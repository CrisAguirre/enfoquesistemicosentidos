import { api } from './apiClient';

export const sessionApi = {
  list: () => api('/sessions'),
};
