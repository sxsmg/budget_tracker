import { createContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Token ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete api.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token]);

  const login = async (username, password) => {
    const res = await api.post('/api-token-auth/', { username, password });
    setToken(res.data.token);
    navigate('/dashboard');
  };

  const logout = () => {
    setToken(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
