import React, { useState } from 'react';
import { format, addDays, startOfYear, getDay } from 'date-fns';

// Utility function to get the first Monday of the given year
const getFirstMondayOfYear = (year) => {
  const firstDay = startOfYear(new Date(year, 0, 1));
  const firstMonday = addDays(firstDay, (8 - getDay(firstDay)) % 7);
  return firstMonday;
};

// Utility function to calculate all fortnights for the given year
const calculateYearlyFortnights = (year) => {
  const firstMonday = getFirstMondayOfYear(year);
  const fortnights = [];
  let currentStart = firstMonday;

  while (currentStart.getFullYear() === year) {
    const currentEnd = addDays(currentStart, 13);
    fortnights.push({
      start: currentStart,
      end: currentEnd
    });
    currentStart = addDays(currentStart, 14);
  }

  return fortnights;
};

// Utility function to get the last 4 fortnights from the current date
const getLastFourFortnights = (fortnights) => {
  const currentDate = new Date();
  const pastFortnights = fortnights.filter(fortnight => fortnight.start <= currentDate);
  return pastFortnights.slice(-4);
};

const FortnightDashboard = () => {
  const currentYear = new Date().getFullYear();
  const [selectedFortnight, setSelectedFortnight] = useState(null);

  const fortnights = calculateYearlyFortnights(currentYear);
  const lastFourFortnights = getLastFourFortnights(fortnights);

  return (
    <div>
      <h1>Fortnight Dashboard</h1>
      <label>
        Select Fortnight:
        <select
          onChange={(e) => {
            const selectedIndex = e.target.value;
            setSelectedFortnight(lastFourFortnights[selectedIndex]);
          }}
          defaultValue=""
        >
          <option value="" disabled>Select a fortnight</option>
          {lastFourFortnights.map((fortnight, index) => (
            <option key={index} value={index}>
              Fortnight {fortnights.indexOf(fortnight) + 1}: {format(fortnight.start, 'MMMM dd')} - {format(fortnight.end, 'MMMM dd')}
            </option>
          ))}
        </select>
      </label>
      {selectedFortnight && (
        <div>
          <h2>Selected Fortnight</h2>
          <p>
            Start Date: {format(selectedFortnight.start, 'MMMM dd, yyyy')}<br />
            End Date: {format(selectedFortnight.end, 'MMMM dd, yyyy')}
          </p>
        </div>
      )}
    </div>
  );
};

export default FortnightDashboard;
