import * as Location from 'expo-location';
import { Platform } from 'react-native';

import { env } from '@/lib/env';
import {
  coordsFromPlaceLocation,
  loadGoogleMapsJs,
  loadPlacesLibrary,
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
    const place = await fetchPlaceWeb(suggestion.placeId);
    if (place) {
      return place;
    }
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

/** Places API (New) 403/bloqueio: não insistir a cada tecla; o Geocoder cobre a busca. */
let placesNewUnavailable = false;

async function suggestPlacesWeb(input: string): Promise<AddressSuggestion[]> {
  if (!env.googleMapsWebApiKey || placesNewUnavailable) {
    return [];
  }

  try {
    const places = await loadPlacesLibrary(env.googleMapsWebApiKey);
    if (!places) {
      placesNewUnavailable = true;
      return [];
    }

    const { suggestions } = await places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
      input,
      includedRegionCodes: ['br'],
      language: 'pt-BR',
    });

    return suggestions.flatMap((suggestion) => {
      const prediction = suggestion.placePrediction;
      const placeId = prediction?.placeId;
      const label = prediction?.text?.text?.trim();
      if (!placeId || !label) {
        return [];
      }

      return [{ id: placeId, label, placeId }];
    });
  } catch {
    placesNewUnavailable = true;
    return [];
  }
}

async function fetchPlaceWeb(placeId: string): Promise<(GeoResult & { label: string }) | null> {
  if (!env.googleMapsWebApiKey || placesNewUnavailable) {
    return null;
  }

  try {
    const places = await loadPlacesLibrary(env.googleMapsWebApiKey);
    if (!places) {
      return null;
    }

    const place = new places.Place({ id: placeId });
    await place.fetchFields({ fields: ['location', 'formattedAddress'] });
    const coords = coordsFromPlaceLocation(place.location);
    if (!coords) {
      return null;
    }

    return {
      label: place.formattedAddress?.trim() || placeId,
      latitude: coords.lat,
      longitude: coords.lng,
    };
  } catch {
    placesNewUnavailable = true;
    return null;
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
