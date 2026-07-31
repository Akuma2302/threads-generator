const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok || body.success === false) {
    throw new Error(body.error || `Request failed with status ${res.status}`);
  }

  return body.data;
}

export function generateThreadContent(payload) {
  return request('/threads/generate', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
