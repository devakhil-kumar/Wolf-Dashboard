// // EnhancedExportComponent.js with side-by-side layout
// import * as XLSX from 'xlsx';
// import React, { useState, useEffect } from 'react';
// import { 
//   Button, 
//   Dialog, 
//   DialogTitle, 
//   DialogContent, 
//   DialogActions,
//   FormGroup,
//   FormControlLabel,
//   Checkbox,
//   Box,
//   Tabs,
//   Tab,
//   Select,
//   MenuItem,
//   InputLabel,
//   FormControl,
//   Typography,
//   Alert
// } from '@mui/material';

// const EnhancedExportComponent = ({ data, columns, tabValue, fromDate, toDate }) => {
//   const [open, setOpen] = useState(false);
//   const [selectedColumns, setSelectedColumns] = useState([]);
//   const [exportType, setExportType] = useState(0); // 0 for store report, 1 for user report
//   const [selectedUser, setSelectedUser] = useState('');
//   const [userList, setUserList] = useState([]);
//   const [showSingleMonthWarning, setShowSingleMonthWarning] = useState(false);
//   const [currentMonth, setCurrentMonth] = useState('');
  
//   // Determine if we're looking at a single month based on fromDate and toDate
//   useEffect(() => {
//     if (fromDate && toDate) {
//       try {
//         const from = new Date(fromDate);
//         const to = new Date(toDate);
        
//         // Check if dates are in the same month and year
//         if (from.getMonth() === to.getMonth() && from.getFullYear() === to.getFullYear()) {
//           const monthNames = ["January", "February", "March", "April", "May", "June", 
//                              "July", "August", "September", "October", "November", "December"];
//           setCurrentMonth(monthNames[from.getMonth()]);
//           setShowSingleMonthWarning(true);
//         } else {
//           setShowSingleMonthWarning(false);
//           setCurrentMonth('');
//         }
//       } catch (e) {
//         console.error("Error parsing dates:", e);
//         setShowSingleMonthWarning(false);
//       }
//     }
//   }, [fromDate, toDate]);
  
//   useEffect(() => {
//     // Extract unique users from data
//     if (data && data.length > 0) {
//       const users = [...new Set(data.map(row => row['column-0']))].filter(user => user);
//       setUserList(users);
//       if (users.length > 0) {
//         setSelectedUser(users[0]); // Select the first user by default
//       }
//     }
//   }, [data]);
  
//   const handleOpen = () => {
//     // Initialize with all columns selected
//     setSelectedColumns(columns.map((_, index) => index));
//     setOpen(true);
//   };
  
//   const handleClose = () => {
//     setOpen(false);
//   };
  
//   const handleToggleColumn = (index) => {
//     setSelectedColumns(prev => {
//       if (prev.includes(index)) {
//         return prev.filter(i => i !== index);
//       } else {
//         return [...prev, index];
//       }
//     });
//   };
  
//   const handleSelectAll = () => {
//     setSelectedColumns(columns.map((_, index) => index));
//   };
  
//   const handleSelectNone = () => {
//     setSelectedColumns([]);
//   };
  
//   const handleExportTypeChange = (_, newValue) => {
//     setExportType(newValue);
//   };
  
//   const handleUserChange = (event) => {
//     setSelectedUser(event.target.value);
//   };
  
//   /**
//    * Creates a side-by-side workbook with monthly performance and progress report
//    * @param {Object} userData - User data to base the monthly report on
//    * @param {String} userName - Name of the user for the report
//    * @returns {Object} XLSX worksheet
//    */
//   const createSideBySideWorksheet = (userData, userName) => {
//     // Define columns for the monthly report
//     const kpiColumns = [
//       { id: 'column-6', name: 'PPN' },
//       { id: 'column-7', name: 'Bundle New' },
//       { id: 'column-8', name: 'TMB' },
//       { id: 'column-10', name: 'Tyro' }, 
//       { id: 'column-11', name: 'Telstra Plus' },
//       { id: 'column-9', name: 'Device Protection' },
//       { id: 'column-18', name: 'Accessory GP' },
//       { id: 'column-22', name: 'Total GP' }
//     ];
    
