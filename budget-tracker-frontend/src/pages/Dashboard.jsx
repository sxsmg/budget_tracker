import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import SummaryChart from '../components/SummaryChart';
import BudgetChart  from '../components/BudgetChart';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [budgetComp, setBudgetComp] = useState(null);
  const [trendData, setTrendData] = useState([]);

  useEffect(() => {
    api.get('/api/summary/').then(r => setSummary(r.data)).catch(console.error);
    api.get('/api/budget-comparison/').then(r => setBudgetComp(r.data)).catch(console.error);
    api.get('/api/summary-trend/').then(r => setTrendData(r.data)).catch(console.error);
  }, []);

  if (!summary || !budgetComp || trendData.length === 0) {
    return <p>Loading dashboard…</p>;
  }

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto' }}>
      <h1>Dashboard</h1>
      <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '2rem' }}>
        <div><h3>Total Income</h3><p>₹{summary.total_income}</p></div>
        <div><h3>Total Expenses</h3><p>₹{summary.total_expenses}</p></div>
        <div><h3>Balance</h3><p>₹{summary.balance}</p></div>
      </div>

      <h2>Income vs. Expenses Over Time</h2>
      <SummaryChart data={trendData} />

      <h2 style={{ marginTop: '2rem' }}>Budget vs. Actual</h2>
      <BudgetChart budget={budgetComp.budget} actual={budgetComp.actual_expenses} />
    </div>
  );
}
