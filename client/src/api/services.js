import apiClient from './api';
import { API_ROUTES } from './constants';

export const fetchData = async (salelocation,startDate, endDate) => {
  try {
    const response = await apiClient.get(API_ROUTES.FETCH_DATA, {
      params: {
        salelocation,
        startDate,
        endDate,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const AllStoreData = async (startDate, endDate) => {
  try {
    const response = await apiClient.get(API_ROUTES.GET_ALL, {
      params: {
        startDate,
        endDate,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createTarget = async (targetData) => {
  try {
    const response = await apiClient.post(API_ROUTES.CREATE_TARGET, targetData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTarget = async (salelocation , startDate, endDate) => {
  console.log(salelocation,"kk")
  try {
    const response = await apiClient.get(`${API_ROUTES.GET_TARGET}?salelocation=${salelocation}&startDate=${startDate}&endDate=${endDate}`);
    console.log(response.data.target,"kk")
    return response.data.target;
  } catch (error) {
    throw error;
  }
};

// Update Target Service
export const updateTarget = async (targetId, targetData) => {
  try {
    const response = await apiClient.patch(`${API_ROUTES.UPDATE_TARGET}/${targetId}`, targetData);
    console.log(response)
    // return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete Target Service
export const deleteTarget = async (targetId) => {
  try {
    const response = await apiClient.delete(`${API_ROUTES.DELETE_TARGET}/${targetId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create Admin Service
export const createAdmin = async (adminData) => {
  try {
    const response = await apiClient.post(API_ROUTES.CREATE_ADMIN, adminData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllAdmins = async () => {
  try {
    const response = await apiClient.get(API_ROUTES.ALL_ADMIN);
    return response.data;
  } catch (error) {
    console.error('Failed to get all admins:', error);
    throw error;
  }
};
// In your services file
export const deleteAdmin = async (adminId) => {
  try {
    const response = await apiClient.delete(`${API_ROUTES.CREATE_ADMIN}/${adminId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};




export const login = async (email, password) => {
  try {
    const response = await apiClient.post(API_ROUTES.LOGIN, { email, password });
    if (response) {
      console.log(response)
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const isAuthenticated = () => {
  const token = getToken();
  // Implement token validation logic if needed
  return token ? true : false;
};

// Create NPS Service
  export const createNps = async (npsData) => {
    try {
      const response = await apiClient.post(API_ROUTES.CREATE_NPS, npsData);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

// Get All NPS Data Service
export const getAllNps = async (startDate, endDate) => {
  try {
    const response = await apiClient.get(`${API_ROUTES.GET_NPS}?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update NPS Data Service
export const updateNps = async ( npsData) => {
  try {
    const response = await apiClient.patch(`${API_ROUTES.UPDATE_NPS}`, npsData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete NPS Data Service
export const deleteNps = async (npsId) => {
  try {
    const response = await apiClient.delete(`${API_ROUTES.DELETE_NPS}/${npsId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};






export const createKPITarget = async (targetData) => {
  try {
    const response = await apiClient.post(API_ROUTES.CREATE_KPI, targetData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getKPITarget = async (salelocation , startDate, endDate) => {
  console.log(salelocation,"kk")
  console.log(`${API_ROUTES.GET_KPI}?salelocation=${salelocation}&startDate=${startDate}&endDate=${endDate}`,"kk")
  try {
    const response = await apiClient.get(`${API_ROUTES.GET_KPI}?salelocation=${salelocation}&startDate=${startDate}&endDate=${endDate}`);
    console.log(response.data.kpi,"kkppp")
    return response.data.kpi;
  } catch (error) {
    console.log(error,"hhhh")
    throw error;
  }
};

// Update Target Service
export const updateKPITarget = async (targetId, targetData) => {
  try {
    const response = await apiClient.patch(`${API_ROUTES.UPDATE_KPI}/${targetId}`, targetData);
    console.log(response)
    // return response.data;
  } catch (error) {
    throw error;
  }
};



// Create Commission
export const createCommission = async (commissionData) => {
  try {
    const response = await apiClient.post(API_ROUTES.CREATE_COMMISSION, commissionData);
    return response.data;
  } catch (error) {
    throw error; // You can customize this to return a specific error message or handle it differently if needed
  }
};

// Get All Commissions
export const getAllCommissions = async (startDate, endDate) => {
  try {
    const response = await apiClient.get(API_ROUTES.GET_COMMISSION, {
      params: { startDate, endDate },
    });
    return response.data;
  } catch (error) {
    throw error; // Handle the error as needed
  }
};

// Update Commission
export const updateCommission = async (commissionData) => {
  try {
    const response = await apiClient.patch(API_ROUTES.UPDATE_COMMISSION, commissionData);
    return response.data;
  } catch (error) {
    throw error; // Handle the error as needed
  }
};