// StoreBenchmark.js — Stage 4 report: multi-site Store Benchmark / Overview.
// Overview table (all stores side-by-side + grand total) plus store-vs-store
// benchmark bar charts. Backed by /api/reports/store-overview. PDF export.
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
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
import { getStoreOverviewThunk } from '../../features/reportsSlice';
import { exportNodeToPdf } from '../../utils/exportPdf';
import MonthMultiSelect, { currentMonthValue } from '../../components/reports/MonthMultiSelect';

const money = (n) =>
  '$' + Number(n || 0).toLocaleString('en-AU', { maximumFractionDigits: 0 });
const num = (n) => Number(n || 0).toLocaleString('en-AU');

const defaultRange = () => {
  const now = new Date();
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  const iso = (d) => d.toISOString().slice(0, 10);
  return { from: iso(first), to: iso(now) };
};

// Overview table rows: [label, accessor, formatter].
const METRICS = [
  { label: 'Total GP', key: 'grossProfit', fmt: money },
  { label: 'Handset/Plan GP', key: 'handsetGP', fmt: money },
  { label: 'Accessory GP', key: 'accessoryGP', fmt: money },
  { label: 'GP / Handset', key: 'gpPerHandset', fmt: money },
  { label: 'Avg GP / Sale', key: 'avgGpPerSale', fmt: money },
  { label: 'Acc GP / Device', key: 'accGpPerDevice', fmt: money },
  { label: 'Handsets Sold', key: 'handsetCount', fmt: num },
  { label: 'PPN', key: 'ppn', fmt: num },
  { label: 'Bundles New', key: 'bundles', fmt: num },
  { label: 'MBB', key: 'mbb', fmt: num },
  { label: 'DPC', key: 'dpcCount', fmt: num },
];

// Charts to render store-vs-store.
const CHARTS = [
  { title: 'Total GP', key: 'grossProfit', money: true },
  { title: 'GP / Handset', key: 'gpPerHandset', money: true },
  { title: 'Acc GP / Device', key: 'accGpPerDevice', money: true },
  { title: 'Avg GP / Sale', key: 'avgGpPerSale', money: true },
  { title: 'PPN Volume', key: 'ppn', money: false },
  { title: 'Bundles New Volume', key: 'bundles', money: false },
];

const BAR_COLORS = ['#2C7BE5', '#00B894', '#FF6B35', '#9B59B6', '#E67E22'];

export default function StoreBenchmark() {
  const dispatch = useDispatch();
  const reportRef = useRef(null);
  const init = defaultRange();

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

  const { storeOverview, overviewLoading, error } = useSelector((s) => s.reports);

  const handleGenerate = () => {
    if (!fromDate || !toDate) return;
    dispatch(getStoreOverviewThunk({ startDate: fromDate, endDate: toDate }));
    setHasRun(true);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportNodeToPdf(
        reportRef.current,
        `Store_Benchmark_${fromDate}_to_${toDate}`
      );
    } finally {
      setExporting(false);
    }
  };

  const stores = storeOverview?.stores || [];
  const grandTotal = storeOverview?.grandTotal;

  return (
    <Box>
      {/* Filter bar */}
      <Paper sx={{ p: 2, mb: 2, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
        <MonthMultiSelect value={months} onChange={handleMonthsChange} />
        {/* Manual From/To pickers removed — the Months dropdown drives the period.
        <TextField label="From" type="date" size="small" value={fromDate}
          onChange={(e) => setFromDate(e.target.value)} InputLabelProps={{ shrink: true }} />
        <TextField label="To" type="date" size="small" value={toDate}
          onChange={(e) => setToDate(e.target.value)} InputLabelProps={{ shrink: true }} />
        */}
        <Button variant="contained" onClick={handleGenerate} disabled={overviewLoading}
          sx={{ backgroundColor: '#FF6B35', '&:hover': { backgroundColor: '#E55A2B' } }}>
          {overviewLoading ? 'Loading…' : 'Generate'}
        </Button>
        <Button variant="outlined" onClick={handleExport} disabled={!hasRun || overviewLoading || exporting}
          sx={{ color: '#2C3E50', borderColor: '#2C3E50' }}>
          {exporting ? 'Exporting…' : 'Download PDF'}
        </Button>
      </Paper>

      {error && <Typography sx={{ color: 'red', mb: 2 }}>Failed to load: {error}</Typography>}
      {!hasRun && (
        <Typography sx={{ color: '#7F8C8D', mt: 2 }}>
          Pick a date range, then click <strong>Generate</strong> to compare all stores.
        </Typography>
      )}
      {overviewLoading && <Box sx={{ textAlign: 'center', p: 4 }}><CircularProgress /></Box>}

      {hasRun && !overviewLoading && storeOverview && (
        <Box ref={reportRef} sx={{ backgroundColor: '#fff', p: 2, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, color: '#2C3E50' }}>
            Store Benchmark / Overview
          </Typography>
          <Typography variant="body2" sx={{ color: '#7F8C8D', mb: 2 }}>
            {storeOverview.meta.startDate} → {storeOverview.meta.endDate}
          </Typography>

          {stores.length === 0 ? (
            <Typography sx={{ color: '#7F8C8D' }}>No data for this date range.</Typography>
          ) : (
            <>
              {/* Overview table: metrics x stores + grand total */}
              <Paper variant="outlined" sx={{ overflowX: 'auto', mb: 3 }}>
                <Table size="small" sx={{ '& td, & th': { whiteSpace: 'nowrap' } }}>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#2C3E50' }}>
                      <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Metric</TableCell>
                      {stores.map((s) => (
                        <TableCell key={s.store} align="right" sx={{ color: '#fff', fontWeight: 700 }}>
                          {s.store}
                        </TableCell>
                      ))}
                      <TableCell align="right" sx={{ color: '#fff', fontWeight: 800, backgroundColor: '#1A252F' }}>
                        Grand Total
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {METRICS.map((m, idx) => (
                      <TableRow key={m.key} sx={{ backgroundColor: idx % 2 ? '#F8F9FA' : '#fff' }}>
                        <TableCell sx={{ fontWeight: 600 }}>{m.label}</TableCell>
                        {stores.map((s) => (
                          <TableCell key={s.store} align="right">{m.fmt(s[m.key])}</TableCell>
                        ))}
                        <TableCell align="right" sx={{ fontWeight: 800, backgroundColor: '#E8F5E9' }}>
                          {grandTotal ? m.fmt(grandTotal[m.key]) : '—'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>

              {/* Benchmark bar charts (store-vs-store) */}
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)' },
                gap: 2,
              }}>
                {CHARTS.map((c) => {
                  const chartData = stores.map((s) => ({ name: s.store, value: s[c.key] }));
                  const fmt = c.money ? money : num;
                  return (
                    <Paper key={c.key} sx={{ p: 2 }}>
                      <Typography sx={{ fontWeight: 700, mb: 1, color: '#2C3E50' }}>{c.title}</Typography>
                      <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis tickFormatter={fmt} width={55} />
                          <Tooltip formatter={fmt} />
                          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                            {chartData.map((_, i) => (
                              <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </Paper>
                  );
                })}
              </Box>
            </>
          )}
        </Box>
      )}
    </Box>
  );
}
