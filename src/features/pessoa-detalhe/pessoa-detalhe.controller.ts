import * as Location from 'expo-location';
import { type Href, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';

import { fieldErrorMessage } from '@/lib/error-messages';
import {
  geocodeAddress,
  resolveAddressSuggestion,
  reverseGeocode,
  suggestAddresses,
  type AddressSuggestion,
} from '@/lib/geocode';
import { getSessionUser } from '@/lib/session';
import { usePersonQuery, useReportLastSeenMutation } from '@/services/people/people.service';

const SUGGEST_MIN_CHARS = 3;
const SUGGEST_DEBOUNCE_MS = 300;

/** Centraliza dados, avistamento e navegação da tela de detalhe. */
export function usePessoaDetalheController() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : (params.id ?? '');

  const personQuery = usePersonQuery(id);
  const reportMutation = useReportLastSeenMutation(id);

  const [formOpen, setFormOpen] = useState(false);
  const [address, setAddress] = useState('');
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [suggesting, setSuggesting] = useState(false);
  const [addressError, setAddressError] = useState<string | undefined>();
  const [formMessage, setFormMessage] = useState<string | undefined>();
  const [locating, setLocating] = useState(false);
  const suggestGen = useRef(0);

  const person = personQuery.data ?? null;

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
    if (getSessionUser() == null) {
      router.push({ pathname: '/login', params: { returnTo: `/pessoa/${id}` } } as Href);
      return;
    }

    setFormOpen(true);
    setFormMessage(undefined);
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

  const submitSighting = () => {
    void (async () => {
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
        setFormMessage('Avistamento registrado. Obrigado por ajudar.');
        setFormOpen(false);
        setAddress('');
        setCoords(null);
        setSuggestions([]);
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
    locating,
    submitting: reportMutation.isPending,
    openSightingForm,
    useCurrentLocation,
    submitSighting,
  };
}

export type PessoaDetalheController = ReturnType<typeof usePessoaDetalheController>;
