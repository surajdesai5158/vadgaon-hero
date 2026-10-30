
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:7000/api'
});

// Automatically attach the login token to API requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('vh_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Let Axios/browser set the correct Content-Type.
    // JSON requests get JSON headers automatically.
    // FormData requests get multipart/form-data with boundary.
    if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Display useful backend error messages
export const getErrorMessage = (error) => {
  return (
    error.response?.data?.message ||
    error.message ||
    'Something went wrong. Please try again.'
  );
};

export default api;
