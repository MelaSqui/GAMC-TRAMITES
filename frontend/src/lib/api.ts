// src/lib/api.ts
import type { Unit, Tramite, PaginatedResponse } from './types';

const BASE =
  (import.meta.env.VITE_API_BASE as string)?.replace(/\/$/, '') ||
  'http://127.0.0.1:8000/api/v1/public';

const HAS_SUMMARY = String(import.meta.env.VITE_API_HAS_SUMMARY ?? 'false') === 'true';

/* ----------------------------- Helpers ----------------------------- */
async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    credentials: 'omit',
    headers: { Accept: 'application/json' },
    ...init,
  });

  if (!res.ok) {
    let body = '';
    try { body = await res.text(); } catch {}
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

/* ------------------------------- API ------------------------------- */

/** Resumen para el hero: { tramites, units } */
export async function fetchSummary(): Promise<{ tramites: number; units: number }> {
  if (HAS_SUMMARY) {
    try {
      const j = await fetchJson<any>(`${BASE}/summary`);
      const data = unwrapItem<{ tramites: number; units: number }>(j);
      if (typeof data?.tramites === 'number' && typeof data?.units === 'number') {
        return data;
      }
    } catch {
      // caemos al plan B
    }
  }

  try {
    const [t, u] = await Promise.all([
      fetchJson<any>(`${BASE}/tramites`),
      fetchJson<any>(`${BASE}/units`),
    ]);
    const tramites = unwrapList<Tramite>(t).length;
    const units = unwrapList<Unit>(u).length;
    return { tramites, units };
  } catch (e) {
    console.error('fetchSummary fallback error:', e);
    return { tramites: 0, units: 0 };
  }
}

/** Lista global de trámites (sin paginación) */
export async function fetchTramites(params?: {
  q?: string;
  unitId?: number | string;
}): Promise<Tramite[]> {
  const url = `${BASE}/tramites${qs({
    q: params?.q,
    unit: params?.unitId as any,
  })}`;
  const json = await fetchJson<any>(url);
  return unwrapList<Tramite>(json);
}

/** ✅ NUEVO: Lista de trámites con paginación */
export async function fetchTramitesPaginated(params?: {
  q?: string;
  unitId?: number | string;
  page?: number;
  perPage?: number;
}): Promise<PaginatedResponse<Tramite>> {
  const url = `${BASE}/tramites${qs({
    q: params?.q,
    unit: params?.unitId as any,
    page: params?.page,
    per_page: params?.perPage,
  })}`;
  const json = await fetchJson<any>(url);
  
  // Si tiene meta, es paginado
  if (json.meta) {
    return {
      data: unwrapList<Tramite>(json),
      meta: json.meta,
    };
  }
  
  // Si no tiene meta, simular respuesta paginada
  const data = unwrapList<Tramite>(json);
  return {
    data,
    meta: {
      current_page: 1,
      last_page: 1,
      per_page: data.length,
      total: data.length,
    },
  };
}

/** ✅ NUEVO: Lista de trámites favoritos/destacados */
export async function fetchFeaturedTramites(): Promise<Tramite[]> {
  const url = `${BASE}/tramites/featured`;
  const json = await fetchJson<any>(url);
  return unwrapList<Tramite>(json);
}

/** Unidades */
export async function getUnits(q?: string): Promise<Unit[]> {
  const url = `${BASE}/units${qs({ q })}`;
  const json = await fetchJson<any>(url);
  return unwrapList<Unit>(json);
}

export async function getUnit(id: number | string): Promise<Unit> {
  const json = await fetchJson<any>(`${BASE}/units/${id}`);
  return unwrapItem<Unit>(json);
}

/** Trámites por unidad (usa el endpoint dedicado) */
export async function listTramitesByUnit(
  unitId: number | string,
  q?: string
): Promise<{ unit?: Unit; items: Tramite[] }> {
  const url = `${BASE}/units/${unitId}/tramites${qs({ q })}`;
  const json = await fetchJson<any>(url);
  return {
    unit: json.unit ? unwrapItem<Unit>(json.unit) : undefined,
    items: unwrapList<Tramite>(json.items ?? json.data),
  };
}

/** Detalle de trámite */
export async function getTramite(id: number | string): Promise<Tramite> {
  const json = await fetchJson<any>(`${BASE}/tramites/${id}`);
  return unwrapItem<Tramite>(json);
}

/* -------------------------- Export por defecto --------------------- */
const API = {
  fetchSummary,
  fetchTramites,
  fetchTramitesPaginated,
  fetchFeaturedTramites,
  getUnits,
  getUnit,
  listTramitesByUnit,
  getTramite,
};

export default API;
export type { Unit, Tramite, PaginatedResponse };