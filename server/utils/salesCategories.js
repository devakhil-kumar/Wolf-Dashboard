// Category corrections for ClickPos sales data.
//
// WHY THIS EXISTS
// The SaleDatafusion feed we aggregate from is pre-grouped by staff + product
// type, and those product types lose two distinctions the business needs:
//
//   1. "New Bundle/New Internet" is keyed off carrier "Telstra Data", so a
//      technology change (plancat BUNDLE-RNT) lands in it alongside genuinely
//      new internet connections. Reported by Nick: invoice 844170333,
//      "Telstra Premium Internet Only Plan - RNT", showing under Internet New.
//
//   2. "PPN (6)" is every new mobile connection (plancat MOB-NEW) regardless of
//      whether the plan is consumer or business, so business mobile connections
//      are counted as consumer. ("SB PPN" is a business *bundle* bucket; there
//      is no business *mobile* bucket in that feed at all.)
//
// The ReportQuery feed below is line-item level and does carry both — `plancat`
// separates NEW from RNT, and `carrier` names Consumer vs Business — so we read
// it purely to correct those counts.
//
// DELIBERATELY NOT RECOMPUTED HERE: Gross Profit, Handset/Plan GP and Accessory
// GP. Those drive the commission tiers and are correct already; nothing in this
// report reproduces them (its `commission` field sums to a different number), so
// every money value still comes from the existing feed, untouched.

import { parseStringPromise } from "xml2js";

const DETAIL_URL = "https://api.clickpos.net/param/ReportQuery/ReportData";
const GUID = "5AF49267-8C88-4C2C-8D69-7AB9B493F340";
const REPORT_ID = 5019;

// plancat values that are a change of technology / re-contract rather than a
// genuinely new connection.
const TECH_CHANGE_PLANCATS = new Set(["BUNDLE-RNT"]);

// This endpoint wants YYYY/MM/DD; everything upstream of us uses YYYY-MM-DD.
const toSlashDate = (date) => String(date || "").replace(/-/g, "/");

// The detail report is not store-scoped: one call covers every store for the
// range, and the dashboard asks per store. Without this, opening the dashboard
// fetches the same ~5 MB payload once per store tab, and because ClickPos
// serialises requests sharing a token those calls queue behind each other
// (measured: 4s on its own, 23s with the tabs loading together). Cache the
// in-flight promise so concurrent callers share a single fetch.
// Matches the aggregated feed's cache in reportHelpers.js. The counts we
// correct here come from the same sale, so a shorter window would re-pull 5 MB
// of XML to adjust numbers that are themselves served from a 10-minute cache,
// and would let the two feeds describe slightly different moments.
const DETAIL_CACHE_TTL_MS = 10 * 60 * 1000;
const DETAIL_CACHE_MAX = 20;
const detailCache = new Map();

// This report lives on a different host to SaleDatafusion and the two do not
// interfere (verified), but ClickPos still merges overlapping requests that
// share a token, so keep our own calls one at a time. The cache above means
// same-range callers never reach the queue at all.
let detailChain = Promise.resolve();

function enqueueDetail(task) {
  const run = detailChain.then(task, task);
  detailChain = run.then(
    () => undefined,
    () => undefined
  );
  return run;
}

function getCachedDetail(key, load) {
  const hit = detailCache.get(key);
  if (hit && Date.now() - hit.at < DETAIL_CACHE_TTL_MS) return hit.promise;

  const promise = load();
  detailCache.set(key, { at: Date.now(), promise });
  // A failed fetch must not be cached, or one outage poisons the next minute.
  promise.catch(() => {
    const current = detailCache.get(key);
    if (current && current.promise === promise) detailCache.delete(key);
  });

  // Map keeps insertion order, so the oldest key is the first one.
  while (detailCache.size > DETAIL_CACHE_MAX) {
    detailCache.delete(detailCache.keys().next().value);
  }
  return promise;
}

const firstValue = (record, field) => {
  const value = record?.[field];
  if (Array.isArray(value)) return String(value[0] ?? "").trim();
  return String(value ?? "").trim();
};

/**
 * Fetch line-item sale detail for a date range. Covers every store; results are
 * cached briefly so the dashboard's per-store calls share one fetch.
 * @param {string} startDate - "YYYY-MM-DD"
 * @param {string} endDate   - "YYYY-MM-DD"
 * @returns {Promise<Array>} [{ salesrep, salelocation, plancat, carrier, plantype, invoice }]
 */
