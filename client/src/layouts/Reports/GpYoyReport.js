// GpYoyReport.js — Stage 1 report: GP Year-on-Year comparison.
// Filters (store + date range) -> KPI cards, store comparison, segment pies,
// monthly trend, and a comparison table. Manual PDF snapshot export.
import React, { useRef, useState } from 'react';
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
} from '@mui/material';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { getGpComparisonThunk, getGpTrendThunk } from '../../features/reportsSlice';
import { exportNodeToPdf } from '../../utils/exportPdf';
import MonthMultiSelect, { currentMonthValue } from '../../components/reports/MonthMultiSelect';

const STORES = ['All Stores', 'Traralgon', 'Warragul', 'Torquay', 'Hamilton'];
const SEGMENT_COLORS = ['#2C7BE5', '#00B894', '#FF6B35'];

// Years available for the trend chart (this year and the previous few).
const YEAR_OPTIONS = (() => {
  const now = new Date().getFullYear();
  return [now, now - 1, now - 2];
})();

const money = (n) =>
  '$' + Number(n || 0).toLocaleString('en-AU', { maximumFractionDigits: 0 });

// First day of current month -> today, as yyyy-mm-dd for <input type=date>.
const defaultRange = () => {
  const now = new Date();
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  const iso = (d) => d.toISOString().slice(0, 10);
  return { from: iso(first), to: iso(now) };
};

