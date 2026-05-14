import axios from 'axios';

const request = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1', // Public APIs might also be under /api/v1/public or just /api/v1
  timeout: 10000,
});

request.interceptors.request.use((config) => {
  const token = localStorage.getItem('customer_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default request;
