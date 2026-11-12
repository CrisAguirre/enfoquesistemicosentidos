import { api } from './apiClient';

// Simulaciones (contenido a construir desde cero).
export const simulationApi = {
  list: () => api('/simulations'),
  getById: (id) => api(`/simulations/${id}`),
};
