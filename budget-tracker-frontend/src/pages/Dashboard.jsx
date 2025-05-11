// src/pages/Dashboard.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../contexts/AuthContext';
import SummaryChart from '../components/SummaryChart';
import BudgetChart from '../components/BudgetChart';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [budgetComp, setBudgetComp] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // 1) Total income / expenses / balance
    api.get('/api/summary/')
      .then(res => setSummary(res.data))
      .catch(err => {
        if (err.response?.status === 401) {
          logout();
          navigate('/login');
        }
      });

    // 2) This month's budget vs. actual
    api.get('/api/budget-comparison/')
      .then(res => setBudgetComp(res.data))
      .catch(console.error);

    // 3) Per-day income/expense trend
    api.get('/api/summary-trend/')
      .then(res => setTrendData(res.data))
      .catch(console.error);
  }, [logout, navigate]);

  // Wait for all three bits of data
  if (!summary || !budgetComp || trendData.length === 0) {
    return <p>Loading dashboard…</p>;
  }

  return (
    <div style={{ maxWidth: 800, margin: '2rem auto' }}>
      <h1>Dashboard</h1>

      {/* Raw numbers */}
      <div style={{ marginBottom: '2rem' }}>
        <p><strong>Total Income:</strong> ₹{summary.total_income}</p>
        <p><strong>Total Expenses:</strong> ₹{summary.total_expenses}</p>
        <p><strong>Balance:</strong> ₹{summary.balance}</p>
      </div>

      {/* D3 line chart */}
      <section>
        <h2>Income vs. Expenses Over Time</h2>
        <SummaryChart data={trendData} />
      </section>

      {/* D3 bar chart */}
      <section style={{ marginTop: '2rem' }}>
        <h2>Budget vs. Actual</h2>
        <BudgetChart
          budget={budgetComp.budget}
          actual={budgetComp.actual_expenses}
        />
      </section>
    </div>
  );
}
