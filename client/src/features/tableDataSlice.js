// tableDataSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchData,AllStoreData } from '../api/services';

export const loadData = createAsyncThunk(
  'tableData/loadData',
  async ({salelocation, startDate, endDate }) => {
    const response = await fetchData(salelocation,startDate, endDate);
    console.log(response.data, "locationstore");
    return response;
  }
);
export const AllStore = createAsyncThunk(
  'tableData/allstore',
  async ({startDate, endDate }) => {
    const response = await AllStoreData(startDate, endDate);
    
    return response;
  }
);

const tableDataSlice = createSlice({
  name: 'tableData',
  initialState: {
    data: [],
    message:null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadData.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message=null;
      })
      .addCase(loadData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.message=action.payload.message;
      })
      .addCase(loadData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.message=null;
      })
      .addCase(AllStore.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message=null;
      })
      .addCase(AllStore.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.message=action.payload.message;
      })
      .addCase(AllStore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.message=null;
      });

  },
});

export default tableDataSlice.reducer;
