import { keepPreviousData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { DEFAULT_NEARBY_RADIUS_KM, haversineKm, snapNearbyCoord } from '@/lib/geo';
import { isLocalPersonId } from '@/lib/person-status';
import { getSessionUser } from '@/lib/session';
import { useSessionUser } from '@/lib/use-session-user';
import {
  getLocalPending,
  listLocalPending,
  mergeLocalPeople,
  saveLocalPending,
} from '@/services/people/people.local.store';
import { getPeopleRepository } from '@/services/people/people.repository';
import { syncLocalPeople } from '@/services/people/people.sync';
import type {
  CreatePersonPayload,
  NearbyPeopleParams,
  PeopleSearchPage,
  PeopleSearchParams,
  Person,
  ReportLastSeenPayload,
} from '@/services/people/people.types';

const DEFAULT_PAGE_SIZE = 12;

const peopleKeys = {
  all: ['people'] as const,
  search: (viewerId: string, filters: Omit<PeopleSearchParams, 'page' | 'pageSize'>) =>
    ['people', 'search', viewerId, filters] as const,
  nearby: (viewerId: string, query: string, lat: number, lng: number) =>
    ['people', 'nearby', viewerId, query, lat, lng] as const,
  detail: (id: string) => ['people', 'detail', id] as const,
  lastSeenHistory: (id: string) => ['people', 'last-seen-history', id] as const,
};

function viewerKey(userId?: string | null) {
  return userId ?? 'anon';
}

/**
 * Busca paginada de pessoas desaparecidas (filtros no backend).
 */
export function usePeopleSearchQuery(params: PeopleSearchParams) {
  const viewerId = viewerKey(useSessionUser()?.id);
  const filters = {
    query: params.query ?? '',
    statusId: params.statusId,
    ageMin: params.ageMin,
    ageMax: params.ageMax,
    city: params.city ?? '',
    state: params.state ?? '',
    country: params.country ?? '',
    neighborhood: params.neighborhood ?? '',
    addressScope: params.addressScope ?? 'lastSeen',
  };
  const pageSize = params.pageSize ?? DEFAULT_PAGE_SIZE;

  return useInfiniteQuery({
    queryKey: peopleKeys.search(viewerId, filters),
    initialPageParam: 1,
    getNextPageParam: (lastPage: PeopleSearchPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    queryFn: async ({ pageParam }) => {
      await syncLocalPeople();
      const local = filterLocalSearch(await listLocalPersons(), { ...params, page: 1, pageSize: 1000 });
      try {
        const remote = await getPeopleRepository().search({
          ...params,
          page: pageParam,
          pageSize,
        });
        if (pageParam === 1) {
          return {
            ...remote,
            items: mergeLocalPeople(local, remote.items),
          };
        }
        return remote;
      } catch (error) {
        if (pageParam === 1 && local.length > 0) {
          return {
            items: local,
            page: 1,
            pageSize,
            totalCount: local.length,
            totalPages: 1,
          } satisfies PeopleSearchPage;
        }
        throw error;
      }
    },
    placeholderData: keepPreviousData,
  });
}

export function useNearbyPeopleQuery(params: {
  query: string;
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
}) {
  const viewerId = viewerKey(useSessionUser()?.id);
  const hasCoords =
    params.latitude != null &&
    params.longitude != null &&
    Number.isFinite(params.latitude) &&
    Number.isFinite(params.longitude);
  const latitude = hasCoords ? snapNearbyCoord(params.latitude!) : null;
  const longitude = hasCoords ? snapNearbyCoord(params.longitude!) : null;

  return useQuery({
    queryKey: peopleKeys.nearby(viewerId, params.query, latitude ?? 0, longitude ?? 0),
    enabled: hasCoords,
    queryFn: async () => {
      const nearbyParams: NearbyPeopleParams = {
        query: params.query,
        latitude: latitude!,
        longitude: longitude!,
        radiusKm: params.radiusKm,
      };
      await syncLocalPeople();
      const local = filterLocalNearby(await listLocalPersons(), nearbyParams);
      try {
        const remote = await getPeopleRepository().listNearby(nearbyParams);
        return mergeLocalPeople(local, remote);
      } catch (error) {
        if (local.length > 0) return local;
        throw error;
      }
    },
    placeholderData: keepPreviousData,
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
      await syncLocalPeople();
      return getPeopleRepository().getById(id);
    },
    enabled: id.length > 0,
  });
}

export function useLastSeenHistoryQuery(id: string, enabled: boolean) {
  return useQuery({
    queryKey: peopleKeys.lastSeenHistory(id),
    queryFn: () => getPeopleRepository().listLastSeenHistory(id),
    enabled: enabled && id.length > 0 && !isLocalPersonId(id),
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
      queryClient.invalidateQueries({ queryKey: peopleKeys.lastSeenHistory(id) });
    },
  });
}

async function listLocalPersons(): Promise<Person[]> {
  const pending = await listLocalPending();
  return pending.map((item) => item.person);
}

function filterLocalNearby(people: Person[], params: NearbyPeopleParams): Person[] {
  const radius = params.radiusKm ?? DEFAULT_NEARBY_RADIUS_KM;
  const nearby = people.filter((person) => {
    if (!person.coords) return true;
    return (
      haversineKm(params.latitude, params.longitude, person.coords.latitude, person.coords.longitude) <=
      radius
    );
  });
  return filterLocalByQuery(nearby, params.query ?? '');
}

function filterLocalSearch(people: Person[], params: PeopleSearchParams): Person[] {
  const byName = filterLocalByQuery(people, params.query ?? '');
  const useOrigin = params.addressScope === 'origin';
  return byName.filter((person) => {
    if (params.statusId != null && person.statusId !== params.statusId) return false;
    if (params.ageMin != null && (person.age == null || person.age < params.ageMin)) return false;
    if (params.ageMax != null && (person.age == null || person.age > params.ageMax)) return false;
    if (params.city && !includesField(useOrigin ? person.originCity : person.city, params.city)) return false;
    if (params.state && !includesField(useOrigin ? person.originState : person.state, params.state)) return false;
    if (params.country && !includesField(useOrigin ? person.originCountry : person.country, params.country)) {
      return false;
    }
    if (
      params.neighborhood &&
      !includesField(useOrigin ? person.originNeighborhood : person.neighborhood, params.neighborhood)
    ) {
      return false;
    }
    return true;
  });
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

function includesField(value: string | undefined, needle: string) {
  return Boolean(value?.toLowerCase().includes(needle.trim().toLowerCase()));
}
