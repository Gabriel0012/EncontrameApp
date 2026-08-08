import { useRouter } from 'expo-router';

import type { MapPin } from '@/components/brand-map';
import { usePeopleQuery } from '@/services/people/people.service';

/** Posições relativas fixas para espalhar os pins no mapa placeholder. */
const pinSpots = [
  { x: 0.32, y: 0.42 },
  { x: 0.62, y: 0.3 },
  { x: 0.48, y: 0.66 },
  { x: 0.74, y: 0.58 },
  { x: 0.2, y: 0.7 },
];

/** Centraliza dados e navegação da tela inicial (dashboard). */
export function useInicioController() {
  const router = useRouter();
  const peopleQuery = usePeopleQuery();

  const people = peopleQuery.data ?? [];

  const pins: MapPin[] = people.map((person, index) => ({
    id: person.id,
    x: pinSpots[index % pinSpots.length].x,
    y: pinSpots[index % pinSpots.length].y,
    locked: person.restricted,
  }));

  return {
    people,
    pins,
    loading: peopleQuery.isLoading,
    goToNearby: () => router.push('/pessoas-proximas'),
    goToRegister: () => router.push('/cadastrar-pessoa'),
    openMenu: () => {
      // TODO: abrir menu lateral quando as demais telas existirem.
    },
  };
}

export type InicioController = ReturnType<typeof useInicioController>;
