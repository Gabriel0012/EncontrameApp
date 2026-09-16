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
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { Radius, type BrandColors } from '@/constants/brand';
import { brandTiming, Motion } from '@/constants/motion';
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
  const { searchOpen, closeSearch, openSearch, handleSearch } = controller;
  const menuButtonRef = useRef<View>(null);
  const searchInputRef = useRef<TextInput>(null);
  const [menuAnchor, setMenuAnchor] = useState<{ top: number; left: number }>({
    top: 96,
    left: PageGutter,
  });
  const [menuHighlighted, setMenuHighlighted] = useState(false);
  const [searchHighlighted, setSearchHighlighted] = useState(false);
  const menuOpacity = useTimedOpacity(menuHighlighted ? 0.85 : 1);
  const searchPressOpacity = useTimedOpacity(searchHighlighted ? 0.85 : 1);
  const searchProgress = useSharedValue(searchOpen ? 1 : 0);

  useEffect(() => {
    searchProgress.value = brandTiming(searchOpen ? 1 : 0);
  }, [searchOpen, searchProgress]);

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

  const searchButtonStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(searchProgress.value, [0, 1], [brand.blueClear, brand.blue]),
  }));

  const closedIconStyle = useAnimatedStyle(() => ({
    opacity: 1 - searchProgress.value,
  }));

  const openIconStyle = useAnimatedStyle(() => ({
    opacity: searchProgress.value,
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

  const handleOpenMenu = () => {
    menuButtonRef.current?.measureInWindow((x, y, _width, height) => {
      setMenuAnchor({ top: y + height + 8, left: x });
      controller.openMenu();
    });
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
            <View ref={menuButtonRef} collapsable={false}>
              <Animated.View style={[styles.menuButton, menuOpacity]}>
                <MaterialCommunityIcons name="menu" size={26} color={brand.label} />
              </Animated.View>
            </View>
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
            <Animated.View style={[styles.searchButton, searchButtonStyle, searchPressOpacity]}>
              <View style={styles.searchIconStack}>
                <Animated.View style={[styles.searchIconLayer, closedIconStyle]}>
                  <MaterialCommunityIcons name="magnify" size={22} color={brand.textDark} />
                </Animated.View>
                <Animated.View style={[styles.searchIconLayer, openIconStyle]}>
                  <MaterialCommunityIcons name="magnify" size={22} color={brand.onPrimary} />
                </Animated.View>
              </View>
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
    wrap: {
      paddingHorizontal: PageGutter,
      paddingTop: 8,
    },
    panel: {
      gap: 8,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: Radius.lg,
      backgroundColor: brand.surface,
      borderWidth: 1,
      borderColor: brand.fieldBorder,
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
      height: 46,
      justifyContent: 'center',
      overflow: 'hidden',
    },
    titleWrap: {
      justifyContent: 'center',
    },
    title: {
      fontSize: 22,
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
      height: 46,
      paddingHorizontal: 16,
      borderRadius: Radius.pill,
      backgroundColor: brand.fieldBackground,
      borderWidth: 1,
      borderColor: brand.fieldBorder,
    },
    searchInput: {
      flex: 1,
      paddingVertical: 0,
      fontSize: 15,
      color: brand.textDark,
    },
    searchButton: {
      width: 46,
      height: 46,
      borderRadius: Radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
    },
    searchIconStack: {
      width: 22,
      height: 22,
    },
    searchIconLayer: {
      ...StyleSheet.absoluteFill,
      alignItems: 'center',
      justifyContent: 'center',
    },
    locationHint: {
      color: brand.textMuted,
      fontSize: 13,
      fontWeight: '600',
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
