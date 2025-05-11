// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'; // you'll build this next
import PrivateRoute from './components/PrivateRoute';
import Transactions from './pages/Transactions';
import Budget from './pages/Budget';

export default function App() {
  return (
    
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/transactions"
        element={
          <PrivateRoute>
            <Transactions />
          </PrivateRoute>
        }
      />
      {/* Redirect any unknown route */}
      <Route
        path="/budget"
        element={
          <PrivateRoute>
            <Budget />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
