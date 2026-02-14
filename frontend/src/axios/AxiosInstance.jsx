// src/axios/AxiosInstance.jsx
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  // Add headers to support backend compression and security
  headers: {
    'Accept-Encoding': 'gzip, deflate', // Tells backend to send compressed response
    'Accept': 'application/json',
  },
  // Optimize timeout for network reliability
  timeout: 10000,
});

// Request interceptor for adding tokens and optimization headers
API.interceptors.request.use(
  (config) => {
    // Enable request compression for large payloads
    config.headers['Content-Encoding'] = 'gzip';
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log errors in development only
    if (import.meta.env.DEV) {
      console.error('API Error:', error);
    }
    return Promise.reject(error);
  }
);

export default API;
