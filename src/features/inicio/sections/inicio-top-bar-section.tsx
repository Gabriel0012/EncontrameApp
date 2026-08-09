import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMemo, useRef, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { Radius, type BrandColors } from '@/constants/brand';
import { PageGutter } from '@/constants/theme';
import type { InicioController } from '@/features/inicio/inicio.controller';
import { useBrand } from '@/lib/brand-theme';
import { useTimedColor, useTimedOpacity } from '@/lib/use-brand-transition';
import { useWideLayout } from '@/lib/use-wide-layout';

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

function MenuItemRow({
  item,
  brand,
  styles,
}: {
  item: MenuItem;
  brand: BrandColors;
  styles: ReturnType<typeof makeStyles>;
}) {
  const [highlighted, setHighlighted] = useState(false);
  const bgStyle = useTimedColor(highlighted, 'transparent', brand.divider, 'backgroundColor');

  return (
    <Pressable
      onPress={item.onPress}
      onPressIn={() => setHighlighted(true)}
      onPressOut={() => setHighlighted(false)}
      onHoverIn={() => setHighlighted(true)}
      onHoverOut={() => setHighlighted(false)}
      android_ripple={{ color: brand.divider }}
    >
      <Animated.View style={[styles.menuItem, bgStyle]}>
        <MaterialCommunityIcons
          name={item.icon}
          size={22}
          color={item.danger ? brand.orangeDark : brand.blue}
        />
        <Text style={[styles.menuLabel, item.danger && styles.menuLabelDanger]}>{item.label}</Text>
      </Animated.View>
    </Pressable>
  );
}

export function InicioTopBarSection({ controller }: InicioTopBarSectionProps) {
  const brand = useBrand();
  const styles = useMemo(() => makeStyles(brand), [brand]);
  const { isWide } = useWideLayout();
  const menuButtonRef = useRef<View>(null);
  const [menuAnchor, setMenuAnchor] = useState<{ top: number; left: number }>({
    top: 96,
    left: PageGutter,
  });
  const [menuHighlighted, setMenuHighlighted] = useState(false);
  const menuOpacity = useTimedOpacity(menuHighlighted ? 0.85 : 1);

  const menuItems: MenuItem[] = [
    ...(isWide
      ? [
          {
            key: 'home',
            label: 'Início',
            icon: 'home-outline' as const,
            onPress: controller.goToHomeFromMenu,
          },
        ]
      : []),
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

  const handleOpenMenu = () => {
    menuButtonRef.current?.measureInWindow((x, y, _width, height) => {
      setMenuAnchor({ top: y + height + 8, left: x });
      controller.openMenu();
    });
  };

  return (
    <View style={styles.bar}>
      <View style={styles.brand}>
        <Pressable
          hitSlop={8}
          onPress={handleOpenMenu}
          onPressIn={() => setMenuHighlighted(true)}
          onPressOut={() => setMenuHighlighted(false)}
          onHoverIn={() => setMenuHighlighted(true)}
          onHoverOut={() => setMenuHighlighted(false)}
        >
          <View ref={menuButtonRef} collapsable={false}>
            <Animated.View style={[styles.menuButton, menuOpacity]}>
              <MaterialCommunityIcons name="menu" size={26} color={brand.label} />
            </Animated.View>
          </View>
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
          <Pressable
            style={[styles.menu, { top: menuAnchor.top, left: menuAnchor.left }]}
            onPress={(event) => event.stopPropagation()}
          >
            <Text style={styles.menuTitle}>Menu</Text>
            {menuItems.map((item) => (
              <MenuItemRow key={item.key} item={item} brand={brand} styles={styles} />
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

function makeStyles(brand: BrandColors) {
  return StyleSheet.create({
    bar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
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
      color: brand.textDark,
    },
    backdrop: {
      flex: 1,
      backgroundColor: brand.overlay,
    },
    menu: {
      position: 'absolute',
      width: 260,
      backgroundColor: brand.surface,
      borderRadius: Radius.lg,
      paddingVertical: 8,
      paddingHorizontal: 6,
      gap: 2,
      shadowColor: brand.navyDeep,
      shadowOpacity: 0.2,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 8,
    },
    menuTitle: {
      fontSize: 13,
      fontWeight: '800',
      color: brand.label,
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
      color: brand.textDark,
    },
    menuLabelDanger: {
      color: brand.orangeDark,
    },
  });
}
