import { api } from './apiClient';

export const forumApi = {
  listBySession: (session) => api(`/forum/session/${session}`),
  create: (data) => api('/forum', { method: 'POST', body: data }),
};
