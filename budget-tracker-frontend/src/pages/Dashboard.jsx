import React, { useEffect, useState } from 'react';
import SummaryChart from '../components/SummaryChart';
import BudgetChart from '../components/BudgetChart';
import api from '../api/axios';

export default function Dashboard() {
  const [summary, setSummary] = useState({});
  const [trend, setTrend]     = useState([]);
  const [comparison, setComp] = useState({});

  useEffect(() => {
    api.get('/api/summary/').then(res => setSummary(res.data));
    api.get('/api/summary-trend/').then(res => setTrend(res.data));
    api.get('/api/budget-comparison/').then(res => setComp(res.data));
  }, []);

  return (
    <>
      <div className="summary-grid">
        <div className="card summary-item">
          <h3>Total Income</h3>
          <p className="summary-value">
            ${summary.total_income?.toFixed(2)}
          </p>
        </div>
        <div className="card summary-item">
          <h3>Total Expenses</h3>
          <p className="summary-value">
            ${summary.total_expenses?.toFixed(2)}
          </p>
        </div>
        <div className="card summary-item">
          <h3>Balance</h3>
          <p className="summary-value">
            ${summary.balance?.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="card chart-container">
        <h2>Income vs. Expenses Over Time</h2>
        <SummaryChart data={trend} />
      </div>

      <div className="card chart-container">
        <h2>Budget vs. Actual</h2>
        <BudgetChart
          budget={comparison.budget}
          actual={comparison.actual_expenses}
        />
        <p
          className={`budget-diff ${
            comparison.difference >= 0 ? 'positive' : 'negative'
          }`}
        >
          {comparison.difference >= 0
            ? `Under budget by $${comparison.difference.toFixed(2)}`
            : `Over budget by $${Math.abs(comparison.difference).toFixed(2)}`}
        </p>
      </div>
    </>
  );
}
