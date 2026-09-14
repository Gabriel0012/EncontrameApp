import { DEFAULT_NEARBY_RADIUS_KM, haversineKm } from '@/lib/geo';
import type { PeopleRepository } from '@/services/people/people.repository';
import type { CreatePersonPayload, NearbyPeopleParams, Person, ReportLastSeenPayload } from '@/services/people/people.types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let mockPeople: Person[] = [
  {
    id: 'p1',
    fullName: 'Fulano da Silva',
    nickname: 'Fulano',
    age: 36,
    location: 'Belo Horizonte, MG',
    lastSeen: 'Savassi, Belo Horizonte',
    dtLastSeen: '2024-01-01T12:00:00.000Z',
    photoUri: 'https://picsum.photos/seed/encontrame-p1/200/200',
    coords: { latitude: -19.918, longitude: -43.938 },
    restricted: false,
    statusId: 1,
    statusDescription: 'Pendente',
  },
  {
    id: 'p2',
    fullName: 'Fulana de Souza',
    nickname: 'Fulana',
    age: 25,
    location: 'Belo Horizonte, MG',
    lastSeen: 'Pampulha, Belo Horizonte',
    dtLastSeen: '2024-03-12T15:00:00.000Z',
    photoUri: 'https://picsum.photos/seed/encontrame-p2/200/200',
    coords: { latitude: -19.924, longitude: -43.945 },
    restricted: true,
    statusId: 2,
    statusDescription: 'Procurado',
  },
  {
    id: 'p3',
    fullName: 'Beltrano Pereira',
    nickname: 'Beltrano',
    age: 42,
    location: 'Contagem, MG',
    lastSeen: 'Centro de Contagem',
    dtLastSeen: '2024-05-20T10:00:00.000Z',
    coords: { latitude: -19.931, longitude: -44.053 },
    restricted: true,
    statusId: 1,
    statusDescription: 'Pendente',
  },
  {
    id: 'p4',
    fullName: 'Ciclano Rocha',
    nickname: 'Ciclano',
    age: 19,
    location: 'Belo Horizonte, MG',
    lastSeen: 'Centro, Belo Horizonte',
    dtLastSeen: '2024-07-02T18:00:00.000Z',
    photoUri: 'https://picsum.photos/seed/encontrame-p4/200/200',
    coords: { latitude: -19.912, longitude: -43.928 },
    restricted: false,
    statusId: 4,
    statusDescription: 'Alerta',
  },
  {
    id: 'p5',
    fullName: 'Maria do Rio',
    nickname: 'Maria',
    age: 31,
    location: 'Rio de Janeiro, RJ',
    lastSeen: 'Copacabana, Rio de Janeiro',
    dtLastSeen: '2024-08-18T09:00:00.000Z',
    photoUri: 'https://picsum.photos/seed/encontrame-p5/200/200',
    coords: { latitude: -22.971, longitude: -43.182 },
    restricted: false,
    statusId: 2,
    statusDescription: 'Procurado',
  },
];

/** Implementação mockada: permite desenvolver sem depender da API. */
export const peopleMockRepository: PeopleRepository = {
  async list() {
    await delay(500);
    return mockPeople;
  },

  async listNearby({ query, latitude, longitude, radiusKm }: NearbyPeopleParams) {
    await delay(500);
    const radius = radiusKm ?? DEFAULT_NEARBY_RADIUS_KM;
    const nearby = mockPeople.filter((person) => {
      if (!person.coords) {
        return false;
      }
      return haversineKm(latitude, longitude, person.coords.latitude, person.coords.longitude) <= radius;
    });

    const needle = query?.trim().toLowerCase();
    if (!needle) {
      return nearby;
    }

    return nearby.filter((person) => {
      const haystack = [person.fullName, person.nickname, person.location, person.lastSeen]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(needle);
    });
  },

  async getById(id: string) {
    await delay(300);
    const person = mockPeople.find((item) => item.id === id);
    if (!person) {
      throw new Error('Pessoa não encontrada.');
    }
    return person;
  },

  async create(payload: CreatePersonPayload) {
    await delay(600);
    const person = {
      id: `mock-${Date.now()}`,
      fullName: payload.fullName || 'Pessoa cadastrada',
      nickname: payload.nickname,
      age: payload.age ? Number.parseInt(payload.age, 10) || undefined : undefined,
      heightCm: payload.heightCm,
      ethnicity: payload.ethnicity,
      build: payload.build,
      clothes: payload.clothes,
      hair: payload.hair,
      eyes: payload.eyes,
      tattoo: payload.tattoo,
      accessories: payload.accessories,
      location: payload.location,
      lastSeen: payload.lastSeen,
      phone: payload.phone,
      photoUri: payload.photoUri,
      statusId: 1,
      statusDescription: 'Pendente',
    } satisfies Person;
    mockPeople = [person, ...mockPeople];
    return person;
  },

  async reportLastSeen(id: string, payload: ReportLastSeenPayload) {
    await delay(400);
    mockPeople = mockPeople.map((person) =>
      person.id === id
        ? {
            ...person,
            lastSeen: payload.location,
            location: payload.location,
            coords: { latitude: payload.latitude, longitude: payload.longitude },
            dtLastSeen: new Date().toISOString(),
          }
        : person,
    );
  },
};
