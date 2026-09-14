import { type Href, useRouter } from 'expo-router';
import { useState } from 'react';

import type { MapPin } from '@/components/brand-map';
import { getBiometricEnabled } from '@/lib/biometric';
import { queryClient } from '@/lib/query-client';
import { clearSession, getRefreshToken, getSessionUser, lockSession } from '@/lib/session';
import { isSofiaWelcomeComplete } from '@/lib/sofia-prefs';
import { useUserLocation } from '@/lib/use-user-location';
import { getAuthRepository } from '@/services/auth/auth.repository';
import { usePeopleQuery } from '@/services/people/people.service';

/** Centraliza dados e navegação da tela inicial (dashboard). */
export function useInicioController() {
  const router = useRouter();
  const peopleQuery = usePeopleQuery();
  const userLocation = useUserLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(() => getSessionUser() != null);

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
        photoUri: person.photoUri,
        label: person.nickname ?? person.fullName,
      },
    ];
  });

  const closeMenu = () => setMenuOpen(false);

  /** Fecha o menu e navega para a rota escolhida. */
  const goTo = (action: () => void) => {
    closeMenu();
    action();
  };

  const logout = () =>
    goTo(() => {
      void (async () => {
        const biometricOn = await getBiometricEnabled();
        if (biometricOn) {
          await lockSession();
          queryClient.clear();
          setLoggedIn(false);
          router.replace('/inicio');
          return;
        }

        const refreshToken = getRefreshToken();
        try {
          await getAuthRepository().logout(refreshToken);
        } finally {
          await clearSession();
          queryClient.clear();
          setLoggedIn(false);
          router.replace('/inicio');
        }
      })();
    });

  return {
    people,
    pins,
    userLocation,
    loading: peopleQuery.isLoading,
    loggedIn,
    menuOpen,
    openMenu: () => setMenuOpen(true),
    closeMenu,
    goToNearby: () => router.push('/pessoas-proximas'),
    goToPerson: (personId: string) => router.push(`/pessoa/${personId}` as Href),
    goToRegister: () => router.push('/cadastrar-pessoa'),
    goToChat: () =>
      goTo(() => {
        void isSofiaWelcomeComplete().then((done) => {
          router.push((done ? '/chat' : '/sofia-welcome') as Href);
        });
      }),
    goToTheme: () => goTo(() => router.push('/sofia-theme' as Href)),
    goToGroupChat: () => goTo(() => router.push('/grupo-chat')),
    goToHomeFromMenu: () => goTo(() => router.push('/inicio')),
    goToRegisterFromMenu: () => goTo(() => router.push('/cadastrar-pessoa')),
    goToNearbyFromMenu: () => goTo(() => router.push('/pessoas-proximas')),
    goToLogin: () => goTo(() => router.push('/login')),
    logout,
  };
}

export type InicioController = ReturnType<typeof useInicioController>;
