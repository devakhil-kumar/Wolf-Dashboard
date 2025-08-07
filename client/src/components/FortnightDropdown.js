
// import React, { useState, useEffect } from 'react';
// import { format, addDays, startOfYear, getDay } from 'date-fns';
// import { Box, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

// const getFirstMondayOfYear = (year) => {
//   const firstDay = startOfYear(new Date(year, 0, 1));
//   const firstMonday = addDays(firstDay, (8 - getDay(firstDay)) % 7);
//   return firstMonday;
// };

// const calculateDynamicFortnights = (startYear, totalFortnights) => {
//   const fortnights = [];
//   let currentYear = startYear;
//   let currentStart = getFirstMondayOfYear(startYear);

//   while (fortnights.length < totalFortnights) {
//     const currentEnd = addDays(currentStart, 13);
//     fortnights.push({
//       start: currentStart,
//       end: currentEnd,
//     });
//     currentStart = addDays(currentStart, 14);
    
//     if (currentStart.getFullYear() > currentYear) {
//       currentYear = currentStart.getFullYear();
//     }
//   }

//   return fortnights;
// };

// const getLastFourFortnights = (fortnights) => {
//   const currentDate = new Date();
//   const currentFortnight = fortnights.findIndex(
//     fortnight => currentDate >= fortnight.start && currentDate <= fortnight.end
//   );
  
//   if (currentFortnight === -1) return [];
  
//   const startIndex = Math.max(0, currentFortnight - 3);
//   return fortnights.slice(startIndex, currentFortnight + 1).reverse();
// };

// const FortnightDropdown = ({ selectedFortnight, setSelectedFortnight, setFromDate, setToDate }) => {
//   const [fortnights, setFortnights] = useState([]);
//   const [lastFourFortnights, setLastFourFortnights] = useState([]);
//   const [initialLoad, setInitialLoad] = useState(true);

//   useEffect(() => {
//     const calculatedFortnights = calculateDynamicFortnights(2024, 100);
//     setFortnights(calculatedFortnights);
//     const lastFour = getLastFourFortnights(calculatedFortnights);
//     setLastFourFortnights(lastFour);
//   }, []);

//   useEffect(() => {
//     if (initialLoad && lastFourFortnights.length > 0) {
//       setSelectedFortnight(lastFourFortnights[0]);
//       setFromDate(formatDateISO(lastFourFortnights[0].start));
//       setToDate(formatDateISO(lastFourFortnights[0].end));
//       setInitialLoad(false);
//     }
//   }, [lastFourFortnights, initialLoad, setSelectedFortnight, setFromDate, setToDate]);

//   const formatDateISO = (date) => {
//     const day = String(date.getDate()).padStart(2, '0');
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const year = String(date.getFullYear());
//     return `${year}-${month}-${day}`;
//   };

//   const handleFortnightChange = (e) => {
//     const selectedIndex = e.target.value;
//     const selected = lastFourFortnights[selectedIndex];
//     setSelectedFortnight(selected);
//     setFromDate(formatDateISO(selected.start));
//     setToDate(formatDateISO(selected.end));
//   };

//   return (
//     <FormControl variant="outlined" sx={{ minWidth: 200, marginLeft: '16px' }}>
//       <InputLabel id="fortnight-select-label">Select Fortnight</InputLabel>
//       <Select
//         labelId="fortnight-select-label"
//         id="fortnight-select"
//         value={selectedFortnight ? lastFourFortnights.indexOf(selectedFortnight) : ''}
//         onChange={handleFortnightChange}
//         label="Select Fortnight"
//       >
//         <MenuItem value="" disabled>Select a fortnight</MenuItem>
//         {lastFourFortnights.map((fortnight, index) => (
//           <MenuItem key={index} value={index}>
//             {format(fortnight.start, 'MMMM dd')} - {format(fortnight.end, 'MMMM dd')}
//           </MenuItem>
//         ))}
//       </Select>
//     </FormControl>
//   );
// };

// export default FortnightDropdown;






import React, { useState, useEffect } from 'react';
import { format, addMonths, startOfMonth, endOfMonth } from 'date-fns';
import { Box, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

const calculateDynamicMonths = (startYear, totalMonths) => {
  const months = [];
  let currentDate = startOfMonth(new Date(startYear, 0, 1));
  
  while (months.length < totalMonths) {
    const monthEnd = endOfMonth(currentDate);
    months.push({
      start: currentDate,
      end: monthEnd,
    });
    currentDate = addMonths(currentDate, 1);
  }

  return months;
};

const getLastFourMonths = (months) => {
  const currentDate = new Date();
  const currentMonthIndex = months.findIndex(
    month => currentDate >= month.start && currentDate <= month.end
  );
  
  if (currentMonthIndex === -1) return [];
  
  const startIndex = Math.max(0, currentMonthIndex - 3);
  return months.slice(startIndex, currentMonthIndex + 1).reverse();
};

const FortnightDropdown = ({ selectedFortnight, setSelectedFortnight, setFromDate, setToDate }) => {
  const [months, setMonths] = useState([]);
  const [lastFourMonths, setLastFourMonths] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    const calculatedMonths = calculateDynamicMonths(2024, 36); // Calculate 36 months (3 years)
    setMonths(calculatedMonths);
    const lastFour = getLastFourMonths(calculatedMonths);
    setLastFourMonths(lastFour);
  }, []);

  useEffect(() => {
    if (initialLoad && lastFourMonths.length > 0) {
      setSelectedFortnight(lastFourMonths[0]);
      setFromDate(formatDateISO(lastFourMonths[0].start));
      setToDate(formatDateISO(lastFourMonths[0].end));
      setInitialLoad(false);
    }
  }, [lastFourMonths, initialLoad, setSelectedFortnight, setFromDate, setToDate]);

  const formatDateISO = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());
    return `${year}-${month}-${day}`;
  };

  const handleMonthChange = (e) => {
    const selectedIndex = e.target.value;
    const selected = lastFourMonths[selectedIndex];
    setSelectedFortnight(selected);
    setFromDate(formatDateISO(selected.start));
    setToDate(formatDateISO(selected.end));
  };

  return (
    <FormControl variant="outlined" sx={{ minWidth: 200, marginLeft: '16px' }}>
      <InputLabel id="month-select-label">Select Month</InputLabel>
      <Select
        labelId="month-select-label"
        id="month-select"
        value={selectedFortnight ? lastFourMonths.indexOf(selectedFortnight) : ''}
        onChange={handleMonthChange}
        label="Select Month"
      >
        <MenuItem value="" disabled>Select a month</MenuItem>
        {lastFourMonths.map((month, index) => (
          <MenuItem key={index} value={index}>
            {format(month.start, 'MMMM yyyy')}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default FortnightDropdown;