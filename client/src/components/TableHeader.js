import React from 'react';
import { Table, TableHead, TableRow, TableCell } from '@mui/material';

const TableHeader = ({ hideColumns, kpiData }) => {
  const headers = [
    { colSpan: hideColumns ? 3 : 6, align: 'left', percentage: '' },
    { colSpan: 1, align: 'center', percentage: '20%', kpi: 'PPN' },
    { colSpan: 1, align: 'center', percentage: '25%', kpi: 'Bundle' },
    { colSpan: 1, align: 'center', percentage: '' },
    { colSpan: hideColumns ? 0 : 1, align: 'center', percentage: '' },
    { colSpan: 3, align: 'center', percentage: '15%', kpi: 'TWD' },
    { colSpan: hideColumns ? 1 : 4, align: 'center', percentage: '' },
    { colSpan: 1, align: 'center', percentage: '15%', kpi: 'DPC' },
    { colSpan: 1, align: 'center', percentage: '25%', kpi: 'ACCGP' },
    { colSpan: hideColumns ? 2 : 4, align: 'left', percentage: '' },
  ];

  return (
    <Table stickyHeader aria-label="sticky table">
      <TableHead>
        <TableRow>
          {headers.map((header, index) => (
            <TableCell
              key={index}
              colSpan={header.colSpan}
              align={header.align}
              style={{ borderRight: "1px solid #e0e0e0" }}
            >
              {header.percentage && (
                <>
                  {header.percentage}
                  {header.kpi && kpiData && (
                    <div>{kpiData[header.kpi] || 'N/A'}%</div>
                  )}
                </>
              )}
              {header.colSpan === 3 && '15% compulsory KPI'}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      {/* Table body would go here */}
    </Table>
  );
};

export default TableHeader;