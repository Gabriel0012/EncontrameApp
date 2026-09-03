import type { BrandColors, ColorSchemeName } from '@/constants/brand';

export type SofiaPaletteId = 'green' | 'blue' | 'lavender' | 'sand';

export type SofiaPalette = {
  id: SofiaPaletteId;
  name: string;
  brand: string;
  brandStrong: string;
  brandSoft: string;
  onBrand: string;
  surface: string;
  onSurface: string;
  surfaceSecondary: string;
  onSurfaceSecondary: string;
  bubbleUser: string;
  bubbleSofia: string;
  border: string;
  muted: string;
  error: string;
  success: string;
  gradient: [string, string];
};

const SOFIA_ERROR = '#CD7B72';
const SOFIA_ON_BRAND = '#FFFFFF';

const sofiaLight: Record<SofiaPaletteId, SofiaPalette> = {
  green: {
    id: 'green',
    name: 'Verde acolhedor',
    brand: '#6A8A74',
    brandStrong: '#4E6B58',
    brandSoft: '#DCE4DF',
    onBrand: SOFIA_ON_BRAND,
    surface: '#FDFBF7',
    onSurface: '#2C362F',
    surfaceSecondary: '#F4EFE6',
    onSurfaceSecondary: '#38453B',
    bubbleUser: '#F0E9DA',
    bubbleSofia: '#DCE4DF',
    border: '#E1DBD0',
    muted: '#8A9A8E',
    error: SOFIA_ERROR,
    success: '#6A8A74',
    gradient: ['#DCE4DF', '#F4EFE6'],
  },
  blue: {
    id: 'blue',
    name: 'Azul sereno',
    brand: '#5F8AA6',
    brandStrong: '#3F6A85',
    brandSoft: '#D9E5EE',
    onBrand: SOFIA_ON_BRAND,
    surface: '#FBFDFE',
    onSurface: '#25333D',
    surfaceSecondary: '#E9F1F6',
    onSurfaceSecondary: '#334856',
    bubbleUser: '#EAE4D7',
    bubbleSofia: '#D9E5EE',
    border: '#D3DEE6',
    muted: '#7F97A8',
    error: SOFIA_ERROR,
    success: '#6A8A74',
    gradient: ['#D9E5EE', '#F0F6FA'],
  },
  lavender: {
    id: 'lavender',
    name: 'Lavanda suave',
    brand: '#8A7BA6',
    brandStrong: '#665A80',
    brandSoft: '#E4DEEE',
    onBrand: SOFIA_ON_BRAND,
    surface: '#FBFAFE',
    onSurface: '#2E2A3D',
    surfaceSecondary: '#EDE9F5',
    onSurfaceSecondary: '#3E3854',
    bubbleUser: '#EFEAF7',
    bubbleSofia: '#E4DEEE',
    border: '#DDD5EA',
    muted: '#8B84A0',
    error: SOFIA_ERROR,
    success: '#6A8A74',
    gradient: ['#E4DEEE', '#F1EDF8'],
  },
  sand: {
    id: 'sand',
    name: 'Areia quente',
    brand: '#B5895A',
    brandStrong: '#8C663D',
    brandSoft: '#EFE1CE',
    onBrand: SOFIA_ON_BRAND,
    surface: '#FEFBF6',
    onSurface: '#3B2E1F',
    surfaceSecondary: '#F6EDDD',
    onSurfaceSecondary: '#4C3B27',
    bubbleUser: '#F0E4D2',
    bubbleSofia: '#EFE1CE',
    border: '#E6D8BF',
    muted: '#A08765',
    error: SOFIA_ERROR,
    success: '#6A8A74',
    gradient: ['#EFE1CE', '#F8EFDD'],
  },
};

