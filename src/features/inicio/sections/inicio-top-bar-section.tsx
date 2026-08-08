import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Brand } from '@/constants/brand';
import type { InicioController } from '@/features/inicio/inicio.controller';

interface InicioTopBarSectionProps {
  controller: InicioController;
}

export function InicioTopBarSection({ controller }: InicioTopBarSectionProps) {
  return (
    <View style={styles.bar}>
      <View style={styles.brand}>
        <View style={styles.badge}>
          <MaterialCommunityIcons name="account-group" size={22} color={Brand.white} />
        </View>
        <Text style={styles.title}>Encontra-me</Text>
      </View>

      <Pressable style={styles.badge} hitSlop={8} onPress={controller.openMenu}>
        <MaterialCommunityIcons name="menu" size={22} color={Brand.white} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  badge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Brand.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Brand.textDark,
  },
});
