import axios from 'axios';

const API_BASE_URL = 'http://localhost:5002/api/';
// const API_BASE_URL = 'http://135.181.192.4:5002/api/';
// const API_BASE_URL = 'http://170.64.177.174:5002/api/'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default apiClient;