/** Variantes escuras derivadas das paletas claras originais da Sofia. */
const sofiaDark: Record<SofiaPaletteId, SofiaPalette> = {
  green: {
    id: 'green',
    name: 'Verde acolhedor',
    brand: '#8AA894',
    brandStrong: '#6A8A74',
    brandSoft: '#2A3530',
    onBrand: SOFIA_ON_BRAND,
    surface: '#1A1E1C',
    onSurface: '#E8EDE9',
    surfaceSecondary: '#242A27',
    onSurfaceSecondary: '#C5D0C8',
    bubbleUser: '#3A342C',
    bubbleSofia: '#2A3530',
    border: '#3A4440',
    muted: '#8A9A8E',
    error: SOFIA_ERROR,
    success: '#8AA894',
    gradient: ['#2A3530', '#242A27'],
  },
  blue: {
    id: 'blue',
    name: 'Azul sereno',
    brand: '#7AA3BB',
    brandStrong: '#5F8AA6',
    brandSoft: '#243038',
    onBrand: SOFIA_ON_BRAND,
    surface: '#171C20',
    onSurface: '#E4EDF2',
    surfaceSecondary: '#222A30',
    onSurfaceSecondary: '#B7C9D4',
    bubbleUser: '#3A342C',
    bubbleSofia: '#243038',
    border: '#334048',
    muted: '#7F97A8',
    error: SOFIA_ERROR,
    success: '#6A8A74',
    gradient: ['#243038', '#222A30'],
  },
  lavender: {
    id: 'lavender',
    name: 'Lavanda suave',
    brand: '#A598BD',
    brandStrong: '#8A7BA6',
    brandSoft: '#2C2838',
    onBrand: SOFIA_ON_BRAND,
    surface: '#1B1922',
    onSurface: '#ECE8F4',
    surfaceSecondary: '#272433',
    onSurfaceSecondary: '#C9C2D8',
    bubbleUser: '#322E3C',
    bubbleSofia: '#2C2838',
    border: '#3E3950',
    muted: '#8B84A0',
    error: SOFIA_ERROR,
    success: '#6A8A74',
    gradient: ['#2C2838', '#272433'],
  },
  sand: {
    id: 'sand',
    name: 'Areia quente',
    brand: '#C9A074',
    brandStrong: '#B5895A',
    brandSoft: '#322A20',
    onBrand: SOFIA_ON_BRAND,
    surface: '#1C1814',
    onSurface: '#F3EBE0',
    surfaceSecondary: '#2A231A',
    onSurfaceSecondary: '#D4C4AE',
    bubbleUser: '#3A3226',
    bubbleSofia: '#322A20',
    border: '#4A3F30',
    muted: '#A08765',
    error: SOFIA_ERROR,
    success: '#C9A074',
    gradient: ['#322A20', '#2A231A'],
  },
};

export const sofiaPaletteOrder: SofiaPaletteId[] = ['green', 'blue', 'lavender', 'sand'];

export function isSofiaPaletteId(value: string | null | undefined): value is SofiaPaletteId {
  return value === 'green' || value === 'blue' || value === 'lavender' || value === 'sand';
}

export function getSofiaPalette(id: SofiaPaletteId, scheme: ColorSchemeName): SofiaPalette {
  return scheme === 'dark' ? sofiaDark[id] : sofiaLight[id];
}

function hexToRgba(hex: string, alpha: number): string {
  const raw = hex.replace('#', '');
  const r = Number.parseInt(raw.slice(0, 2), 16);
  const g = Number.parseInt(raw.slice(2, 4), 16);
  const b = Number.parseInt(raw.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Sobrepõe a paleta Sofia nos tokens de ação, fundo, texto e chat. */
export function applySofiaPaletteToBrand(base: BrandColors, palette: SofiaPalette): BrandColors {
  return {
    ...base,
    blue: palette.brand,
    blueDark: palette.brandStrong,
    blueClear: hexToRgba(palette.brand, 0),
    white: palette.surface,
    surface: palette.surfaceSecondary,
    fieldBackground: palette.surface,
    fieldBorder: palette.border,
    label: palette.muted,
    placeholder: palette.muted,
    textDark: palette.onSurface,
    textMuted: palette.onSurfaceSecondary,
    divider: palette.border,
    error: palette.error,
    avatarBackground: palette.brandSoft,
    avatarIcon: palette.muted,
    chatBubbleAI: palette.bubbleSofia,
    chatBubbleUser: palette.bubbleUser,
    onChatBubbleUser: palette.onSurface,
    onPrimary: palette.onBrand,
  };
}
