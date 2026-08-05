// MonthMultiSelect.js — dropdown with tick boxes to pick one or more months.
// Selecting months drives the report's from/to date range, so users don't have
// to set start/end dates manually.
import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
} from '@mui/material';

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/** Current month as a "YYYY-MM" value — the default selection for reports. */
export function currentMonthValue() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

/** Build the last `count` months, newest first. Values look like "2026-07". */
export function buildMonthOptions(count = 24) {
  const opts = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    opts.push({
      value: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      label: `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`,
    });
  }
  return opts;
}

/**
 * Convert selected months into a single from/to range.
 * Spans from the start of the earliest month to the end of the latest month.
 * Returns null when nothing is selected.
 */
export function monthsToRange(months) {
  if (!months || months.length === 0) return null;
  const sorted = [...months].sort();
  const [sy, sm] = sorted[0].split('-').map(Number);
  const [ey, em] = sorted[sorted.length - 1].split('-').map(Number);
  const lastDay = new Date(ey, em, 0).getDate();
  return {
    from: `${sy}-${String(sm).padStart(2, '0')}-01`,
    to: `${ey}-${String(em).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`,
  };
}

/**
 * Expand a selection so every month between the earliest and latest is included.
 * The report always covers one continuous range, so ticking Feb and Apr must
 * also tick Mar — otherwise the board would silently include a month the user
 * never selected.
 * @param {string[]} selected - sorted oldest -> newest
 * @param {string[]} allSorted - every option value, sorted oldest -> newest
 */
function fillRange(selected, allSorted) {
  if (!selected || selected.length <= 1) return selected || [];
  const start = allSorted.indexOf(selected[0]);
  const end = allSorted.indexOf(selected[selected.length - 1]);
  if (start === -1 || end === -1) return selected;
  return allSorted.slice(start, end + 1);
}

/** How many whole months the selection spans (used to scale targets). */
export function monthSpan(months) {
  if (!months || months.length === 0) return 0;
  const sorted = [...months].sort();
  const [sy, sm] = sorted[0].split('-').map(Number);
  const [ey, em] = sorted[sorted.length - 1].split('-').map(Number);
  return (ey - sy) * 12 + (em - sm) + 1;
}

export default function MonthMultiSelect({
  value = [],
  onChange,
  monthsBack = 24,
  label = 'Months',
  minWidth = 220,
}) {
  const options = React.useMemo(
    () => buildMonthOptions(monthsBack),
    [monthsBack]
  );

  const handleChange = (event) => {
    const raw =
      typeof event.target.value === 'string'
        ? event.target.value.split(',')
        : event.target.value;

    const allSorted = options.map((o) => o.value).sort(); // oldest -> newest
    const prev = [...value].sort();
    const next = [...raw].sort();
    const removed = prev.filter((v) => !next.includes(v));

    let result;
    if (removed.length === 1 && prev.length > 1) {
      const gone = removed[0];
      const isEndpoint = gone === prev[0] || gone === prev[prev.length - 1];
      if (isEndpoint) {
        // Range just shrinks from one end; still continuous.
        result = next;
      } else {
        // A middle month was unticked. Re-filling would instantly put it back,
        // so split the range there and keep the larger remaining side.
        const idx = prev.indexOf(gone);
        const before = prev.slice(0, idx);
        const after = prev.slice(idx + 1);
        result = after.length > before.length ? after : before;
      }
    } else {
      // A month was added (or selection cleared) — pull in any months in
      // between so the ticks match exactly what the report will cover.
      result = fillRange(next, allSorted);
    }

    onChange(result, monthsToRange(result));
  };

  return (
    <FormControl size="small" sx={{ minWidth }}>
      <InputLabel>{label}</InputLabel>
      <Select
        multiple
        value={value}
        onChange={handleChange}
        input={<OutlinedInput label={label} />}
        renderValue={(selected) => {
          if (selected.length === 0) return '';
          if (selected.length === 1) {
            return options.find((o) => o.value === selected[0])?.label || selected[0];
          }
          const sorted = [...selected].sort();
          const first = options.find((o) => o.value === sorted[0])?.label;
          const last = options.find((o) => o.value === sorted[sorted.length - 1])?.label;
          return `${first} – ${last} (${selected.length})`;
        }}
        MenuProps={{ PaperProps: { style: { maxHeight: 320 } } }}
      >
        {options.map((o) => (
          <MenuItem key={o.value} value={o.value} dense>
            <Checkbox checked={value.indexOf(o.value) > -1} size="small" />
            <ListItemText primary={o.label} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
