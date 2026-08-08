import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getPeopleRepository } from '@/services/people/people.repository';
import type { CreatePersonPayload } from '@/services/people/people.types';

const peopleKeys = {
  all: ['people'] as const,
  nearby: (query: string) => ['people', 'nearby', query] as const,
};

/**
 * Camada de acesso à API de pessoas exposta como hooks do React Query.
 * O repositório (axios ou mock) é resolvido por env dentro de cada chamada.
 */
export function usePeopleQuery() {
  return useQuery({
    queryKey: peopleKeys.all,
    queryFn: () => getPeopleRepository().list(),
  });
}

export function useNearbyPeopleQuery(query: string) {
  return useQuery({
    queryKey: peopleKeys.nearby(query),
    queryFn: () => getPeopleRepository().listNearby(query),
  });
}

export function useCreatePersonMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePersonPayload) => getPeopleRepository().create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: peopleKeys.all });
    },
  });
}
