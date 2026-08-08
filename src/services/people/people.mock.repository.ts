import type { PeopleRepository } from '@/services/people/people.repository';
import type { CreatePersonPayload, Person } from '@/services/people/people.types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const mockPeople: Person[] = [
  {
    id: 'p1',
    fullName: 'Fulano da Silva',
    nickname: 'Fulano',
    age: 36,
    location: 'Belo Horizonte, MG',
    lastSeen: '01/01/2024',
    coords: { latitude: -19.918, longitude: -43.938 },
    restricted: false,
  },
  {
    id: 'p2',
    fullName: 'Fulana de Souza',
    nickname: 'Fulana',
    age: 25,
    location: 'Belo Horizonte, MG',
    lastSeen: '12/03/2024',
    coords: { latitude: -19.924, longitude: -43.945 },
    restricted: true,
  },
  {
    id: 'p3',
    fullName: 'Beltrano Pereira',
    nickname: 'Beltrano',
    age: 42,
    location: 'Contagem, MG',
    lastSeen: '20/05/2024',
    coords: { latitude: -19.931, longitude: -44.053 },
    restricted: true,
  },
  {
    id: 'p4',
    fullName: 'Ciclano Rocha',
    nickname: 'Ciclano',
    age: 19,
    location: 'Belo Horizonte, MG',
    lastSeen: '02/07/2024',
    coords: { latitude: -19.912, longitude: -43.928 },
    restricted: false,
  },
];

/** Implementação mockada: permite desenvolver sem depender da API. */
export const peopleMockRepository: PeopleRepository = {
  async list() {
    await delay(500);
    return mockPeople;
  },

  async listNearby(_query: string) {
    await delay(500);
    return mockPeople;
  },

  async create(payload: CreatePersonPayload) {
    await delay(600);
    return {
      id: `mock-${Date.now()}`,
      fullName: payload.fullName || 'Pessoa cadastrada',
      nickname: payload.nickname,
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
    } satisfies Person;
  },
};
