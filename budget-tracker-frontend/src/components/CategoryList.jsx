// src/components/CategoryList.jsx
import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function CategoryList({ onEdit }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get('/api/categories/').then(res => {
    setCategories(res.data.results);
});
  }, []);

  const handleDelete = id => {
    if (!confirm('Delete this category?')) return;
    api.delete(`/api/categories/${id}/`).then(() => {
      setCategories(categories.filter(c => c.id !== id));
    });
  };

  return (
    <div className="card">
      <h2>Categories</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(cat => (
            <tr key={cat.id}>
              <td>{cat.name}</td>
              <td>{cat.type === 'income' ? 'Income' : 'Expense'}</td>
              <td className="text-right">
                <button className="btn sm" onClick={() => onEdit(cat)}>Edit</button>{' '}
                <button className="btn sm" onClick={() => handleDelete(cat.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