export function fetchPlanDetail(startDate, endDate) {
  return getCachedDetail(`${startDate}|${endDate}`, () =>
    enqueueDetail(() => loadPlanDetail(startDate, endDate))
  );
}

async function loadPlanDetail(startDate, endDate) {
  const url =
    `${DETAIL_URL}?Guid=${GUID}&RptID=${REPORT_ID}&RptType=1` +
    `&Param1=${toSlashDate(startDate)}&Param2=${toSlashDate(endDate)}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`ClickPos detail report failed (${res.status})`);
  }

  const xml = await res.text();
  const parsed = await parseStringPromise(xml);
  const records = parsed?.ClickPOSDataFeed?.ClickPOSData || [];

  return records.map((record) => ({
    invoice: firstValue(record, "invoice"),
    salesrep: firstValue(record, "salesrep"),
    salelocation: firstValue(record, "salelocation"),
    plancat: firstValue(record, "plancat"),
    carrier: firstValue(record, "carrier"),
    plantype: firstValue(record, "plantype"),
  }));
}

const keyFor = (salelocation, salesrep) =>
  `${String(salelocation).toLowerCase()}|${String(salesrep).toLowerCase()}`;

/**
 * Roll the detail rows up into per staff/store counts of the things the
 * aggregated feed gets wrong.
 * @param {Array} detailRows - from fetchPlanDetail
 * @returns {Map<string, {internetTechChange:number, businessMobile:number, consumerMobile:number}>}
 */
export function buildCategoryCorrections(detailRows) {
  const corrections = new Map();

  const bump = (row, field) => {
    if (!row.salesrep || !row.salelocation) return;
    const key = keyFor(row.salelocation, row.salesrep);
    if (!corrections.has(key)) {
      corrections.set(key, {
        internetTechChange: 0,
        businessMobile: 0,
        consumerMobile: 0,
      });
    }
    corrections.get(key)[field] += 1;
  };

  detailRows.forEach((row) => {
    const isBusiness = /\(Business\)/i.test(row.carrier);

    // Internet: the aggregated bucket is carrier-driven, so only the
    // "Telstra Data" rows end up in "New Bundle/New Internet".
    if (
      TECH_CHANGE_PLANCATS.has(row.plancat) &&
      /Telstra Data/i.test(row.carrier)
    ) {
      bump(row, "internetTechChange");
    }

    // Mobile: split the single MOB-NEW bucket by who the plan is for.
    if (row.plancat === "MOB-NEW") {
      bump(row, isBusiness ? "businessMobile" : "consumerMobile");
    }
  });

  return corrections;
}

/**
 * Apply the corrections to rows produced by aggregateSalesDataByStaff.
 * Mutates nothing — returns new row objects.
 *
 * Adds two fields the aggregated feed cannot provide:
 *   "Business PPN" - new mobile connections on a business plan
 *   "Consumer PPN" - new mobile connections on a consumer plan
 * and removes technology changes from "New Bundle/New Internet".
 */
export function applyCategoryCorrections(rows, corrections) {
  return rows.map((row) => {
    const corrected = { ...row };
    const match = corrections.get(keyFor(row.salelocation, row.salesrep));

    if (!match) {
      // No detail rows for this person: leave the counts as they came, but
      // still expose the new fields so the shape is consistent for every row.
      corrected["Business PPN"] = corrected["Business PPN"] || 0;
      corrected["Consumer PPN"] = corrected.pnncount || 0;
      corrected["Internet Tech Change"] = corrected["Internet Tech Change"] || 0;
      return corrected;
    }

    const internetNew = corrected["New Bundle/New Internet"] || 0;
    corrected["New Bundle/New Internet"] = Math.max(
      0,
      internetNew - match.internetTechChange
    );
    // Keep what was taken out visible rather than silently dropping it.
    corrected["Internet Tech Change"] = match.internetTechChange;

    corrected["Business PPN"] = match.businessMobile;
    corrected["Consumer PPN"] = match.consumerMobile;

    return corrected;
  });
}

/**
 * Convenience wrapper: fetch the detail feed and correct the aggregated rows.
 * Falls back to the uncorrected rows if the detail report is unavailable, so a
 * ClickPos outage degrades the categories rather than taking the dashboard down.
 */
export async function correctSalesCategories(rows, startDate, endDate) {
  try {
    const detail = await fetchPlanDetail(startDate, endDate);
    return applyCategoryCorrections(rows, buildCategoryCorrections(detail));
  } catch (error) {
    console.error("correctSalesCategories failed, using raw counts:", error.message);
    return rows;
  }
}
