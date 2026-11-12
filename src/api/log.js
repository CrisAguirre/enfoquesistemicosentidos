import { api } from './apiClient';

export const logApi = {
  create: (data) => api('/logs', { method: 'POST', body: data }),
  listMine: () => api('/logs/mine'),
};
