import axios from 'axios';
import Cookies from 'js-cookie';
import API_BASE_URL from '@/config';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
});

console.log(API_BASE_URL)

api.interceptors.request.use((config) => {
  const token = Cookies.get('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export default api;