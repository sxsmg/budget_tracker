// src/pages/Transactions.jsx
import React, { useState } from 'react';
import TransactionList from '../components/TransactionList';
import TransactionForm from '../components/TransactionForm';
import {
  createTransaction,
  updateTransaction
} from '../api/transactions';
import { Navigate, useNavigate } from 'react-router-dom';

export default function Transactions() {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  // use `showForm` as a key to force list to re-fetch when toggled
  const listKey = showForm;

  const handleEdit = tx => {
    setEditing(tx);
    setShowForm(true);
  };

  const handleSave = data => {
    const action = editing
      ? updateTransaction(editing.id, data)
      : createTransaction(data);

    action
      .then(() => {
        setShowForm(false);
        setEditing(null);
      })
      .catch(console.error);
  };

  return (
    <div className="transaction-containder" style={{ maxWidth: 800, margin: '2rem auto' }}>
      <h1>Transactions</h1>

      {showForm ? (
        <TransactionForm
          initial={editing || {}}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
        />
      ) : (
        <>
          <button className="btn btn-add" onClick={() => setShowForm(true)}>+ Add Transaction</button>
          <button className="btn btn-add" onClick={() => navigate("/categories")}>+ Add Categories</button>
          <TransactionList className="transaction-table" key={listKey} onEdit={handleEdit} />
        </>
      )}
    </div>
  );
}
