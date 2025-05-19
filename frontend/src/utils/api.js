import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Intercepta todas las peticiones para añadir el token si está guardado
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 📌 Cargar productos desde colección productos (migrada)
export const fetchProducts = async () => {
  const { data } = await API.get('/productos');
  return data;
};

// 📌 Login usuario
export const loginUser = async (email, password) => {
  const { data } = await API.post('/auth/login', { email, password });
  return data;
};

// 📌 Registro usuario
export const signupUser = async (nombre, email, password) => {
  const { data } = await API.post('/auth/signup', { nombre, email, password });
  return data;
};

export default API;
