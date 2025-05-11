// src/api/axios.js
import axios from 'axios';

const token = localStorage.getItem('token');  // read it right away

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: token
    ? { Authorization: `Token ${token}` }
    : {}
});

export default api;
