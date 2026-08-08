import { useRouter } from 'expo-router';
import { useState } from 'react';

import type { MapPin } from '@/components/brand-map';
import { usePeopleQuery } from '@/services/people/people.service';

/** Centraliza dados e navegação da tela inicial (dashboard). */
export function useInicioController() {
  const router = useRouter();
  const peopleQuery = usePeopleQuery();

  const [menuOpen, setMenuOpen] = useState(false);

  const people = peopleQuery.data ?? [];

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

  const closeMenu = () => setMenuOpen(false);

  /** Fecha o menu e navega para a rota escolhida. */
  const goTo = (action: () => void) => {
    closeMenu();
    action();
  };

  return {
    people,
    pins,
    loading: peopleQuery.isLoading,
    menuOpen,
    openMenu: () => setMenuOpen(true),
    closeMenu,
    goToNearby: () => router.push('/pessoas-proximas'),
    goToRegister: () => router.push('/cadastrar-pessoa'),
    goToChat: () => goTo(() => router.push('/chat')),
    goToRegisterFromMenu: () => goTo(() => router.push('/cadastrar-pessoa')),
    goToNearbyFromMenu: () => goTo(() => router.push('/pessoas-proximas')),
    logout: () => goTo(() => router.replace('/')),
  };
}

export type InicioController = ReturnType<typeof useInicioController>;
