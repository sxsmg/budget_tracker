// src/components/Layout.jsx
import React, { useContext } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function Layout() {
  const { logout } = useContext(AuthContext);

  const linkStyle = ({ isActive }) => ({
    margin: '0 1rem',
    textDecoration: isActive ? 'underline' : 'none'
  });

  return (
    <div>
      <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
        <NavLink to="/dashboard" style={linkStyle}>Dashboard</NavLink>
        <NavLink to="/transactions" style={linkStyle}>Transactions</NavLink>
        <NavLink to="/budget" style={linkStyle}>Budget</NavLink>
        <button className="btn btn-add" onClick={logout} style={{ float: 'right' }}>Logout</button>
      </nav>
      <Outlet />
    </div>
  );
}
