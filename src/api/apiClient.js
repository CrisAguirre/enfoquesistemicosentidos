import { API_URL } from '../config';

const BASE_URL = `${API_URL}/api`;

export function getToken() {
  return localStorage.getItem('token');
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function api(path, { method = 'GET', body } = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // Response wasn't JSON, keep data as null
  }

  if (!res.ok) {
    const error = new Error(data?.error || 'Error en la solicitud');
    error.status = res.status;
    throw error;
  }

  return data;
}

export default api;
