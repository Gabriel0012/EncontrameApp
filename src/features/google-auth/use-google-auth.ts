import * as Google from 'expo-auth-session/providers/google';
import { type Href, usePathname, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { Platform } from 'react-native';

import { parseApiError } from '@/lib/api-errors';
import { env } from '@/lib/env';
import { generalErrorMessage } from '@/lib/error-messages';
import {
  clearGoogleSignupDraft,
  setGoogleSignupDraft,
} from '@/lib/google-signup-draft';
import { useGoogleStartMutation } from '@/services/auth/auth.service';

const GOOGLE_ERROR = 'Não foi possível entrar com o Google.';

function googleRedirectUri() {
  if (typeof window === 'undefined') return undefined;
  return `${window.location.origin}/`;
}

interface UseGoogleAuthOptions {
  /** Destino após login Google de conta já existente. */
  successHref?: Href;
  /** Chamado quando o e-mail ainda não tem cadastro (já com draft gravado). */
  onNeedsRegistration?: () => void;
  /** Roda após autenticar (ex.: oferecer biometria) e antes de navegar. */
  beforeSuccess?: () => Promise<void>;
}

/** Prompt Google (web) e decide entre sessão imediata ou cadastro incompleto. */
export function useGoogleAuth(options: UseGoogleAuthOptions = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const googleStart = useGoogleStartMutation();
  const [error, setError] = useState('');
  const [prompting, setPrompting] = useState(false);

  const available = Platform.OS === 'web' && Boolean(env.googleWebClientId);
  const redirectUri = googleRedirectUri();

  const [request, , promptAsync] = Google.useIdTokenAuthRequest({
    clientId: env.googleWebClientId || undefined,
    webClientId: env.googleWebClientId || undefined,
    redirectUri,
  });

  const promptGoogle = async () => {
    if (!available || !request) return;

    setError('');
    setPrompting(true);
    try {
      const authResult = await promptAsync({ windowName: 'encontrame-google-auth' });
      WebBrowser.dismissAuthSession();

      if (authResult.type !== 'success') {
        if (authResult.type === 'error') setError(GOOGLE_ERROR);
        return;
      }

      const idToken = authResult.params.id_token;
      if (!idToken) {
        setError(GOOGLE_ERROR);
        return;
      }

      const result = await googleStart.mutateAsync(idToken);
      if (result.status === 'authenticated') {
        clearGoogleSignupDraft();
        await options.beforeSuccess?.();
        router.replace((options.successHref ?? '/inicio') as Href);
        return;
      }

      setGoogleSignupDraft({
        idToken,
        email: result.profile.email,
        name: result.profile.name,
      });

      if (options.onNeedsRegistration) {
        options.onNeedsRegistration();
      } else if (pathname !== '/signup') {
        router.replace('/signup');
      }
    } catch (caught) {
      WebBrowser.dismissAuthSession();
      const { code } = parseApiError(caught);
      setError(code === 'invalid_credentials' ? GOOGLE_ERROR : generalErrorMessage(code));
    } finally {
      setPrompting(false);
    }
  };

  return {
    available,
    ready: Boolean(request),
    submitting: prompting || googleStart.isPending,
    error,
    promptGoogle,
  };
}
