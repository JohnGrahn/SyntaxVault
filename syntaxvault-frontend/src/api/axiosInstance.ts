// src/api/axiosInstance.ts
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080', // Update this with your backend URL
});

function isTokenValid(token: string | null): boolean {
  if (!token) return false;
  try {
    const decoded = jwtDecode<{ exp: number }>(token);
    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

// Add a request interceptor to include the token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (isTokenValid(token) && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    } else {
      // If token is invalid, remove it
      localStorage.removeItem('token');
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default axiosInstance;