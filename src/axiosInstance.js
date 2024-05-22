import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api', // Base URL for all requests
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
