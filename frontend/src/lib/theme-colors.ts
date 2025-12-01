/**
 * Paleta de colores centralizada
 * Mantener estos valores sincronizados con app/globals.css
 * Usar estos en lugar de colores hardcodeados
 */

export const BRAND_COLORS = {
  // Púrpura - Colores primarios
  primary: "#341A67",
  primaryHover: "#584291",

  // Cyan/Turquesa - Colores de acento
  accent: "#47B4D8",
  accentHover: "#3da5c7",

  // Opacidades útiles
  primaryLight: "rgba(52, 26, 103, 0.1)",
  accentLight: "rgba(71, 180, 216, 0.1)",
} as const

export const getColorVariable = (colorName: keyof typeof BRAND_COLORS): string => {
  return `var(--brand-${colorName.replace(/([A-Z])/g, "-$1").toLowerCase()})`
}
