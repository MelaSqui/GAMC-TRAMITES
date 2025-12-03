export type Unit = {
  id: number | string;
  name: string;
  code_prefix?: string | null;
  description?: string | null;
  contact?: string | null; // Alias para compatibilidad
  contact_name?: string | null; // Nombre real del backend
  address?: string | null;
  phones?: string[];
  whatsapp_phone?: string | null;
  website?: string | null; // Alias para compatibilidad
  website_url?: string | null; // Nombre real del backend
  cover_url?: string | null;
  nivel?: string | null;
  level?: string | null; // Nombre real del backend
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
  normativas_html?: string | null;
  keywords?: string | null;
  estimated_time?: string | null;
  cost?: number | null;
  is_active?: boolean;
  is_featured?: boolean;
};

// Respuesta paginada
export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};
