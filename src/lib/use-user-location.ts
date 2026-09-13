import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

export type UserLocation = {
  latitude: number;
  longitude: number;
  accuracy: number | null;
};

/**
 * Pede permissão de localização (web e nativo) e acompanha a posição atual.
 */
export function useUserLocation() {
  const [location, setLocation] = useState<UserLocation | null>(null);

  useEffect(() => {
    let cancelled = false;
    let subscription: Location.LocationSubscription | null = null;

    const applyPosition = (coords: Location.LocationObjectCoords) => {
      if (cancelled) {
        return;
      }

      setLocation({
        latitude: coords.latitude,
        longitude: coords.longitude,
        accuracy: coords.accuracy,
      });
    };

    void (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (cancelled || status !== 'granted') {
        return;
      }

      const current = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      applyPosition(current.coords);

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          distanceInterval: 8,
          timeInterval: 4000,
        },
        (update) => applyPosition(update.coords),
      );
    })();

    return () => {
      cancelled = true;
      subscription?.remove();
    };
  }, []);

  return location;
}

/** Raio do círculo de precisão, limitado para não cobrir a cidade inteira. */
export function userAccuracyRadius(accuracy: number | null): number {
  return Math.min(Math.max(accuracy ?? 35, 25), 180);
}
