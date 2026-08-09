import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Brand, Radius } from '@/constants/brand';

type Tab = 'register' | 'home' | 'phone';

type Props = {
  /** Aba ativa (fundo azul + ícone branco); as demais ficam cinza. */
  active?: Tab;
};

/**
 * Barra inferior de navegação: telefone (emergência), início e cadastrar pessoa.
 */
export function BottomBar({ active }: Props) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const renderTab = (
    tab: Tab,
    icon: keyof typeof MaterialCommunityIcons.glyphMap,
    onPress?: () => void,
  ) => {
    const isActive = active === tab;
    const content = (
      <View style={[styles.iconWrap, isActive && styles.iconWrapActive]}>
        <MaterialCommunityIcons
          name={icon}
          size={26}
          color={isActive ? Brand.white : Brand.label}
        />
      </View>
    );

    if (!onPress) {
      return (
        <View key={tab} accessibilityState={{ disabled: true }}>
          {content}
        </View>
      );
    }

    return (
      <Pressable key={tab} hitSlop={12} onPress={onPress}>
        {content}
      </Pressable>
    );
  };

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      {renderTab('phone', 'phone')}
      {renderTab('home', 'home', () => router.push('/inicio'))}
      {renderTab('register', 'account-plus', () => router.push('/cadastrar-pessoa'))}
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
    borderTopColor: Brand.fieldBorder,
    backgroundColor: Brand.white,
  },
  iconWrap: {
    padding: 8,
    borderRadius: Radius.sm,
  },
  iconWrapActive: {
    backgroundColor: Brand.blue,
  },
});
