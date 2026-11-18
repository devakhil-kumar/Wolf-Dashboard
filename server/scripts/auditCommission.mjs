#!/usr/bin/env node
//
// Commission audit — recompute past months from clean ClickPos data.
//
// WHY
// ClickPos merges the result sets of overlapping requests that share a token.
// Four concurrent calls for 01-18 Nov each came back with ~4x the rows, and one
// staff member's Gross Profit read 25,324 instead of 6,331. Until this was
// fixed, the dashboard's /api/data-by-store calls were not serialised (the
// Reports module had its own queue; the dashboard bypassed it), so any overlap
// — two store logins refreshing at once, the 15-minute auto-refresh, a report
// running alongside the dashboard — could inflate Gross Profit. Gross Profit
// drives the commission tiers, so an inflated read can promote someone from
// "Not Eligible" to a paid tier, or from tier 1 to tier 3.
//
// WHAT THIS DOES
// Walks month by month, store by store, strictly one request at a time, and
// recomputes every staff member's commission with the SAME code the dashboard
// and Commission Report use (client/src/utils/commissionCalc.js). That gives
// the true figure to check against what was actually paid.
//
// It then replays the corruption: multiply the aggregated counts and dollars by
// 2x, 3x and 4x (that is what duplicated rows do) and recompute. The resulting
// columns show what someone could have seen, and what that would have cost.
//
// This script only reads. It writes nothing back to the database.
//
// USAGE
//   node scripts/auditCommission.mjs                     # last 6 months, all stores
//   node scripts/auditCommission.mjs --from 2026-06 --to 2026-11
//   node scripts/auditCommission.mjs --months 3 --store Traralgon
//   node scripts/auditCommission.mjs --api http://170.64.177.174:5002/api
//
// The server must be running and reachable at --api (default localhost:5002).
// Run it against a server that has the serialisation fix, otherwise the audit
// is reading through the very bug it is measuring.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

// commissionCalc.js is ESM, but it sits under client/ whose package.json has no
// "type": "module", so Node reads it as CommonJS and a plain import fails. It
// has no imports of its own, so evaluate the real file instead of copying it —
// a copy would silently drift away from the logic the app actually pays on.
const CALC_PATH = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../../client/src/utils/commissionCalc.js"
);
const { buildKpiTargets, computeStaffRow } = await import(
  `data:text/javascript,${encodeURIComponent(readFileSync(CALC_PATH, "utf8"))}`
);

// ---------------------------------------------------------------------------
// Arguments
// ---------------------------------------------------------------------------

const argv = process.argv.slice(2);
const arg = (name, fallback = null) => {
  const i = argv.indexOf(`--${name}`);
  return i !== -1 && argv[i + 1] ? argv[i + 1] : fallback;
};

const API = (arg("api", "http://localhost:5002/api") || "").replace(/\/$/, "");
const ALL_STORES = ["Hamilton", "Torquay", "Traralgon", "Warragul"];
const STORES = arg("store") ? [arg("store")] : ALL_STORES;
const OUT = arg("out", "commission-audit.csv");
// Multipliers to replay. 1 is the truth and is always computed separately.
const FACTORS = [2, 3, 4];

// ---------------------------------------------------------------------------
// Month range
// ---------------------------------------------------------------------------

/** "YYYY-MM" -> {label, from: Date, to: Date}; `to` is capped at today. */
function monthWindow(ym) {
  const [y, m] = ym.split("-").map(Number);
  const from = new Date(Date.UTC(y, m - 1, 1));
  const lastDay = new Date(Date.UTC(y, m, 0));
  const today = new Date();
  const todayUtc = new Date(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
  );
  return { label: ym, from, to: lastDay > todayUtc ? todayUtc : lastDay };
}

function monthRange() {
  const from = arg("from");
  const to = arg("to");
  const out = [];

  if (from) {
    const [fy, fm] = from.split("-").map(Number);
    const end = to || from;
    const [ty, tm] = end.split("-").map(Number);
    let y = fy;
    let m = fm;
    while (y < ty || (y === ty && m <= tm)) {
      out.push(`${y}-${String(m).padStart(2, "0")}`);
      m += 1;
      if (m > 12) { m = 1; y += 1; }
    }
    return out;
  }

  // Default: the last N months, ending with the current one.
  const n = Number(arg("months", 6));
  const now = new Date();
  for (let i = n - 1; i >= 0; i -= 1) {
    const d = new Date(Date.UTC(now.getFullYear(), now.getMonth() - i, 1));
    out.push(`${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`);
  }
  return out;
}

// Date shapes the API expects. These mirror CommissionReport.js exactly:
// sales/target/kpi/pro-rata take DD/MM/YY, NPS takes DD/MM/YYYY.
const ddmmyy = (d) =>
  `${String(d.getUTCDate()).padStart(2, "0")}/${String(d.getUTCMonth() + 1).padStart(2, "0")}/${String(d.getUTCFullYear()).slice(2)}`;
const ddmmyyyy = (d) =>
  `${String(d.getUTCDate()).padStart(2, "0")}/${String(d.getUTCMonth() + 1).padStart(2, "0")}/${d.getUTCFullYear()}`;
