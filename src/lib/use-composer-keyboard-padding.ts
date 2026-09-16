import { useEffect } from 'react';
import { Keyboard, Platform } from 'react-native';
import {
  useAnimatedKeyboard,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * No Android (edge-to-edge) o teclado cobre o compositor. Este padding
 * sobe input + botão junto com o teclado, no estilo WhatsApp.
 * No iOS o KeyboardAvoidingView da tela já cuida disso.
 */
export function useComposerKeyboardPadding() {
  const insets = useSafeAreaInsets();
  const keyboard = useAnimatedKeyboard({
    isStatusBarTranslucentAndroid: true,
    isNavigationBarTranslucentAndroid: true,
  });
  const fallbackHeight = useSharedValue(0);

  useEffect(() => {
    if (Platform.OS !== 'android') {
      return;
    }

    const show = Keyboard.addListener('keyboardDidShow', (event) => {
      fallbackHeight.value = event.endCoordinates.height;
    });
    const hide = Keyboard.addListener('keyboardDidHide', () => {
      fallbackHeight.value = 0;
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, [fallbackHeight]);

  return useAnimatedStyle(() => {
    if (Platform.OS !== 'android') {
      return { paddingBottom: 0 };
    }

    const keyboardHeight = Math.max(keyboard.height.value, fallbackHeight.value);
    return {
      paddingBottom: keyboardHeight > 0 ? keyboardHeight : insets.bottom,
    };
  });
}
