import { api } from './apiClient';

export const evidenciaApi = {
  listMine: () => api('/evidencias/mine'),
  create: (data) => api('/evidencias', { method: 'POST', body: data }),
};
