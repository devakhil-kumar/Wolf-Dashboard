// Reporting helpers — self-contained so the existing dashboard logic stays untouched.
// Pulls sales data from ClickPos and rolls it up into report-friendly shapes
// (store-level Gross Profit, segment splits, etc.).

import { changeFormatDateForFetchingData } from "./index.js";

const CLICKPOS_TOKEN = "5AF49267-8C88-4C2C-8D69-7AB9B493F340";
const CLICKPOS_URL =
  "https://tcpsvr121.clickpos.net/ctime/ctimeapi/Sales/SaleDatafusion";

// Product types (as they arrive from ClickPos) that represent dollar GP buckets.
const GROSS_PROFIT_TYPE = "Gross Profit";
const HANDSET_GP_TYPE = "Handset/Plan GP";
const ACCESSORY_GP_TYPE = "Accessory GP total";

// ---------------------------------------------------------------------------
// IMPORTANT: ClickPos cannot serve concurrent requests for the same token.
// Two overlapping calls come back with their date ranges MERGED, so every
// caller gets the union of both periods (this silently made year-on-year
// comparisons show identical "current" and "previous" figures).
// Every request is therefore pushed through a queue so only one is ever in
// flight, and results are cached briefly to keep multi-month reports usable.
// ---------------------------------------------------------------------------
let requestChain = Promise.resolve();

function enqueue(task) {
  const run = requestChain.then(task, task);
  requestChain = run.then(
    () => undefined,
    () => undefined
  );
  return run;
}

const responseCache = new Map(); // "start|end" -> { at, data }
const CACHE_TTL_MS = 10 * 60 * 1000;

/**
 * Fetch raw ClickPos sales data for a date range.
 * Safe to call from anywhere: requests are serialised internally.
 * @param {string} startDate - "DD/MM/YY", "DD/MM/YYYY" or "YYYY-MM-DD"
 * @param {string} endDate   - same formats as startDate
 * @returns {Promise<Array>} raw store array (each with SalesDataaggregation)
 */
export async function fetchSalesData(startDate, endDate) {
  const startdate = normaliseDate(startDate);
  const enddate = normaliseDate(endDate);
  const key = `${startdate}|${enddate}`;

  const cached = responseCache.get(key);
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
    return cached.data;
  }

  return enqueue(async () => {
    // Re-check: an identical range may have been fetched while queued.
    const fresh = responseCache.get(key);
    if (fresh && Date.now() - fresh.at < CACHE_TTL_MS) {
      return fresh.data;
    }

    const res = await fetch(
      `${CLICKPOS_URL}?startdate=${startdate}&enddate=${enddate}`,
      {
        headers: {
          "Content-Type": "application/json",
          token: CLICKPOS_TOKEN,
        },
      }
    );

    if (!res.ok) {
      throw new Error(`ClickPos request failed (${res.status})`);
    }

    const json = await res.json();
    const data = Array.isArray(json) ? json : [];
    responseCache.set(key, { at: Date.now(), data });
    return data;
  });
}

// Accepts DD/MM/YY(YY) or already-formatted YYYY-MM-DD and returns YYYY-MM-DD.
function normaliseDate(input) {
  if (!input) return input;
  if (/^\d{4}-\d{2}-\d{2}$/.test(input)) return input; // already ok
  return changeFormatDateForFetchingData(input);
}

/**
 * Roll a raw ClickPos response up into per-store Gross Profit numbers.
 * @param {Array} rawData - ClickPos store array
 * @param {string} location - specific StoreName, or "all"/"all-store" for everything
 * @returns {Array<{store,grossProfit,handsetGP,accessoryGP,handsetCount,avgGpPerSale}>}
 */
export function aggregateStoreGP(rawData, location = "all") {
  const wantAll =
    !location ||
    location.toLowerCase() === "all" ||
    location.toLowerCase() === "all-store" ||
    location.toLowerCase() === "all stores";

  const stores = wantAll
    ? rawData
    : rawData.filter(
        (s) =>
          (s.StoreName || "").toLowerCase() === location.toLowerCase()
      );

  return stores
    .filter((s) => s.StoreName && Array.isArray(s.SalesDataaggregation))
    .map((store) => {
      let grossProfit = 0;
      let accessoryGP = 0;
      let handsetCount = 0;

      store.SalesDataaggregation.forEach((sale) => {
        const value = Number(sale.SaleValue) || 0;
        const count = Number(sale.SaleCount) || 0;
        switch (sale.ProductType) {
          case GROSS_PROFIT_TYPE:
            grossProfit += value;
            break;
          case HANDSET_GP_TYPE:
            // Only the unit count is taken from here; the GP value is derived
            // below so it matches the dashboard's Handset/Plan GP column.
            handsetCount += count;
            break;
          case ACCESSORY_GP_TYPE:
            accessoryGP += value;
            break;
          default:
            break;
        }
      });

      // Dashboard defines Handset/Plan GP as Total GP - Accessory GP.
      // Keeping the same definition guarantees Total GP >= Handset/Plan GP.
      const handsetGP = grossProfit - accessoryGP;

      return {
        store: store.StoreName,
        grossProfit: round(grossProfit),
        handsetGP: round(handsetGP),
        accessoryGP: round(accessoryGP),
        handsetCount,
        avgGpPerSale: handsetCount > 0 ? round(grossProfit / handsetCount) : 0,
      };
    });
}

// ProductType -> benchmark count fields (counts come straight from raw data).
const BENCHMARK_COUNT_TYPES = {
  "PPN (6)": "ppn",
  "Bundle New (2)": "bundles",
  "TMB (5)": "mbb",
  "DPC Mobile / Tablet": "dpcCount",
  "Outright Mobile / Tablet inc Prepaid": "outright",
  "Smart watch": "smartwatch",
};