//     // Define months to show
//     let months;
//     if (showSingleMonthWarning && currentMonth) {
//       // If we're in single month mode, only show that month
//       const monthAbbreviations = {
//         "January": "Jan", "February": "Feb", "March": "Mar", "April": "Apr",
//         "May": "May", "June": "Jun", "July": "Jul", "August": "Aug",
//         "September": "Sep", "October": "Oct", "November": "Nov", "December": "Dec"
//       };
//       months = [monthAbbreviations[currentMonth]];
//     } else {
//       // Otherwise show all months
//       months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
//     }
    
//     // Create the worksheet with a side-by-side layout
//     // Start with empty rows for spacing
//     const worksheet = [];
    
//     // Row 1: Username title
//     worksheet.push([userName, "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]);
    
//     // Row 2: Empty row for spacing
//     worksheet.push(Array(16).fill(""));
    
//     // Row 3: Section titles
//     worksheet.push(["Month on Month Performance", "", "", "", "", "", "", "", "", "", "Progress Report", "", "", "", "", ""]);
    
//     // Row 4: Empty row for spacing
//     worksheet.push(Array(16).fill(""));
    
//     // Row 5: Headers for monthly data | Headers for progress report
//     worksheet.push([
//       "", "PPN", "Bundle New", "TMB", "Tyro", "Telstra Plus", "Device Protection", "Accessory GP", "Total GP", "",
//       "Notes", "", "", "", "", "Staff Acknowledgement"
//     ]);
    
//     // Mock progress notes (you would replace this with actual data)
//     const progressNotes = [
//       ["3a NBN, 2 Belong, 8 PPN for month", "Y"],
//       ["Answer phones, shows keen to serve.", ""],
//       ["Doing well for fortnightly KPIs, just need some surveys and TYRO!!!", ""],
//       ["MAKE COMMS IF SHE DOES 2 PPN, 2 TYRO LEADS, AND 1K in 3 days!!", ""],
//       ["Actively for Tyro lead from a long term business customer. Great work :D", ""],
//       ["GET THE TYROS, GOT THE GP. DON'T MISS IT", ""],
//       ["WELL DONE!!", ""],
//       ["3 TMBs, 12k GP", ""]
//     ];
    
//     // Add data rows - months on left | progress notes on right
//     const baseValues = userData[0] || {};
    
//     // Figure out how many rows we need (max of months or progress notes)
//     const rowCount = Math.max(months.length, progressNotes.length);
    
//     for (let i = 0; i < rowCount; i++) {
//       const row = Array(16).fill("");
      
//       // Add month data if available
//       if (i < months.length) {
//         row[0] = months[i];
        
//         // Add KPI values
//         kpiColumns.forEach((column, colIndex) => {
//           const value = baseValues[column.id] || 0;
          
//           if (column.name === 'Device Protection' || column.name === 'Accessory GP') {
//             // Format as percentage
//             const numValue = typeof value === 'string' ? 
//               parseFloat(value.replace('%', '')) : value;
//             row[colIndex + 1] = isNaN(numValue) ? "0%" : `${Math.round(numValue)}%`;
//           } else if (column.name === 'Total GP') {
//             // Format as number
//             const numValue = typeof value === 'string' && value.startsWith('$') ? 
//               parseFloat(value.substring(1)) : parseFloat(value);
//             row[colIndex + 1] = isNaN(numValue) ? 0 : Math.round(numValue);
//           } else {
//             // Regular numeric value
//             const numValue = parseFloat(value);
//             row[colIndex + 1] = isNaN(numValue) ? 0 : Math.round(numValue);
//           }
//         });
//       }
      
