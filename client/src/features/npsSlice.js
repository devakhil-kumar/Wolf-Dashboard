import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createNps, getAllNps, updateNps, deleteNps } from '../api/services';

// Thunks for async actions
export const createNpsThunk = createAsyncThunk('nps/createNps', async (npsData, { rejectWithValue }) => {
  try {
    const response = await createNps(npsData);
    return response;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const getAllNpsThunk = createAsyncThunk(
    'nps/getAllNps',
    async ({ startDate, endDate }, { rejectWithValue }) => {
        console.log({ startDate, endDate })
      try {
        const response = await getAllNps(startDate, endDate);
        return response;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );

export const updateNpsThunk = createAsyncThunk('nps/updateNps', async ({  npsData }, { rejectWithValue }) => {
    console.log(npsData)
  try {
    const response = await updateNps( npsData);
    console.log(response,"hhhhhhhhhhiiiii")
    return response;
  } catch (error) {
    console.log(error,"jijiji")
    return rejectWithValue(error.response.data);
  }
});

export const deleteNpsThunk = createAsyncThunk('nps/deleteNps', async (npsId, { rejectWithValue }) => {
  try {
    const response = await deleteNps(npsId);
    return response;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Initial state
const initialState = {
  npsData: [],
  npsloading: false,
  npserror: null,
};

// NPS slice
const npsSlice = createSlice({
  name: 'nps',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createNpsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNpsThunk.fulfilled, (state, action) => {
        state.loading = false;
        // state.npsData= action.payload;
      })
      .addCase(createNpsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAllNpsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllNpsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.npsData = action.payload;
      })
      .addCase(getAllNpsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateNpsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNpsThunk.fulfilled, (state, action) => {
        state.loading = false;
        // const index = state.npsData.findIndex(nps => nps.id === action.payload.id);
        // if (index !== -1) {
        //   state.npsData[index] = action.payload;
        // }
      })
      .addCase(updateNpsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteNpsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNpsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.npsData = state.npsData.filter(nps => nps.id !== action.payload.id);
      })
      .addCase(deleteNpsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default npsSlice.reducer;
