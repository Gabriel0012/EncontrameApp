/** Coordenada geográfica simples usada nos pins do mapa. */
export interface GeoPoint {
  latitude: number;
  longitude: number;
}

/** Origem vs último avistamento nos filtros de endereço. */
export type AddressScope = 'origin' | 'lastSeen';

/** Pessoa desaparecida cadastrada / exibida no app. */
export interface Person {
  id: string;
  fullName: string;
  nickname?: string;
  age?: number;
  photoUri?: string;
  heightCm?: string;
  ethnicity?: string;
  build?: string;
  clothes?: string;
  hair?: string;
  eyes?: string;
  tattoo?: string;
  accessories?: string;
  location?: string;
  lastSeen?: string;
  dtLastSeen?: string;
  originCity?: string;
  originState?: string;
  originCountry?: string;
  originNeighborhood?: string;
  city?: string;
  state?: string;
  country?: string;
  neighborhood?: string;
  phone?: string;
  coords?: GeoPoint;
  /** Quando true, o pin aparece com cadeado (dados restritos). */
  restricted?: boolean;
  statusId?: number;
  statusDescription?: string;
}

/** Dados enviados ao cadastrar uma nova pessoa. */
export interface CreatePersonPayload {
  fullName: string;
  nickname: string;
  age: string;
  heightCm: string;
  ethnicity: string;
  build: string;
  clothes: string;
  hair: string;
  eyes: string;
  tattoo: string;
  accessories: string;
  location: string;
  lastSeen: string;
  originCity?: string;
  originState?: string;
  originCountry?: string;
  originNeighborhood?: string;
  phone: string;
  photoUri?: string;
  /** Base64 puro da foto (sem prefixo data URL), enviado à API. */
  photo?: string;
}

/** Avistamento enviado ao registrar um last-seen. */
export interface ReportLastSeenPayload {
  location: string;
  city?: string;
  neighborhood?: string;
  latitude: number;
  longitude: number;
}

/** Filtro geo da listagem de pessoas próximas. */
export type NearbyPeopleParams = {
  query?: string;
  latitude: number;
  longitude: number;
  radiusKm?: number;
};

/** Filtros da listagem paginada de pessoas desaparecidas. */
export type PeopleSearchParams = {
  query?: string;
  statusId?: number;
  ageMin?: number;
  ageMax?: number;
  city?: string;
  state?: string;
  country?: string;
  neighborhood?: string;
  addressScope?: AddressScope;
  page?: number;
  pageSize?: number;
};

/** Página retornada pela busca de pessoas. */
export type PeopleSearchPage = {
  items: Person[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};