//       // Add progress notes if available
//       if (i < progressNotes.length) {
//         row[10] = progressNotes[i][0];
//         row[15] = progressNotes[i][1];
//       }
      
//       worksheet.push(row);
//     }
    
//     // Create the worksheet object
//     const sheetData = XLSX.utils.aoa_to_sheet(worksheet);
    
//     // Apply formatting
//     try {
//       // Set column widths
//       sheetData['!cols'] = [
//         { wch: 12 }, // A - Month
//         { wch: 8 },  // B - PPN
//         { wch: 12 }, // C - Bundle New
//         { wch: 8 },  // D - TMB
//         { wch: 8 },  // E - Tyro
//         { wch: 12 }, // F - Telstra Plus
//         { wch: 15 }, // G - Device Protection
//         { wch: 15 }, // H - Accessory GP
//         { wch: 10 }, // I - Total GP
//         { wch: 3 },  // J - Spacer
//         { wch: 60 }, // K - Notes
//         { wch: 3 },  // L - Spacing
//         { wch: 3 },  // M - Spacing
//         { wch: 3 },  // N - Spacing
//         { wch: 3 },  // O - Spacing
//         { wch: 20 }  // P - Staff Acknowledgement
//       ];
      
//       // Merge cells for titles
//       if (!sheetData['!merges']) sheetData['!merges'] = [];
      
//       // Merge cells for user name
//       sheetData['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 15 } });
      
//       // Merge cells for "Month on Month Performance" title
//       sheetData['!merges'].push({ s: { r: 2, c: 0 }, e: { r: 2, c: 8 } });
      
//       // Merge cells for "Progress Report" title
//       sheetData['!merges'].push({ s: { r: 2, c: 10 }, e: { r: 2, c: 15 } });
      
//       // Merge cells for Notes column
//       for (let i = 0; i < progressNotes.length; i++) {
//         sheetData['!merges'].push({ s: { r: 6 + i, c: 10 }, e: { r: 6 + i, c: 14 } });
//       }
//     } catch (err) {
//       console.error("Error applying Excel formatting:", err);
//       // Continue even if formatting fails
//     }
    
//     return sheetData;
//   };
  
//   /**
//    * Export store data to Excel with multiple sheets
//    */
//   const exportStoreData = () => {
//     try {
//       // Create workbook
//       const workbook = XLSX.utils.book_new();
      
//       // 1. Create main store data sheet with all selected columns
//       const exportColumns = columns.filter((_, index) => selectedColumns.includes(index));
      
//       const mainSheetData = [
//         exportColumns.map(col => col.label)
//       ];
      
//       // Add data rows
//       data.forEach(row => {
//         const rowData = exportColumns.map(column => {
//           // Extract value from the row using column id
//           const value = row[column.id];
          
//           // Format as needed (remove dollar signs, etc.)
//           if (typeof value === 'string' && value.startsWith('$')) {
//             return parseFloat(value.substring(1));
//           }
          
//           return value;
//         });
        
//         mainSheetData.push(rowData);
//       });
      
//       // Add totals row if available
//       if (data.length > 0) {
//         const totalRow = exportColumns.map((column, index) => {
//           if (index === 0) return 'Total';
          
//           // Calculate column total
//           const total = data.reduce((sum, row) => {
//             const value = row[column.id];
//             const numValue = typeof value === 'string' && value.startsWith('$') 
//               ? parseFloat(value.substring(1)) 
//               : parseFloat(value);
            
//             return sum + (isNaN(numValue) ? 0 : numValue);
//           }, 0);
          
//           // Format certain columns (percentages, etc.)
//           if (column.id === 'column-17') {
//             return Math.round(total) + '%';
//           }
          
//           return Math.round(total);
//         });
        
//         mainSheetData.push(totalRow);
//       }
      
//       // Create main worksheet and add to workbook
//       const mainWorksheet = XLSX.utils.aoa_to_sheet(mainSheetData);
//       XLSX.utils.book_append_sheet(workbook, mainWorksheet, `${tabValue} Summary`);
      
