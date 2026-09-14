import * as Location from 'expo-location';
import { Platform } from 'react-native';

import { env } from '@/lib/env';
import {
  loadGoogleMapsJs,
  loadGooglePlaces,
  type GoogleGeocoderResult,
} from '@/lib/google-maps-web';

export type GeoResult = {
  latitude: number;
  longitude: number;
};

export type AddressSuggestion = {
  id: string;
  label: string;
  placeId?: string;
  latitude?: number;
  longitude?: number;
};

/** Converte um endereço em coordenadas. Sem resultado, retorna null. */
export async function geocodeAddress(address: string): Promise<GeoResult | null> {
  const results = await suggestFromGeocoder(address);
  const first = results[0];
  if (!first || first.latitude == null || first.longitude == null) {
    return null;
  }

  return { latitude: first.latitude, longitude: first.longitude };
}

/** Sugestões enquanto o usuário pesquisa o endereço. */
export async function suggestAddresses(query: string): Promise<AddressSuggestion[]> {
  const input = query.trim();
  if (input.length < 3) {
    return [];
  }

  if (Platform.OS === 'web') {
    const places = await suggestPlacesWeb(input);
    if (places.length > 0) {
      return places;
    }
  }

  return suggestFromGeocoder(input);
}

/** Resolve a opção escolhida para lat/lng. */
export async function resolveAddressSuggestion(
  suggestion: AddressSuggestion,
): Promise<(GeoResult & { label: string }) | null> {
  if (suggestion.latitude != null && suggestion.longitude != null) {
    return {
      label: suggestion.label,
      latitude: suggestion.latitude,
      longitude: suggestion.longitude,
    };
  }

  if (suggestion.placeId && Platform.OS === 'web') {
    const results = await geocodeWeb({ placeId: suggestion.placeId });
    const first = results[0];
    if (!first) {
      return null;
    }

    return {
      label: first.formatted_address || suggestion.label,
      latitude: first.geometry.location.lat(),
      longitude: first.geometry.location.lng(),
    };
  }

  return geocodeAddress(suggestion.label).then((point) =>
    point ? { ...point, label: suggestion.label } : null,
  );
}

/** Converte coordenadas em um endereço curto, quando possível. */
export async function reverseGeocode(latitude: number, longitude: number): Promise<string | null> {
  if (Platform.OS === 'web') {
    const results = await geocodeWeb({ location: { lat: latitude, lng: longitude } });
    return results[0]?.formatted_address ?? null;
  }

  const results = await Location.reverseGeocodeAsync({ latitude, longitude });
  const first = results[0];
  if (!first) {
    return null;
  }

  const parts = [first.street, first.streetNumber, first.district, first.city, first.region].filter(
    (part) => Boolean(part && String(part).trim()),
  );
  if (parts.length > 0) {
    return parts.join(', ');
  }

  return first.name?.trim() || null;
}

async function suggestPlacesWeb(input: string): Promise<AddressSuggestion[]> {
  if (!env.googleMapsWebApiKey) {
    return [];
  }

  try {
    const places = await loadGooglePlaces(env.googleMapsWebApiKey);
    if (!places) {
      return [];
    }

    const service = new places.AutocompleteService();
    const predictions = await new Promise<AddressSuggestion[]>((resolve) => {
      service.getPlacePredictions(
        {
          input,
          componentRestrictions: { country: 'br' },
          language: 'pt-BR',
        },
        (items, status) => {
          if (status !== 'OK' || !items) {
            resolve([]);
            return;
          }

          resolve(
            items.map((item) => ({
              id: item.place_id,
              label: item.description,
              placeId: item.place_id,
            })),
          );
        },
      );
    });

    return predictions;
  } catch {
    return [];
  }
}

async function suggestFromGeocoder(query: string): Promise<AddressSuggestion[]> {
  const input = query.trim();
  if (!input) {
    return [];
  }

  if (Platform.OS === 'web') {
    const results = await geocodeWeb({ address: input });
    return results.map((result) => ({
      id: result.place_id || result.formatted_address,
      label: result.formatted_address,
      placeId: result.place_id,
      latitude: result.geometry.location.lat(),
      longitude: result.geometry.location.lng(),
    }));
  }

  const matches = await Location.geocodeAsync(input);
  const suggestions: AddressSuggestion[] = [];
  for (const match of matches.slice(0, 5)) {
    const label =
      (await reverseGeocode(match.latitude, match.longitude)) ?? input;
    suggestions.push({
      id: `${match.latitude},${match.longitude}`,
      label,
      latitude: match.latitude,
      longitude: match.longitude,
    });
  }

  return suggestions;
}

async function geocodeWeb(request: {
  address?: string;
  location?: { lat: number; lng: number };
  placeId?: string;
}): Promise<GoogleGeocoderResult[]> {
  if (!env.googleMapsWebApiKey) {
    return [];
  }

  try {
    const maps = await loadGoogleMapsJs(env.googleMapsWebApiKey);
    const geocoder = new maps.Geocoder();
    return await new Promise((resolve) => {
      geocoder.geocode(
        {
          ...request,
          region: 'BR',
          componentRestrictions: request.address ? { country: 'br' } : undefined,
        },
        (results, status) => {
          if (status !== 'OK' || !results) {
            resolve([]);
            return;
          }

          resolve(results);
        },
      );
    });
  } catch {
    return [];
  }
}
