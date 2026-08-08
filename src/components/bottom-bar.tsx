import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Brand } from '@/constants/brand';

/**
 * Barra inferior presente nos protótipos das telas de cadastro/login.
 * Ainda é apenas visual — as ações serão ligadas quando as telas
 * de câmera, início e contato existirem.
 */
export function BottomBar() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <MaterialCommunityIcons name="camera" size={26} color={Brand.orange} />
      <MaterialCommunityIcons name="home" size={26} color={Brand.textDark} />
      <MaterialCommunityIcons name="phone" size={26} color={Brand.orange} />
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
    borderTopColor: '#EDEDF1',
    backgroundColor: Brand.white,
  },
});
