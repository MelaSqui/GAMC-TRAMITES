// src/lib/types.ts
export type Unit = {
  id: number;
  name: string;
  code_prefix?: string;
  description?: string | null;
  tramites_count?: number;
};

export type Tramite = {
  id: number;
  unit_id: number;
  code: string;
  title: string;
  description: string;
  estimated_time?: string | null;
  cost?: number | null;
};
