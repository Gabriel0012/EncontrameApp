import type { BrandColors, ColorSchemeName } from '@/constants/brand';

/** Regra no formato da Maps JavaScript API / react-native-maps `customMapStyle`. */
export type MapStyleRule = {
  featureType?: string;
  elementType?: string;
  stylers: Record<string, string | number>[];
};

type Rgb = { r: number; g: number; b: number };

function parseHex(color: string): Rgb | null {
  const match = /^#([0-9a-fA-F]{6})$/.exec(color);
  if (!match) {
    return null;
  }

  const raw = match[1];
  return {
    r: Number.parseInt(raw.slice(0, 2), 16),
    g: Number.parseInt(raw.slice(2, 4), 16),
    b: Number.parseInt(raw.slice(4, 6), 16),
  };
}

function toHex({ r, g, b }: Rgb): string {
  return `#${[r, g, b].map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;
}

export function hexToRgba(color: string, alpha: number): string {
  const parsed = parseHex(color);
  if (!parsed) {
    return color;
  }

  return `rgba(${parsed.r}, ${parsed.g}, ${parsed.b}, ${alpha})`;
}

/** Mistura `from` em direção a `toward` (0 = from, 1 = toward). */
function mixHex(from: string, toward: string, amount: number): string {
  const a = parseHex(from);
  const b = parseHex(toward);
  if (!a || !b) {
    return from;
  }

  const t = Math.min(1, Math.max(0, amount));
  return toHex({
    r: Math.round(a.r + (b.r - a.r) * t),
    g: Math.round(a.g + (b.g - a.g) * t),
    b: Math.round(a.b + (b.b - a.b) * t),
  });
}

/**
 * Mapa desaturado com contraste alto entre terreno, ruas e água.
 * A paleta só dá um toque; não precisa espelhar a UI.
 */
export function brandMapStyle(brand: BrandColors, scheme: ColorSchemeName): MapStyleRule[] {
  const isDark = scheme === 'dark';
  const land = isDark
    ? mixHex(brand.mapBackground, brand.navyDeep, 0.38)
    : mixHex(brand.mapBackground, brand.textDark, 0.22);
  const road = isDark
    ? mixHex(land, brand.textDark, 0.34)
    : mixHex(brand.white, brand.mapBackground, 0.05);
  const roadStroke = isDark
    ? mixHex(land, brand.navyDeep, 0.25)
    : mixHex(land, brand.textDark, 0.16);
  const localRoad = isDark ? mixHex(road, land, 0.18) : mixHex(road, land, 0.08);
  const highway = isDark
    ? mixHex(road, brand.blue, 0.2)
    : mixHex(road, brand.textDark, 0.12);
  const water = mixHex(land, brand.blue, isDark ? 0.48 : 0.55);
  const park = mixHex(land, brand.blue, isDark ? 0.28 : 0.32);
  const labels = mixHex(brand.textMuted, brand.textDark, 0.55);
  const labelStroke = land;

  return [
    { elementType: 'geometry', stylers: [{ color: land }] },
    { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: labels }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: labelStroke }] },
    { featureType: 'administrative', elementType: 'geometry', stylers: [{ visibility: 'off' }] },
    { featureType: 'administrative.land_parcel', stylers: [{ visibility: 'off' }] },
    { featureType: 'administrative.neighborhood', stylers: [{ visibility: 'off' }] },
    { featureType: 'poi', stylers: [{ visibility: 'off' }] },
    {
      featureType: 'poi.park',
      elementType: 'geometry',
      stylers: [{ visibility: 'on' }, { color: park }],
    },
    { featureType: 'poi.park', elementType: 'labels', stylers: [{ visibility: 'off' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: localRoad }] },
    { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: roadStroke }] },
    { featureType: 'road', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
    { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: road }] },
    { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: highway }] },
    { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: roadStroke }] },
    { featureType: 'transit', stylers: [{ visibility: 'off' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: water }] },
    { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: labels }] },
  ];
}
