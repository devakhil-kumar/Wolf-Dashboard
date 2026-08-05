// commissionCalc.js
// Faithful port of the per-staff calculation logic that lives inside
// layouts/Dashboard.js (the `rows = data?.map(...)` block). Extracted here so the
// Reports module can produce IDENTICAL numbers WITHOUT modifying Dashboard.js.
//
// If the dashboard logic ever changes, keep this in sync.

// Default KPI targets — mirrors Dashboard.js fallback values.
export const DEFAULT_KPI_TARGETS = {
  KPITMB: null,
  KPIPPN: null,
  KPIBundle: null,
  KPISBNBN: null,
  KPITWD: null,
  KPIDPC: null,
  KPIACCGP: null,
  KPIMAIN: 65,
  NPSVoltarget: 6,
  NPSScoreTargetMin: 60,
  NPSScoreTargetMax: 75,
  GPCommissionPercentage: 4,
  GPTier2Percentage: 5.5,
  GPTier3Percentage: 7,
  NPSMultiplierLow: 0.5,
  NPSMultiplierMid: 1.0,
  NPSMultiplierHigh: 1.5,
};

// Normalise a KPITarget document from the API into the shape Dashboard.js uses.
export function buildKpiTargets(KPITarget) {
  if (!KPITarget) return { ...DEFAULT_KPI_TARGETS };
  return {
    KPITMB: KPITarget.KPITMB ?? null,
    KPIPPN: KPITarget.KPIPPN ?? null,
    KPIBundle: KPITarget.KPIBundle ?? null,
    KPISBNBN: KPITarget.KPISBNBN ?? null,
    KPITWD: KPITarget.KPITWD ?? null,
    KPIDPC: KPITarget.KPIDPC ?? null,
    KPIACCGP: KPITarget.KPIACCGP ?? null,
    KPIMAIN: KPITarget.KPIMAIN ?? 65,
    NPSVoltarget: KPITarget.NPSVoltarget ?? 6,
    NPSScoreTargetMin: KPITarget.NPSScoreTargetMin ?? 60,
    NPSScoreTargetMax: KPITarget.NPSScoreTargetMax ?? 75,
    GPCommissionPercentage: KPITarget.GPCommissionPercentage ?? 4,
    GPTier2Percentage: KPITarget.GPTier2Percentage ?? 5.5,
    GPTier3Percentage: KPITarget.GPTier3Percentage ?? 7,
    NPSMultiplierLow: KPITarget.NPSMultiplierLow ?? 0.5,
    NPSMultiplierMid: KPITarget.NPSMultiplierMid ?? 1.0,
    NPSMultiplierHigh: KPITarget.NPSMultiplierHigh ?? 1.5,
  };
}

// Volume target fields that accumulate month-by-month.
const VOLUME_TARGET_FIELDS = ['ppn', 'bundel', 'tmb', 'tyro', 'websitebas', 'sbNbn'];

// The target record in force for a given year/month (latest createdDate that is
// on or before the end of that month), from a store's target history.
function effectiveTargetForMonth(storeTargets, year, month1to12) {
  const monthEnd = new Date(Date.UTC(year, month1to12, 0, 23, 59, 59, 999));
  let best = null;
  storeTargets.forEach((t) => {
    const cd = new Date(t.createdDate);
    if (cd <= monthEnd && (!best || cd > new Date(best.createdDate))) best = t;
  });
  return best;
}

/**
 * Sum each volume target across every month in the range, using whichever
 * target was actually in force that month. This keeps the board accurate when
 * targets change quarter to quarter (e.g. 11 + 11 + 13 = 35, not 13 x 3).
 * @param {Array} allTargets  - every target record (all stores)
 * @param {string} store      - store name; 'All Stores' returns null (flat scaling)
 * @param {string} fromDate   - 'YYYY-MM-DD'
 * @param {string} toDate     - 'YYYY-MM-DD'
 * @returns {object|null} summed volume targets, or null if no history applies
 */
