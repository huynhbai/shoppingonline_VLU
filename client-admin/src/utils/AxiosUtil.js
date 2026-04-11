import axios from 'axios';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000'
});

// Store for the token (will be set by the app)
let currentToken = '';

export const setAuthToken = (token) => {
  currentToken = token;
  if (token) {
    axiosInstance.defaults.headers.common['x-access-token'] = token;
  } else {
    delete axiosInstance.defaults.headers.common['x-access-token'];
  }
};

// Interceptor to add token to requests (if not already set)
axiosInstance.interceptors.request.use(
  (config) => {
    // Only add token if it exists and not already in headers
    if (currentToken && !config.headers['x-access-token']) {
      config.headers['x-access-token'] = currentToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle 431 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 431) {
      console.error('Request header too large. Clearing token and retrying...');
      currentToken = '';
      delete axiosInstance.defaults.headers.common['x-access-token'];
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
