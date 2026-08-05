// TargetKpiBoard.js — Stage 3 report: staff Target / KPI board.
// Actual/Target (A/T) per KPI, colour-coded (green = hit, red = missed),
// % Achieved green-lights on KPI threshold. Reuses dashboard thunks + calc.
import React, { useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  Button,
  MenuItem,
  TextField,
  CircularProgress,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
} from '@mui/material';
import { loadData, AllStore } from '../../features/tableDataSlice';
import { getTargetThunk, getAllTargetsThunk } from '../../features/targetSlice';
import { getKPITargetThunk } from '../../features/kpiTargetSlice';
import { getAllNpsThunk } from '../../features/npsSlice';
import { getProrataStaffThunk } from '../../features/prorataStaffSlice';
import {
  buildKpiTargets,
  computeStaffRow,
  computePeriodVolumeTargets,
} from '../../utils/commissionCalc';
import { exportNodeToPdf } from '../../utils/exportPdf';
import MonthMultiSelect, { currentMonthValue } from '../../components/reports/MonthMultiSelect';

const STORES = ['Traralgon', 'Warragul', 'Torquay', 'Hamilton', 'All Stores'];

const money = (n) =>
  '$' + Number(n || 0).toLocaleString('en-AU', { maximumFractionDigits: 0 });

const defaultRange = () => {
  const now = new Date();
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  const iso = (d) => d.toISOString().slice(0, 10);
  return { from: iso(first), to: iso(now) };
};
const toDDMMYY = (iso) => {
  const d = new Date(iso);
  return `${String(d.getUTCDate()).padStart(2, '0')}/${String(
    d.getUTCMonth() + 1
  ).padStart(2, '0')}/${String(d.getUTCFullYear()).slice(2)}`;
};
const toDDMMYYYY = (iso) => iso.split('-').reverse().join('/');

// Format one KPI Actual/Target cell value. Volume KPIs show the period target
// (per-month target x months selected); ratio KPIs stay as-is.
const fmtAT = (kpi) => {
  const target = kpi.periodTarget ?? kpi.target ?? 0;
  if (kpi.isPercent) return `${kpi.actual}% / ${target}%`;
  if (kpi.isMoney) return `${money(kpi.actual)} / ${money(target)}`;
  return `${kpi.actual} / ${target}`;
};

// Calendar months spanned by a from/to range, inclusive (1 Jan–31 Mar = 3).
const monthsInRange = (from, to) => {
  if (!from || !to) return 1;
  const f = new Date(from);
  const t = new Date(to);
  const span =
    (t.getFullYear() - f.getFullYear()) * 12 + (t.getMonth() - f.getMonth()) + 1;
  return span > 0 ? span : 1;
};

