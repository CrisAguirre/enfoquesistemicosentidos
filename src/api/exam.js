import { api } from './apiClient';

export const examApi = {
  getBySimulation: (id) => api(`/exams/${id}`),
  submit: (id, data) => api(`/exams/${id}/submit`, { method: 'POST', body: data }),
  getMine: () => api('/exams/mine'),
};
