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
    surface: '#EFEBE3',
    onSurface: '#2C362F',
    surfaceSecondary: '#FDFBF7',
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
    surface: '#E7EEF3',
    onSurface: '#25333D',
    surfaceSecondary: '#FBFDFF',
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
    surface: '#EEEAF4',
    onSurface: '#2E2A3D',
    surfaceSecondary: '#FBFAFE',
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
    surface: '#F3EAD9',
    onSurface: '#3B2E1F',
    surfaceSecondary: '#FEFBF6',
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
    brandSoft: '#1C2622',
    onBrand: SOFIA_ON_BRAND,
    surface: '#0C100E',
    onSurface: '#E8EDE9',
    surfaceSecondary: '#181E1B',
    onSurfaceSecondary: '#C5D0C8',
    bubbleUser: '#3A342C',
    bubbleSofia: '#1C2622',
    border: '#3A4641',
    muted: '#8A9A8E',
    error: SOFIA_ERROR,
    success: '#8AA894',
    gradient: ['#1C2622', '#181E1B'],
  },
  blue: {
    id: 'blue',
    name: 'Azul sereno',
    brand: '#7AA3BB',
    brandStrong: '#5F8AA6',
    brandSoft: '#1A242C',
    onBrand: SOFIA_ON_BRAND,
    surface: '#0A0E11',
    onSurface: '#E4EDF2',
    surfaceSecondary: '#151B20',
    onSurfaceSecondary: '#B7C9D4',
    bubbleUser: '#3A342C',
    bubbleSofia: '#1A242C',
    border: '#3A4A54',
    muted: '#7F97A8',
    error: SOFIA_ERROR,
    success: '#6A8A74',
    gradient: ['#1A242C', '#151B20'],
  },
  lavender: {
    id: 'lavender',
    name: 'Lavanda suave',
    brand: '#A598BD',
    brandStrong: '#8A7BA6',
    brandSoft: '#1F1B28',
    onBrand: SOFIA_ON_BRAND,
    surface: '#0C0B10',
    onSurface: '#ECE8F4',
    surfaceSecondary: '#17151F',
    onSurfaceSecondary: '#C9C2D8',
    bubbleUser: '#322E3C',
    bubbleSofia: '#1F1B28',
    border: '#3E3950',
    muted: '#8B84A0',
    error: SOFIA_ERROR,
    success: '#6A8A74',
    gradient: ['#1F1B28', '#17151F'],
  },
  sand: {
    id: 'sand',
    name: 'Areia quente',
    brand: '#C9A074',
    brandStrong: '#B5895A',
    brandSoft: '#221C16',
    onBrand: SOFIA_ON_BRAND,
    surface: '#0C0A08',
    onSurface: '#F3EBE0',
    surfaceSecondary: '#181410',
    onSurfaceSecondary: '#D4C4AE',
    bubbleUser: '#3A3226',
    bubbleSofia: '#221C16',
    border: '#4A3F30',
    muted: '#A08765',
    error: SOFIA_ERROR,
    success: '#C9A074',
    gradient: ['#221C16', '#181410'],
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
    mapBackground: palette.brandSoft,
    mapStroke: palette.border,
    error: palette.error,
    avatarBackground: palette.brandSoft,
    avatarIcon: palette.muted,
    cardInfo: palette.surfaceSecondary,
    chatBubbleAI: palette.bubbleSofia,
    chatBubbleUser: palette.bubbleUser,
    onChatBubbleUser: palette.onSurface,
    onPrimary: palette.onBrand,
  };
}
