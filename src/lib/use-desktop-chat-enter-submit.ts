import { useEffect, useRef } from 'react';
import {
  Platform,
  type NativeSyntheticEvent,
  type TextInputKeyPressEventData,
  type TextInputSelectionChangeEventData,
} from 'react-native';

type WebKeyEvent = NativeSyntheticEvent<TextInputKeyPressEventData> & {
  key?: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  target?: {
    setSelectionRange?: (start: number, end: number) => void;
  };
};

type Params = {
  value: string;
  onChangeText: (text: string) => void;
  canSend: boolean;
  onSend: () => void;
};

/**
 * No web/desktop: Enter envia; Ctrl/Cmd+Enter quebra linha.
 * Usa onKeyPress — no RN-web o onKeyDown do TextInput é sobrescrito internamente.
 */
export function useDesktopChatEnterSubmit({ value, onChangeText, canSend, onSend }: Params) {
  const selectionRef = useRef({ start: 0, end: 0 });
  const paramsRef = useRef({ value, onChangeText, canSend, onSend });

  useEffect(() => {
    paramsRef.current = { value, onChangeText, canSend, onSend };
  }, [value, onChangeText, canSend, onSend]);

  if (Platform.OS !== 'web') {
    return {};
  }

  return {
    onSelectionChange: (event: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => {
      selectionRef.current = event.nativeEvent.selection;
    },
    onKeyPress: (event: WebKeyEvent) => {
      const key = event.key ?? event.nativeEvent.key;
      if (key !== 'Enter') return;

      const native = event.nativeEvent as TextInputKeyPressEventData & {
        ctrlKey?: boolean;
        metaKey?: boolean;
        shiftKey?: boolean;
      };
      const withModifier = Boolean(
        event.ctrlKey || event.metaKey || native.ctrlKey || native.metaKey,
      );
      const withShift = Boolean(event.shiftKey || native.shiftKey);

      if (withModifier) {
        event.preventDefault();
        const { value: text, onChangeText: setText } = paramsRef.current;
        const { start, end } = selectionRef.current;
        const next = `${text.slice(0, start)}\n${text.slice(end)}`;
        const caret = start + 1;
        setText(next);
        selectionRef.current = { start: caret, end: caret };
        requestAnimationFrame(() => {
          event.target?.setSelectionRange?.(caret, caret);
        });
        return;
      }

      if (withShift) return;

      event.preventDefault();
      const current = paramsRef.current;
      if (current.canSend) current.onSend();
    },
  };
}