export default function GpYoyReport() {
  const dispatch = useDispatch();
  const reportRef = useRef(null);
  const init = defaultRange();

  const [store, setStore] = useState('All Stores');
  const [year, setYear] = useState(''); // '' = custom range / months
  const [months, setMonths] = useState([currentMonthValue()]);
  const [fromDate, setFromDate] = useState(init.from);
  const [toDate, setToDate] = useState(init.to);
  const [exporting, setExporting] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  // Ticking months in the dropdown drives the from/to range.
  const handleMonthsChange = (selected, range) => {
    setMonths(selected);
    setYear(''); // months take over from the year quick-pick
    if (range) {
      setFromDate(range.from);
      setToDate(range.to);
    }
  };

  // Year quick-pick: sets the whole reporting period to that year
  // (year-to-date if it's the current year).
  const handleYearChange = (selectedYear) => {
    setYear(selectedYear);
    setMonths([]);
    const now = new Date();
    setFromDate(`${selectedYear}-01-01`);
    setToDate(
      selectedYear === now.getFullYear()
        ? now.toISOString().slice(0, 10)
        : `${selectedYear}-12-31`
    );
  };

  // Everything (cards, stores, segments, trend) follows the selected period.
  // The trend chart plots the period's year against the year before it.
  const trendYear = toDate
    ? new Date(toDate).getFullYear()
    : new Date().getFullYear();

  const { gpComparison, gpTrend, comparisonLoading, trendLoading, error } =
    useSelector((state) => state.reports);

  const storeParam = store === 'All Stores' ? 'all' : store;

  const handleGenerate = () => {
    if (!fromDate || !toDate) return;
    dispatch(
      getGpComparisonThunk({
        salelocation: storeParam,
        startDate: fromDate,
        endDate: toDate,
      })
    );
    dispatch(
      getGpTrendThunk({ salelocation: storeParam, year: trendYear, compare: true })
    );
    setHasRun(true);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportNodeToPdf(
        reportRef.current,
        `GP_YoY_${store}_${fromDate}_to_${toDate}`
      );
    } finally {
      setExporting(false);
    }
  };

  const loading = comparisonLoading || trendLoading;
  const total = gpComparison?.total;

  // Build chart-ready data.
  const sameperiodBars = total
    ? [
        { name: 'Previous Year', GP: total.previous.grossProfit },
        { name: 'Current Year', GP: total.current.grossProfit },
      ]
    : [];

  const perStoreBars =
    gpComparison?.perStore?.map((s) => ({
      name: s.store,
      'Current GP': s.current.grossProfit,
      'Previous GP': s.previous.grossProfit,
    })) || [];

  const segPie = (seg) =>
    seg
      ? [
          { name: 'Handset/Plan GP', value: Math.max(seg.handset, 0) },
          { name: 'Accessory GP', value: Math.max(seg.accessory, 0) },
        ]
      : [];

  const trendData =
    gpTrend?.trend?.map((t) => ({
      month: t.month,
      [`${gpTrend.year}`]: t.current,
      ...(t.previous != null ? { [`${gpTrend.compareYear}`]: t.previous } : {}),
    })) || [];

  return (
    <Box>
      {/* ===== Filter bar ===== */}
      <Paper
        sx={{
          p: 2,
          mb: 2,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          alignItems: 'center',
        }}
      >
        <TextField
          select
          label="Store"
          size="small"
          value={store}
          onChange={(e) => setStore(e.target.value)}
          sx={{ minWidth: 160 }}
        >
          {STORES.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Year"
          size="small"
          value={year}
          onChange={(e) => handleYearChange(Number(e.target.value))}
          sx={{ minWidth: 150 }}
        >
          {YEAR_OPTIONS.map((y) => (
            <MenuItem key={y} value={y}>
              {y}
              {y === new Date().getFullYear() ? ' (to date)' : ''}
            </MenuItem>
          ))}
        </TextField>

        <MonthMultiSelect value={months} onChange={handleMonthsChange} monthsBack={36} />

        {/* Manual From/To pickers removed — the Year + Months dropdowns drive
            the period now. Kept here in case a custom range is needed later.
        <TextField
          label="From"
          type="date"
          size="small"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="To"
          type="date"
          size="small"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        */}

        <Button
          variant="contained"
          onClick={handleGenerate}
          disabled={loading}
          sx={{ backgroundColor: '#FF6B35', '&:hover': { backgroundColor: '#E55A2B' } }}
        >
          {loading ? 'Loading…' : 'Generate'}
        </Button>

        <Button
          variant="outlined"
          onClick={handleExport}
          disabled={!hasRun || loading || exporting}
          sx={{ color: '#2C3E50', borderColor: '#2C3E50' }}
        >
          {exporting ? 'Exporting…' : 'Download PDF'}
        </Button>
      </Paper>

      {error && (
        <Typography sx={{ color: 'red', mb: 2 }}>
          Failed to load report: {error}
        </Typography>
      )}

      {!hasRun && (
        <Typography sx={{ color: '#7F8C8D', mt: 2 }}>
          Select a store and date range, then click <strong>Generate</strong>.
        </Typography>
      )}

      {loading && (
        <Box sx={{ textAlign: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* ===== Report body (this is what gets snapshotted to PDF) ===== */}
      {hasRun && !loading && gpComparison && (
        <Box ref={reportRef} sx={{ backgroundColor: '#fff', p: 2, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, color: '#2C3E50' }}>
            GP Year-on-Year — {store}
          </Typography>
          <Typography variant="body2" sx={{ color: '#7F8C8D', mb: 2 }}>
            Selected period: <strong>{gpComparison.meta.current.startDate} →{' '}
            {gpComparison.meta.current.endDate}</strong> &nbsp;compared with&nbsp;
            <strong>{gpComparison.meta.previous.startDate} →{' '}
            {gpComparison.meta.previous.endDate}</strong> (same period, one year
            earlier)
          </Typography>

          {/* Comparison data availability — the platform only holds ~18 months,
              so earlier comparison periods legitimately come back empty. */}
          {total && total.previous.grossProfit === 0 && (
            <Paper
              variant="outlined"
              sx={{ p: 1.5, mb: 2, backgroundColor: '#FFF3CD', borderColor: '#FFE08A' }}
            >
              <Typography variant="body2" sx={{ color: '#7A5B00' }}>
                <strong>No data for the comparison period</strong> (
                {gpComparison.meta.previous.startDate} →{' '}
                {gpComparison.meta.previous.endDate}). Year-on-year figures need
                sales history for that period — comparisons will fill in
                automatically as more history builds up.
              </Typography>
            </Paper>
          )}

          {/* KPI cards */}
          {total && (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
                gap: 2,
                mb: 3,
              }}
            >
              <KpiCard label="Current GP" value={money(total.current.grossProfit)} color="#2C7BE5" />
              <KpiCard label="Previous Year GP" value={money(total.previous.grossProfit)} color="#7F8C8D" />
              <KpiCard
                label="Difference"
                value={`${total.diff.grossProfit.change >= 0 ? '+' : ''}${money(
                  total.diff.grossProfit.change
                )}`}
                sub={
                  total.diff.grossProfit.pct != null
                    ? `${total.diff.grossProfit.pct >= 0 ? '+' : ''}${total.diff.grossProfit.pct}%`
                    : '—'
                }
                color={total.diff.grossProfit.change >= 0 ? '#00B894' : '#FF4444'}
              />
              <KpiCard label="Avg GP / Sale" value={money(total.current.avgGpPerSale)} color="#FF6B35" />
            </Box>
          )}

          {/* Same-period & per-store comparison */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 2fr' },
              gap: 2,
              mb: 3,
            }}
          >
            <ChartCard title="Same Period — This Year vs Last Year">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={sameperiodBars}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(v) => money(v)} width={70} />
                  <Tooltip formatter={(v) => money(v)} />
                  <Bar dataKey="GP" radius={[4, 4, 0, 0]}>
                    <Cell fill="#7F8C8D" />
                    <Cell fill="#2C7BE5" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Gross Profit by Store — Current vs Previous Year">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={perStoreBars}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(v) => money(v)} width={70} />
                  <Tooltip formatter={(v) => money(v)} />
                  <Legend />
                  <Bar dataKey="Previous GP" fill="#7F8C8D" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Current GP" fill="#2C7BE5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </Box>

          {/* Segment pies */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 2,
              mb: 3,
            }}
          >
            <ChartCard title="GP by Segment — Current">
              <SegmentPie data={segPie(gpComparison.segments?.current)} />
            </ChartCard>
            <ChartCard title="GP by Segment — Previous Year">
              <SegmentPie data={segPie(gpComparison.segments?.previous)} />
            </ChartCard>
          </Box>

          {/* Monthly trend */}
          <ChartCard
            title={`Monthly GP Trend — ${gpTrend?.year || ''}${
              gpTrend?.compareYear ? ` vs ${gpTrend.compareYear}` : ''
            }`}
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(v) => money(v)} width={70} />
                <Tooltip formatter={(v) => money(v)} />
                <Legend />
                {gpTrend?.compareYear && (
                  <Line
                    type="monotone"
                    dataKey={`${gpTrend.compareYear}`}
                    stroke="#7F8C8D"
                    strokeWidth={2}
                    dot={false}
                  />
                )}
                {gpTrend?.year && (
                  <Line
                    type="monotone"
                    dataKey={`${gpTrend.year}`}
                    stroke="#FF6B35"
                    strokeWidth={2}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Comparison table */}
          <Paper variant="outlined" sx={{ mt: 3, overflowX: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#2C3E50' }}>
                  {['Store', 'Current GP', 'Previous Year GP', 'Difference', 'Change %'].map(
                    (h) => (
                      <TableCell key={h} sx={{ color: '#fff', fontWeight: 700 }}>
                        {h}
                      </TableCell>
                    )
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {gpComparison.perStore.map((s) => (
                  <ComparisonRow key={s.store} row={s} />
                ))}
                {total && <ComparisonRow row={total} isTotal />}
              </TableBody>
            </Table>
          </Paper>
        </Box>
      )}
    </Box>
  );
}

function KpiCard({ label, value, sub, color }) {
  return (
    <Paper sx={{ p: 2, borderTop: `4px solid ${color}` }}>
      <Typography variant="body2" sx={{ color: '#7F8C8D' }}>
        {label}
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 700, color: '#2C3E50' }}>
        {value}
      </Typography>
      {sub && (
        <Typography variant="body2" sx={{ color, fontWeight: 700 }}>
          {sub}
        </Typography>
      )}
    </Paper>
  );
}

