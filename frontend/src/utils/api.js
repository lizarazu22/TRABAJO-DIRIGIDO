import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchProducts = async () => {
  const { data } = await API.get('/productos');
  return data;
};

export const loginUser = async (email, password) => {
  const { data } = await API.post('/auth/login', { email, password });
  return data;
};

export const signupUser = async (nombre, email, password) => {
  const { data } = await API.post('/auth/signup', { nombre, email, password });
  return data;
};

export const consultarIA = async (solicitud) => {
  const { data } = await API.post('/gpt/buscar', { solicitud });
  return data.sugerencias;
};

export default API;
