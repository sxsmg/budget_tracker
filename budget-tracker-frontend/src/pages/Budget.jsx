import React, { useState, useEffect } from 'react'  // ← you need both React and the hooks
import { getBudgets, createBudget, updateBudget } from '../api/budget'
import BudgetForm from '../components/BudgetForm'
import BudgetChart from '../components/BudgetChart'
import api from '../api/axios'


export default function Budget() {
  const [budget, setBudget]         = useState(undefined); // undefined = not loaded; null = loaded, but none
  const [comparison, setComparison] = useState(undefined);
  const [editing, setEditing]       = useState(false);

  // use month/year selectors, too
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth()+1);
  const [year,  setYear ] = useState(now.getFullYear());

  const loadBudget = async () => {
    // fetch one budget for that month/year
    const res = await getBudgets({ month, year });
    setBudget(res.data.results[0] ?? null);
  };

  useEffect(() => {
    loadBudget();
    api.get('/api/budget-comparison/')
       .then(res => setComparison(res.data))
       .catch(console.error);
  }, [month, year]);

  // still waiting? show a spinner
  if (budget === undefined || comparison === undefined) {
    return <p>Loading budget…</p>;
  }

  // once loaded, if there is _no_ budget we fall through to the form
  return (
    <div style={{ maxWidth: 800, margin: '2rem auto' }}>
      <h1>Budget Management</h1>

      {/* month/year picker */}
      <div style={{ marginBottom: '1rem' }}>
        <label>
          Month:{' '}
          <select value={month} onChange={e=>setMonth(+e.target.value)}>
            {Array.from({length:12},(_,i)=>(
              <option key={i} value={i+1}>
                {i+1}
              </option>
            ))}
          </select>
        </label>
        <label style={{ marginLeft: 16 }}>
          Year:{' '}
          <select value={year} onChange={e=>setYear(+e.target.value)}>
            {Array.from({length:5},(_,i)=>year-2+i).map(y=>(
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </label>
      </div>

      {editing || budget === null ? (
        <BudgetForm
          initialAmount={budget?.amount ?? ''}
          onSave={({ amount }) => {
            const payload = { month, year, amount };
            const action = budget
              ? updateBudget(budget.id, payload)
              : createBudget(payload);
            action
              .then(() => {
                setEditing(false);
                loadBudget();
              })
              .catch(console.error);
          }}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <div style={{ marginBottom: '1rem' }}>
          <p>
            <strong>
              {month}/{year} Budget:
            </strong>{' '}
            ₹{budget.amount}
          </p>
          <button className="btn" onClick={() => setEditing(true)}>
            {budget ? 'Edit' : 'Set'} Budget
          </button>
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
