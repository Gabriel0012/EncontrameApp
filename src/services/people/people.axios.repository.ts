import { api } from '@/lib/axios';
import type { PeopleRepository } from '@/services/people/people.repository';
import type { CreatePersonPayload, Person } from '@/services/people/people.types';

/** Implementação real: fala com a API existente via axios. */
export const peopleAxiosRepository: PeopleRepository = {
  async list() {
    const { data } = await api.get<Person[]>('/people');
    return data;
  },

  async listNearby(query: string) {
    const { data } = await api.get<Person[]>('/people/nearby', { params: { q: query } });
    return data;
  },

  async create(payload: CreatePersonPayload) {
    const { data } = await api.post<Person>('/people', payload);
    return data;
  },
};
