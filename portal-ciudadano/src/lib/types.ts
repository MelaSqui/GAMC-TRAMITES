// src/lib/types.ts

export interface Unit {
  id: number;
  name: string;
  code_prefix?: string | null;
  description?: string | null;

  // Campos “perfil” de la unidad (opcionales)
  level?: string | null;
  contact_name?: string | null;
  address?: string | null;
  phones?: string[] | null;
  internal_phone?: string | null;
  website_url?: string | null;
  cover_url?: string | null;

  tramites_count?: number;
}

export interface TramiteRequirement {
  item: string;
  detalle?: string | null;
  link?: string | null;
}

export interface TramiteStep {
  paso: number | string;
  detalle: string;
  link?: string | null;
}

export interface Normativa {
  id: number;
  title: string;
  link?: string | null;
}

export interface Tramite {
  id: number;
  unit_id: number;
  unit?: Unit;

  // Nota: puede venir null desde el backend
  code?: string | null;

  title: string;
  description?: string | null;
  estimated_time?: string | null;
  cost?: number | null;

  requirements?: TramiteRequirement[] | null;
  steps?: TramiteStep[] | null;
  normativas?: Normativa[];
}
