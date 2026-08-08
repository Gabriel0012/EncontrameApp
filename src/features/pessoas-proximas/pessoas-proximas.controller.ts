import { useState } from 'react';

import type { MapPin } from '@/components/brand-map';
import { useNearbyPeopleQuery } from '@/services/people/people.service';

/** Posições relativas fixas para espalhar os pins no mapa placeholder. */
const pinSpots = [
  { x: 0.18, y: 0.48 },
  { x: 0.24, y: 0.55 },
  { x: 0.6, y: 0.32 },
  { x: 0.7, y: 0.28 },
  { x: 0.42, y: 0.6 },
  { x: 0.5, y: 0.66 },
  { x: 0.66, y: 0.62 },
];

/** Centraliza busca e pins da tela de pessoas próximas. */
export function usePessoasProximasController() {
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');

  const nearbyQuery = useNearbyPeopleQuery(query);
  const people = nearbyQuery.data ?? [];

  const pins: MapPin[] = people.map((person, index) => ({
    id: person.id,
    x: pinSpots[index % pinSpots.length].x,
    y: pinSpots[index % pinSpots.length].y,
    locked: person.restricted,
  }));

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
