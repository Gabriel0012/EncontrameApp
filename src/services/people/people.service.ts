import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { isLocalPersonId } from '@/lib/person-status';
import { getSessionUser } from '@/lib/session';
import {
  getLocalPending,
  listLocalPending,
  mergeLocalPeople,
  saveLocalPending,
} from '@/services/people/people.local.store';
import { getPeopleRepository } from '@/services/people/people.repository';
import type { CreatePersonPayload, Person, ReportLastSeenPayload } from '@/services/people/people.types';

const peopleKeys = {
  all: ['people'] as const,
  nearby: (query: string) => ['people', 'nearby', query] as const,
  detail: (id: string) => ['people', 'detail', id] as const,
};

/**
 * Camada de acesso à API de pessoas exposta como hooks do React Query.
 * O repositório (axios ou mock) é resolvido por env dentro de cada chamada.
 */
export function usePeopleQuery() {
  return useQuery({
    queryKey: peopleKeys.all,
    queryFn: async () => {
      const local = await listLocalPersons();
      try {
        const remote = await getPeopleRepository().list();
        return mergeLocalPeople(local, remote);
      } catch (error) {
        if (local.length > 0) return local;
        throw error;
      }
    },
  });
}

export function useNearbyPeopleQuery(query: string) {
  return useQuery({
    queryKey: peopleKeys.nearby(query),
    queryFn: async () => {
      const local = filterLocalByQuery(await listLocalPersons(), query);
      try {
        const remote = await getPeopleRepository().listNearby(query);
        return mergeLocalPeople(local, remote);
      } catch (error) {
        if (local.length > 0) return local;
        throw error;
      }
    },
  });
}

export function usePersonQuery(id: string) {
  return useQuery({
    queryKey: peopleKeys.detail(id),
    queryFn: async () => {
      if (isLocalPersonId(id)) {
        const person = await getLocalPending(id);
        if (!person) {
          throw new Error('Pessoa não encontrada.');
        }
        return person;
      }
      return getPeopleRepository().getById(id);
    },
    enabled: id.length > 0,
  });
}

export function useCreatePersonMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreatePersonPayload) => {
      if (getSessionUser() == null) {
        return saveLocalPending(payload);
      }
      return getPeopleRepository().create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: peopleKeys.all });
      queryClient.invalidateQueries({ queryKey: ['people', 'nearby'] });
    },
  });
}

export function useReportLastSeenMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ReportLastSeenPayload) =>
      getPeopleRepository().reportLastSeen(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: peopleKeys.all });
      queryClient.invalidateQueries({ queryKey: peopleKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: ['people', 'nearby'] });
    },
  });
}

async function listLocalPersons(): Promise<Person[]> {
  const pending = await listLocalPending();
  return pending.map((item) => item.person);
}

function filterLocalByQuery(people: Person[], query: string): Person[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return people;

  return people.filter((person) => {
    const haystack = [person.fullName, person.nickname, person.location, person.lastSeen]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return haystack.includes(needle);
  });
}
