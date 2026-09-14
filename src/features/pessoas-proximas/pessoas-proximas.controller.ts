import { type Href, useRouter } from 'expo-router';
import { useState } from 'react';

import type { MapPin } from '@/components/brand-map';
import { useUserLocation } from '@/lib/use-user-location';
import { useNearbyPeopleQuery } from '@/services/people/people.service';

/** Centraliza busca e pins da tela de pessoas próximas. */
export function usePessoasProximasController() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');

  const { location: userLocation, denied: locationDenied } = useUserLocation();
  const nearbyQuery = useNearbyPeopleQuery({
    query,
    latitude: userLocation?.latitude,
    longitude: userLocation?.longitude,
  });
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
        photoUri: person.photoUri,
        label: person.nickname ?? person.fullName,
        onPress: () => router.push(`/pessoa/${person.id}` as Href),
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
    userLocation,
    locationDenied,
    loading: nearbyQuery.isLoading || nearbyQuery.isFetching,
    handleSearch,
  };
}

export type PessoasProximasController = ReturnType<typeof usePessoasProximasController>;
