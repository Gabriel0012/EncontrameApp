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
  setDraggable?: (draggable: boolean) => void;
  getPosition?: () => GoogleLatLng | null;
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

export type GooglePlace = {
  fetchFields: (opts: { fields: string[] }) => Promise<unknown>;
  location?: GoogleLatLng | LatLngLiteral | null;
  formattedAddress?: string | null;
};

export type GooglePlacePrediction = {
  placeId?: string;
  text?: { text?: string };
  toPlace?: () => GooglePlace;
};

export type GoogleAutocompleteSuggestion = {
  placePrediction?: GooglePlacePrediction | null;
};

/** Places API (New) — AutocompleteSuggestion / Place. Não usar AutocompleteService (legacy). */
export type GooglePlacesLibrary = {
  Place: new (opts: { id: string }) => GooglePlace;
  AutocompleteSuggestion: {
    fetchAutocompleteSuggestions: (request: {
      input: string;
      includedRegionCodes?: string[];
      language?: string;
    }) => Promise<{ suggestions: GoogleAutocompleteSuggestion[] }>;
  };
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
  event: {
    addListener: (
      instance: object,
      eventName: string,
      handler: (event?: { latLng?: GoogleLatLng }) => void,
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
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&language=pt-BR&region=BR`;
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

/** Carrega Places API (New). Projetos novos não podem ativar a Places legada. */
export async function loadPlacesLibrary(apiKey: string): Promise<GooglePlacesLibrary | null> {
  const maps = await loadGoogleMapsJs(apiKey);
  if (typeof maps.importLibrary !== 'function') {
    return null;
  }

  const library = (await maps.importLibrary('places')) as GooglePlacesLibrary;
  if (!library?.AutocompleteSuggestion?.fetchAutocompleteSuggestions || !library.Place) {
    return null;
  }

  return library;
}

export function coordsFromPlaceLocation(
  location: GooglePlace['location'],
): LatLngLiteral | null {
  if (!location) {
    return null;
  }

  const lat = location.lat;
  const lng = location.lng;
  if (typeof lat === 'function' && typeof lng === 'function') {
    return { lat: lat.call(location), lng: lng.call(location) };
  }

  if (typeof lat === 'number' && typeof lng === 'number') {
    return { lat, lng };
  }

  return null;
}
