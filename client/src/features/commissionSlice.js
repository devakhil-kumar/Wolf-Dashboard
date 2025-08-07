import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createCommission, getAllCommissions, updateCommission } from '../api/services';

// Thunks for async actions

// Create Commission Thunk
export const createCommissionThunk = createAsyncThunk(
  'commission/createCommission',
  async (commissionData, { rejectWithValue }) => {
    try {
      const response = await createCommission(commissionData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Get All Commissions Thunk
export const getAllCommissionsThunk = createAsyncThunk(
  'commission/getAllCommissions',
  async ({ startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await getAllCommissions(startDate, endDate);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update Commission Thunk
export const updateCommissionThunk = createAsyncThunk(
  'commission/updateCommission',
  async (commissionData, { rejectWithValue }) => {
    try {
      const response = await updateCommission(commissionData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const commissionSlice = createSlice({
    name: 'commission',
    initialState: {
      commissions: [],
      loading: false,
      error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(createCommissionThunk.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(createCommissionThunk.fulfilled, (state, action) => {
          state.loading = false;
          state.commissions.push(action.payload);
        })
        .addCase(createCommissionThunk.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        .addCase(getAllCommissionsThunk.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(getAllCommissionsThunk.fulfilled, (state, action) => {
          state.loading = false;
          state.commissions = action.payload.commission;
        })
        .addCase(getAllCommissionsThunk.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        .addCase(updateCommissionThunk.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(updateCommissionThunk.fulfilled, (state, action) => {
          state.loading = false;
        //   const index = state.commissions.findIndex(
        //     (commission) => commission.id === action.payload.id
        //   );
        //   if (index !== -1) {
        //     state.commissions[index] = action.payload;
        //   }
        })
        .addCase(updateCommissionThunk.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    },
  });
  
  export default commissionSlice.reducer;   