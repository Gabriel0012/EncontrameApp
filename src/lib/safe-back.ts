import { type Href, useNavigation, useRouter } from 'expo-router';
import { useCallback } from 'react';

const DEFAULT_FALLBACK: Href = '/inicio';

type BackRouter = {
  canGoBack: () => boolean;
  back: () => void;
  replace: (href: Href) => void;
};

type BackNavigation = {
  canGoBack: () => boolean;
  goBack: () => void;
};

/**
 * Volta só se a pilha do navigator tiver tela anterior.
 * `router.canGoBack()` no web olha o histórico do browser e dá falso positivo
 * (GO_BACK sem tela / tela em branco) depois de `replace` ou remount do Stack.
 */
export function goBackOrReplace(
  router: BackRouter,
  fallback: Href = DEFAULT_FALLBACK,
  navigation?: BackNavigation,
) {
  if (navigation?.canGoBack()) {
    navigation.goBack();
    return;
  }
  if (!navigation && router.canGoBack()) {
    router.back();
    return;
  }
  router.replace(fallback);
}

/** Handler de voltar com fallback, usando a pilha real do React Navigation. */
export function useSafeBack(fallback: Href = DEFAULT_FALLBACK) {
  const router = useRouter();
  const navigation = useNavigation();

  return useCallback(() => {
    goBackOrReplace(router, fallback, navigation);
  }, [fallback, navigation, router]);
}
