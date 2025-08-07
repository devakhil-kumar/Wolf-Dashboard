// ExportToExcel.js
import * as XLSX from 'xlsx';
import React, { useState } from 'react';
import { 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Box
} from '@mui/material';
// import DownloadIcon from '@mui/icons-material/Download';
/**
 * Exports selected table data to Excel
 * @param {Array} data - The data to export
 * @param {Array} columns - Column definitions
 * @param {Array} selectedColumns - Indices of columns to include in export
 * @param {string} fileName - Name for the exported file
 */
export const exportToExcel = (data, columns, selectedColumns, fileName = 'table_data') => {
  try {
    // Filter columns based on selection
    const exportColumns = columns.filter((_, index) => selectedColumns.includes(index));
    
    // Create worksheet data array starting with headers
    const worksheetData = [
      exportColumns.map(col => col.label)
    ];
    
    // Add data rows
    data.forEach(row => {
      const rowData = exportColumns.map(column => {
        // Extract value from the row using column id
        const value = row[column.id];
        
        // Format as needed (remove dollar signs, etc.)
        if (typeof value === 'string' && value.startsWith('$')) {
          return parseFloat(value.substring(1));
        }
        
        return value;
      });
      
      worksheetData.push(rowData);
    });
    
    // Add totals row if available
    if (data.length > 0) {
      const totalRow = exportColumns.map((column, index) => {
        if (index === 0) return 'Total';
        
        // Calculate column total
        const total = data.reduce((sum, row) => {
          const value = row[column.id];
          const numValue = typeof value === 'string' && value.startsWith('$') 
            ? parseFloat(value.substring(1)) 
            : parseFloat(value);
          
          return sum + (isNaN(numValue) ? 0 : numValue);
        }, 0);
        
        // Format certain columns (percentages, etc.)
        if (column.id === 'column-17') {
          return Math.round(total) + '%';
        }
        
        return Math.round(total);
      });
      
      worksheetData.push(totalRow);
    }
    
    // Create worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    
    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Dashboard Data');
    
    // Generate Excel file
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    alert('Failed to export data. Please try again.');
  }
};

/**
 * Component to add to the Dashboard for Excel export functionality
 */


const ExcelExportComponent = ({ data, columns, tabValue }) => {
  const [open, setOpen] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState([]);
  
  const handleOpen = () => {
    // Initialize with all columns selected
    setSelectedColumns(columns.map((_, index) => index));
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
  };
  
  const handleToggleColumn = (index) => {
    setSelectedColumns(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };
  
  const handleSelectAll = () => {
    setSelectedColumns(columns.map((_, index) => index));
  };
  
  const handleSelectNone = () => {
    setSelectedColumns([]);
  };
  
  const handleExport = () => {
    if (selectedColumns.length === 0) {
      alert('Please select at least one column to export');
      return;
    }
    
    exportToExcel(
      data, 
      columns, 
      selectedColumns, 
      `${tabValue}_dashboard_data_${new Date().toISOString().slice(0, 10)}`
    );
    
    handleClose();
  };
  
  return (
    <>
      <Button 
        variant="contained" 
        color="primary" 
        // startIcon={<DownloadIcon />}
        onClick={handleOpen}
        sx={{ 
          backgroundColor: '#54595f',
          '&:hover': {
            backgroundColor: '#3f4448',
          }
        }}
      >
        Export
      </Button>
      
      <Dialog open={open} onClose={handleClose} maxWidth="md">
        <DialogTitle>Select Columns to Export</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Button variant="outlined" onClick={handleSelectAll} sx={{ mr: 1 }}>
              Select All
            </Button>
            <Button variant="outlined" onClick={handleSelectNone}>
              Select None
            </Button>
          </Box>
          
          <FormGroup sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
            {columns.map((column, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    checked={selectedColumns.includes(index)}
                    onChange={() => handleToggleColumn(index)}
                  />
                }
                label={column.label}
              />
            ))}
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button 
            onClick={handleExport} 
            variant="contained" 
            disabled={selectedColumns.length === 0}
            sx={{ 
              backgroundColor: '#54595f',
              '&:hover': {
                backgroundColor: '#3f4448',
              }
            }}
          >
            Export
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ExcelExportComponent;