function ChartCard({ title, children }) {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontWeight: 700, mb: 1, color: '#2C3E50' }}>{title}</Typography>
      {children}
    </Paper>
  );
}

function SegmentPie({ data }) {
  const totalVal = data.reduce((a, b) => a + b.value, 0);
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={90}
          label={(e) =>
            totalVal ? `${Math.round((e.value / totalVal) * 100)}%` : ''
          }
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={SEGMENT_COLORS[i % SEGMENT_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(v) =>
            '$' + Number(v).toLocaleString('en-AU', { maximumFractionDigits: 0 })
          }
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

function ComparisonRow({ row, isTotal }) {
  const cur = row.current.grossProfit;
  const prev = row.previous.grossProfit;
  const change = row.diff.grossProfit.change;
  const pct = row.diff.grossProfit.pct;
  const up = change >= 0;
  return (
    <TableRow sx={isTotal ? { backgroundColor: '#E8F5E9', fontWeight: 700 } : {}}>
      <TableCell sx={{ fontWeight: isTotal ? 700 : 500 }}>{row.store}</TableCell>
      <TableCell>{money(cur)}</TableCell>
      <TableCell>{money(prev)}</TableCell>
      <TableCell sx={{ color: up ? '#00B894' : '#FF4444', fontWeight: 700 }}>
        {up ? '+' : ''}
        {money(change)}
      </TableCell>
      <TableCell sx={{ color: up ? '#00B894' : '#FF4444', fontWeight: 700 }}>
        {pct != null ? `${up ? '+' : ''}${pct}%` : '—'}
      </TableCell>
    </TableRow>
  );
}
