import { useCallback, useEffect, useRef } from 'react';
import {
  Keyboard,
  Platform,
  type FlatList,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';

type ScrollableNode = {
  scrollHeight: number;
  scrollTop: number;
};

const PIN_THRESHOLD_PX = 80;
const KEYBOARD_FOLLOW_MS = 450;

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

/** Mantém uma FlatList de chat no fim quando o conteúdo cresce ou o teclado abre. */
export function useScrollListToEnd<T>(trigger: unknown) {
  const listRef = useRef<FlatList<T>>(null);
  const heightRef = useRef(0);
  const pinnedToEndRef = useRef(true);

  const scrollToEnd = useCallback((animated = false) => {
    const list = listRef.current;
    if (!list) return;

    if (Platform.OS === 'web') {
      const node = getWebScrollNode(list);
      if (node) {
        node.scrollTop = node.scrollHeight;
        return;
      }
    }

    list.scrollToEnd({ animated });
  }, []);

  const onListScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
    const distanceFromEnd = contentSize.height - layoutMeasurement.height - contentOffset.y;
    pinnedToEndRef.current = distanceFromEnd <= PIN_THRESHOLD_PX;
  }, []);

  const onListLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const nextHeight = event.nativeEvent.layout.height;
      const previousHeight = heightRef.current;
      heightRef.current = nextHeight;

      if (previousHeight > 0 && nextHeight < previousHeight - 4 && pinnedToEndRef.current) {
        scrollToEnd(false);
      }
    },
    [scrollToEnd],
  );

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

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    let follow: ReturnType<typeof setInterval> | null = null;
    let followTimeout: ReturnType<typeof setTimeout> | null = null;

    const stopFollow = () => {
      if (follow) {
        clearInterval(follow);
        follow = null;
      }
      if (followTimeout) {
        clearTimeout(followTimeout);
        followTimeout = null;
      }
    };

    const startFollow = () => {
      if (!pinnedToEndRef.current) return;
      scrollToEnd(false);
      stopFollow();
      follow = setInterval(() => {
        if (pinnedToEndRef.current) {
          scrollToEnd(false);
        }
      }, 32);
      followTimeout = setTimeout(() => {
        stopFollow();
        if (pinnedToEndRef.current) {
          scrollToEnd(false);
        }
      }, KEYBOARD_FOLLOW_MS);
    };

    const show = Keyboard.addListener(showEvent, startFollow);
    const hide = Keyboard.addListener(hideEvent, stopFollow);

    return () => {
      show.remove();
      hide.remove();
      stopFollow();
    };
  }, [scrollToEnd]);

  return { listRef, scrollToEnd, onListLayout, onListScroll };
}
