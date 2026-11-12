import { api } from './apiClient';

export const authApi = {
  login: (data) => api('/auth/login', { method: 'POST', body: data }),
  profile: () => api('/auth/profile'),
};
