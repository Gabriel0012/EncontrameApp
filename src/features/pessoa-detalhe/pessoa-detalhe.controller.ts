import * as Location from 'expo-location';
import { type Href, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';

import type { MapPin, MapPolyline } from '@/components/brand-map';
import { fieldErrorMessage } from '@/lib/error-messages';
import {
  geocodeAddress,
  resolveAddressSuggestion,
  reverseGeocode,
  suggestAddresses,
  type AddressSuggestion,
} from '@/lib/geocode';
import { isLocalPersonId } from '@/lib/person-status';
import { getSessionUser } from '@/lib/session';
import { useUserLocation } from '@/lib/use-user-location';
import { usePersonQuery, useLastSeenHistoryQuery, useReportLastSeenMutation } from '@/services/people/people.service';
import type { PersonLastSeen } from '@/services/people/people.types';

const SUGGEST_MIN_CHARS = 3;
const SUGGEST_DEBOUNCE_MS = 300;
const HISTORY_PREVIOUS_OPACITY = 0.55;

/** Centraliza dados, avistamento e navegação da tela de detalhe. */
export function usePessoaDetalheController() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : (params.id ?? '');

  const personQuery = usePersonQuery(id);
  const reportMutation = useReportLastSeenMutation(id);
  const { location: userLocation } = useUserLocation();

  const [formOpen, setFormOpen] = useState(false);
  const [address, setAddress] = useState('');
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [suggesting, setSuggesting] = useState(false);
  const [addressError, setAddressError] = useState<string | undefined>();
  const [formMessage, setFormMessage] = useState<string | undefined>();
  const [thanksOpen, setThanksOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [locating, setLocating] = useState(false);
  const suggestGen = useRef(0);
  const historyQuery = useLastSeenHistoryQuery(id, historyOpen);

  const person = personQuery.data ?? null;
  const isLocalPerson = isLocalPersonId(id);
  const sightingBlockedMessage = isLocalPerson
    ? getSessionUser() == null
      ? 'Entre na sua conta para enviar este cadastro e registrar avistamentos.'
      : 'Este cadastro ainda não foi enviado. Conecte-se à internet e tente novamente.'
    : undefined;

  useEffect(() => {
    if (!formOpen) {
      return;
    }

    const trimmed = address.trim();
    if (coords || trimmed.length < SUGGEST_MIN_CHARS) {
      return;
    }

    const generation = ++suggestGen.current;
    const timer = setTimeout(() => {
      void (async () => {
        setSuggesting(true);
        const items = await suggestAddresses(trimmed);
        if (generation !== suggestGen.current) {
          return;
        }

        setSuggestions(items);
        setSuggesting(false);
      })();
    }, SUGGEST_DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
    };
  }, [address, coords, formOpen]);

  const openSightingForm = () => {
    if (isLocalPersonId(id)) {
      return;
    }

    if (getSessionUser() == null) {
      router.push({ pathname: '/login', params: { returnTo: `/pessoa/${id}` } } as Href);
      return;
    }

    setFormOpen(true);
    setFormMessage(undefined);
    setThanksOpen(false);
    setAddressError(undefined);
    setSuggestions([]);
  };

  const useCurrentLocation = () => {
    void (async () => {
      setLocating(true);
      setAddressError(undefined);
      setFormMessage(undefined);
      setSuggestions([]);
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setAddressError('Permita o acesso à localização para usar este recurso.');
          return;
        }

        const current = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        const next = {
          latitude: current.coords.latitude,
          longitude: current.coords.longitude,
        };
        setCoords(next);
        const label = await reverseGeocode(next.latitude, next.longitude);
        setAddress(label ?? 'Localização atual');
      } catch {
        setAddressError('Não foi possível obter sua localização.');
      } finally {
        setLocating(false);
      }
    })();
  };

  const pickSuggestion = (suggestion: AddressSuggestion) => {
    void (async () => {
      setAddressError(undefined);
      const resolved = await resolveAddressSuggestion(suggestion);
      if (!resolved) {
        setAddressError('Não encontramos esse endereço. Tente outro ou use sua localização.');
        return;
      }

      suggestGen.current += 1;
      setAddress(resolved.label);
      setCoords({ latitude: resolved.latitude, longitude: resolved.longitude });
      setSuggestions([]);
      setSuggesting(false);
    })();
  };

  const placeSightingOnMap = (latitude: number, longitude: number) => {
    const generation = ++suggestGen.current;
    setCoords({ latitude, longitude });
    setSuggestions([]);
    setSuggesting(false);
    if (addressError) setAddressError(undefined);

    void reverseGeocode(latitude, longitude).then((label) => {
      if (generation !== suggestGen.current) {
        return;
      }
      setAddress(label ?? 'Localização atual');
    });
  };

  const handlePinDragEnd = (_id: string, latitude: number, longitude: number) => {
    placeSightingOnMap(latitude, longitude);
  };

  const sightingPins: MapPin[] = useMemo(() => {
    if (!coords) {
      return [];
    }

    return [
      {
        id: person?.id ?? 'sighting',
        latitude: coords.latitude,
        longitude: coords.longitude,
        label: person?.nickname ?? person?.fullName,
        photoUri: person?.photoUri,
        draggable: true,
      },
    ];
  }, [coords, person]);

  const historyItems = useMemo(() => {
    if (isLocalPerson) {
      if (!person?.coords) {
        return [];
      }

      return [
        {
          id: `${person.id}-local`,
          location: person.lastSeen ?? person.location,
          city: person.city,
          neighborhood: person.neighborhood,
          state: person.state,
          latitude: person.coords.latitude,
          longitude: person.coords.longitude,
          dtRegistration: person.dtLastSeen ?? new Date().toISOString(),
        } satisfies PersonLastSeen,
      ];
    }

    return [...(historyQuery.data ?? [])].sort((left, right) => {
      const leftTime = new Date(left.dtRegistration).getTime();
      const rightTime = new Date(right.dtRegistration).getTime();
      return leftTime - rightTime;
    });
  }, [historyQuery.data, isLocalPerson, person]);

  const mappedSightings = useMemo(
    () =>
      historyItems.filter(
        (item): item is PersonLastSeen & { latitude: number; longitude: number } =>
          item.latitude != null &&
          item.longitude != null &&
          Number.isFinite(item.latitude) &&
          Number.isFinite(item.longitude),
      ),
    [historyItems],
  );

  const historyPins: MapPin[] = useMemo(() => {
    const lastIndex = mappedSightings.length - 1;
    return mappedSightings.map((item, index) => ({
      id: item.id,
      latitude: item.latitude,
      longitude: item.longitude,
      photoUri: person?.photoUri,
      opacity: index === lastIndex ? 1 : HISTORY_PREVIOUS_OPACITY,
      zIndex: index + 1,
      tooltip: {
        title: formatSightingDate(item.dtRegistration),
        subtitle: formatSightingAddress(item),
      },
    }));
  }, [mappedSightings, person?.photoUri]);

  const historyPolylines: MapPolyline[] = useMemo(() => {
    if (mappedSightings.length < 2) {
      return [];
    }

    return [
      {
        id: `${id}-trail`,
        dashed: true,
        coordinates: mappedSightings.map((item) => ({
          latitude: item.latitude,
          longitude: item.longitude,
        })),
      },
    ];
  }, [id, mappedSightings]);

  const submitSighting = () => {
    void (async () => {
      if (isLocalPersonId(id)) {
        return;
      }

      if (getSessionUser() == null) {
        router.push({ pathname: '/login', params: { returnTo: `/pessoa/${id}` } } as Href);
        return;
      }

      setAddressError(undefined);
      setFormMessage(undefined);

      let point = coords;
      const trimmed = address.trim();
      if (!point) {
        if (!trimmed) {
          setAddressError(fieldErrorMessage('location', 'required'));
          return;
        }

        if (suggestions.length > 0) {
          setAddressError('Escolha um endereço da lista.');
          return;
        }

        point = await geocodeAddress(trimmed);
        if (!point) {
          setAddressError('Não encontramos esse endereço. Tente outro ou use sua localização.');
          return;
        }
      }

      try {
        await reportMutation.mutateAsync({
          location: trimmed || 'Localização atual',
          latitude: point.latitude,
          longitude: point.longitude,
        });
        setFormOpen(false);
        setAddress('');
        setCoords(null);
        setSuggestions([]);
        setThanksOpen(true);
      } catch {
        setFormMessage('Não foi possível registrar o avistamento. Tente novamente.');
      }
    })();
  };

  return {
    id,
    person,
    loading: personQuery.isLoading,
    notFound: !personQuery.isLoading && (personQuery.isError || person == null),
    formOpen,
    address,
    setAddress: (value: string) => {
      suggestGen.current += 1;
      setAddress(value);
      setCoords(null);
      setSuggestions([]);
      setSuggesting(false);
      if (addressError) setAddressError(undefined);
    },
    suggestions,
    suggesting,
    pickSuggestion,
    addressError,
    formMessage,
    thanksOpen,
    historyOpen,
    locating,
    submitting: reportMutation.isPending,
    historyLoading: historyQuery.isLoading,
    historyError: historyQuery.isError,
    isLocalPerson,
    sightingBlockedMessage,
    sightingPins,
    historyPins,
    historyPolylines,
    userLocation,
    placeSightingOnMap,
    handlePinDragEnd,
    openSightingForm,
    openHistory: () => setHistoryOpen(true),
    closeHistory: () => setHistoryOpen(false),
    useCurrentLocation,
    submitSighting,
    closeThanks: () => setThanksOpen(false),
    goToInicio: () => {
      setThanksOpen(false);
      router.replace('/inicio' as Href);
    },
  };
}

export type PessoaDetalheController = ReturnType<typeof usePessoaDetalheController>;

function formatSightingDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
}

function formatSightingAddress(item: PersonLastSeen) {
  const parts = [item.location, item.neighborhood, item.city, item.state].filter(
    (value): value is string => Boolean(value?.trim()),
  );
  const unique: string[] = [];
  for (const part of parts) {
    if (!unique.some((existing) => existing.toLowerCase() === part.toLowerCase())) {
      unique.push(part);
    }
  }
  return unique.join(', ') || 'Local não informado';
}