//       // 2. Create individual user sheets with side-by-side layout
//       if (data.length > 0) {
//         const uniqueUsers = [...new Set(data.map(row => row['column-0']))].filter(user => user);
        
//         uniqueUsers.forEach(user => {
//           const userData = data.filter(row => row['column-0'] === user);
//           if (userData.length === 0) return;
          
//           // Create side-by-side sheet for this user
//           const userSheet = createSideBySideWorksheet(userData, user);
          
//           // Get first name for the sheet name
//           const firstName = user.split(' ')[0] || user;
          
//           // Add to workbook
//           XLSX.utils.book_append_sheet(workbook, userSheet, `${firstName}`);
//         });
//       }
      
//       // Generate Excel file
//       const monthIndicator = showSingleMonthWarning ? `_${currentMonth}` : '';
//       XLSX.writeFile(workbook, `${tabValue}${monthIndicator}_report_${new Date().toISOString().slice(0, 10)}.xlsx`);
//     } catch (error) {
//       console.error('Error exporting store data to Excel:', error);
//       alert('Failed to export data. Please try again.');
//     }
//   };
  
//   /**
//    * Export user-specific data to Excel
//    */
//   const exportUserData = () => {
//     try {
//       // Filter data for the selected user
//       const userData = data.filter(row => row['column-0'] === selectedUser);
      
//       if (userData.length === 0) {
//         alert(`No data found for user: ${selectedUser}`);
//         return;
//       }
      
//       // Create workbook
//       const workbook = XLSX.utils.book_new();
      
//       // 1. Create side-by-side monthly performance and progress report
//       const sideBySideSheet = createSideBySideWorksheet(userData, selectedUser);
//       XLSX.utils.book_append_sheet(workbook, sideBySideSheet, `${selectedUser}`);
      
//       // 2. Add summary sheet with all selected columns
//       if (selectedColumns.length > 0) {
//         // Filter columns based on selection
//         const exportColumns = columns.filter((_, index) => selectedColumns.includes(index));
        
//         const userWorksheetData = [
//           exportColumns.map(col => col.label),
//           ...userData.map(row => 
//             exportColumns.map(column => {
//               const value = row[column.id];
//               return typeof value === 'string' && value.startsWith('$') 
//                 ? parseFloat(value.substring(1))
//                 : value;
//             })
//           )
//         ];
        
//         const userWorksheet = XLSX.utils.aoa_to_sheet(userWorksheetData);
//         XLSX.utils.book_append_sheet(workbook, userWorksheet, "Summary");
//       }
      
//       // Generate Excel file
//       const monthIndicator = showSingleMonthWarning ? `_${currentMonth}` : '';
//       const fileName = `${selectedUser}_${tabValue}${monthIndicator}_report_${new Date().toISOString().slice(0, 10)}.xlsx`;
//       XLSX.writeFile(workbook, fileName);
//     } catch (error) {
//       console.error('Error exporting user data to Excel:', error);
//       alert('Failed to export user data. Please try again.');
//     }
//   };
  
//   /**
//    * Handle the export based on selected type
//    */
//   const handleExport = () => {
//     if (selectedColumns.length === 0) {
//       alert('Please select at least one column to export');
//       return;
//     }
    
//     if (exportType === 0) {
//       // Export store-level report
//       exportStoreData();
//     } else {
//       // Export user-specific report
//       if (!selectedUser) {
//         alert('Please select a user to export data for');
//         return;
//       }
      
//       exportUserData();
//     }
    
//     handleClose();
//   };
  
//   return (
//     <>
//       <Button 
//         variant="contained" 
//         color="primary" 
//         onClick={handleOpen}
//         sx={{ 
//           backgroundColor: '#54595f',
//           '&:hover': {
//             backgroundColor: '#3f4448',
//           }
//         }}
//       >
//         Export
//       </Button>
      
