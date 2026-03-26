import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  createProrataStaff,
  getProrataStaff,
  updateProrataStaff,
  deleteProrataStaff,
} from '../api/services';

// Async thunks
export const createProrataStaffThunk = createAsyncThunk(
  'prorataStaff/createProrataStaff',
  async (prorataStaffData, thunkAPI) => {
    try {
      const data = await createProrataStaff(prorataStaffData);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getProrataStaffThunk = createAsyncThunk(
  'prorataStaff/getProrataStaff',
  async ({ salelocation, startDate, endDate }, thunkAPI) => {
    try {
      const data = await getProrataStaff(salelocation, startDate, endDate);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateProrataStaffThunk = createAsyncThunk(
  'prorataStaff/updateProrataStaff',
  async ({ staffId, prorataStaffData }, thunkAPI) => {
    try {
      const data = await updateProrataStaff(staffId, prorataStaffData);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const deleteProrataStaffThunk = createAsyncThunk(
  'prorataStaff/deleteProrataStaff',
  async (staffId, thunkAPI) => {
    try {
      const data = await deleteProrataStaff(staffId);
      return { staffId, ...data };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Slice
const prorataStaffSlice = createSlice({
  name: 'prorataStaff',
  initialState: {
    staffList: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createProrataStaffThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProrataStaffThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.staffList.push(action.payload.prorataStaff);
        state.error = null;
      })
      .addCase(createProrataStaffThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create prorata staff';
      })
      .addCase(getProrataStaffThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProrataStaffThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.staffList = action.payload || [];
        state.error = null;
      })
      .addCase(getProrataStaffThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch prorata staff';
      })
      .addCase(updateProrataStaffThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProrataStaffThunk.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.staffList.findIndex(
          (staff) => staff._id === action.payload.prorataStaff._id
        );
        if (index !== -1) {
          state.staffList[index] = action.payload.prorataStaff;
        }
      })
      .addCase(updateProrataStaffThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update prorata staff';
      })
      .addCase(deleteProrataStaffThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProrataStaffThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.staffList = state.staffList.filter(
          (staff) => staff._id !== action.payload.staffId
        );
      })
      .addCase(deleteProrataStaffThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete prorata staff';
      });
  },
});

export default prorataStaffSlice.reducer;
