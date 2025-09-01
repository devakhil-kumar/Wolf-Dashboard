// // src/features/auth/authSlice.js
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { login } from '../api/services';
// // Define allowed emails array
// const ALLOWED_EMAILS = [
//   // 'warragul@wolfstores.com.au',
//   // 'torquay@wolfstores.com.au',
//   'gauravisonline@gmail.com',
//   'shae@wolfstores.com.au',
//   'bec@wolfstores.com.au'
//   // 'traralgon@wolfstores.com.au'
// ];

// // Helper function to check if email is allowed
// const isEmailAllowed = (email) => ALLOWED_EMAILS.includes(email);


// export const loginUser = createAsyncThunk('auth/loginUser', async ({ email, password }, thunkAPI) => {
//   try {
//     const response = await login(email, password);
//     console.log({response})
//     localStorage.setItem('userEmail', response.admin.email);
   
//     return response;
//   } catch (error) {
//     return thunkAPI.rejectWithValue(error);
//   }
// });

// const authSlice = createSlice({
//   name: 'auth',
//   initialState: {
//     user: null,
//     token: localStorage.getItem('token') || null,
//     status: 'idle',
//     error: null,
//     // isCreateUserAllowed: localStorage.getItem('userEmail') === 'gauravisonline@gmail.com', 
//     isCreateUserAllowed: isEmailAllowed(localStorage.getItem('userEmail')),
//   },
//   reducers: {
//     logoutUser: (state) => {
//       state.user = null;
//       state.token = null;
//       localStorage.removeItem('token');
//       localStorage.removeItem('userEmail');
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(loginUser.pending, (state) => {
//         state.status = 'loading';
//       })
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         state.user = action.payload.admin;
//         state.token = action.payload.token;
//         // state.isCreateUserAllowed = action.payload.admin.email === 'gauravisonline@gmail.com';
//         // const storedEmail = localStorage.getItem('userEmail');
//         // state.isCreateUserAllowed = storedEmail === 'gauravisonline@gmail.com';
//         const storedEmail = localStorage.getItem('userEmail');
//         state.isCreateUserAllowed = isEmailAllowed(storedEmail);
//       })
//       .addCase(loginUser.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.payload;
//       });
//   },
// });

// export const { logoutUser } = authSlice.actions;

// export default authSlice.reducer;







// // src/features/auth/authSlice.js
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { login } from '../api/services';

// // Define allowed emails array
// const ALLOWED_EMAILS = [
//   // 'warragul@wolfstores.com.au',
//   // 'torquay@wolfstores.com.au',
//   'gauravisonline@gmail.com',
//   'shae@wolfstores.com.au',
//   'bec@wolfstores.com.au'
//   // 'traralgon@wolfstores.com.au'
// ];

// // Helper function to check if email is allowed
// const isEmailAllowed = (email) => ALLOWED_EMAILS.includes(email);

// // Helper function to get user from localStorage
// const getUserFromStorage = () => {
//   try {
//     const userString = localStorage.getItem('user');
//     return userString ? JSON.parse(userString) : null;
//   } catch (error) {
//     console.error('Error parsing user from localStorage:', error);
//     return null;
//   }
// };

// // Helper function to save user to localStorage
// const saveUserToStorage = (user) => {
//   try {
//     localStorage.setItem('user', JSON.stringify(user));
//   } catch (error) {
//     console.error('Error saving user to localStorage:', error);
//   }
// };

// // Helper function to remove user from localStorage
// const removeUserFromStorage = () => {
//   localStorage.removeItem('user');
// };

// export const loginUser = createAsyncThunk('auth/loginUser', async ({ email, password }, thunkAPI) => {
//   try {
//     const response = await login(email, password);
//     console.log({response});
    
//     // Store user data and email in localStorage
//     localStorage.setItem('userEmail', response.admin.email);
//     localStorage.setItem('token', response.token);
//     saveUserToStorage(response.admin);
    
//     return response;
//   } catch (error) {
//     return thunkAPI.rejectWithValue(error);
//   }
// });

// const authSlice = createSlice({
//   name: 'auth',
//   initialState: {
//     user: getUserFromStorage(), // Get user from localStorage on app initialization
//     token: localStorage.getItem('token') || null,
//     status: 'idle',
//     error: null,
//     // Check both stored user role and email for backward compatibility
//     isCreateUserAllowed: (() => {
//       const storedUser = getUserFromStorage();
//       const storedEmail = localStorage.getItem('userEmail');
      
//       // If we have a stored user with role, use that
//       if (storedUser && storedUser.role) {
//         return storedUser.role === 'manager';
//       }
      
//       // Fallback to email-based check for backward compatibility
//       return isEmailAllowed(storedEmail);
//     })(),
//   },
//   reducers: {
//     logoutUser: (state) => {
//       state.user = null;
//       state.token = null;
//       state.isCreateUserAllowed = false;
      
//       // Clear all stored data
//       localStorage.removeItem('token');
//       localStorage.removeItem('userEmail');
//       removeUserFromStorage();
//     },
    
//     // Additional reducer to update user data (useful for profile updates)
//     updateUser: (state, action) => {
//       state.user = { ...state.user, ...action.payload };
//       saveUserToStorage(state.user);
      
//       // Update permissions based on new role
//       if (state.user.role) {
//         state.isCreateUserAllowed = state.user.role === 'manager';
//       }
//     },
    
//     // Reducer to clear error state
//     clearError: (state) => {
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(loginUser.pending, (state) => {
//         state.status = 'loading';
//         state.error = null;
//       })
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         state.user = action.payload.admin;
//         state.token = action.payload.token;
//         state.error = null;
        
//         // Set permissions based on user role
//         if (action.payload.admin.role) {
//           state.isCreateUserAllowed = action.payload.admin.role === 'manager';
//         } else {
//           // Fallback to email-based check if role is not available
//           const storedEmail = localStorage.getItem('userEmail');
//           state.isCreateUserAllowed = isEmailAllowed(storedEmail);
//         }
//       })
//       .addCase(loginUser.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.payload;
//         state.user = null;
//         state.token = null;
//         state.isCreateUserAllowed = false;
        
//         // Clear stored data on login failure
//         localStorage.removeItem('token');
//         localStorage.removeItem('userEmail');
//         removeUserFromStorage();
//       });
//   },
// });

// export const { logoutUser, updateUser, clearError } = authSlice.actions;

// export default authSlice.reducer;

// // Selectors for easier state access
// export const selectUser = (state) => state.auth.user;
// export const selectIsAuthenticated = (state) => !!state.auth.token && !!state.auth.user;
// export const selectIsManager = (state) => state.auth.user?.role === 'manager';
// export const selectUserRole = (state) => state.auth.user?.role;
// export const selectIsCreateUserAllowed = (state) => state.auth.isCreateUserAllowed;









// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login } from '../api/services';

// Define allowed emails array with their default roles
const ALLOWED_EMAILS = [
  // 'warragul@wolfstores.com.au',
  // 'torquay@wolfstores.com.au',
  'gauravisonline@gmail.com', // Admin
  'shae@wolfstores.com.au',   // Admin
  'bec@wolfstores.com.au',    // Admin
  'demo@wolfstores.com.au'    // Demo user
  // 'traralgon@wolfstores.com.au'
];

// Helper function to check if email is allowed
const isEmailAllowed = (email) => ALLOWED_EMAILS.includes(email);

// Helper function to determine if email should have admin privileges (for backward compatibility)
const isEmailAdmin = (email) => ALLOWED_EMAILS.includes(email) && email !== 'demo@wolfstores.com.au';

// Helper function to check if user is demo user
const isDemoUser = (email) => email === 'demo@wolfstores.com.au';

// Helper function to get user from localStorage
const getUserFromStorage = () => {
  try {
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    return null;
  }
};

// Helper function to save user to localStorage
const saveUserToStorage = (user) => {
  try {
    localStorage.setItem('user', JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user to localStorage:', error);
  }
};

// Helper function to remove user from localStorage
const removeUserFromStorage = () => {
  localStorage.removeItem('user');
};

// Helper function to determine create user permissions based on role
const getCreateUserPermissions = (role, email) => {
  if (role === 'admin') return true;
  if (role === 'manager') return true;
  if (role === 'demo') return true;
  
  // Fallback to email-based check for backward compatibility
  return isEmailAllowed(email);
};

export const loginUser = createAsyncThunk('auth/loginUser', async ({ email, password }, thunkAPI) => {
  try {
    const response = await login(email, password);
    console.log({response});
    
    // Store user data and email in localStorage
    localStorage.setItem('userEmail', response.admin.email);
    localStorage.setItem('token', response.token);
    
    // If user doesn't have a role but email is in allowed list, set appropriate role (backward compatibility)
    if (!response.admin.role) {
      if (isDemoUser(response.admin.email)) {
        response.admin.role = 'demo';
      } else if (isEmailAdmin(response.admin.email)) {
        response.admin.role = 'admin';
      }
    }
    
    saveUserToStorage(response.admin);
    
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: (() => {
      const storedUser = getUserFromStorage();
      // Ensure backward compatibility - if user has no role but email is allowed, set appropriate role
      if (storedUser && !storedUser.role) {
        if (isDemoUser(storedUser.email)) {
          storedUser.role = 'demo';
          saveUserToStorage(storedUser);
        } else if (isEmailAdmin(storedUser.email)) {
          storedUser.role = 'admin';
          saveUserToStorage(storedUser);
        }
      }
      return storedUser;
    })(),
    token: localStorage.getItem('token') || null,
    status: 'idle',
    error: null,
    // Check permissions based on role and email
    isCreateUserAllowed: (() => {
      const storedUser = getUserFromStorage();
      const storedEmail = localStorage.getItem('userEmail');
      
      // If we have a stored user with role, use that
      if (storedUser && storedUser.role) {
        return getCreateUserPermissions(storedUser.role, storedUser.email);
      }
      
      // Fallback to email-based check for backward compatibility
      return isEmailAllowed(storedEmail);
    })(),
  },
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      state.isCreateUserAllowed = false;
      
      // Clear all stored data
      localStorage.removeItem('token');
      localStorage.removeItem('userEmail');
      removeUserFromStorage();
    },
    
    // Additional reducer to update user data (useful for profile updates)
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      saveUserToStorage(state.user);
      
      // Update permissions based on new role
      if (state.user.role) {
        state.isCreateUserAllowed = getCreateUserPermissions(state.user.role, state.user.email);
      }
    },
    
    // Reducer to clear error state
    clearError: (state) => {
      state.error = null;
    },
    
    // Reducer to upgrade user role (for migration purposes)
    upgradeUserRole: (state, action) => {
      if (state.user) {
        state.user.role = action.payload;
        saveUserToStorage(state.user);
        state.isCreateUserAllowed = getCreateUserPermissions(state.user.role, state.user.email);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.admin;
        state.token = action.payload.token;
        state.error = null;
        
        // Set permissions based on user role
        if (action.payload.admin.role) {
          state.isCreateUserAllowed = getCreateUserPermissions(
            action.payload.admin.role, 
            action.payload.admin.email
          );
        } else {
          // Fallback to email-based check if role is not available
          const storedEmail = localStorage.getItem('userEmail');
          state.isCreateUserAllowed = isEmailAllowed(storedEmail);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.user = null;
        state.token = null;
        state.isCreateUserAllowed = false;
        
        // Clear stored data on login failure
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        removeUserFromStorage();
      });
  },
});

export const { logoutUser, updateUser, clearError, upgradeUserRole } = authSlice.actions;

export default authSlice.reducer;

// Selectors for easier state access
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => !!state.auth.token && !!state.auth.user;

// Role-based selectors
export const selectUserRole = (state) => state.auth.user?.role;
export const selectIsAdmin = (state) => state.auth.user?.role === 'admin';
export const selectIsManager = (state) => state.auth.user?.role === 'manager';
export const selectIsStaff = (state) => state.auth.user?.role === 'staff';
export const selectIsDemo = (state) => state.auth.user?.role === 'demo';

// Permission-based selectors
export const selectIsCreateUserAllowed = (state) => state.auth.isCreateUserAllowed;

// Advanced permission selectors
export const selectCanCreateAdmin = (state) => state.auth.user?.role === 'admin';
export const selectCanCreateManager = (state) => state.auth.user?.role === 'admin';
export const selectCanCreateStaff = (state) => 
  state.auth.user?.role === 'admin' || state.auth.user?.role === 'manager';

export const selectCanDeleteAdmin = (state) => state.auth.user?.role === 'admin';
export const selectCanDeleteManager = (state) => state.auth.user?.role === 'admin';
export const selectCanDeleteStaff = (state) => 
  state.auth.user?.role === 'admin' || state.auth.user?.role === 'manager';

// Helper selector to check if user can delete a specific role
export const selectCanDeleteRole = (state, targetRole) => {
  const userRole = state.auth.user?.role;
  
  if (userRole === 'admin') return true; // Admin can delete anyone
  if (userRole === 'manager') return targetRole === 'staff'; // Manager can only delete staff
  return false; // Staff can't delete anyone
};

// Helper selector to check if user can create a specific role
export const selectCanCreateRole = (state, targetRole) => {
  const userRole = state.auth.user?.role;
  
  if (userRole === 'admin') return true; // Admin can create anyone
  if (userRole === 'manager') return targetRole === 'staff'; // Manager can only create staff
  return false; // Staff can't create anyone
};

// Selector to get available roles for creation based on current user's role
export const selectAvailableRolesToCreate = (state) => {
  const userRole = state.auth.user?.role;
  
  if (userRole === 'admin') {
    return ['admin', 'manager', 'staff'];
  } else if (userRole === 'manager') {
    return ['staff'];
  }
  return [];
};

// Selector to get user's permission level (for UI display)
export const selectUserPermissionLevel = (state) => {
  const userRole = state.auth.user?.role;
  
  switch (userRole) {
    case 'admin':
      return {
        level: 'admin',
        displayName: 'Administrator',
        description: 'Full system access - can manage all users and roles',
        icon: '🔐'
      };
    case 'manager':
      return {
        level: 'manager',
        displayName: 'Manager',
        description: 'Can create and manage staff users',
        icon: '👑'
      };
    case 'staff':
      return {
        level: 'staff',
        displayName: 'Staff',
        description: 'Standard user access',
        icon: '👤'
      };
    case 'demo':
      return {
        level: 'demo',
        displayName: 'Demo User',
        description: 'Limited access - view only',
        icon: '👁️'
      };
    default:
      return {
        level: 'unknown',
        displayName: 'Unknown',
        description: 'Unknown permission level',
        icon: '❓'
      };
  }
};