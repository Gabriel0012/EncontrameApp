import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useState } from 'react';

import { Brand, Radius } from '@/constants/brand';
import { useTimedColor, useTimedOpacity } from '@/lib/use-brand-transition';
import type { InicioController } from '@/features/inicio/inicio.controller';

interface InicioTopBarSectionProps {
  controller: InicioController;
}

type MenuItem = {
  key: string;
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  onPress: () => void;
  danger?: boolean;
};

function MenuItemRow({ item }: { item: MenuItem }) {
  const [highlighted, setHighlighted] = useState(false);
  const bgStyle = useTimedColor(highlighted, 'transparent', Brand.divider, 'backgroundColor');

  return (
    <Pressable
      onPress={item.onPress}
      onPressIn={() => setHighlighted(true)}
      onPressOut={() => setHighlighted(false)}
      onHoverIn={() => setHighlighted(true)}
      onHoverOut={() => setHighlighted(false)}
      android_ripple={{ color: Brand.divider }}
    >
      <Animated.View style={[styles.menuItem, bgStyle]}>
        <MaterialCommunityIcons
          name={item.icon}
          size={22}
          color={item.danger ? Brand.orangeDark : Brand.blue}
        />
        <Text style={[styles.menuLabel, item.danger && styles.menuLabelDanger]}>{item.label}</Text>
      </Animated.View>
    </Pressable>
  );
}

export function InicioTopBarSection({ controller }: InicioTopBarSectionProps) {
  const menuItems: MenuItem[] = [
    {
      key: 'chat',
      label: 'Chat com a Sofia (IA)',
      icon: 'robot-happy-outline',
      onPress: controller.goToChat,
    },
    {
      key: 'grupo-chat',
      label: 'Grupo do apoio',
      icon: 'account-group-outline',
      onPress: controller.goToGroupChat,
    },
    {
      key: 'register',
      label: 'Cadastrar uma pessoa',
      icon: 'account-plus-outline',
      onPress: controller.goToRegisterFromMenu,
    },
    {
      key: 'nearby',
      label: 'Pessoas próximas',
      icon: 'map-marker-radius-outline',
      onPress: controller.goToNearbyFromMenu,
    },
    {
      key: 'logout',
      label: 'Sair',
      icon: 'logout',
      onPress: controller.logout,
      danger: true,
    },
  ];

  const [menuHighlighted, setMenuHighlighted] = useState(false);
  const menuOpacity = useTimedOpacity(menuHighlighted ? 0.85 : 1);

  return (
    <View style={styles.bar}>
      <View style={styles.brand}>
        <Pressable
          hitSlop={8}
          onPress={controller.openMenu}
          onPressIn={() => setMenuHighlighted(true)}
          onPressOut={() => setMenuHighlighted(false)}
          onHoverIn={() => setMenuHighlighted(true)}
          onHoverOut={() => setMenuHighlighted(false)}
        >
          <Animated.View style={[styles.menuButton, menuOpacity]}>
            <MaterialCommunityIcons name="menu" size={26} color={Brand.label} />
          </Animated.View>
        </Pressable>
        <Text style={styles.title}>Encontra-me</Text>
      </View>

      <Modal
        visible={controller.menuOpen}
        transparent
        animationType="fade"
        onRequestClose={controller.closeMenu}
      >
        <Pressable style={styles.backdrop} onPress={controller.closeMenu}>
          <Pressable style={styles.menu}>
            <Text style={styles.menuTitle}>Menu</Text>
            {menuItems.map((item) => (
              <MenuItemRow key={item.key} item={item} />
            ))}
          </Pressable>
        </Pressable>
      </Modal>
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
  menuButton: {
    padding: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Brand.textDark,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(11, 36, 66, 0.45)',
    paddingTop: 96,
    paddingHorizontal: 20,
    alignItems: 'flex-start',
  },
  menu: {
    width: 260,
    backgroundColor: Brand.white,
    borderRadius: Radius.lg,
    paddingVertical: 8,
    paddingHorizontal: 6,
    gap: 2,
    shadowColor: Brand.navyDeep,
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  menuTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Brand.label,
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: Radius.md,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: Brand.textDark,
  },
  menuLabelDanger: {
    color: Brand.orangeDark,
  },
});
