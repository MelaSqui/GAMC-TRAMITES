// src/lib/api.ts
import type { Unit, Tramite, Normativa } from './types';

const BASE =
  (import.meta.env.VITE_API_BASE as string)?.replace(/\/$/, '') ||
  'http://127.0.0.1:8000/api/v1/public';

// --- Helpers ---
async function fetchJson<T>(url: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(url, {
    // Para endpoints públicos no enviamos cookies/sesión:
    credentials: 'omit',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
    ...init,
  });

  if (!res.ok) {
    let body = '';
    try {
      body = await res.text();
    } catch {}
    throw new Error(`HTTP ${res.status} - ${body || res.statusText}`);
  }

  return (await res.json()) as T;
}

function unwrapList<T>(json: any): T[] {
  if (Array.isArray(json)) return json;
  if (Array.isArray(json?.data)) return json.data;
  if (Array.isArray(json?.items)) return json.items;
  return [];
}

function unwrapItem<T>(json: any): T {
  if (json?.data && !Array.isArray(json.data)) return json.data as T;
  return json as T;
}

function qs(params?: Record<string, string | number | undefined | null>) {
  if (!params) return '';
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && String(v).trim() !== ''
  );
  return entries.length ? `?${new URLSearchParams(entries as any).toString()}` : '';
}

// --- API ---
const API = {
  // Unidades
  async getUnits(q?: string): Promise<Unit[]> {
    const url = `${BASE}/units${qs({ q })}`;
    const json = await fetchJson<any>(url);
    return unwrapList<Unit>(json);
  },

  async getUnit(id: number | string): Promise<Unit> {
    const json = await fetchJson<any>(`${BASE}/units/${id}`);
    return unwrapItem<Unit>(json);
  },

  // Trámites por unidad
  async listTramitesByUnit(
    unitId: number | string,
    q?: string
  ): Promise<{ unit?: Unit; items: Tramite[] }> {
    const url = `${BASE}/units/${unitId}/tramites${qs({ q })}`;
    const json = await fetchJson<any>(url);
    return {
      unit: json.unit ? unwrapItem<Unit>(json.unit) : undefined,
      items: unwrapList<Tramite>(json.items ?? json.data),
    };
  },

  // Detalle de trámite
  async getTramite(id: number | string): Promise<Tramite> {
    const json = await fetchJson<any>(`${BASE}/tramites/${id}`);
    return unwrapItem<Tramite>(json);
  },

  // Alias si usas el nombre anterior en tu código
  listUnits(q?: string) {
    return API.getUnits(q);
  },
};

export default API;
export type { Unit, Tramite, Normativa };
