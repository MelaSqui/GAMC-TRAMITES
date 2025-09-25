// src/lib/api.ts
const BASE =
  import.meta.env.VITE_API_URL?.replace(/\/+$/, '') ??
  'http://127.0.0.1:8000/api/v1/public';

async function getJson<T>(url: string) {
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status} ${text}`.trim());
  }
  return (await res.json()) as T;
}

// Desenvuelve respuestas tipo { data: ... }
function unwrap<T = any>(res: any): T {
  if (Array.isArray(res)) return res as T;
  if (Array.isArray(res?.data)) return res.data as T;
  if (res?.data !== undefined) return res.data as T;
  return res as T;
}

export const API = {
  listUnits: () => getJson<any>(`${BASE}/units`).then(unwrap),
  getUnit: (id: string | number) =>
    getJson<any>(`${BASE}/units/${id}`).then(unwrap),

  listTramitesByUnit: (id: string | number, params?: { q?: string }) => {
    const qs = params?.q ? `?q=${encodeURIComponent(params.q)}` : '';
    return getJson<{ unit: any; items: any[] }>(
      `${BASE}/units/${id}/tramites${qs}`,
    ); // este ya viene sin 'data'
  },

  getTramite: (id: string | number) =>
    getJson<any>(`${BASE}/tramites/${id}`).then(unwrap),
};
