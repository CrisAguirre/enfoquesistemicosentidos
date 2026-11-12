import { api } from './apiClient';

// Progreso del estudiante (contenido a construir desde cero).
export const progressApi = {
  getMine: () => api('/progress/mine'),
  save: (data) => api('/progress', { method: 'POST', body: data }),
};
