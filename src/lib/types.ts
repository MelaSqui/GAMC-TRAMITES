export type Unit = {
  id: number | string;
  name: string;

  // Texto
  description?: string | null;

  // Contacto (responsable)
  contact?: string | null;

  // Ubicación y teléfonos
  address?: string | null;
  phones?: string | null;

  // Web e imagen
  website?: string | null;
  cover_url?: string | null;

  // Nivel administrativo opcional
  nivel?: string | null;
};


export type Tramite = {
  id: number;
  unit_id: number;
  unit?: Unit;
  code?: string | null;
  title: string;
  description?: string | null;
  requirements_html?: string | null;
  steps_html?: string | null;
  normativas_html?: string | null;  // si decides mostrarlo después
  keywords?: string | null;
  estimated_time?: string | null;
  cost?: number | null;
};
