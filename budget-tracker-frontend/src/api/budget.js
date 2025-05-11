// src/api/budget.js
import api from './axios';

export function getBudgets({ month, year }) {
  return api.get('/api/budgets/', { params: { month, year } });
}

export function createBudget(data) {
  return api.post('/api/budgets/', data);
}

export function updateBudget(id, data) {
  return api.put(`/api/budgets/${id}/`, data);
}