//       <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
//         <DialogTitle>Export Report Options</DialogTitle>
//         <DialogContent>
//           {/* Show alert if we're looking at a specific month */}
//           {showSingleMonthWarning && (
//             <Alert severity="info" sx={{ mb: 2 }}>
//               Data is currently filtered for {currentMonth}. The export will reflect this selected month.
//             </Alert>
//           )}
          
//           {/* Export type tabs */}
//           <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
//             <Tabs 
//               value={exportType} 
//               onChange={handleExportTypeChange}
//               indicatorColor="primary"
//               textColor="primary"
//             >
//               <Tab label="Monthly Store Report" />
//               <Tab label="Monthly User Report" />
//             </Tabs>
//           </Box>
          
//           {/* User selection for user report */}
//           {exportType === 1 && (
//             <Box sx={{ mb: 3 }}>
//               <FormControl fullWidth>
//                 <InputLabel id="user-select-label">Select User</InputLabel>
//                 <Select
//                   labelId="user-select-label"
//                   value={selectedUser}
//                   label="Select User"
//                   onChange={handleUserChange}
//                 >
//                   {userList.map(user => (
//                     <MenuItem key={user} value={user}>{user}</MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
              
//               <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
//                 The report will include:
//                 <ul>
//                   <li>A combined sheet with monthly performance and progress report side by side</li>
//                   <li>A summary sheet with all selected columns from the table</li>
//                 </ul>
//                 {showSingleMonthWarning && (
//                   <strong>Note: Currently only showing data for {currentMonth}.</strong>
//                 )}
//               </Typography>
//             </Box>
//           )}
          
//           {/* Column selection */}
//           <Typography variant="subtitle1" gutterBottom>
//             Select Columns for Summary Sheet:
//           </Typography>
          
//           <Box sx={{ mb: 2 }}>
//             <Button variant="outlined" onClick={handleSelectAll} sx={{ mr: 1 }}>
//               Select All
//             </Button>
//             <Button variant="outlined" onClick={handleSelectNone}>
//               Select None
//             </Button>
//           </Box>
          
//           <FormGroup sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
//             {columns.map((column, index) => (
//               <FormControlLabel
//                 key={index}
//                 control={
//                   <Checkbox
//                     checked={selectedColumns.includes(index)}
//                     onChange={() => handleToggleColumn(index)}
//                   />
//                 }
//                 label={column.label}
//               />
//             ))}
//           </FormGroup>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose}>Cancel</Button>
//           <Button 
//             onClick={handleExport} 
//             variant="contained" 
//             disabled={selectedColumns.length === 0 || (exportType === 1 && !selectedUser)}
//             sx={{ 
//               backgroundColor: '#54595f',
//               '&:hover': {
//                 backgroundColor: '#3f4448',
//               }
//             }}
//           >
//             Export
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// };

// export default EnhancedExportComponent;


// EnhancedExportComponent.js - Final version
import * as XLSX from 'xlsx';
import React, { useState, useEffect } from 'react';
import { 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Box,
  Typography,
  Alert
} from '@mui/material';

