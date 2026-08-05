// reportsSlice.js — state for the Reports module (Stage 1: GP Year-on-Year).
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getGpComparison, getGpTrend, getStoreOverview } from '../api/services';

export const getGpComparisonThunk = createAsyncThunk(
  'reports/gpComparison',
  async ({ salelocation, startDate, endDate }) => {
    return await getGpComparison(salelocation, startDate, endDate);
  }
);

export const getGpTrendThunk = createAsyncThunk(
  'reports/gpTrend',
  async ({ salelocation, year, compare }) => {
    return await getGpTrend(salelocation, year, compare);
  }
);

export const getStoreOverviewThunk = createAsyncThunk(
  'reports/storeOverview',
  async ({ startDate, endDate }) => {
    return await getStoreOverview(startDate, endDate);
  }
);

const reportsSlice = createSlice({
  name: 'reports',
  initialState: {
    gpComparison: null,
    gpTrend: null,
    storeOverview: null,
    comparisonLoading: false,
    trendLoading: false,
    overviewLoading: false,
    error: null,
  },
  reducers: {
    clearReports: (state) => {
      state.gpComparison = null;
      state.gpTrend = null;
      state.storeOverview = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getGpComparisonThunk.pending, (state) => {
        state.comparisonLoading = true;
        state.error = null;
      })
      .addCase(getGpComparisonThunk.fulfilled, (state, action) => {
        state.comparisonLoading = false;
        state.gpComparison = action.payload;
      })
      .addCase(getGpComparisonThunk.rejected, (state, action) => {
        state.comparisonLoading = false;
        state.error = action.error.message;
      })
      .addCase(getGpTrendThunk.pending, (state) => {
        state.trendLoading = true;
        state.error = null;
      })
      .addCase(getGpTrendThunk.fulfilled, (state, action) => {
        state.trendLoading = false;
        state.gpTrend = action.payload;
      })
      .addCase(getGpTrendThunk.rejected, (state, action) => {
        state.trendLoading = false;
        state.error = action.error.message;
      })
      .addCase(getStoreOverviewThunk.pending, (state) => {
        state.overviewLoading = true;
        state.error = null;
      })
      .addCase(getStoreOverviewThunk.fulfilled, (state, action) => {
        state.overviewLoading = false;
        state.storeOverview = action.payload;
      })
      .addCase(getStoreOverviewThunk.rejected, (state, action) => {
        state.overviewLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearReports } = reportsSlice.actions;
export default reportsSlice.reducer;
