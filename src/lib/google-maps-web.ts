/** Subconjunto tipado da Maps JavaScript API usado pelo BrandMap na web. */

export type LatLngLiteral = { lat: number; lng: number };

export type GoogleMapsListener = { remove: () => void };

export type GoogleMap = {
  fitBounds: (bounds: GoogleLatLngBounds, padding?: number) => void;
  setCenter: (latLng: LatLngLiteral) => void;
  setZoom: (zoom: number) => void;
  setOptions: (options: Record<string, unknown>) => void;
};

export type GoogleMarker = {
  setMap: (map: GoogleMap | null) => void;
  setPosition: (latLng: LatLngLiteral) => void;
  setIcon: (icon: unknown) => void;
};

export type GoogleCircle = {
  setMap: (map: GoogleMap | null) => void;
  setCenter: (latLng: LatLngLiteral) => void;
  setRadius: (radius: number) => void;
  setOptions: (options: Record<string, unknown>) => void;
};

export type GoogleLatLngBounds = {
  extend: (latLng: LatLngLiteral) => void;
};

export type GoogleLatLng = {
  lat: () => number;
  lng: () => number;
};

export type GoogleGeocoderResult = {
  formatted_address: string;
  place_id: string;
  geometry: { location: GoogleLatLng };
};

export type GoogleGeocoder = {
  geocode: (
    request: {
      address?: string;
      location?: LatLngLiteral;
      placeId?: string;
      componentRestrictions?: { country: string };
      region?: string;
    },
    callback: (results: GoogleGeocoderResult[] | null, status: string) => void,
  ) => void;
};

export type GooglePlacePrediction = {
  description: string;
  place_id: string;
};

export type GoogleAutocompleteService = {
  getPlacePredictions: (
    request: {
      input: string;
      componentRestrictions?: { country: string };
      language?: string;
    },
    callback: (predictions: GooglePlacePrediction[] | null, status: string) => void,
  ) => void;
};

export type GoogleMapsApi = {
  Map: new (mapDiv: HTMLElement, opts?: Record<string, unknown>) => GoogleMap;
  Marker: new (opts?: Record<string, unknown>) => GoogleMarker;
  Circle: new (opts?: Record<string, unknown>) => GoogleCircle;
  LatLngBounds: new () => GoogleLatLngBounds;
  Geocoder: new () => GoogleGeocoder;
  Size: new (width: number, height: number) => unknown;
  Point: new (x: number, y: number) => unknown;
  importLibrary?: (name: string) => Promise<unknown>;
  places?: {
    AutocompleteService: new () => GoogleAutocompleteService;
  };
  event: {
    addListener: (
      instance: object,
      eventName: string,
      handler: () => void,
    ) => GoogleMapsListener;
    trigger: (instance: object, eventName: string) => void;
    clearInstanceListeners: (instance: object) => void;
  };
};

const SCRIPT_ID = 'encontrame-google-maps';

let loadPromise: Promise<GoogleMapsApi> | null = null;

function getGoogleMaps(): GoogleMapsApi | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }

  return (window as Window & { google?: { maps: GoogleMapsApi } }).google?.maps;
}

/** Carrega a Maps JavaScript API uma vez por sessão. */
export function loadGoogleMapsJs(apiKey: string): Promise<GoogleMapsApi> {
  const existing = getGoogleMaps();
  if (existing) {
    return Promise.resolve(existing);
  }

  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = new Promise((resolve, reject) => {
    if (typeof document === 'undefined') {
      loadPromise = null;
      reject(new Error('Google Maps só está disponível no navegador.'));
      return;
    }

    const onReady = () => {
      const api = getGoogleMaps();
      if (api) {
        resolve(api);
        return;
      }

      loadPromise = null;
      reject(new Error('Google Maps JS não inicializou.'));
    };

    const existingScript = document.getElementById(SCRIPT_ID);
    if (existingScript) {
      existingScript.addEventListener('load', onReady, { once: true });
      existingScript.addEventListener(
        'error',
        () => {
          loadPromise = null;
          reject(new Error('Falha ao carregar o Google Maps.'));
        },
        { once: true },
      );
      return;
    }

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.async = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&language=pt-BR&region=BR&libraries=places`;
    script.onload = onReady;
    script.onerror = () => {
      loadPromise = null;
      script.remove();
      reject(new Error('Falha ao carregar o Google Maps.'));
    };
    document.head.appendChild(script);
  });

  return loadPromise;
}

/** Garante Places (autocomplete). A chave com referrer HTTP não serve no REST, só no JS. */
export async function loadGooglePlaces(
  apiKey: string,
): Promise<NonNullable<GoogleMapsApi['places']> | null> {
  const maps = await loadGoogleMapsJs(apiKey);
  if (maps.places?.AutocompleteService) {
    return maps.places;
  }

  if (typeof maps.importLibrary === 'function') {
    await maps.importLibrary('places');
  }

  return getGoogleMaps()?.places ?? null;
}