export function computePeriodVolumeTargets(allTargets, store, fromDate, toDate) {
  if (!allTargets?.length || !store || store === 'All Stores' || !fromDate || !toDate) {
    return null;
  }
  const storeTargets = allTargets.filter(
    (t) => (t.salelocation || '').toLowerCase() === store.toLowerCase()
  );
  if (!storeTargets.length) return null;

  const from = new Date(fromDate);
  const to = new Date(toDate);
  let y = from.getUTCFullYear();
  let m = from.getUTCMonth() + 1;
  const endY = to.getUTCFullYear();
  const endM = to.getUTCMonth() + 1;

  const sums = Object.fromEntries(VOLUME_TARGET_FIELDS.map((f) => [f, 0]));
  let matched = false;

  while (y < endY || (y === endY && m <= endM)) {
    const eff = effectiveTargetForMonth(storeTargets, y, m);
    if (eff) {
      matched = true;
      VOLUME_TARGET_FIELDS.forEach((f) => {
        sums[f] += Number(eff[f]) || 0;
      });
    }
    m += 1;
    if (m > 12) {
      m = 1;
      y += 1;
    }
  }

  return matched ? sums : null;
}

// Pro-rata staff override (Dashboard getEffectiveTargets).
function getEffectiveTargets(salesrepName, target, prorataStaffList) {
  const prorata = prorataStaffList?.find((s) => s.salesrep === salesrepName);
  if (prorata) {
    return {
      dpc: prorata.dpc ?? target?.dpc,
      ppn: prorata.ppn ?? target?.ppn,
      bundel: prorata.bundel ?? target?.bundel,
      tmb: prorata.tmb ?? target?.tmb,
      tyro: prorata.tyro ?? target?.tyro,
      sbNbn: prorata.sbNbn ?? target?.sbNbn,
      websitebas: prorata.websitebas ?? target?.websitebas,
      AcceGP_Handset_Sales:
        prorata.AcceGP_Handset_Sales ?? target?.AcceGP_Handset_Sales,
      gpGreenTarget: prorata.gpGreenTarget ?? target?.gpGreenTarget,
      gpTier2Threshold: prorata.gpTier2Threshold ?? target?.gpTier2Threshold,
      gpTier3Threshold: prorata.gpTier3Threshold ?? target?.gpTier3Threshold,
      productBonuses: prorata.productBonuses ?? target?.productBonuses,
      isProrataStaff: true,
    };
  }
  return { ...target, isProrataStaff: false };
}

// Aggregate NPS rows for a salesrep (Dashboard matchingNpsRows logic).
function aggregateNps(item, npsData, selectedStore) {
  const matching = npsData?.filter((n) =>
    selectedStore === 'All Stores'
      ? n.salesrep === item.salesrep
      : n.salesrep === item.salesrep && n.salelocation === selectedStore
  );

  if (!matching || matching.length === 0) {
    return { npsVol: '', npsScore: '', adv10_9: '', pass8_7: '', detr_less_6: '' };
  }

  let adv = 0;
  let pass = 0;
  let detr = 0;
  matching.forEach((n) => {
    adv += n.adv10_9;
    pass += n.pass8_7;
    detr += n.detr_less_6;
  });
  const npsVol = adv + pass + detr;
  const advPct = npsVol !== 0 ? (adv / npsVol) * 100 : 0;
  const detrPct = npsVol !== 0 ? (detr / npsVol) * 100 : 0;
  const npsScore = Math.round(advPct - detrPct);

  return { npsVol, npsScore, adv10_9: adv, pass8_7: pass, detr_less_6: detr };
}

/**
 * Compute one staff member's report row.
 * @param {object} item        - aggregated sales record from ClickPos (per staff)
 * @param {object} ctx         - { target, prorataStaffList, kpiTargets, npsData, selectedStore, fromDate, toDate }
 * @returns computed metrics matching Dashboard.js columns
 */
