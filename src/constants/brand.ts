/**
 * Identidade visual do Encontra-me — paletas light/dark.
 * Hex só aqui (e espelho em global.css). Na UI use `useBrand()`.
 */

const BrandLight = {
  navy: '#0B2442',
  navyDeep: '#081B33',
  orange: '#F5822E',
  orangeDark: '#E06F1E',
  cream: '#F4E4C1',
  blue: '#1B4DB8',
  blueDark: '#163F97',
  /** Fundo de tela / botão outline */
  white: '#FFFFFF',
  /** Superfície elevada (menus, cards interativos) */
  surface: '#FFFFFF',
  fieldBackground: '#FFFFFF',
  fieldBorder: '#DCDCE1',
  label: '#8A8A92',
  placeholder: '#B4B4BC',
  textDark: '#1F2430',
  textMuted: '#60646C',
  divider: '#EDEDF1',
  mapBackground: '#E7ECF2',
  mapStroke: '#CBD5E1',
  pin: '#E23B3B',
  avatarBackground: '#C2C7CE',
  avatarIcon: '#E6E9ED',
  chatBubbleAI: '#ECEBF6',
  chatBubbleUser: '#1B4DB8',
  /** Azul transparente para interpolateColor (não usar `transparent`) */
  blueClear: 'rgba(27, 77, 184, 0)',
  /** Ícone / texto sobre azul ou pin (sempre claro) */
  onPrimary: '#FFFFFF',
  /** Overlay de modal */
  overlay: 'rgba(11, 36, 66, 0.45)',
} as const;

const BrandDark = {
  navy: '#0B2442',
  navyDeep: '#081B33',
  orange: '#F5822E',
  orangeDark: '#E06F1E',
  cream: '#F4E4C1',
  blue: '#3264D1',
  blueDark: '#4073E2',
  white: '#22262B',
  surface: '#2B3036',
  fieldBackground: '#30363D',
  fieldBorder: '#464D56',
  label: '#B4BAC3',
  placeholder: '#858C96',
  textDark: '#F1F3F5',
  textMuted: '#B4BAC3',
  divider: '#464D56',
  mapBackground: '#2B3036',
  mapStroke: '#464D56',
  pin: '#E23B3B',
  avatarBackground: '#3A4149',
  avatarIcon: '#858C96',
  chatBubbleAI: '#2B3036',
  chatBubbleUser: '#3264D1',
  blueClear: 'rgba(50, 100, 209, 0)',
  onPrimary: '#FFFFFF',
  overlay: 'rgba(0, 0, 0, 0.55)',
} as const;

export const BrandPalettes = {
  light: BrandLight,
  dark: BrandDark,
} as const;

export type ColorSchemeName = keyof typeof BrandPalettes;
export type BrandColors = (typeof BrandPalettes)[ColorSchemeName];

/** Alias da paleta light (fallback). Preferir `useBrand()` na UI. */
export const Brand: BrandColors = BrandLight;

export const Radius = {
  xs: 3,
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
} as const;
