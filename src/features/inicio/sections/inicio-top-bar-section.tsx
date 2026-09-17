import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  BackHandler,
  Keyboard,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Radius, type BrandColors } from '@/constants/brand';
import { brandTiming, Motion } from '@/constants/motion';
import { PageGutter } from '@/constants/theme';
import type { InicioController } from '@/features/inicio/inicio.controller';
import { useBrand } from '@/lib/brand-theme';
import { hexToRgba } from '@/lib/map-style';
import { useTimedColor, useTimedOpacity } from '@/lib/use-brand-transition';
import { useWideLayout } from '@/lib/use-wide-layout';

const DRAWER_MAX_WIDTH = 320;
const DRAWER_SCREEN_RATIO = 0.86;

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
  const insets = useSafeAreaInsets();
  const { isWide, width } = useWideLayout();
  const drawerWidth = Math.min(DRAWER_MAX_WIDTH, Math.round(width * DRAWER_SCREEN_RATIO));
  const styles = useMemo(
    () => makeStyles(brand, isWide, drawerWidth),
    [brand, isWide, drawerWidth],
  );
  const { searchOpen, closeSearch, openSearch, handleSearch, clearSearch } = controller;
  const searchInputRef = useRef<TextInput>(null);
  const [menuHighlighted, setMenuHighlighted] = useState(false);
  const [searchHighlighted, setSearchHighlighted] = useState(false);
  const menuOpacity = useTimedOpacity(menuHighlighted ? 0.85 : 1);
  const searchPressOpacity = useTimedOpacity(searchHighlighted ? 0.85 : 1);
  const searchProgress = useSharedValue(searchOpen ? 1 : 0);
  const drawerProgress = useSharedValue(0);

  useEffect(() => {
    searchProgress.value = brandTiming(searchOpen ? 1 : 0);
  }, [searchOpen, searchProgress]);

  useEffect(() => {
    if (!controller.menuOpen) {
      drawerProgress.value = 0;
      return;
    }

    drawerProgress.value = 0;
    const frame = requestAnimationFrame(() => {
      drawerProgress.value = brandTiming(1);
    });
    return () => cancelAnimationFrame(frame);
  }, [controller.menuOpen, drawerProgress]);

  useEffect(() => {
    if (!searchOpen) {
      Keyboard.dismiss();
      return;
    }

    const timeout = setTimeout(() => {
      searchInputRef.current?.focus();
    }, Motion.durationMs);
    return () => clearTimeout(timeout);
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen) {
      return;
    }

    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      closeSearch();
      return true;
    });
    return () => sub.remove();
  }, [closeSearch, searchOpen]);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: 1 - searchProgress.value,
    transform: [{ translateX: interpolate(searchProgress.value, [0, 1], [0, -12]) }],
  }));

  const searchFieldStyle = useAnimatedStyle(() => ({
    opacity: searchProgress.value,
    transform: [{ translateX: interpolate(searchProgress.value, [0, 1], [20, 0]) }],
  }));

  const drawerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(drawerProgress.value, [0, 1], [-drawerWidth, 0]) }],
  }));

  const scrimStyle = useAnimatedStyle(() => ({
    opacity: drawerProgress.value,
  }));

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
      key: 'all-people',
      label: 'Pessoas desaparecidas',
      icon: 'account-search-outline',
      onPress: controller.goToAllPeopleFromMenu,
    },
    {
      key: 'settings',
      label: 'Configurações',
      icon: 'cog-outline',
      onPress: controller.goToTheme,
    },
    controller.loggedIn
      ? {
          key: 'logout',
          label: 'Sair',
          icon: 'logout' as const,
          onPress: controller.logout,
          danger: true,
        }
      : {
          key: 'login',
          label: 'Entrar',
          icon: 'login' as const,
          onPress: controller.goToLogin,
        },
  ];

  const accountItem = menuItems[menuItems.length - 1];
  const navItems = menuItems.slice(0, -1);

  const handleOpenMenu = () => {
    controller.openMenu();
  };

  const handleSearchButton = () => {
    if (searchOpen) {
      handleSearch();
      return;
    }
    openSearch();
  };

  return (
    <View style={styles.wrap} pointerEvents="box-none">
      <View style={styles.panel}>
        <View style={styles.brand}>
          <Pressable
            hitSlop={8}
            onPress={handleOpenMenu}
            onPressIn={() => setMenuHighlighted(true)}
            onPressOut={() => setMenuHighlighted(false)}
            onHoverIn={() => setMenuHighlighted(true)}
            onHoverOut={() => setMenuHighlighted(false)}
          >
            <Animated.View style={[styles.menuButton, menuOpacity]}>
              <MaterialCommunityIcons name="menu" size={26} color={brand.label} />
            </Animated.View>
          </Pressable>

          <View style={styles.middle}>
            <Animated.View
              style={[styles.titleWrap, titleStyle]}
              pointerEvents={searchOpen ? 'none' : 'auto'}
            >
              <Text style={styles.title} numberOfLines={1}>
                Encontra-me
              </Text>
            </Animated.View>

            <Animated.View
              style={[styles.searchFieldWrap, searchFieldStyle]}
              pointerEvents={searchOpen ? 'auto' : 'none'}
            >
              <View style={styles.searchField}>
                <TextInput
                  ref={searchInputRef}
                  style={styles.searchInput}
                  value={controller.search}
                  onChangeText={controller.setSearch}
                  placeholder="Nome, bairro ou cidade"
                  placeholderTextColor={brand.placeholder}
                  returnKeyType="search"
                  onSubmitEditing={controller.handleSearch}
                  accessibilityLabel="Buscar pessoas"
                />
                {controller.search.length > 0 ? (
                  <Pressable
                    onPress={clearSearch}
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel="Limpar busca"
                  >
                    <MaterialCommunityIcons name="close-circle" size={20} color={brand.placeholder} />
                  </Pressable>
                ) : null}
              </View>
            </Animated.View>
          </View>

          <Pressable
            onPress={handleSearchButton}
            onPressIn={() => setSearchHighlighted(true)}
            onPressOut={() => setSearchHighlighted(false)}
            onHoverIn={() => setSearchHighlighted(true)}
            onHoverOut={() => setSearchHighlighted(false)}
            accessibilityRole="button"
            accessibilityLabel={searchOpen ? 'Buscar' : 'Abrir busca'}
          >
            <Animated.View style={[styles.searchButton, searchPressOpacity]}>
              <MaterialCommunityIcons name="magnify" size={22} color={brand.orange} />
            </Animated.View>
          </Pressable>
        </View>

        {controller.locationDenied ? (
          <Text style={styles.locationHint}>Ative a localização para ver pessoas próximas.</Text>
        ) : null}
      </View>

      <Modal
        visible={controller.menuOpen}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={controller.closeMenu}
      >
        <View style={styles.drawerRoot} pointerEvents="box-none">
          <Pressable
            style={styles.drawerScrimHit}
            onPress={controller.closeMenu}
            accessibilityRole="button"
            accessibilityLabel="Fechar menu"
          >
            <Animated.View style={[styles.drawerScrim, scrimStyle]} />
          </Pressable>
          <Animated.View style={[styles.drawer, drawerStyle]} pointerEvents="auto">
            <View style={[styles.drawerHeader, { paddingTop: insets.top + 12 }]}>
              <Text style={styles.menuTitle}>Menu</Text>
              <Pressable
                onPress={controller.closeMenu}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Fechar menu"
              >
                <MaterialCommunityIcons name="close" size={24} color={brand.label} />
              </Pressable>
            </View>
            <View style={styles.drawerNav}>
              {navItems.map((item) => (
                <MenuItemRow key={item.key} item={item} brand={brand} styles={styles} />
              ))}
            </View>
            {accountItem ? (
              <View style={[styles.drawerFooter, { paddingBottom: Math.max(insets.bottom, 16) }]}>
                <MenuItemRow item={accountItem} brand={brand} styles={styles} />
              </View>
            ) : null}
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

function makeStyles(brand: BrandColors, isWide: boolean, drawerWidth: number) {
  return StyleSheet.create({
    wrap: {
      paddingHorizontal: isWide ? 4 : PageGutter,
      paddingTop: isWide ? 4 : 8,
    },
    panel: {
      gap: 8,
      paddingVertical: isWide ? 6 : 10,
      paddingHorizontal: 12,
      borderRadius: Radius.lg,
      backgroundColor: isWide ? 'transparent' : brand.surface,
      shadowColor: brand.navyDeep,
      shadowOpacity: isWide ? 0 : 0.28,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 8 },
      elevation: isWide ? 0 : 10,
    },
    brand: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    menuButton: {
      padding: 4,
    },
    middle: {
      flex: 1,
      minWidth: 0,
      height: isWide ? 38 : 46,
      justifyContent: 'center',
      overflow: 'hidden',
    },
    titleWrap: {
      justifyContent: 'center',
    },
    title: {
      fontSize: isWide ? 18 : 22,
      fontWeight: '800',
      color: brand.textDark,
    },
    searchFieldWrap: {
      ...StyleSheet.absoluteFill,
      justifyContent: 'center',
    },
    searchField: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      height: isWide ? 38 : 46,
      paddingHorizontal: 16,
      borderRadius: Radius.pill,
      backgroundColor: brand.fieldBackground,
      borderWidth: 1,
      borderColor: brand.fieldBorder,
    },
    searchInput: {
      flex: 1,
      paddingVertical: 0,
      fontSize: isWide ? 14 : 15,
      color: brand.textDark,
    },
    searchButton: {
      width: isWide ? 38 : 46,
      height: isWide ? 38 : 46,
      borderRadius: Radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: hexToRgba(brand.orange, 0.22),
    },
    locationHint: {
      color: brand.textMuted,
      fontSize: 13,
      fontWeight: '600',
    },
    drawerRoot: {
      flex: 1,
    },
    drawerScrimHit: {
      ...StyleSheet.absoluteFill,
    },
    drawerScrim: {
      ...StyleSheet.absoluteFill,
      backgroundColor: brand.overlay,
    },
    drawer: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      zIndex: 2,
      width: drawerWidth,
      backgroundColor: brand.surface,
      // borderRightWidth: 1,
      // borderRightColor: brand.fieldBorder,
      paddingHorizontal: 8,
      elevation: 16,
      shadowColor: brand.navyDeep,
      shadowOpacity: 0.28,
      shadowRadius: 24,
      shadowOffset: { width: 8, height: 0 },
    },
    drawerHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 12,
      paddingBottom: 12,
    },
    drawerNav: {
      flex: 1,
      gap: 2,
    },
    drawerFooter: {
      borderTopWidth: 1,
      borderTopColor: brand.divider,
      paddingTop: 8,
      paddingHorizontal: 0,
    },
    menuTitle: {
      fontSize: 18,
      fontWeight: '800',
      color: brand.textDark,
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
