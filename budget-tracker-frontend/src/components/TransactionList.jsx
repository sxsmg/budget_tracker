import React, { useState, useEffect } from 'react';
import { listTransactions, deleteTransaction } from '../api/transactions';

export default function TransactionList({ onEdit }) {
  const [txs, setTxs] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    date__gte: '', date__lte: '', amount__gte: '', amount__lte: ''
  });

  useEffect(() => {
    fetchPage();
  }, [page, filters]);

  const fetchPage = () => {
    listTransactions({ page, page_size: 10, filters })
      .then(res => {
        setTxs(res.data.results);
        setCount(res.data.count);
      })
      .catch(console.error);
  };

  const handleDelete = id => {
    if (!window.confirm('Delete this transaction?')) return;
    deleteTransaction(id).then(fetchPage);
  };

  const handleFilterChange = e => {
    const { name, value } = e.target;
    setFilters(f => ({ ...f, [name]: value }));
    setPage(1);
  };

  const totalPages = Math.ceil(count / 10) || 1;

  return (
    <div>
      <h3>Filters</h3>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <input type="date" name="date__gte" value={filters.date__gte} onChange={handleFilterChange} />
        <input type="date" name="date__lte" value={filters.date__lte} onChange={handleFilterChange} />
        <input type="number" name="amount__gte" value={filters.amount__gte} onChange={handleFilterChange} placeholder="Min amount" />
        <input type="number" name="amount__lte" value={filters.amount__lte} onChange={handleFilterChange} placeholder="Max amount" />
        <button onClick={() => setFilters({ date__gte:'', date__lte:'', amount__gte:'', amount__lte:'' })}>
          Clear
        </button>
      </div>

      <table border="1" width="100%" style={{ marginTop: '1rem' }}>
        <thead>
          <tr><th>Date</th><th>Category</th><th>Amount</th><th>Description</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {txs.map(t => (
            <tr key={t.id}>
              <td>{t.date}</td>
              <td>{t.category}</td>
              <td>₹{t.amount}</td>
              <td>{t.description}</td>
              <td>
                <button onClick={() => onEdit(t)}>Edit</button>
                <button onClick={() => handleDelete(t.id)} style={{ marginLeft: 4 }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {txs.length === 0 && (
            <tr><td colSpan="5" style={{ textAlign: 'center' }}>No transactions</td></tr>
          )}
        </tbody>
      </table>

      <div style={{ marginTop: '1rem' }}>
        <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page<=1}>
          « Prev
        </button>
        <span style={{ margin: '0 1rem' }}>Page {page} of {totalPages}</span>
        <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page>=totalPages}>
          Next »
        </button>
      </div>
    </div>
  );
}
