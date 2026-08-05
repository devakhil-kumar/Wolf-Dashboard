// CommissionReport.js — Stage 2 report: per-staff commission snapshot.
// Reuses the existing dashboard thunks + the ported commission calc so the
// numbers match the live dashboard exactly. Manual PDF snapshot export.
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
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import { loadData, AllStore } from '../../features/tableDataSlice';
import { getTargetThunk } from '../../features/targetSlice';
import { getKPITargetThunk } from '../../features/kpiTargetSlice';
import { getAllNpsThunk } from '../../features/npsSlice';
import { getProrataStaffThunk } from '../../features/prorataStaffSlice';
import { buildKpiTargets, computeStaffRow } from '../../utils/commissionCalc';
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

// yyyy-mm-dd -> dd/mm/yy  (matches Dashboard.formatDate, UTC based)
const toDDMMYY = (iso) => {
  const d = new Date(iso);
  const day = String(d.getUTCDate()).padStart(2, '0');
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const year = String(d.getUTCFullYear()).slice(2);
  return `${day}/${month}/${year}`;
};
// yyyy-mm-dd -> dd/mm/yyyy  (matches Dashboard NPS/commission date format)
const toDDMMYYYY = (iso) => iso.split('-').reverse().join('/');

export default function CommissionReport() {
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

  const { data, loading: dataLoading } = useSelector((s) => s.tableData);
  const { target, loading: targetLoading } = useSelector((s) => s.targets);
  const { KPITarget, loading: kpiLoading } = useSelector((s) => s.KPITargets);
  const { npsData } = useSelector((s) => s.nps);
  const { staffList: prorataStaffList } = useSelector((s) => s.prorataStaff);

  const loading = dataLoading || targetLoading || kpiLoading;

  const handleGenerate = () => {
    if (!fromDate || !toDate) return;
    const ddmmyy = { startDate: toDDMMYY(fromDate), endDate: toDDMMYY(toDate) };
    const targetLoc = store === 'All Stores' ? 'all-store' : store;

    if (store === 'All Stores') {
      dispatch(AllStore(ddmmyy));
    } else {
      dispatch(loadData({ salelocation: store, ...ddmmyy }));
      dispatch(
        getProrataStaffThunk({ salelocation: store, ...ddmmyy })
      );
    }
    dispatch(getTargetThunk({ salelocation: targetLoc, ...ddmmyy }));
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
        `Commission_${store}_${fromDate}_to_${toDate}`
      );
    } finally {
      setExporting(false);
    }
  };

  const kpiTargets = useMemo(() => buildKpiTargets(KPITarget), [KPITarget]);

  // Compute per-staff rows from the same data the dashboard uses.
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
        })
      )
      .sort((a, b) => b.totalGP - a.totalGP);
  }, [data, target, prorataStaffList, kpiTargets, npsData, store, fromDate, toDate]);

  const totals = useMemo(() => {
    return rows.reduce(
      (acc, r) => {
        acc.totalGP += r.totalGP;
        acc.accGP += r.accGP;
        acc.commission += r.commissionNumeric;
        acc.productIncentive += r.productIncentive;
        return acc;
      },
      { totalGP: 0, accGP: 0, commission: 0, productIncentive: 0 }
    );
  }, [rows]);

  const chartData = rows
    .filter((r) => r.eligible)
    .map((r) => ({ name: r.salesrep, commission: r.commissionNumeric }));

  return (
    <Box>
      {/* Filter bar */}
      <Paper sx={{ p: 2, mb: 2, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
        <TextField
          select
          label="Store"
          size="small"
          value={store}
          onChange={(e) => setStore(e.target.value)}
          sx={{ minWidth: 160 }}
        >
          {STORES.map((s) => (
            <MenuItem key={s} value={s}>{s}</MenuItem>
          ))}
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

      {loading && (
        <Box sx={{ textAlign: 'center', p: 4 }}><CircularProgress /></Box>
      )}

      {hasRun && !loading && (
        <Box ref={reportRef} sx={{ backgroundColor: '#fff', p: 2, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, color: '#2C3E50' }}>
            Commission Report — {store}
          </Typography>
          <Typography variant="body2" sx={{ color: '#7F8C8D', mb: 2 }}>
            {toDDMMYY(fromDate)} → {toDDMMYY(toDate)}
          </Typography>

          {rows.length === 0 ? (
            <Typography sx={{ color: '#7F8C8D' }}>No sales data for this selection.</Typography>
          ) : (
            <>
              {/* KPI cards */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4,1fr)' }, gap: 2, mb: 3 }}>
                <KpiCard label="Total GP" value={money(totals.totalGP)} color="#2C7BE5" />
                <KpiCard label="Total Commission" value={money(totals.commission)} color="#00B894" />
                <KpiCard label="Product Incentives" value={money(totals.productIncentive)} color="#9B59B6" />
                <KpiCard label="Eligible Staff" value={`${chartData.length} / ${rows.length}`} color="#FF6B35" />
              </Box>

              {/* Commission by staff chart */}
              {chartData.length > 0 && (
                <Paper sx={{ p: 2, mb: 3 }}>
                  <Typography sx={{ fontWeight: 700, mb: 1, color: '#2C3E50' }}>
                    Commission by Staff (eligible)
                  </Typography>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-20} textAnchor="end" height={60} interval={0} />
                      <YAxis tickFormatter={(v) => money(v)} width={70} />
                      <Tooltip formatter={(v) => money(v)} />
                      <Bar dataKey="commission" radius={[4, 4, 0, 0]}>
                        {chartData.map((_, i) => (
                          <Cell key={i} fill="#00B894" />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              )}

              {/* Staff commission table */}
              <Paper variant="outlined" sx={{ overflowX: 'auto' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#2C3E50' }}>
                      {['Staff', 'Total GP', 'Acc GP', 'KPI Score', '% Achieved',
                        'NPS Score', 'Product Inc.', 'Commission', 'Potential'].map((h) => (
                        <TableCell key={h} sx={{ color: '#fff', fontWeight: 700, whiteSpace: 'nowrap' }}>
                          {h}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((r) => (
                      <TableRow key={r.salesrep}>
                        <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                          {r.salesrep}
                          {r.isProrataStaff && (
                            <Chip label="PR" size="small" sx={{ ml: 0.5, height: 16, fontSize: 10 }} />
                          )}
                        </TableCell>
                        <TableCell>{money(r.totalGP)}</TableCell>
                        <TableCell>{money(r.accGP)}</TableCell>
                        <TableCell>{r.kpiScore}%</TableCell>
                        {/* Green-light when KPI threshold met (client request, image #10) */}
                        <TableCell
                          sx={{
                            fontWeight: 700,
                            color: r.kpiThresholdMet ? '#fff' : '#2C3E50',
                            backgroundColor: r.kpiThresholdMet ? '#00C851' : '#FFF3CD',
                          }}
                        >
                          {r.pctAchieved}%
                        </TableCell>
                        <TableCell>{r.npsScore === '' ? '—' : r.npsScore}</TableCell>
                        <TableCell>{money(r.productIncentive)}</TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 700,
                            color: r.eligible ? '#00B894' : '#FF4444',
                          }}
                        >
                          {r.eligible ? money(r.commission) : r.commission}
                        </TableCell>
                        <TableCell sx={{ color: '#7F8C8D' }}>
                          {typeof r.potentialCommission === 'number'
                            ? money(r.potentialCommission)
                            : r.potentialCommission}
                        </TableCell>
                      </TableRow>
                    ))}
                    {/* Store total row */}
                    <TableRow sx={{ backgroundColor: '#E8F5E9' }}>
                      <TableCell sx={{ fontWeight: 800 }}>{store} TOTAL</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>{money(totals.totalGP)}</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>{money(totals.accGP)}</TableCell>
                      <TableCell />
                      <TableCell />
                      <TableCell />
                      <TableCell sx={{ fontWeight: 800 }}>{money(totals.productIncentive)}</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: '#00B894' }}>{money(totals.commission)}</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableBody>
                </Table>
              </Paper>
            </>
          )}
        </Box>
      )}
    </Box>
  );
}

function KpiCard({ label, value, color }) {
  return (
    <Paper sx={{ p: 2, borderTop: `4px solid ${color}` }}>
      <Typography variant="body2" sx={{ color: '#7F8C8D' }}>{label}</Typography>
      <Typography variant="h5" sx={{ fontWeight: 700, color: '#2C3E50' }}>{value}</Typography>
    </Paper>
  );
}
