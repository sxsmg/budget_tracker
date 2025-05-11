import api from './axios';

export function listTransactions({ page=1, page_size=10, filters={} } = {}) {
  return api.get('/api/transactions/', { params: { page, page_size, ...filters } });
}

export function createTransaction(data) {
  return api.post('/api/transactions/', data);
}

export function updateTransaction(id, data) {
  return api.put(`/api/transactions/${id}/`, data);
}

export function deleteTransaction(id) {
  return api.delete(`/api/transactions/${id}/`);
}
