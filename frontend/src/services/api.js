// Uses relative paths → Vite dev proxy forwards to http://localhost:8080
// Production: set VITE_API_URL env variable or configure nginx reverse proxy
const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const handleResponse = async (res) => {
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  return res.json();
};

export const sessionAPI = {
  create: (data) => fetch(`${BASE_URL}/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse),

  getAll: () => fetch(`${BASE_URL}/sessions`).then(r => r.ok ? r.json() : []),

  getActive: () => fetch(`${BASE_URL}/sessions/active`).then(r => r.ok ? r.json() : []),

  getById: (id) => fetch(`${BASE_URL}/sessions/${id}`).then(r => r.ok ? r.json() : null),

  updateElements: (id, elementsJson) => fetch(`${BASE_URL}/sessions/${id}/elements`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ elementsJson }),
  }).then(r => r.ok ? r.json() : null),

  delete: (id) => fetch(`${BASE_URL}/sessions/${id}`, { method: 'DELETE' }),

  getUsers: (id) => fetch(`${BASE_URL}/sessions/${id}/users`).then(r => r.ok ? r.json() : { count: 0, users: {} }),

  getAnalytics: () => fetch(`${BASE_URL}/sessions/analytics`).then(r => r.ok ? r.json() : { totalSessions: 0, activeSessions: 0, totalActiveUsers: 0 }),

  toggle: (id, active) => fetch(`${BASE_URL}/sessions/${id}/toggle`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ active }),
  }).then(r => r.ok ? r.json() : null),
};

export const chatAPI = {
  getHistory: (sessionId) => fetch(`${BASE_URL}/chat/${sessionId}`).then(r => r.ok ? r.json() : []),
};

