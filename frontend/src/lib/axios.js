import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: "https://api.timeflow.space/api/v1",
});

api.interceptors.request.use((config) => {
  const token = Cookies.get('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export default api;