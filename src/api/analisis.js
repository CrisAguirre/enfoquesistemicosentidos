import { api } from './apiClient';

export const analisisApi = {
  listMine: () => api('/analisis/mine'),
  create: (data) => api('/analisis', { method: 'POST', body: data }),
};
