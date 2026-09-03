import { useCallback, useEffect, useRef } from 'react';
import { Platform, type FlatList } from 'react-native';

type ScrollableNode = {
  scrollHeight: number;
  scrollTop: number;
};

function getWebScrollNode(list: object | null): ScrollableNode | null {
  if (!list) return null;
  const host = list as {
    getScrollableNode?: () => unknown;
    getNativeScrollRef?: () => unknown;
  };
  const node = host.getScrollableNode?.() ?? host.getNativeScrollRef?.();
  if (node && typeof (node as ScrollableNode).scrollHeight === 'number') {
    return node as ScrollableNode;
  }
  return null;
}

/** Mantém uma FlatList de chat no fim quando o conteúdo cresce. */
export function useScrollListToEnd<T>(trigger: unknown) {
  const listRef = useRef<FlatList<T>>(null);

  const scrollToEnd = useCallback(() => {
    const list = listRef.current;
    if (!list) return;

    if (Platform.OS === 'web') {
      const node = getWebScrollNode(list);
      if (node) {
        node.scrollTop = node.scrollHeight;
        return;
      }
    }

    list.scrollToEnd({ animated: false });
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => scrollToEnd());
    const short = setTimeout(() => scrollToEnd(), 50);
    const afterFooter = setTimeout(() => scrollToEnd(), 200);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(short);
      clearTimeout(afterFooter);
    };
  }, [scrollToEnd, trigger]);

  return { listRef, scrollToEnd };
}
