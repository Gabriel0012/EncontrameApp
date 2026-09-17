import { type Href, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

import type { MapPin } from '@/components/brand-map';
import { completeAppOnboarding, isAppOnboardingComplete } from '@/lib/app-onboarding';
import { getBiometricEnabled } from '@/lib/biometric';
import { queryClient } from '@/lib/query-client';
import { clearSession, getRefreshToken, lockSession } from '@/lib/session';
import { isSofiaWelcomeComplete } from '@/lib/sofia-prefs';
import { useSessionUser } from '@/lib/use-session-user';
import { useUserLocation } from '@/lib/use-user-location';
import { getAuthRepository } from '@/services/auth/auth.repository';
import { useNearbyPeopleQuery } from '@/services/people/people.service';

const ONBOARDING_LAST_STEP = 2;

/** Centraliza dados e navegação da tela inicial (dashboard). */
export function useInicioController() {
  const router = useRouter();
  const sessionUser = useSessionUser();
  const { location: userLocation, denied: locationDenied } = useUserLocation();
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const peopleQuery = useNearbyPeopleQuery({
    query,
    latitude: userLocation?.latitude,
    longitude: userLocation?.longitude,
  });

  const [menuOpen, setMenuOpen] = useState(false);
  const [onboardingVisible, setOnboardingVisible] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const loggedIn = sessionUser != null;

  useEffect(() => {
    let cancelled = false;
    void isAppOnboardingComplete().then((done) => {
      if (!cancelled) {
        setOnboardingVisible(!done);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const people = peopleQuery.data ?? [];
  const waitingLocation = !locationDenied && userLocation == null;
  const showPeopleSkeleton =
    waitingLocation ||
    peopleQuery.isLoading ||
    peopleQuery.isPlaceholderData ||
    (peopleQuery.isFetching && people.length === 0);

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

  const closeMenu = () => setMenuOpen(false);

  /** Fecha o menu e navega para a rota escolhida. */
  const goTo = (action: () => void) => {
    closeMenu();
    action();
  };

  const openSearch = () => {
    closeMenu();
    setSearchOpen(true);
  };

  const closeSearch = () => setSearchOpen(false);

  const handleSearch = () => {
    setQuery(search.trim());
  };

  const clearSearch = () => {
    setSearch('');
    setQuery('');
  };

  const finishOnboarding = (after?: () => void) => {
    setOnboardingVisible(false);
    void completeAppOnboarding();
    after?.();
  };

  const onboardingContinue = () => {
    setOnboardingStep((current) => Math.min(current + 1, ONBOARDING_LAST_STEP));
  };

  const onboardingReport = () => {
    finishOnboarding();
  };

  const onboardingRegister = () => {
    finishOnboarding(() => router.push('/cadastrar-pessoa'));
  };

  const onboardingExplore = () => {
    finishOnboarding();
  };

  const onboardingRequestClose = () => {
    if (onboardingStep === ONBOARDING_LAST_STEP) {
      onboardingExplore();
      return;
    }

    if (onboardingStep > 0) {
      setOnboardingStep((current) => current - 1);
    }
  };

  const logout = () =>
    goTo(() => {
      void (async () => {
        const biometricOn = await getBiometricEnabled();
        if (biometricOn) {
          await lockSession();
          queryClient.clear();
          router.replace('/inicio');
          return;
        }

        const refreshToken = getRefreshToken();
        try {
          await getAuthRepository().logout(refreshToken);
        } finally {
          await clearSession();
          queryClient.clear();
          router.replace('/inicio');
        }
      })();
    });

  return {
    people,
    pins,
    userLocation,
    locationDenied,
    search,
    setSearch,
    searchOpen,
    openSearch,
    closeSearch,
    handleSearch,
    clearSearch,
    loading: peopleQuery.isLoading || peopleQuery.isFetching,
    showPeopleSkeleton,
    loggedIn,
    menuOpen,
    openMenu: () => {
      closeSearch();
      setMenuOpen(true);
    },
    closeMenu,
    goToPerson: (personId: string) => router.push(`/pessoa/${personId}` as Href),
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
    goToAllPeopleFromMenu: () => goTo(() => router.push('/pessoas-desaparecidas' as Href)),
    goToAllPeople: () => router.push('/pessoas-desaparecidas' as Href),
    goToLogin: () => goTo(() => router.push('/login')),
    logout,
    onboardingVisible,
    onboardingStep,
    onboardingContinue,
    onboardingReport,
    onboardingRegister,
    onboardingExplore,
    onboardingRequestClose,
  };
}

export type InicioController = ReturnType<typeof useInicioController>;
