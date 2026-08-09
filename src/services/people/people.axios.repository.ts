import { api } from '@/lib/axios';
import type { PeopleRepository } from '@/services/people/people.repository';
import type { CreatePersonPayload, Person } from '@/services/people/people.types';

/** Payload/resposta alinhados ao MissingPerson da API .NET. */
interface ApiMissingPerson {
  missingPersonId: number;
  name: string;
  nickName?: string;
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
}

/** Implementação real: fala com /MissingPerson. */
export const peopleAxiosRepository: PeopleRepository = {
  async list() {
    const { data } = await api.get<ApiMissingPerson[]>('/MissingPerson');
    return data.map(mapPerson);
  },

  async listNearby(query: string) {
    const { data } = await api.get<ApiMissingPerson[]>('/MissingPerson/nearby', {
      params: { q: query || undefined },
    });
    return data.map(mapPerson);
  },

  async create(payload: CreatePersonPayload) {
    const height = Number.parseFloat(payload.heightCm.replace(',', '.'));
    const { data } = await api.post<ApiMissingPerson>('/MissingPerson', {
      name: payload.fullName,
      nickName: payload.nickname || null,
      height: Number.isFinite(height) ? height : null,
      race: payload.ethnicity || null,
      bodyType: payload.build || null,
      clothes: payload.clothes || null,
      hair: payload.hair || null,
      eyes: payload.eyes || null,
      tatoo: payload.tattoo || null,
      accessories: payload.accessories || null,
      location: payload.location || null,
      city: payload.location || null,
    });

    const person = mapPerson(data);
    return {
      ...person,
      location: payload.location || person.location,
      lastSeen: payload.lastSeen || person.lastSeen,
      phone: payload.phone,
      photoUri: payload.photoUri,
    };
  },
};

function mapPerson(api: ApiMissingPerson): Person {
  return {
    id: String(api.missingPersonId),
    fullName: api.name,
    nickname: api.nickName || undefined,
    heightCm: api.height != null ? String(api.height) : undefined,
    ethnicity: api.race || undefined,
    build: api.bodyType || undefined,
    clothes: api.clothes || undefined,
    hair: api.hair || undefined,
    eyes: api.eyes || undefined,
    tattoo: api.tatoo || undefined,
    accessories: api.accessories || undefined,
  };
}
