// src/api/axios.js
import axios from 'axios';

const token = localStorage.getItem('token');  // read it right away

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  headers: token
    ? { Authorization: `Token ${token}` }
    : {}
});

export default api;
