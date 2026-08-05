// Reporting controllers — Stage 1: GP Year-on-Year.
// Fully additive: does not touch existing customer/target/dashboard controllers.

import {
  fetchSalesData,
  aggregateStoreGP,
  aggregateStoreBenchmark,
  sumBenchmarkRows,
  sumStoreRows,
  diff,
  shiftYears,
  monthRange,
  normaliseDate,
} from "../utils/reportHelpers.js";

/**
 * GP Year-on-Year comparison.
 * GET /api/reports/gp-comparison?salelocation=&startDate=&endDate=
 *   startDate/endDate: DD/MM/YY(YY) or YYYY-MM-DD
 *
 * Returns current period vs the same period one year earlier:
 *  - perStore: [{ store, current, previous, diff }]
 *  - total:    { store:'All Stores', current, previous, diff }
 *  - segments: { current:{handset,accessory,other}, previous:{...} }
 *  - meta:     date ranges used
 */
export const getGpComparison = async (req, res) => {
  try {
    const { salelocation = "all", startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "startDate and endDate are required" });
    }

    const curStart = normaliseDate(startDate);
    const curEnd = normaliseDate(endDate);
    const prevStart = shiftYears(curStart, 1);
    const prevEnd = shiftYears(curEnd, 1);

    // Sequential on purpose — see the concurrency note in reportHelpers.js.
    const curRaw = await fetchSalesData(curStart, curEnd);
    const prevRaw = await fetchSalesData(prevStart, prevEnd);

    const curStores = aggregateStoreGP(curRaw, salelocation);
    const prevStores = aggregateStoreGP(prevRaw, salelocation);

    // Build a per-store comparison keyed by store name.
    const prevByStore = Object.fromEntries(
      prevStores.map((s) => [s.store, s])
    );
    const allStoreNames = [
      ...new Set([
        ...curStores.map((s) => s.store),
        ...prevStores.map((s) => s.store),
      ]),
    ].sort();

    const blank = {
      grossProfit: 0,
      handsetGP: 0,
      accessoryGP: 0,
      handsetCount: 0,
      avgGpPerSale: 0,
    };

    const perStore = allStoreNames.map((name) => {
      const current = curStores.find((s) => s.store === name) || {
        store: name,
        ...blank,
      };
      const previous = prevByStore[name] || { store: name, ...blank };
      return {
        store: name,
        current,
        previous,
        diff: {
          grossProfit: diff(current.grossProfit, previous.grossProfit),
          handsetGP: diff(current.handsetGP, previous.handsetGP),
          accessoryGP: diff(current.accessoryGP, previous.accessoryGP),
        },
      };
    });

    const curTotal = sumStoreRows(curStores);
    const prevTotal = sumStoreRows(prevStores);
    const total = {
      store: "All Stores",
      current: curTotal,
      previous: prevTotal,
      diff: {
        grossProfit: diff(curTotal.grossProfit, prevTotal.grossProfit),
        handsetGP: diff(curTotal.handsetGP, prevTotal.handsetGP),
        accessoryGP: diff(curTotal.accessoryGP, prevTotal.accessoryGP),
      },
    };

    // Handset/Plan GP + Accessory GP make up Total GP (same split as dashboard).
    const segments = {
      current: {
        handset: curTotal.handsetGP,
        accessory: curTotal.accessoryGP,
      },
      previous: {
        handset: prevTotal.handsetGP,
        accessory: prevTotal.accessoryGP,
      },
    };

    return res.status(200).json({
      perStore,
      total,
      segments,
      meta: {
        salelocation,
        current: { startDate: curStart, endDate: curEnd },
        previous: { startDate: prevStart, endDate: prevEnd },
      },
    });
  } catch (error) {
    console.error("getGpComparison error:", error);
    return res
      .status(500)
      .json({ message: "Failed to build GP comparison", error: error.message });
  }
};

/**
 * Monthly GP trend for a year, optionally vs the previous year.
 * GET /api/reports/gp-trend?salelocation=&year=2026&compare=true
 *
 * Returns: [{ month:'Jan', monthIndex:1, current:<gp>, previous:<gp|null> }]
 * NOTE: this fires one ClickPos call per month (up to 24 with compare).
 *       Kept simple for now; can be cached later if it gets slow.
 */
export const getGpTrend = async (req, res) => {
  try {
    const {
      salelocation = "all",
      year,
      compare = "true",
    } = req.query;

    const targetYear = parseInt(year, 10) || new Date().getFullYear();
    const wantCompare = compare === "true" || compare === true;
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    // Only fetch months up to "now" for the current year to avoid empty calls.
    const now = new Date();
    const lastMonth =
      targetYear === now.getFullYear() ? now.getMonth() + 1 : 12;

    const months = Array.from({ length: lastMonth }, (_, i) => i + 1);

    const gpForMonth = async (y, m) => {
      const { start, end } = monthRange(y, m);
      const raw = await fetchSalesData(start, end);
      return sumStoreRows(aggregateStoreGP(raw, salelocation)).grossProfit;
    };

    // Sequential on purpose — see the concurrency note in reportHelpers.js.
    const currentVals = [];
    for (const m of months) {
      currentVals.push(await gpForMonth(targetYear, m));
    }

    const previousVals = [];
    if (wantCompare) {
      for (const m of months) {
        previousVals.push(await gpForMonth(targetYear - 1, m));
      }
    }

    const trend = months.map((m, idx) => ({
      month: monthNames[m - 1],
      monthIndex: m,
      current: currentVals[idx],
      previous: wantCompare ? previousVals[idx] : null,
    }));

    return res.status(200).json({
      salelocation,
      year: targetYear,
      compareYear: wantCompare ? targetYear - 1 : null,
      trend,
    });
  } catch (error) {
    console.error("getGpTrend error:", error);
    return res
      .status(500)
      .json({ message: "Failed to build GP trend", error: error.message });
  }
};

/**
 * Multi-site Store Benchmark / Overview.
 * GET /api/reports/store-overview?startDate=&endDate=
 * Returns per-store benchmark metrics + a grand-total row.
 */
export const getStoreOverview = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "startDate and endDate are required" });
    }

    const start = normaliseDate(startDate);
    const end = normaliseDate(endDate);
    const raw = await fetchSalesData(start, end);

    const stores = aggregateStoreBenchmark(raw);
    const grandTotal = sumBenchmarkRows(stores);

    return res.status(200).json({
      stores,
      grandTotal,
      meta: { startDate: start, endDate: end },
    });
  } catch (error) {
    console.error("getStoreOverview error:", error);
    return res
      .status(500)
      .json({ message: "Failed to build store overview", error: error.message });
  }
};
