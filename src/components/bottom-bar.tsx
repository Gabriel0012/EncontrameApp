import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Brand } from '@/constants/brand';

type Tab = 'camera' | 'home' | 'phone';

type Props = {
  /** Aba ativa (fica em destaque escuro); as demais ficam laranja. */
  active?: Tab;
};

/**
 * Barra inferior de navegação: câmera (cadastrar pessoa), início e chat.
 */
export function BottomBar({ active }: Props) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const colorFor = (tab: Tab) => (active === tab ? Brand.textDark : Brand.orange);

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <Pressable hitSlop={12} onPress={() => router.push('/cadastrar-pessoa')}>
        <MaterialCommunityIcons name="camera" size={26} color={colorFor('camera')} />
      </Pressable>
      <Pressable hitSlop={12} onPress={() => router.push('/inicio')}>
        <MaterialCommunityIcons name="home" size={26} color={colorFor('home')} />
      </Pressable>
      <Pressable hitSlop={12} onPress={() => router.push('/chat')}>
        <MaterialCommunityIcons name="phone" size={26} color={colorFor('phone')} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Brand.divider,
    backgroundColor: Brand.white,
  },
});