const iso = (d) => d.toISOString().slice(0, 10);

// ---------------------------------------------------------------------------
// HTTP — deliberately one request at a time. Never Promise.all here: that is
// the exact pattern that corrupts the data this script is trying to measure.
// ---------------------------------------------------------------------------

// Thrown when a store simply has no configuration for a month — a store that
// opened later has no targets for earlier months. That is not a fault.
class NotConfigured extends Error {}

async function get(path, params) {
  const url = new URL(`${API}${path}`);
  Object.entries(params || {}).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (res.status === 404) {
    throw new NotConfigured(`no ${path.replace(/^\//, "")} configured`);
  }
  if (!res.ok) {
    throw new Error(`${path} -> HTTP ${res.status}`);
  }
  return res.json();
}

// ---------------------------------------------------------------------------
// Corruption replay
// ---------------------------------------------------------------------------

// Fields derived from the line-item report, which is a different host and was
// never part of the merge, so they must not be scaled.
const NOT_INFLATED = new Set([
  "Business PPN",
  "Consumer PPN",
  "Internet Tech Change",
]);

/**
 * Duplicated rows multiply every aggregated count and dollar value, so scaling
 * the numeric fields reproduces what a corrupted read looked like. Ratio KPIs
 * (device protection %, accessory GP per device) divide one inflated number by
 * another and come out unchanged — which is why Gross Profit, an absolute
 * threshold, is where the damage lands.
 */
function inflate(row, factor) {
  const out = {};
  for (const [key, value] of Object.entries(row)) {
    out[key] =
      typeof value === "number" && !NOT_INFLATED.has(key)
        ? value * factor
        : value;
  }
  return out;
}

const numeric = (commission) =>
  typeof commission === "number" ? commission : 0;

// ---------------------------------------------------------------------------
// Audit
// ---------------------------------------------------------------------------

async function auditStoreMonth(store, month) {
  const { from, to } = monthWindow(month);
  const sales = { startDate: ddmmyy(from), endDate: ddmmyy(to) };

  // One at a time, in the same order the Commission Report dispatches them.
  const data = await get("/data-by-store", { salelocation: store, ...sales });
  const target = await get("/target", { salelocation: store, ...sales });
  const kpi = await get("/kpi", { salelocation: store, ...sales });
  const prorata = await get("/prorata-staff", { salelocation: store, ...sales });
  const nps = await get("/nps/all", {
    startDate: ddmmyyyy(from),
    endDate: ddmmyyyy(to),
  });

  const ctx = {
    target: target?.target ?? target,
    prorataStaffList: prorata?.prorataStaff ?? prorata ?? [],
    kpiTargets: buildKpiTargets(kpi?.kpi ?? kpi),
    npsData: nps?.npsData ?? nps?.data ?? nps ?? [],
    selectedStore: store,
    fromDate: iso(from),
    toDate: iso(to),
  };

  const rows = (data?.data ?? []).map((item) => {
    const truth = computeStaffRow(item, ctx);
    const replays = FACTORS.map((f) => {
      const r = computeStaffRow(inflate(item, f), ctx);
      return {
        factor: f,
        commission: r.commissionNumeric ?? numeric(r.commission),
        eligible: r.eligible,
      };
    });

    const trueCommission = truth.commissionNumeric ?? numeric(truth.commission);
    const worst = replays.reduce(
      (acc, r) => (r.commission > acc.commission ? r : acc),
      { commission: trueCommission, factor: 1, eligible: truth.eligible }
    );

    return {
      month,
      store,
      staff: truth.salesrep,
      trueGP: truth.totalGP ?? item.grossprofit ?? 0,
      trueKpiScore: truth.kpiScore ?? 0,
      trueEligible: truth.eligible,
      trueCommission,
      trueIncentive: truth.productIncentive ?? 0,
      replays,
      worstFactor: worst.factor,
      worstCommission: worst.commission,
      maxOverstatement: Math.max(0, worst.commission - trueCommission),
      becameEligible: !truth.eligible && replays.some((r) => r.eligible),
    };
  });

  return rows;
}

// ---------------------------------------------------------------------------

