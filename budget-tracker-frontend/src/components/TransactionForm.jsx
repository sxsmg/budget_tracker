import React, { useState, useEffect } from 'react';
import api from '../api/axios';

export default function TransactionForm({ initial={}, onSave, onCancel }) {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    category: initial.category || '',
    amount: initial.amount || '',
    date: initial.date || '',
    description: initial.description || ''
  });

  useEffect(() => {
      api.get('/api/categories/')
        .then(res => {
          const cats = Array.isArray(res.data)
            ? res.data
            : res.data.results ?? [];
          setCategories(cats);
        })
          .catch(console.error);
    }, []);
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
      <div>
        <label>Date</label><br/>
        <input type="date" name="date" value={form.date} onChange={handleChange} required />
      </div>
      <div>
        <label>Category</label><br/>
        <select name="category" value={form.category} onChange={handleChange} required>
          <option value="">— select —</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.type})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Amount</label><br/>
        <input
          type="number" name="amount" step="0.01"
          value={form.amount} onChange={handleChange} required
        />
      </div>
      <div>
        <label>Description</label><br/>
        <input name="description" value={form.description} onChange={handleChange} />
      </div>
      <button type="submit" style={{ marginTop: '1rem' }}>Save</button>
      <button type="button" onClick={onCancel} style={{ marginLeft: 8 }}>Cancel</button>
    </form>
  );
}
