// DateInputs.js
import React, { useState, useEffect } from 'react';
import { Box, TextField, Button } from '@mui/material';
import { formattDate } from '../utils/formatDate';
// function formatDate(date) {
//   const day = String(date.getDate());
//   const month = String(date.getMonth() + 1); // Months are zero-based
//   const year = String(date.getFullYear());

//   return `${month.padStart(2, '0')}/${day.padStart(2, '0')}/${year}`;
// }


const DateInputs = ({ fromDate, toDate, setFromDate, setToDate, fetchData }) => {
  const handleFromDateChange = (event) => {
    setFromDate(event.target.value);
  };


console.log({ fromDate, toDate})


  const handleToDateChange = (event) => {
    setToDate(event.target.value);
  };

  const handleApplyClick = () => {
    const formattedFromDate = formattDate(new Date(fromDate));
    const formattedToDate = formattDate(new Date(toDate));
    fetchData(formattedFromDate, formattedToDate);
  };

  return (
    <Box display="flex" alignItems="center" padding="8px">
      <TextField
        label="From Date"
        type="date"
        value={fromDate}
        onChange={handleFromDateChange}
        InputLabelProps={{
          shrink: true,
        }}
        sx={{ marginRight: '10px' }}
      />
      <TextField
        label="To Date"
        type="date"
        value={toDate}
        onChange={handleToDateChange}
        InputLabelProps={{
          shrink: true,
        }}
        sx={{ marginRight: '10px' }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleApplyClick}
        sx={{
          backgroundColor: '#54595f', // Change to any color you like
          color: 'white',           // Text color
          '&:hover': {
            backgroundColor: 'black', // Hover color
          },
          height: 'fit-content',
        }}
      >
        Apply
      </Button>
    </Box>
  );
};
export default DateInputs;