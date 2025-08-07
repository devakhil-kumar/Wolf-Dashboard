// features/admin/adminSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createAdmin, getAllAdmins, deleteAdmin } from '../api/services'; // Import other admin services as needed

// Thunk to create admin
export const createAdminThunk = createAsyncThunk(
  'admin/createAdmin',
  async (adminData, { rejectWithValue }) => {
    try {
      const response = await createAdmin(adminData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk to fetch all admins
export const getAllAdminsThunk = createAsyncThunk(
  'admin/getAllAdmins',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllAdmins();
      console.log(response.admins)
      return response.admins;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk to delete admin
export const deleteAdminThunk = createAsyncThunk(
  'admin/deleteAdmin',
  async (adminId, { rejectWithValue }) => {
    try {
      const response = await deleteAdmin(adminId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    admins: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createAdminThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAdminThunk.fulfilled, (state, action) => {
        state.loading = false;
        // state.admins.push(action.payload); // Assuming the payload is the 
      })
      .addCase(createAdminThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAllAdminsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllAdminsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.admins = action.payload; // Assuming the payload is an array of admin objects
      })
      .addCase(getAllAdminsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteAdminThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAdminThunk.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the deleted admin from the admins array
        state.admins = state.admins.filter(admin => admin.id !== action.payload.id); // Assuming the payload is the deleted admin object
      })
      .addCase(deleteAdminThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default adminSlice.reducer;
