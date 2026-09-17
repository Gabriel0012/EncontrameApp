import { useCallback, useEffect, useRef, type ReactNode } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';

import { enterDown, enterFade, enterRight, enterUp, exitUp } from '@/constants/motion';

type EnterFrom = 'up' | 'right' | 'down' | 'fade';

type BrandEnterProps = {
  children: ReactNode;
  from?: EnterFrom;
  index?: number;
  style?: StyleProp<ViewStyle>;
  /** Quando true, também anima a saída (fade + sobe). */
  withExit?: boolean;
  /** Pula a entrada — útil para itens já vistos no FlatList. */
  skip?: boolean;
};

const ENTER = {
  up: enterUp,
  right: enterRight,
  down: enterDown,
  fade: enterFade,
} as const;

/** Wrapper de entrada com fade + translate (ease-out, sem bounce). */
export function BrandEnter({
  children,
  from = 'up',
  index = 0,
  style,
  withExit = false,
  skip = false,
}: BrandEnterProps) {
  return (
    <Animated.View
      entering={skip ? undefined : ENTER[from](index)}
      exiting={withExit ? exitUp() : undefined}
      style={style}
    >
      {children}
    </Animated.View>
  );
}

/**
 * Marca ids já animados nesta montagem (evita reanimar item reciclado).
 * Retorna true na primeira vez que o id aparece (deve animar).
 * O id só entra em `seen` após o commit, para o Strict Mode não engolir a entrada.
 */
export function useEnterOnce() {
  const seen = useRef(new Set<string>());
  const pending = useRef(new Set<string>());

  useEffect(() => {
    pending.current.forEach((key) => {
      seen.current.add(key);
    });
    pending.current.clear();
  });

  return useCallback((key: string) => {
    if (seen.current.has(key)) {
      return false;
    }
    pending.current.add(key);
    return true;
  }, []);
}

/**
 * Histórico já presente no 1º lote não anima; ids novos depois disso entram.
 */
export function useSkipInitialEnter(ids: string[]) {
  const claimEnter = useEnterOnce();
  const historyIds = useRef<Set<string> | null>(null);

  if (historyIds.current == null) {
    historyIds.current = ids.length > 0 ? new Set(ids) : null;
  }

  return useCallback(
    (id: string) => (historyIds.current?.has(id) ?? false) || !claimEnter(id),
    [claimEnter],
  );
}
