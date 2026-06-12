const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';
const API_BASE = import.meta.env.VITE_API_URL ?? '/api';

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  if (USE_MOCK) {
    throw new Error('MOCK_MODE');
  }
  const request = () => fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    credentials: 'include',
  });

  let res = await request();
  if (res.status === 401 && path !== '/auth/refresh') {
    const refresh = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    if (refresh.ok) {
      res = await request();
    } else {
      window.location.assign('/login?session=expired');
      throw new Error('SESSION_EXPIRED');
    }
  }

  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
}

export { USE_MOCK };
