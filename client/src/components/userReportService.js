// userReportService.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

/**
 * Fetch user monthly performance data
 * @param {string} salesrep - User/salesrep name
 * @param {string} salelocation - Store location
 * @param {string} year - Optional year to filter (defaults to current year)
 * @returns {Promise} Promise containing monthly performance data
 */
export const getUserMonthlyPerformance = createAsyncThunk(
  'reports/getUserMonthlyPerformance',
  async ({ salesrep, salelocation, year = new Date().getFullYear() }, { rejectWithValue }) => {
    try {
      // Replace with your actual API endpoint
      const response = await axios.get(`/api/reports/user-monthly`, {
        params: { salesrep, salelocation, year }
      });
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch user monthly data');
    }
  }
);

/**
 * Formats monthly performance data for Excel export
 * @param {Object} monthlyData - Raw monthly data from API
 * @returns {Array} Formatted data ready for Excel export
 */
export const formatMonthlyDataForExport = (monthlyData) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  // If no data is available, return an empty template
  if (!monthlyData || monthlyData.length === 0) {
    return months.map(month => [
      month, 0, 0, 0, 0, 0, 0, 0, 0
    ]);
  }
  
  // Process data by month
  return months.map(month => {
    const monthData = monthlyData.find(item => item.month === month) || {};
    
    return [
      month, // Month name
      monthData.pnnCount || 0, // PPN
      monthData.bundleNewCount || 0, // Bundle New
      monthData.tmbCount || 0, // TMB
      monthData.tyro || 0, // Tyro
      monthData.telstraPlus || 0, // Telstra Plus
      monthData.deviceProtection || 0, // Device Protection
      monthData.accessoryGP || 0, // Accessory GP
      monthData.totalGP || 0, // Total GP
    ];
  });
};

/**
 * Get performance data for a specific month
 * @param {string} salesrep - User/salesrep name 
 * @param {string} salelocation - Store location
 * @param {string} month - Month to get data for (e.g., "Jan", "Feb")
 * @param {number} year - Optional year (defaults to current year)
 * @returns {Promise} Promise containing the month's performance data
 */
export const getUserMonthPerformance = createAsyncThunk(
  'reports/getUserMonthPerformance',
  async ({ salesrep, salelocation, month, year = new Date().getFullYear() }, { rejectWithValue }) => {
    try {
      // Replace with your actual API endpoint
      const response = await axios.get(`/api/reports/user-month`, {
        params: { salesrep, salelocation, month, year }
      });
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch monthly performance data');
    }
  }
);

/**
 * Generate a complete user performance report with:
 * - Overall summary
 * - Monthly breakdown
 * - KPI performance
 * - Commission calculations
 */
export const generateUserReport = async (salesrep, salelocation, year = new Date().getFullYear()) => {
  try {
    // Get overall performance summary
    const overallData = await axios.get(`/api/reports/user-summary`, {
      params: { salesrep, salelocation, year }
    });
    
    // Get monthly breakdown
    const monthlyData = await axios.get(`/api/reports/user-monthly`, {
      params: { salesrep, salelocation, year }
    });
    
    // Get KPI performance
    const kpiData = await axios.get(`/api/reports/user-kpi`, {
      params: { salesrep, salelocation, year }
    });
    
    // Combine all data into a comprehensive report
    return {
      summary: overallData.data,
      monthlyBreakdown: monthlyData.data,
      kpiPerformance: kpiData.data,
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error generating user report:', error);
    throw error;
  }
}