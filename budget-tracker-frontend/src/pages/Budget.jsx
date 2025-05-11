// src/pages/Budget.jsx
import React, { useState, useEffect } from 'react';
import { getBudgets, createBudget, updateBudget } from '../api/budget';
import BudgetForm from '../components/BudgetForm';
import BudgetChart from '../components/BudgetChart';
import api from '../api/axios';

export default function Budget() {
  const [budget, setBudget] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [editing, setEditing] = useState(false);

  // Helper to load the current month/year budget
  const loadBudget = async () => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const res = await getBudgets({ month, year });
    // assume one budget per month
    setBudget(res.data.results?.[0] ?? null);
  };

  useEffect(() => {
    // 1) Load or create the current budget
    loadBudget();

    // 2) Fetch the actual vs. budget numbers
    api.get('/api/budget-comparison/')
        .then(res => setComparison(res.data))
        .catch(console.error);
    }, []);

  const handleSave = ({ amount }) => {
    const action = budget
      ? updateBudget(budget.id, { month: budget.month, year: budget.year, amount })
      : createBudget({ amount }); // backend should infer month/year from user
    action
      .then(() => {
        setEditing(false);
        loadBudget();
      })
      .catch(console.error);
  };

  if (budget === null || comparison === null) {
    return <p>Loading budget…</p>;
  }

  return (
    <div style={{ maxWidth: 800, margin: '2rem auto' }}>
      <h1>Budget Management</h1>

      {editing ? (
        <BudgetForm
          initialAmount={budget.amount}
          onSave={handleSave}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <div style={{ marginBottom: '1rem' }}>
          <p>
            <strong>Current Month Budget:</strong> ₹{budget.amount}
          </p>
          <button onClick={() => setEditing(true)}>Edit Budget</button>
        </div>
      )}

      <section style={{ marginTop: '2rem' }}>
        <h2>Budget vs. Actual</h2>
        <BudgetChart
          budget={comparison.budget}
          actual={comparison.actual_expenses}
        />
      </section>
    </div>
  );
}
