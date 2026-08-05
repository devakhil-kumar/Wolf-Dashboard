// ReportsHome.js — entry point for the Reports module.
// Option-based menu to pick a report; renders the selected report inline.
import React, { useState } from 'react';
import { Box, Paper, Typography, Chip } from '@mui/material';
import Navbar from '../../components/Navbar';
import GpYoyReport from './GpYoyReport';
import CommissionReport from './CommissionReport';
import TargetKpiBoard from './TargetKpiBoard';
import StoreBenchmark from './StoreBenchmark';

const REPORTS = [
  {
    id: 'gp-yoy',
    title: 'GP Year-on-Year',
    desc: 'Compare Gross Profit against the same period last year, by store and segment.',
    ready: true,
  },
  {
    id: 'commission',
    title: 'Commission Report',
    desc: 'Staff & store commission snapshot.',
    ready: true,
  },
  {
    id: 'target-kpi',
    title: 'Target / KPI Board',
    desc: 'Staff KPI board with % achieved and green-light thresholds.',
    ready: true,
  },
  {
    id: 'benchmark',
    title: 'Store Benchmark / Overview',
    desc: 'Multi-site overview and side-by-side benchmarks.',
    ready: true,
  },
];

export default function ReportsHome() {
  const [selected, setSelected] = useState('gp-yoy');

  const renderReport = () => {
    switch (selected) {
      case 'gp-yoy':
        return <GpYoyReport />;
      case 'commission':
        return <CommissionReport />;
      case 'target-kpi':
        return <TargetKpiBoard />;
      case 'benchmark':
        return <StoreBenchmark />;
      default:
        return (
          <Box sx={{ p: 4, textAlign: 'center', color: '#7F8C8D' }}>
            <Typography variant="h6">This report is coming soon.</Typography>
          </Box>
        );
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F8F9FA' }}>
      <Navbar />
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, mb: 2, color: '#2C3E50' }}
        >
          Reports
        </Typography>

        {/* Report picker */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' },
            gap: 2,
            mb: 3,
          }}
        >
          {REPORTS.map((r) => {
            const active = selected === r.id;
            return (
              <Paper
                key={r.id}
                onClick={() => r.ready && setSelected(r.id)}
                elevation={active ? 6 : 1}
                sx={{
                  p: 2,
                  cursor: r.ready ? 'pointer' : 'not-allowed',
                  opacity: r.ready ? 1 : 0.55,
                  borderRadius: 2,
                  borderLeft: active
                    ? '5px solid #FF6B35'
                    : '5px solid transparent',
                  transition: 'all .15s ease',
                  '&:hover': r.ready ? { transform: 'translateY(-2px)' } : {},
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 1,
                  }}
                >
                  <Typography sx={{ fontWeight: 700, color: '#2C3E50' }}>
                    {r.title}
                  </Typography>
                  {!r.ready && (
                    <Chip label="Soon" size="small" sx={{ height: 20 }} />
                  )}
                </Box>
                <Typography variant="body2" sx={{ color: '#7F8C8D' }}>
                  {r.desc}
                </Typography>
              </Paper>
            );
          })}
        </Box>

        {renderReport()}
      </Box>
    </Box>
  );
}
