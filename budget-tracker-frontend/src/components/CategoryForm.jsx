// src/components/CategoryForm.jsx
import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function CategoryForm({ editing, onSaved, onCancel }) {
  const [name, setName] = useState(editing?.name || '');
  const [type, setType] = useState(editing?.type || 'expense');

  useEffect(() => {
    if (editing) {
      setName(editing.name);
      setType(editing.type);
    }
  }, [editing]);

  const handleSubmit = e => {
    e.preventDefault();
    const payload = { name, type };
    const request = editing
      ? api.put(`/api/categories/${editing.id}/`, payload)
      : api.post('/api/categories/', payload);

    request.then(res => onSaved(res.data));
  };

  return (
    <div className="card">
      <h2>{editing ? 'Edit' : 'Add'} Category</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Type</label>
          <select value={type} onChange={e => setType(e.target.value)}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div className="form-inline">
          <button type="submit" className="btn">
            {editing ? 'Update' : 'Create'}
          </button>
          {editing && (
            <button type="button" className="btn sm" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
