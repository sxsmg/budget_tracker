// src/components/BudgetForm.jsx
import React, { useState } from 'react';

export default function BudgetForm({ initialAmount = '', onSave, onCancel }) {
  const [amount, setAmount] = useState(initialAmount);

  const handleSubmit = e => {
    e.preventDefault();
    onSave({ amount: parseFloat(amount) });
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 300, margin: '1rem 0' }}>
      <div>
        <label>Monthly Budget (₹)</label><br/>
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          required
        />
      </div>
      <button className="btn btn-add" type="submit" style={{ marginTop: '0.5rem' }}>Save</button>
      <button
        type="button"
        className="btn btn-add"
        onClick={onCancel}
        style={{ marginLeft: 8, marginTop: '0.5rem' }}
      >
        Cancel
      </button>
    </form>
  );
}
