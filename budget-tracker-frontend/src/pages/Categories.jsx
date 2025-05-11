// src/pages/Categories.jsx
import { useState } from 'react';
import CategoryList from '../components/CategoryList';
import CategoryForm from '../components/CategoryForm';

export default function Categories() {
  const [editing, setEditing] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSaved = () => {
    setEditing(null);
    setRefreshKey(k => k + 1);
  };

  return (
    <div className="container">
      <CategoryForm
        key={editing?.id ?? 'new'} 
        editing={editing}
        onSaved={handleSaved}
        onCancel={() => setEditing(null)}
      />
      <CategoryList
        key={refreshKey}
        onEdit={cat => setEditing(cat)}
      />
    </div>
  );
}
