import { env } from '@/lib/env';
import { peopleAxiosRepository } from '@/services/people/people.axios.repository';
import { peopleMockRepository } from '@/services/people/people.mock.repository';
import type { CreatePersonPayload, Person } from '@/services/people/people.types';

/** Contrato comum aos repositórios de pessoas (axios e mock). */
export interface PeopleRepository {
  list(): Promise<Person[]>;
  listNearby(query: string): Promise<Person[]>;
  create(payload: CreatePersonPayload): Promise<Person>;
}

/**
 * Escolhe o repositório conforme a env: mock quando EXPO_PUBLIC_USE_MOCKS,
 * caso contrário o repositório real via axios.
 */
export function getPeopleRepository(): PeopleRepository {
  return env.useMocks ? peopleMockRepository : peopleAxiosRepository;
}
