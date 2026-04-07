import axios from 'axios';

// Store for the token (will be set by the app)
let currentToken = '';

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.headers.common['Content-Type'] = 'application/json';

export const setAuthToken = (token) => {
  currentToken = token;
  if (token) {
    axios.defaults.headers.common['x-access-token'] = token;
  } else {
    delete axios.defaults.headers.common['x-access-token'];
  }
};

// Global interceptor to add token to requests
axios.interceptors.request.use(
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

// Global interceptor to handle 431 errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 431) {
      console.error('Request header too large. Clearing token and retrying...');
      currentToken = '';
      delete axios.defaults.headers.common['x-access-token'];
    }
    return Promise.reject(error);
  }
);

export default axios;
