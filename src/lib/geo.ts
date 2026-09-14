/** Raio padrão do mapa de pessoas próximas, alinhado à API. */
export const DEFAULT_NEARBY_RADIUS_KM = 50;

/** Distância em km entre dois pontos (Haversine). */
export function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const toRad = (degrees: number) => (degrees * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Reduz jitter do GPS (~1 km) para não refazer o nearby a cada poucos metros. */
export function snapNearbyCoord(value: number): number {
  return Math.round(value * 100) / 100;
}