export function computeStaffRow(item, ctx) {
  const {
    target,
    prorataStaffList,
    kpiTargets: KPITargets = DEFAULT_KPI_TARGETS,
    npsData,
    selectedStore,
    fromDate,
    // How many calendar months the selected range covers. Used ONLY to scale
    // the targets shown on the Target/KPI board (a 3-month range shows a 3x
    // target). KPI scoring and commission deliberately stay on the configured
    // per-month targets so payout figures are unaffected.
    periodMonths = 1,
    // Historical volume targets summed month-by-month across the selected range
    // (keyed by target field: ppn, bundel, tmb, tyro, websitebas...). When
    // provided, the board shows these instead of a flat perMonth x months —
    // this keeps totals correct when targets changed mid-range. Ratio KPIs are
    // never summed. Pro-rata staff keep flat scaling (handled separately).
    periodVolumeTargets = null,
  } = ctx;

  const salesrep =
    item.salesrep === '' || item.salesrep === null
      ? 'unknown salesrep'
      : item.salesrep;

  const effectiveTargets = getEffectiveTargets(salesrep, target, prorataStaffList);
  const nps = aggregateNps(item, npsData, selectedStore);

  // Device Protection % (column17Value in Dashboard)
  const stayConnectedCount =
    (item['Upgrade & Protect Plus (Stay Connected)'] || 0) +
    (item['Stay Connected'] || 0);
  const dpcCountSafe = item.dcpcount || 1;
  const devProtectPct = Math.round((stayConnectedCount / dpcCountSafe) * 100);

  // Accessory GP per device (columnACCValue)
  const dpcCount1 = item.dcpcount || 0;
  const outrightCount = item.outriCount || 0;
  const smartWatchCount = item.smartWatchCount || 0;
  const accDenom = dpcCount1 + outrightCount + smartWatchCount;
  const accGpPerDevice = accDenom
    ? Math.round(item.accGP / accDenom)
    : 0;

  // ----- KPI score -----
  let kpiScore = 0;
  if (
    (item.pnncount || 0) + (item['mob-new'] || 0) >=
    (effectiveTargets?.ppn != null ? effectiveTargets.ppn : 0)
  ) {
    kpiScore += KPITargets.KPIPPN != null ? KPITargets.KPIPPN : 0;
  }
  if (
    (item.bundelnewcount || 0) + (item['New Bundle/New Internet'] || 0) >=
    (effectiveTargets?.bundel != null ? effectiveTargets.bundel : 0)
  ) {
    kpiScore += KPITargets.KPIBundle != null ? KPITargets.KPIBundle : 0;
  }
  if (item['TMB-NEW (5)'] >= (effectiveTargets?.tmb != null ? effectiveTargets.tmb : 0)) {
    kpiScore += KPITargets.KPITMB != null ? KPITargets.KPITMB : 0;
  }
  if (item['SB NBN'] >= (effectiveTargets?.sbNbn != null ? effectiveTargets.sbNbn : 0)) {
    kpiScore += KPITargets.KPISBNBN != null ? KPITargets.KPISBNBN : 0;
  }
  if (
    item['Belong NBN'] >= (effectiveTargets?.tyro != null ? effectiveTargets.tyro : 0) &&
    item['Telstra Plus'] >=
      (effectiveTargets?.websitebas != null ? effectiveTargets.websitebas : 0)
  ) {
    kpiScore += KPITargets.KPITWD != null ? KPITargets.KPITWD : 0;
  }
  if (devProtectPct >= (effectiveTargets?.dpc != null ? effectiveTargets.dpc : 0)) {
    kpiScore += KPITargets.KPIDPC != null ? KPITargets.KPIDPC : 0;
  }
  if (
    accGpPerDevice >=
    (effectiveTargets?.AcceGP_Handset_Sales != null
      ? effectiveTargets.AcceGP_Handset_Sales
      : 0)
  ) {
    kpiScore += KPITargets.KPIACCGP != null ? KPITargets.KPIACCGP : 0;
  }

  // ----- Commission -----
  let commission;
  let eligible = false;
  if (item.grossprofit < (effectiveTargets?.gpGreenTarget || 12000)) {
    commission = 'Not Eligible';
  } else if (kpiScore >= KPITargets.KPIMAIN) {
    let pct;
    if (item.grossprofit >= (effectiveTargets?.gpTier3Threshold || 16000)) {
      pct = KPITargets.GPTier3Percentage;
    } else if (item.grossprofit >= (effectiveTargets?.gpTier2Threshold || 14000)) {
      pct = KPITargets.GPTier2Percentage;
    } else {
      pct = KPITargets.GPCommissionPercentage;
    }
    const grossProfitCommission = ((pct ?? 7) / 100) * (item.grossprofit ?? 0);
    const kpiAdjusted = (kpiScore / 100) * grossProfitCommission;

    const NPSVol = nps.npsVol;
    const NPSScore = nps.npsScore;
    // Penalty (halving) depends ONLY on the score, never on survey volume.
    // Volume only gates the upward 1.5x bonus. (Matches Dashboard.js)
    let npsMultiplier = KPITargets.NPSMultiplierMid; // 1.0x by default
    if (NPSScore < KPITargets.NPSScoreTargetMin) {
      npsMultiplier = KPITargets.NPSMultiplierLow; // 0.5x
    } else if (
      NPSVol >= KPITargets.NPSVoltarget &&
      NPSScore >= KPITargets.NPSScoreTargetMax
    ) {
      npsMultiplier = KPITargets.NPSMultiplierHigh; // 1.5x
    }
    commission = Number((kpiAdjusted * npsMultiplier).toFixed(2));
    eligible = true;
  } else {
    commission = 'Not Eligible';
  }

  // ----- Potential commission (current-month pace forecast) -----
  let potentialCommission;
  const currentGP = item.grossprofit || 0;
  const maxNPSMultiplier = KPITargets.NPSMultiplierHigh;
  const selFrom = new Date(fromDate);
  const today = new Date();
  const isCurrentMonth =
    selFrom.getFullYear() === today.getFullYear() &&
    selFrom.getMonth() === today.getMonth();

  if (!isCurrentMonth) {
    potentialCommission = 'Month Complete';
  } else {
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const daysPassed = Math.max(
      1,
      Math.ceil((today - startOfMonth) / (1000 * 60 * 60 * 24))
    );
    const totalDays = endOfMonth.getDate();
    const forecastGP = (currentGP / daysPassed) * totalDays;

    if (
      currentGP < (effectiveTargets?.gpGreenTarget || 12000) &&
      forecastGP < (effectiveTargets?.gpGreenTarget || 12000)
    ) {
      potentialCommission = 'Reach Min GP First';
    } else {
      let pct;
      if (forecastGP >= (effectiveTargets?.gpTier3Threshold || 16000)) {
        pct = KPITargets.GPTier3Percentage;
      } else if (forecastGP >= (effectiveTargets?.gpTier2Threshold || 14000)) {
        pct = KPITargets.GPTier2Percentage;
      } else {
        pct = KPITargets.GPCommissionPercentage;
      }
      const gpCommission = ((pct ?? 7) / 100) * forecastGP;
      potentialCommission = Number((gpCommission * maxNPSMultiplier).toFixed(2));
    }
  }

  // ----- Product incentive -----
  let productIncentive = 0;
  const breakdown = [];
  if (effectiveTargets?.productBonuses?.length) {
    effectiveTargets.productBonuses.forEach((bonus) => {
      let sales = 0;
      switch (bonus.product) {
        case 'PPN':
          sales = (item.pnncount || 0) + (item['mob-new'] || 0);
          break;
        case 'SB PPN':
          sales = item['SB PPN'] || 0;
          break;
        case 'Bundle New':
          sales = item.bundelnewcount || 0;
          break;
        case 'Internet NEW':
        case 'Internet Only':
          sales =
            (item.bundelnewcount || 0) +
            (item['New Bundle/New Internet'] || 0) -
            (item['SB NBN'] || 0);
          break;
        case 'MBB':
          sales = item['TMB-NEW (5)'] || 0;
          break;
        case 'Device Protection':
          sales =
            (item['Upgrade & Protect Plus (Stay Connected)'] || 0) +
            (item['Stay Connected'] || 0);
          break;
        case 'Belong PPN':
          sales = item['Belong PPN'] || 0;
          break;
        case 'SB NBN':
          sales = item['SB NBN'] || 0;
          break;
        case 'Belong NBN':
          sales = item['Belong NBN'] || 0;
          break;
        case 'Telstra Plus':
          sales = item['Telstra Plus'] || 0;
          break;
        case 'Device Security($10/m)':
          sales = 0;
          break;
        case 'Outright Mobile/Tablet Inc Prepaid':
          sales = item.outriCount || 0;
          break;
        case 'U&P Mobile/Tablet':
          sales = item.upgrade || 0;
          break;
        case 'DPC Mobile/Tablet':
          sales = item.dcpcount || 0;
          break;
        case 'Smart Watch':
          sales = item.smartWatchCount || 0;
          break;
        case 'Accessory GP':
          sales = Math.round(item.accGP) || 0;
          break;
        default:
          sales = 0;
      }
      const amount = sales * bonus.bonusValue;
      if (amount > 0) {
        productIncentive += amount;
        breakdown.push({
          product: bonus.product,
          sales,
          bonusValue: bonus.bonusValue,
          incentive: amount,
        });
      }
    });
  }

  // ----- Per-KPI Actual / Target breakdown (for the Target/KPI Board) -----
  const ppnActual = (item.pnncount || 0) + (item['mob-new'] || 0);
  const bundleActual =
    (item.bundelnewcount || 0) + (item['New Bundle/New Internet'] || 0);
  const mbbActual = item['TMB-NEW (5)'] || 0;
  const belongNbnActual = item['Belong NBN'] || 0;
  const telstraPlusActual = item['Telstra Plus'] || 0;

  // Volume KPIs scale with the number of months selected; ratio/percentage
  // KPIs (Device Protect %, Acc GP per device) do not — they are averages.
  // opts.field names the underlying target so we can look up a historical
  // month-by-month sum in periodVolumeTargets.
  const useHistory =
    periodVolumeTargets && !effectiveTargets.isProrataStaff;

  const kpi = (key, label, actual, target, weight, opts = {}) => {
    const perMonth = target ?? 0;
    let periodTarget;
    if (opts.isRatio) {
      periodTarget = perMonth; // averages are never scaled
    } else if (
      useHistory &&
      opts.field &&
      periodVolumeTargets[opts.field] != null
    ) {
      periodTarget = periodVolumeTargets[opts.field]; // historical sum
    } else {
      periodTarget = perMonth * periodMonths; // flat fallback
    }
    return {
      key,
      label,
      actual,
      target: perMonth,
      periodTarget,
      weight,
      ...opts,
      met: actual >= periodTarget,
    };
  };

  const kpiBreakdown = [
    kpi('ppn', 'PPN', ppnActual, effectiveTargets?.ppn, KPITargets.KPIPPN, { field: 'ppn' }),
    kpi('bundle', 'Bundles New', bundleActual, effectiveTargets?.bundel, KPITargets.KPIBundle, { field: 'bundel' }),
    kpi('mbb', 'MBB', mbbActual, effectiveTargets?.tmb, KPITargets.KPITMB, { field: 'tmb' }),
    kpi('belongNbn', 'Belong NBN', belongNbnActual, effectiveTargets?.tyro, KPITargets.KPITWD, { field: 'tyro' }),
    kpi('telstraPlus', 'Telstra Plus', telstraPlusActual, effectiveTargets?.websitebas, KPITargets.KPITWD, { field: 'websitebas' }),
    kpi('dpc', 'Device Protect %', devProtectPct, effectiveTargets?.dpc, KPITargets.KPIDPC, {
      isPercent: true, isRatio: true,
    }),
    kpi('accGp', 'Acc GP / Device', accGpPerDevice, effectiveTargets?.AcceGP_Handset_Sales, KPITargets.KPIACCGP, {
      isMoney: true, isRatio: true,
    }),
  ];

  const totalGP = Math.round(item.grossprofit || 0);
  const accGP = Math.round(item.accGP || 0);
  const handsetGP = Math.round((item.grossprofit || 0) - (item.accGP || 0));

  // % Achieved = KPI score vs main KPI threshold (used for green-light).
  const mainKpi = KPITargets.KPIMAIN || 65;
  const pctAchieved = mainKpi ? Math.round((kpiScore / mainKpi) * 100) : 0;

  return {
    salesrep,
    isProrataStaff: effectiveTargets.isProrataStaff,
    totalGP,
    handsetGP,
    accGP,
    devProtectPct,
    accGpPerDevice,
    kpiBreakdown,
    kpiScore,
    pctAchieved,
    kpiThresholdMet: kpiScore >= mainKpi,
    npsVol: nps.npsVol,
    npsScore: nps.npsScore,
    commission,
    commissionNumeric: eligible ? commission : 0,
    potentialCommission,
    productIncentive,
    productIncentiveBreakdown: breakdown,
    eligible,
  };
}
