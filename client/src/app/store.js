import { configureStore } from '@reduxjs/toolkit'
import tableDataReducer from '../features/tableDataSlice';
import targetReducer from '../features/targetSlice';
import KPITargetReducer from '../features/kpiTargetSlice';
import adminReducer from '../features/adminSlice';
import authReducer from '../features/authSlice';
import npsReducer from '../features/npsSlice';
import commissionReducer from '../features/commissionSlice'; 

export const store = configureStore({
  reducer: {
    tableData: tableDataReducer,
    targets: targetReducer,
    KPITargets: KPITargetReducer,
    admin: adminReducer,
    auth: authReducer,
    nps: npsReducer,
    commission: commissionReducer,
  },
})