export default function TargetKpiBoard() {
  const dispatch = useDispatch();
  const reportRef = useRef(null);
  const init = defaultRange();

  const [store, setStore] = useState('Traralgon');
  const [months, setMonths] = useState([currentMonthValue()]);
  const [fromDate, setFromDate] = useState(init.from);
  const [toDate, setToDate] = useState(init.to);
  const [hasRun, setHasRun] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Ticking months in the dropdown drives the from/to range.
  const handleMonthsChange = (selected, range) => {
    setMonths(selected);
    if (range) {
      setFromDate(range.from);
      setToDate(range.to);
    }
  };

  // Targets on this board are scaled by the number of months selected.
  const periodMonths = monthsInRange(fromDate, toDate);

  const { data, loading: dataLoading } = useSelector((s) => s.tableData);
  const { target, targets: allTargets, loading: targetLoading } = useSelector((s) => s.targets);
  const { KPITarget, loading: kpiLoading } = useSelector((s) => s.KPITargets);
  const { npsData } = useSelector((s) => s.nps);
  const { staffList: prorataStaffList } = useSelector((s) => s.prorataStaff);

  const loading = dataLoading || targetLoading || kpiLoading;

  // Per-month historical volume targets (accurate when targets changed mid-range).
  // Falls back to flat scaling when there is no history for the store.
  const periodVolumeTargets = useMemo(
    () => computePeriodVolumeTargets(allTargets, store, fromDate, toDate),
    [allTargets, store, fromDate, toDate]
  );

  const handleGenerate = () => {
    if (!fromDate || !toDate) return;
    const ddmmyy = { startDate: toDDMMYY(fromDate), endDate: toDDMMYY(toDate) };
    const targetLoc = store === 'All Stores' ? 'all-store' : store;
    if (store === 'All Stores') {
      dispatch(AllStore(ddmmyy));
    } else {
      dispatch(loadData({ salelocation: store, ...ddmmyy }));
      dispatch(getProrataStaffThunk({ salelocation: store, ...ddmmyy }));
    }
    dispatch(getTargetThunk({ salelocation: targetLoc, ...ddmmyy }));
    dispatch(getAllTargetsThunk()); // full target history for month-by-month scaling
    dispatch(getKPITargetThunk({ salelocation: targetLoc, ...ddmmyy }));
    dispatch(
      getAllNpsThunk({
        startDate: toDDMMYYYY(fromDate),
        endDate: toDDMMYYYY(toDate),
      })
    );
    setHasRun(true);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportNodeToPdf(
        reportRef.current,
        `TargetKPI_${store}_${fromDate}_to_${toDate}`
      );
    } finally {
      setExporting(false);
    }
  };

  const kpiTargets = useMemo(() => buildKpiTargets(KPITarget), [KPITarget]);

  const rows = useMemo(() => {
    if (!data?.length) return [];
    return data
      .map((item) =>
        computeStaffRow(item, {
          target,
          prorataStaffList,
          kpiTargets,
          npsData,
          selectedStore: store,
          fromDate,
          toDate,
          periodMonths,
          periodVolumeTargets,
        })
      )
      .sort((a, b) => b.totalGP - a.totalGP);
  }, [data, target, prorataStaffList, kpiTargets, npsData, store, fromDate, toDate, periodMonths, periodVolumeTargets]);

  // KPI column definitions taken from the first computed row (labels + weights).
  const kpiCols = rows[0]?.kpiBreakdown?.map((k) => ({
    key: k.key,
    label: k.label,
    weight: k.weight,
  })) || [];

  const totals = useMemo(() => {
    const t = { totalGP: 0, commission: 0, potential: 0, productIncentive: 0 };
    rows.forEach((r) => {
      t.totalGP += r.totalGP;
      t.commission += r.commissionNumeric;
      t.productIncentive += r.productIncentive;
      if (typeof r.potentialCommission === 'number') t.potential += r.potentialCommission;
    });
    return t;
  }, [rows]);

  return (
    <Box>
      {/* Filter bar */}
      <Paper sx={{ p: 2, mb: 2, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
        <TextField select label="Store" size="small" value={store}
          onChange={(e) => setStore(e.target.value)} sx={{ minWidth: 160 }}>
          {STORES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
        </TextField>
        <MonthMultiSelect value={months} onChange={handleMonthsChange} />
        {/* Manual From/To pickers removed — the Months dropdown drives the period.
        <TextField label="From" type="date" size="small" value={fromDate}
          onChange={(e) => setFromDate(e.target.value)} InputLabelProps={{ shrink: true }} />
        <TextField label="To" type="date" size="small" value={toDate}
          onChange={(e) => setToDate(e.target.value)} InputLabelProps={{ shrink: true }} />
        */}
        <Button variant="contained" onClick={handleGenerate} disabled={loading}
          sx={{ backgroundColor: '#FF6B35', '&:hover': { backgroundColor: '#E55A2B' } }}>
          {loading ? 'Loading…' : 'Generate'}
        </Button>
        <Button variant="outlined" onClick={handleExport} disabled={!hasRun || loading || exporting}
          sx={{ color: '#2C3E50', borderColor: '#2C3E50' }}>
          {exporting ? 'Exporting…' : 'Download PDF'}
        </Button>
      </Paper>

      {!hasRun && (
        <Typography sx={{ color: '#7F8C8D', mt: 2 }}>
          Select a store and date range, then click <strong>Generate</strong>.
        </Typography>
      )}
      {loading && <Box sx={{ textAlign: 'center', p: 4 }}><CircularProgress /></Box>}

      {hasRun && !loading && (
        <Box ref={reportRef} sx={{ backgroundColor: '#fff', p: 2, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, color: '#2C3E50' }}>
            Target / KPI Board — {store}
          </Typography>
          <Typography variant="body2" sx={{ color: '#7F8C8D', mb: 2 }}>
            {toDDMMYY(fromDate)} → {toDDMMYY(toDate)} &nbsp;·&nbsp; A / T = Actual / Target
            {periodMonths > 1 && (
              <>
                {' '}·{' '}
                <strong>
                  Volume targets summed across {periodMonths} months
                </strong>{' '}
                {periodVolumeTargets
                  ? '(using the target in force each month)'
                  : `(× ${periodMonths} — no target history for this store)`}
                ; ratio KPIs (Device Protect %, Acc GP/Device) are averages and
                not scaled
              </>
            )}
          </Typography>

          {rows.length === 0 ? (
            <Typography sx={{ color: '#7F8C8D' }}>No sales data for this selection.</Typography>
          ) : (
            <Paper variant="outlined" sx={{ overflowX: 'auto' }}>
              <Table size="small" sx={{ '& td, & th': { whiteSpace: 'nowrap' } }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#2C3E50' }}>
                    {['Staff', 'Bonus', 'Total GP', 'Potential Bonus', 'Product Inc.',
                      '% Achieved', 'NPS Score'].map((h) => (
                      <TableCell key={h} sx={{ color: '#fff', fontWeight: 700 }}>{h}</TableCell>
                    ))}
                    {kpiCols.map((c) => (
                      <TableCell key={c.key} align="center" sx={{ color: '#fff', fontWeight: 700 }}>
                        {c.label}
                        {c.weight != null && (
                          <Typography component="span" sx={{ display: 'block', fontSize: 11, opacity: 0.8 }}>
                            ({c.weight}%)
                          </Typography>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((r) => (
                    <TableRow key={r.salesrep}>
                      <TableCell sx={{ fontWeight: 600 }}>
                        {r.salesrep}
                        {r.isProrataStaff && (
                          <Chip label="PR" size="small" sx={{ ml: 0.5, height: 16, fontSize: 10 }} />
                        )}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, color: r.eligible ? '#00B894' : '#FF4444' }}>
                        {r.eligible ? money(r.commission) : '$0'}
                      </TableCell>
                      <TableCell>{money(r.totalGP)}</TableCell>
                      <TableCell sx={{ color: '#7F8C8D' }}>
                        {typeof r.potentialCommission === 'number' ? money(r.potentialCommission) : '—'}
                      </TableCell>
                      <TableCell>{money(r.productIncentive)}</TableCell>
                      <TableCell sx={{
                        fontWeight: 700, textAlign: 'center',
                        color: r.kpiThresholdMet ? '#fff' : '#2C3E50',
                        backgroundColor: r.kpiThresholdMet ? '#00C851' : '#FFF3CD',
                      }}>
                        {r.pctAchieved}%
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        {r.npsScore === '' ? '—' : r.npsScore}
                      </TableCell>
                      {r.kpiBreakdown.map((k) => (
                        <TableCell key={k.key} align="center" sx={{
                          fontWeight: 600,
                          color: k.met ? '#155724' : '#721C24',
                          backgroundColor: k.met ? '#D4EDDA' : '#F8D7DA',
                        }}>
                          {fmtAT(k)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                  {/* Store total row */}
                  <TableRow sx={{ backgroundColor: '#E8F5E9' }}>
                    <TableCell sx={{ fontWeight: 800 }}>{store} TOTAL</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: '#00B894' }}>{money(totals.commission)}</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>{money(totals.totalGP)}</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: '#7F8C8D' }}>{money(totals.potential)}</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>{money(totals.productIncentive)}</TableCell>
                    <TableCell colSpan={2 + kpiCols.length} />
                  </TableRow>
                </TableBody>
              </Table>
            </Paper>
          )}
        </Box>
      )}
    </Box>
  );
}
