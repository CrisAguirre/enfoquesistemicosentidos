import { api } from './apiClient';

// Usuarios (admin).
export const userApi = {
  list: () => api('/users'),
  getById: (id) => api(`/users/${id}`),
};
