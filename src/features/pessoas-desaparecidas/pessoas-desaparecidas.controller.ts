import { type Href, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';

import { usePeopleSearchQuery } from '@/services/people/people.service';
import type { AddressScope, Person } from '@/services/people/people.types';

const SEARCH_DEBOUNCE_MS = 350;
const PAGE_SIZE = 12;

export const STATUS_FILTER_OPTIONS = [
  { id: '', label: 'Todos' },
  { id: '2', label: 'Procurado' },
  { id: '3', label: 'Encontrado' },
  { id: '4', label: 'Alerta' },
] as const;

export const ADDRESS_SCOPE_OPTIONS = [
  { id: 'lastSeen' as const, label: 'Última vez vista' },
  { id: 'origin' as const, label: 'De onde é' },
];

/** Centraliza filtros, paginação e navegação da listagem de pessoas. */
export function usePessoasDesaparecidasController() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [statusId, setStatusId] = useState('');
  const [ageMin, setAgeMin] = useState('');
  const [ageMax, setAgeMax] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [addressScope, setAddressScope] = useState<AddressScope>('lastSeen');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  const parsedStatus = statusId ? Number.parseInt(statusId, 10) : undefined;
  const parsedAgeMin = ageMin ? Number.parseInt(ageMin.replace(/\D/g, ''), 10) : undefined;
  const parsedAgeMax = ageMax ? Number.parseInt(ageMax.replace(/\D/g, ''), 10) : undefined;

  const searchQuery = usePeopleSearchQuery({
    query: debouncedQuery,
    statusId: Number.isFinite(parsedStatus) ? parsedStatus : undefined,
    ageMin: Number.isFinite(parsedAgeMin) ? parsedAgeMin : undefined,
    ageMax: Number.isFinite(parsedAgeMax) ? parsedAgeMax : undefined,
    city: city.trim() || undefined,
    state: state.trim() || undefined,
    country: country.trim() || undefined,
    neighborhood: neighborhood.trim() || undefined,
    addressScope,
    pageSize: PAGE_SIZE,
  });

  const people = useMemo(
    () => searchQuery.data?.pages.flatMap((page) => page.items) ?? [],
    [searchQuery.data],
  );

  const totalCount = searchQuery.data?.pages[0]?.totalCount ?? 0;
  const hasActiveFilters = Boolean(
    statusId || ageMin || ageMax || city || state || country || neighborhood || addressScope !== 'lastSeen',
  );

  const locationLine = (person: Person) => {
    if (addressScope === 'origin') {
      return [person.originNeighborhood, person.originCity, person.originState, person.originCountry]
        .filter(Boolean)
        .join(', ');
    }
    return (
      [person.neighborhood, person.city, person.state].filter(Boolean).join(', ') ||
      person.lastSeen ||
      person.location ||
      ''
    );
  };

  return {
    query,
    setQuery,
    filtersOpen,
    toggleFilters: () => setFiltersOpen((open) => !open),
    statusId,
    setStatusId,
    ageMin,
    setAgeMin,
    ageMax,
    setAgeMax,
    city,
    setCity,
    state,
    setState,
    country,
    setCountry,
    neighborhood,
    setNeighborhood,
    addressScope,
    setAddressScope,
    people,
    totalCount,
    hasActiveFilters,
    loading: searchQuery.isLoading,
    fetchingMore: searchQuery.isFetchingNextPage,
    hasMore: Boolean(searchQuery.hasNextPage),
    loadMore: () => {
      if (searchQuery.hasNextPage && !searchQuery.isFetchingNextPage) {
        void searchQuery.fetchNextPage();
      }
    },
    locationLine,
    goToPerson: (id: string) => router.push(`/pessoa/${id}` as Href),
    goToRegister: () => router.push('/cadastrar-pessoa' as Href),
  };
}

export type PessoasDesaparecidasController = ReturnType<typeof usePessoasDesaparecidasController>;
