import type { Unit } from './types';

/** Obtiene la primera key no vacía que exista en el objeto. */
function pick(obj: any, keys: string[]) {
  for (const k of keys) {
    const v = obj?.[k];
    if (v !== undefined && v !== null && String(v).trim() !== '') {
      return String(v);
    }
  }
  return undefined;
}

export function normalizeUnit(raw: any): Unit {
  if (!raw) return { id: 0 as any, name: '' };

  const id =
    raw.id ?? raw.uuid ?? raw.slug ?? raw._id ?? 0;

  const name =
    raw.name ?? raw.nombre ?? raw.titulo ?? '';

  const description = pick(raw, ['description', 'descripcion', 'detalle']);

  // Responsable / Contacto
  const contact = pick(raw, ['contact', 'responsable', 'contacto']);

  // Dirección
  const address = pick(raw, ['address', 'direccion', 'ubicacion']);

  // Teléfonos
  const phones = pick(raw, ['phones', 'telefonos', 'telefono']);

  // Web
  const website = pick(raw, ['website', 'pagina_web', 'web', 'url']);

  // Portada / imagen
  const cover_url = pick(raw, ['cover_url', 'cover', 'portada', 'image', 'imagen', 'coverPath']);

  const nivel = pick(raw, ['level', 'nivel']);

  return { id, name, description, contact, address, phones, website, cover_url, nivel };
}