/**
 * Per-store benchmark metrics for the Overview report.
 * Reads raw ClickPos SalesDataaggregation directly so counts stay accurate.
 */
export function aggregateStoreBenchmark(rawData) {
  const stores = rawData.filter(
    (s) => s.StoreName && Array.isArray(s.SalesDataaggregation)
  );

  return stores
    .map((store) => {
      const m = {
        store: store.StoreName,
        grossProfit: 0,
        accessoryGP: 0,
        handsetCount: 0,
        ppn: 0,
        bundles: 0,
        mbb: 0,
        dpcCount: 0,
        outright: 0,
        smartwatch: 0,
      };

      store.SalesDataaggregation.forEach((sale) => {
        const value = Number(sale.SaleValue) || 0;
        const count = Number(sale.SaleCount) || 0;
        if (sale.ProductType === GROSS_PROFIT_TYPE) m.grossProfit += value;
        // Handset/Plan GP contributes only its unit count here; the GP value is
        // derived in withBenchmarkDerived so it matches the dashboard.
        else if (sale.ProductType === HANDSET_GP_TYPE) m.handsetCount += count;
        else if (sale.ProductType === ACCESSORY_GP_TYPE) m.accessoryGP += value;

        const countField = BENCHMARK_COUNT_TYPES[sale.ProductType];
        if (countField) m[countField] += count;
      });

      return withBenchmarkDerived(m);
    })
    .sort((a, b) => a.store.localeCompare(b.store));
}

// Add derived ratio metrics (GP/handset, Acc GP/device, avg GP/sale).
// Handset/Plan GP is derived as Total GP - Accessory GP, matching the
// dashboard's definition, so Total GP is always >= Handset/Plan GP.
function withBenchmarkDerived(m) {
  const devices = m.dpcCount + m.outright + m.smartwatch;
  const handsetGP = m.grossProfit - m.accessoryGP;
  return {
    store: m.store,
    grossProfit: round(m.grossProfit),
    handsetGP: round(handsetGP),
    accessoryGP: round(m.accessoryGP),
    handsetCount: m.handsetCount,
    ppn: m.ppn,
    bundles: m.bundles,
    mbb: m.mbb,
    dpcCount: m.dpcCount,
    outright: m.outright,
    smartwatch: m.smartwatch,
    gpPerHandset: m.handsetCount ? round(handsetGP / m.handsetCount) : 0,
    accGpPerDevice: devices ? round(m.accessoryGP / devices) : 0,
    avgGpPerSale: m.handsetCount ? round(m.grossProfit / m.handsetCount) : 0,
  };
}

// Sum benchmark store rows into a Grand Total row (re-derives ratios).
export function sumBenchmarkRows(rows, label = "Grand Total") {
  const agg = rows.reduce(
    (acc, r) => {
      acc.grossProfit += r.grossProfit;
      acc.accessoryGP += r.accessoryGP;
      acc.handsetCount += r.handsetCount;
      acc.ppn += r.ppn;
      acc.bundles += r.bundles;
      acc.mbb += r.mbb;
      acc.dpcCount += r.dpcCount;
      acc.outright += r.outright;
      acc.smartwatch += r.smartwatch;
      return acc;
    },
    {
      store: label,
      grossProfit: 0,
      accessoryGP: 0,
      handsetCount: 0,
      ppn: 0,
      bundles: 0,
      mbb: 0,
      dpcCount: 0,
      outright: 0,
      smartwatch: 0,
    }
  );
  return withBenchmarkDerived(agg);
}

// Sum a list of per-store rows into a single "All Stores / Total" row.
export function sumStoreRows(rows, label = "All Stores") {
  const total = rows.reduce(
    (acc, r) => {
      acc.grossProfit += r.grossProfit;
      acc.accessoryGP += r.accessoryGP;
      acc.handsetCount += r.handsetCount;
      return acc;
    },
    {
      store: label,
      grossProfit: 0,
      accessoryGP: 0,
      handsetCount: 0,
    }
  );
  // Same definition as per-store: Handset/Plan GP = Total GP - Accessory GP.
  total.handsetGP = round(total.grossProfit - total.accessoryGP);
  total.grossProfit = round(total.grossProfit);
  total.accessoryGP = round(total.accessoryGP);
  total.avgGpPerSale =
    total.handsetCount > 0 ? round(total.grossProfit / total.handsetCount) : 0;
  return total;
}

// Difference + percentage change between current and previous values.
export function diff(current, previous) {
  const change = round(current - previous);
  const pct = previous !== 0 ? round((change / Math.abs(previous)) * 100) : null;
  return { change, pct };
}

// Shift a YYYY-MM-DD date back by N years (default 1) for YoY comparisons.
export function shiftYears(isoDate, years = 1) {
  const [y, m, d] = isoDate.split("-").map(Number);
  const shifted = new Date(Date.UTC(y - years, m - 1, d));
  const yy = shifted.getUTCFullYear();
  const mm = String(shifted.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(shifted.getUTCDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

// First & last day (YYYY-MM-DD) of a given month (1-12) in a year.
export function monthRange(year, month1to12) {
  const start = `${year}-${String(month1to12).padStart(2, "0")}-01`;
  const lastDay = new Date(Date.UTC(year, month1to12, 0)).getUTCDate();
  const end = `${year}-${String(month1to12).padStart(2, "0")}-${String(
    lastDay
  ).padStart(2, "0")}`;
  return { start, end };
}

export function round(n) {
  return Math.round((Number(n) || 0) * 100) / 100;
}

export { normaliseDate };