const EnhancedExportComponent = ({ data, columns, tabValue, fromDate, toDate }) => {
  const [open, setOpen] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [showSingleMonthWarning, setShowSingleMonthWarning] = useState(false);
  const [currentMonth, setCurrentMonth] = useState('');
  const [currentMonthFull, setCurrentMonthFull] = useState('');
  
  // Determine if we're looking at a single month based on fromDate and toDate
  useEffect(() => {
    if (fromDate && toDate) {
      try {
        const from = new Date(fromDate);
        const to = new Date(toDate);
        
        // Check if dates are in the same month and year
        if (from.getMonth() === to.getMonth() && from.getFullYear() === to.getFullYear()) {
          const monthNames = ["January", "February", "March", "April", "May", "June", 
                             "July", "August", "September", "October", "November", "December"];
          setCurrentMonth(monthNames[from.getMonth()].substring(0, 3));
          setCurrentMonthFull(monthNames[from.getMonth()]);
          setShowSingleMonthWarning(true);
        } else {
          setShowSingleMonthWarning(false);
          setCurrentMonth('');
          setCurrentMonthFull('');
        }
      } catch (e) {
        console.error("Error parsing dates:", e);
        setShowSingleMonthWarning(false);
      }
    }
  }, [fromDate, toDate]);
  
  const handleOpen = () => {


    const columnsToSelect = [
        // These indices correspond to the columns shown in the screenshot
        0,  // All Stores
        1,  // NPS Vol
        2,  // NPS Score
        3,  // Adv 10-9
        4,  // Pas 8-7
        5,  // Det <6
        6,  // PPN
        7,  // Bundle New
        8,  // TMB
        9,  // Device Protection
        10, // Tyro
        11,
        13, // Outright Mobile/Tablet
        14, // DPC Mobile/Tablet
        15, // Belon NBN
        17, // Device Protect to Hand/Tab DPC
        18, // Accessory GP to Hands et Sales
         // Telstra Plus
        20,
        21, // Handset/Plan GP
        22  // Total GP
      ];
    // Initialize with all columns selected
    const selectedIndices = columnsToSelect.filter(index => index < columns.length);
  console.log(selectedIndices)
    setSelectedColumns(selectedIndices);
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
  
  /**
   * Creates a side-by-side workbook with monthly performance and progress report
   * @param {Object} userData - User data to base the monthly report on
   * @param {String} userName - Name of the user for the report
   * @returns {Object} XLSX worksheet
   */
  const createSideBySideWorksheet = (userData, userName) => {
    // Define columns for the monthly report
    const kpiColumns = [
      { id: 'column-6', name: 'PPN' },
      { id: 'column-7', name: 'Bundle New' },
      { id: 'column-8', name: 'TMB' },
      { id: 'column-10', name: 'Tyro' }, 
      { id: 'column-11', name: 'Telstra Plus' },
      { id: 'column-17', name: 'Device Protection' },
      { id: 'column-18', name: 'Accessory GP' },
      { id: 'column-22', name: 'Total GP' }
    ];
    
    // Define months to show
    let months;
    if (showSingleMonthWarning && currentMonth) {
      // If we're in single month mode, only show that month
      months = [currentMonth];
    } else {
      // Otherwise show all months
      months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    }
    
    // Create the worksheet with a side-by-side layout
    const worksheet = [];
    
    // Add title row with user name
    worksheet.push([userName, "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]);
    
    // Add date range row
    const dateRangeText = showSingleMonthWarning ? 
      `Report for ${currentMonthFull} ${new Date().getFullYear()}` : 
      `Report generated on ${new Date().toLocaleDateString()}`;
    worksheet.push([dateRangeText, "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]);
    
    // Add empty row for spacing
    worksheet.push(Array(16).fill(""));
    
    // Add section title row
    worksheet.push(["Month on Month Performance", "", "", "", "", "", "", "", "", "", "Progress Report", "", "", "", "", ""]);
    
    // Add empty row for spacing
    worksheet.push(Array(16).fill(""));
    
    // Add column headers
    worksheet.push([
      "", "PPN", "Bundle New", "TMB", "Tyro", "Telstra Plus", "Device Protection", "Accessory GP", "Total GP", "",
      "Date","Task", "Notes", "", "", "", "Staff Acknowledgement"
    ]);
    
    // Mock progress notes with dates (you would replace this with actual data)
    const today = new Date();
    const progressNotes = [
    //   [new Date(today.setDate(today.getDate() - 8)).toLocaleDateString(), "3a NBN, 2 Belong, 8 PPN for month", "Y"],
    //   [new Date(today.setDate(today.getDate() - 7)).toLocaleDateString(), "Answer phones, shows keen to serve.", ""],
    //   [new Date(today.setDate(today.getDate() - 5)).toLocaleDateString(), "Doing well for fortnightly KPIs, just need some surveys and TYRO!!!", ""],
    //   [new Date(today.setDate(today.getDate() - 3)).toLocaleDateString(), "MAKE COMMS IF SHE DOES 2 PPN, 2 TYRO LEADS, AND 1K in 3 days!!", ""],
    //   [new Date(today.setDate(today.getDate() - 2)).toLocaleDateString(), "Actively for Tyro lead from a long term business customer. Great work :D", ""],
    //   [new Date(today.setDate(today.getDate() - 1)).toLocaleDateString(), "GET THE TYROS, GOT THE GP. DON'T MISS IT", ""],
    //   [new Date().toLocaleDateString(), "WELL DONE!!", ""],
    //   [new Date().toLocaleDateString(), "3 TMBs, 12k GP", ""]
    ];
    
    // Add data rows - months on left | progress notes on right
    const baseValues = userData[0] || {};
    
    // Figure out how many rows we need (max of months or progress notes)
    const rowCount = Math.max(months.length, progressNotes.length);
    
    for (let i = 0; i < rowCount; i++) {
      const row = Array(16).fill("");
      
      // Add month data if available
      if (i < months.length) {
        row[0] = months[i];
        
        // Add KPI values
        kpiColumns.forEach((column, colIndex) => {
          const value = baseValues[column.id] || 0;
          
          if (column.name === 'Device Protection' ) {
            // Format as percentage
            const numValue = typeof value === 'string' ? 
              parseFloat(value.replace('%', '')) : value;
            row[colIndex + 1] = isNaN(numValue) ? "0%" : `${Math.round(numValue)}%`;
          } else if (column.name === 'Total GP') {
            // Format as number
            const numValue = typeof value === 'string' && value.startsWith('$') ? 
              parseFloat(value.substring(1)) : parseFloat(value);
            row[colIndex + 1] = isNaN(numValue) ? 0 : Math.round(numValue);
          } else {
            // Regular numeric value
            const numValue = parseFloat(value);
            row[colIndex + 1] = isNaN(numValue) ? 0 : Math.round(numValue);
          }
        });
      }
      
      // Add progress notes if available
      if (i < progressNotes.length) {
        row[10] = progressNotes[i][0]; // Date
        row[11] = progressNotes[i][1]; // Notes
        row[15] = progressNotes[i][2]; // Staff Acknowledgement
      }
      
      worksheet.push(row);
    }
    
    // Create the worksheet object
    const sheetData = XLSX.utils.aoa_to_sheet(worksheet);
    
    // Apply formatting
    try {
      // Set column widths
      sheetData['!cols'] = [
        { wch: 12 }, // A - Month
        { wch: 8 },  // B - PPN
        { wch: 12 }, // C - Bundle New
        { wch: 8 },  // D - TMB
        { wch: 8 },  // E - Tyro
        { wch: 12 }, // F - Telstra Plus
        { wch: 15 }, // G - Device Protection
        { wch: 15 }, // H - Accessory GP
        { wch: 10 }, // I - Total GP
        { wch: 3 },  // J - Spacer
        { wch: 12 }, // K - Date
        { wch: 50 }, // L - Notes
        { wch: 3 },  // M - Spacing
        { wch: 3 },  // N - Spacing
        { wch: 3 },  // O - Spacing
        { wch: 20 }  // P - Staff Acknowledgement
      ];
      
      // Merge cells for titles
      if (!sheetData['!merges']) sheetData['!merges'] = [];
      
      // Merge cells for user name
      sheetData['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 15 } });
      
      // Merge cells for date range
      sheetData['!merges'].push({ s: { r: 1, c: 0 }, e: { r: 1, c: 15 } });
      
      // Merge cells for "Month on Month Performance" title
      sheetData['!merges'].push({ s: { r: 3, c: 0 }, e: { r: 3, c: 8 } });
      
      // Merge cells for "Progress Report" title
      sheetData['!merges'].push({ s: { r: 3, c: 10 }, e: { r: 3, c: 15 } });
      
      // Merge cells for Notes column in each data row
      for (let i = 0; i < progressNotes.length; i++) {
        sheetData['!merges'].push({ s: { r: 6 + i, c: 11 }, e: { r: 6 + i, c: 14 } });
      }
      
      // Add some cell styles
      // This feature requires writing custom XML in Excel which is complex
      // For basic styling, we'll set what XLSX supports directly
    } catch (err) {
      console.error("Error applying Excel formatting:", err);
      // Continue even if formatting fails
    }
    
    return sheetData;
  };
  
  /**
   * Export data to Excel with multiple sheets for all users
   */
  const exportData = () => {
    try {
      // Create workbook
      const workbook = XLSX.utils.book_new();
      
      // 1. Create main summary sheet with all selected columns
      const exportColumns = columns.filter((_, index) => selectedColumns.includes(index));
      
      const mainSheetData = [
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
        
        mainSheetData.push(rowData);
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
        
        mainSheetData.push(totalRow);
      }
      
      // Create main worksheet and add to workbook
      const mainWorksheet = XLSX.utils.aoa_to_sheet(mainSheetData);
      
      // Add column widths to make it look better
      try {
        mainWorksheet['!cols'] = exportColumns.map(() => ({ wch: 15 }));
      } catch (err) {
        console.error("Error setting column widths for summary:", err);
      }
      
      XLSX.utils.book_append_sheet(workbook, mainWorksheet, "Summary");
      
      // 2. Create individual user sheets with side-by-side layout
      if (data.length > 0) {
        const uniqueUsers = [...new Set(data.map(row => row['column-0']))].filter(user => user);
        
        uniqueUsers.forEach(user => {
          const userData = data.filter(row => row['column-0'] === user);
          if (userData.length === 0) return;
          
          // Create side-by-side sheet for this user
          const userSheet = createSideBySideWorksheet(userData, user);
          
          // Add to workbook
          XLSX.utils.book_append_sheet(workbook, userSheet, user);
        });
      }
      
      // Generate Excel file
      const monthIndicator = showSingleMonthWarning ? `_${currentMonthFull}` : '';
      XLSX.writeFile(workbook, `${tabValue}${monthIndicator}_report_${new Date().toISOString().slice(0, 10)}.xlsx`);
      
    } catch (error) {
      console.error('Error exporting data to Excel:', error);
      alert('Failed to export data. Please try again.');
    }
  };
  
  /**
   * Handle the export
   */
  const handleExport = () => {
    if (selectedColumns.length === 0) {
      alert('Please select at least one column to export');
      return;
    }
    
    exportData();
    handleClose();
  };
  
  return (
    <>
      <Button 
        variant="contained" 
        color="primary" 
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
      
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Store Performance Report Export</DialogTitle>
        <DialogContent>
          {/* Show alert if we're looking at a specific month */}
          {showSingleMonthWarning && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Data is currently filtered for {currentMonthFull}. The export will reflect this selected month.
            </Alert>
          )}
          
          <Typography variant="body1" paragraph sx={{ mt: 2 }}>
            This report will include:
          </Typography>
          
          <ul>
            <li>
              <Typography variant="body1">A "Summary" sheet with all selected data columns</Typography>
            </li>
            <li>
              <Typography variant="body1">Individual tabs for each sales representative</Typography>
            </li>
            <li>
              <Typography variant="body1">Each sales rep tab includes their monthly performance and progress notes side by side</Typography>
            </li>
          </ul>
          
          {/* Column selection */}
          <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
            Select Columns for Summary Sheet:
          </Typography>
          
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
                backgroundColor: 'black',
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

export default EnhancedExportComponent;