const fmt = (n) =>
  Number(n || 0).toLocaleString("en-AU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

async function main() {
  const months = monthRange();

  console.log("Commission audit — recomputed from serial ClickPos reads");
  console.log(`  api     : ${API}`);
  console.log(`  months  : ${months.join(", ")}`);
  console.log(`  stores  : ${STORES.join(", ")}`);
  console.log(`  replays : ${FACTORS.map((f) => `${f}x`).join(", ")}`);
  console.log("");

  const all = [];
  const failures = [];
  const skipped = [];

  for (const month of months) {
    for (const store of STORES) {
      const started = Date.now();
      process.stdout.write(`  ${month}  ${store.padEnd(10)} `);
      try {
        const rows = await auditStoreMonth(store, month);
        all.push(...rows);
        const eligible = rows.filter((r) => r.trueEligible).length;
        const paid = rows.reduce((a, r) => a + r.trueCommission, 0);
        const risk = rows.reduce((a, r) => a + r.maxOverstatement, 0);
        console.log(
          `${rows.length} staff, ${eligible} eligible, true commission $${fmt(paid)}` +
            (risk > 0 ? `, up to $${fmt(risk)} overstated if corrupted` : "")
        );
      } catch (error) {
        if (error instanceof NotConfigured) {
          skipped.push({ month, store, reason: error.message });
          console.log(`skipped — ${error.message}`);
        } else {
          failures.push({ month, store, error: error.message });
          console.log(`FAILED — ${error.message}`);
        }
      }
      // Breathe between ranges; ClickPos is the bottleneck and we want no
      // chance of our own calls overlapping.
      await new Promise((r) => setTimeout(r, 400 - Math.min(400, Date.now() - started)));
    }
  }

  if (!all.length) {
    console.log("\nNothing to report.");
    if (failures.length) process.exitCode = 1;
    return;
  }

  // ---- CSV ----
  const header = [
    "month", "store", "staff",
    "true_gross_profit", "true_kpi_score", "true_eligible",
    "true_commission", "true_product_incentive",
    ...FACTORS.map((f) => `commission_if_${f}x`),
    "worst_factor", "worst_commission", "max_overstatement",
    "became_eligible_only_when_corrupted",
  ];
  const csv = [header.join(",")];
  all.forEach((r) => {
    csv.push([
      r.month, r.store, `"${String(r.staff).replace(/"/g, '""')}"`,
      r.trueGP.toFixed(2), r.trueKpiScore, r.trueEligible,
      r.trueCommission.toFixed(2), Number(r.trueIncentive).toFixed(2),
      ...r.replays.map((x) => x.commission.toFixed(2)),
      r.worstFactor, r.worstCommission.toFixed(2), r.maxOverstatement.toFixed(2),
      r.becameEligible,
    ].join(","));
  });
  writeFileSync(OUT, csv.join("\n") + "\n");

  // ---- Summary ----
  const totalTrue = all.reduce((a, r) => a + r.trueCommission, 0);
  const flipped = all.filter((r) => r.becameEligible);

  console.log("\n" + "-".repeat(72));
  console.log(`Rows audited                    : ${all.length}`);
  console.log(`True commission across all rows : $${fmt(totalTrue)}`);
  console.log(`Rows paid only when corrupted   : ${flipped.length}`);

  // Report each multiplier on its own. A single "worst case" number invites
  // being read as money lost; it is not. Each figure below is a CEILING that
  // assumes every row in every month was corrupted at that multiplier, which
  // needs that many requests overlapping every single time. Two overlapping
  // readers (2x) is the realistic case; treat the rest as upper bounds.
  console.log("\nCeiling if EVERY row had been read at:");
  FACTORS.forEach((f, idx) => {
    const extra = all.reduce((acc, r) => {
      const replay = r.replays[idx];
      return acc + Math.max(0, replay.commission - r.trueCommission);
    }, 0);
    const affected = all.filter(
      (r) => r.replays[idx].commission > r.trueCommission
    ).length;
    console.log(
      `  ${f}x  +$${fmt(extra).padStart(12)}  (${affected} rows)` +
        (f === 2 ? "   <- two overlapping readers, the realistic case" : "")
    );
  });
  console.log(
    `\nActual overpayment is somewhere between $0.00 and those ceilings and\n` +
      `cannot be derived from ClickPos: only payroll shows what was paid.`
  );

  const atRisk = all
    .filter((r) => r.maxOverstatement > 0)
    .sort((a, b) => b.maxOverstatement - a.maxOverstatement)
    .slice(0, 15);

  if (atRisk.length) {
    console.log("\nMost exposed rows (true vs worst corrupted read):");
    console.log(
      `  ${"month".padEnd(8)}${"store".padEnd(11)}${"staff".padEnd(20)}` +
        `${"true GP".padStart(11)}${"true comm".padStart(12)}${"worst".padStart(12)}${"delta".padStart(12)}`
    );
    atRisk.forEach((r) => {
      console.log(
        `  ${r.month.padEnd(8)}${r.store.padEnd(11)}${String(r.staff).slice(0, 19).padEnd(20)}` +
          `${fmt(r.trueGP).padStart(11)}${fmt(r.trueCommission).padStart(12)}` +
          `${fmt(r.worstCommission).padStart(12)}${("+" + fmt(r.maxOverstatement)).padStart(12)}`
      );
    });
  } else {
    console.log("\nNo row changes payout under any replayed multiplier.");
  }

  if (skipped.length) {
    console.log("\nRanges with no configuration (store not set up yet):");
    skipped.forEach((s) => console.log(`  ${s.month} ${s.store}: ${s.reason}`));
  }

  if (failures.length) {
    console.log("\nRanges that could not be read:");
    failures.forEach((f) => console.log(`  ${f.month} ${f.store}: ${f.error}`));
    process.exitCode = 1;
  }

  console.log(`\nPer-row detail written to ${OUT}`);
  console.log(
    "Compare true_commission against what was actually paid. A gap means a\n" +
      "corrupted read reached payroll; the commission_if_Nx columns show the\n" +
      "shape such a read would have had."
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
