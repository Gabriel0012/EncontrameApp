import { useState } from 'react';

import type { MapPin } from '@/components/brand-map';
import { useNearbyPeopleQuery } from '@/services/people/people.service';

/** Centraliza busca e pins da tela de pessoas próximas. */
export function usePessoasProximasController() {
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');

  const nearbyQuery = useNearbyPeopleQuery(query);
  const people = nearbyQuery.data ?? [];

  const pins: MapPin[] = people.flatMap((person) => {
    if (!person.coords) {
      return [];
    }

    return [
      {
        id: person.id,
        latitude: person.coords.latitude,
        longitude: person.coords.longitude,
        locked: person.restricted,
      },
    ];
  });

  const handleSearch = () => {
    setQuery(search.trim());
  };

  return {
    search,
    setSearch,
    pins,
    loading: nearbyQuery.isLoading || nearbyQuery.isFetching,
    handleSearch,
  };
}

export type PessoasProximasController = ReturnType<typeof usePessoasProximasController>;
