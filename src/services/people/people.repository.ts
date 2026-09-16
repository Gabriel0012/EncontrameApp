import { env } from '@/lib/env';
import { peopleAxiosRepository } from '@/services/people/people.axios.repository';
import { peopleMockRepository } from '@/services/people/people.mock.repository';
import type {
  CreatePersonPayload,
  NearbyPeopleParams,
  PeopleSearchParams,
  PeopleSearchPage,
  Person,
  PersonLastSeen,
  ReportLastSeenPayload,
} from '@/services/people/people.types';

/** Contrato comum aos repositórios de pessoas (axios e mock). */
export interface PeopleRepository {
  search(params: PeopleSearchParams): Promise<PeopleSearchPage>;
  listNearby(params: NearbyPeopleParams): Promise<Person[]>;
  getById(id: string): Promise<Person>;
  create(payload: CreatePersonPayload): Promise<Person>;
  reportLastSeen(id: string, payload: ReportLastSeenPayload): Promise<void>;
  listLastSeenHistory(id: string): Promise<PersonLastSeen[]>;
}

/**
 * Escolhe o repositório conforme a env: mock quando EXPO_PUBLIC_USE_MOCKS,
 * caso contrário o repositório real via axios.
 */
export function getPeopleRepository(): PeopleRepository {
  return env.useMocks ? peopleMockRepository : peopleAxiosRepository;
}
