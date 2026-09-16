import { api } from '@/lib/axios';
import type { PeopleRepository } from '@/services/people/people.repository';
import type {
  CreatePersonPayload,
  NearbyPeopleParams,
  PeopleSearchPage,
  PeopleSearchParams,
  Person,
  PersonLastSeen,
  ReportLastSeenPayload,
} from '@/services/people/people.types';

/** Payload/resposta alinhados ao MissingPerson da API .NET. */
interface ApiMissingPerson {
  missingPersonId: number;
  name: string;
  nickName?: string;
  age?: number | null;
  height?: number;
  race?: string;
  bodyType?: string;
  clothes?: string;
  hair?: string;
  eyes?: string;
  tatoo?: string;
  accessories?: string;
  userId?: number | null;
  dtRegistration?: string;
  statusId?: number | null;
  statusDescription?: string | null;
  photo?: string | null;
  lastSeen?: string | null;
  originCity?: string | null;
  originState?: string | null;
  originCountry?: string | null;
  originNeighborhood?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  neighborhood?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  dtLastSeen?: string | null;
}

interface ApiPersonLastSeen {
  personLastSeenId: number;
  missingPersonId: number;
  location?: string | null;
  city?: string | null;
  neighborhood?: string | null;
  state?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  dtRegistration: string;
}

interface ApiPagedResult {
  items: ApiMissingPerson[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

/** Implementação real: fala com /MissingPerson. */
export const peopleAxiosRepository: PeopleRepository = {
  async search(params: PeopleSearchParams) {
    const { data } = await api.get<ApiPagedResult>('/MissingPerson', {
      params: toSearchQuery(params),
    });
    return mapPage(data);
  },

  async listNearby({ query, latitude, longitude, radiusKm }: NearbyPeopleParams) {
    const { data } = await api.get<ApiMissingPerson[]>('/MissingPerson/nearby', {
      params: {
        q: query || undefined,
        lat: latitude,
        lng: longitude,
        ...(radiusKm != null ? { radiusKm } : {}),
      },
    });
    return data.map(mapPerson);
  },

  async getById(id: string) {
    const { data } = await api.get<ApiMissingPerson>(`/MissingPerson/${id}`);
    return mapPerson(data);
  },

  async create(payload: CreatePersonPayload) {
    const height = Number.parseFloat(payload.heightCm.replace(',', '.'));
    const age = Number.parseInt(payload.age.replace(/\D/g, ''), 10);

    const { data } = await api.post<ApiMissingPerson>('/MissingPerson', {
      name: payload.fullName,
      nickName: payload.nickname || null,
      age: Number.isFinite(age) ? age : null,
      height: Number.isFinite(height) ? height : null,
      race: payload.ethnicity || null,
      bodyType: payload.build || null,
      clothes: payload.clothes || null,
      hair: payload.hair || null,
      eyes: payload.eyes || null,
      tatoo: payload.tattoo || null,
      accessories: payload.accessories || null,
      originCity: payload.originCity || null,
      originState: payload.originState || null,
      originCountry: payload.originCountry || 'Brasil',
      originNeighborhood: payload.originNeighborhood || null,
      location: payload.location || null,
      city: payload.location || null,
      photo: payload.photo || null,
    });

    const person = mapPerson(data);
    return {
      ...person,
      location: payload.location || person.location,
      lastSeen: payload.lastSeen || person.lastSeen,
      originCity: payload.originCity || person.originCity,
      originState: payload.originState || person.originState,
      originCountry: payload.originCountry || person.originCountry,
      originNeighborhood: payload.originNeighborhood || person.originNeighborhood,
      phone: payload.phone,
      photoUri: payload.photoUri,
    };
  },

  async reportLastSeen(id: string, payload: ReportLastSeenPayload) {
    await api.post(`/MissingPerson/${id}/last-seen`, {
      location: payload.location,
      city: payload.city || null,
      neighborhood: payload.neighborhood || null,
      latitude: payload.latitude,
      longitude: payload.longitude,
    });
  },

  async listLastSeenHistory(id: string) {
    const { data } = await api.get<ApiPersonLastSeen[]>(`/MissingPerson/${id}/last-seen/history`);
    return (data ?? []).map(mapLastSeen);
  },
};

function toSearchQuery(params: PeopleSearchParams) {
  return {
    q: params.query || undefined,
    statusId: params.statusId,
    ageMin: params.ageMin,
    ageMax: params.ageMax,
    city: params.city || undefined,
    state: params.state || undefined,
    country: params.country || undefined,
    neighborhood: params.neighborhood || undefined,
    addressScope: params.addressScope,
    page: params.page,
    pageSize: params.pageSize,
  };
}

function mapPage(page: ApiPagedResult): PeopleSearchPage {
  return {
    items: (page.items ?? []).map(mapPerson),
    page: page.page,
    pageSize: page.pageSize,
    totalCount: page.totalCount,
    totalPages: page.totalPages,
  };
}

function mapPerson(apiPerson: ApiMissingPerson): Person {
  return {
    id: String(apiPerson.missingPersonId),
    fullName: apiPerson.name,
    nickname: apiPerson.nickName || undefined,
    age: apiPerson.age ?? undefined,
    heightCm: apiPerson.height != null ? String(apiPerson.height) : undefined,
    ethnicity: apiPerson.race || undefined,
    build: apiPerson.bodyType || undefined,
    clothes: apiPerson.clothes || undefined,
    hair: apiPerson.hair || undefined,
    eyes: apiPerson.eyes || undefined,
    tattoo: apiPerson.tatoo || undefined,
    accessories: apiPerson.accessories || undefined,
    location: apiPerson.lastSeen || undefined,
    lastSeen: apiPerson.lastSeen || undefined,
    dtLastSeen: apiPerson.dtLastSeen || undefined,
    originCity: apiPerson.originCity || undefined,
    originState: apiPerson.originState || undefined,
    originCountry: apiPerson.originCountry || undefined,
    originNeighborhood: apiPerson.originNeighborhood || undefined,
    city: apiPerson.city || undefined,
    state: apiPerson.state || undefined,
    country: apiPerson.country || undefined,
    neighborhood: apiPerson.neighborhood || undefined,
    coords:
      apiPerson.latitude != null && apiPerson.longitude != null
        ? { latitude: apiPerson.latitude, longitude: apiPerson.longitude }
        : undefined,
    statusId: apiPerson.statusId ?? undefined,
    statusDescription: apiPerson.statusDescription || undefined,
    photoUri: toPhotoUri(apiPerson.photo),
  };
}

function mapLastSeen(item: ApiPersonLastSeen): PersonLastSeen {
  return {
    id: String(item.personLastSeenId),
    location: item.location || undefined,
    city: item.city || undefined,
    neighborhood: item.neighborhood || undefined,
    state: item.state || undefined,
    latitude: item.latitude ?? undefined,
    longitude: item.longitude ?? undefined,
    dtRegistration: item.dtRegistration,
  };
}

function toPhotoUri(photo?: string | null): string | undefined {
  if (!photo) return undefined;
  const value = photo.trim();
  if (!value) return undefined;
  if (value.startsWith('data:')) return value;
  return `data:image/jpeg;base64,${value}`;
}
