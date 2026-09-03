import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Href, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { type BrandColors } from '@/constants/brand';
import type { ChatController } from '@/features/chat/chat.controller';
import { useBrand } from '@/lib/brand-theme';

type Props = {
  controller: ChatController;
};

export function ChatHeaderSection({ controller }: Props) {
  const router = useRouter();
  const brand = useBrand();
  const styles = useMemo(() => makeStyles(brand), [brand]);

  return (
    <View style={styles.header}>
      <Pressable onPress={() => router.back()} hitSlop={12} style={styles.iconBtn}>
        <MaterialCommunityIcons name="chevron-left" size={30} color={brand.textDark} />
      </Pressable>
      <Pressable
        onPress={() => router.push('/sofia-perfil' as Href)}
        style={styles.identity}
        accessibilityRole="button"
        accessibilityLabel="Sobre a Sofia"
      >
        <Image
          source={require('@/assets/images/sofia-avatar.jpg')}
          style={styles.avatar}
          resizeMode="cover"
        />
        <View style={styles.titles}>
          <Text style={styles.name}>Sofia</Text>
          <Text style={styles.subtitle}>aqui com você</Text>
        </View>
      </Pressable>
      <Pressable
        onPress={() => router.push('/exercises' as Href)}
        hitSlop={12}
        style={styles.iconBtn}
        accessibilityLabel="Exercícios rápidos"
      >
        <MaterialCommunityIcons name="heart-outline" size={22} color={brand.textDark} />
      </Pressable>
      <Pressable
        onPress={() => controller.setConfirmClear(true)}
        hitSlop={12}
        style={styles.iconBtn}
        accessibilityLabel="Apagar conversa"
        disabled={controller.clearing}
      >
        <MaterialCommunityIcons name="trash-can-outline" size={22} color={brand.textMuted} />
      </Pressable>
    </View>
  );
}

function makeStyles(brand: BrandColors) {
  return StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: brand.divider,
    },
    iconBtn: {
      padding: 4,
    },
    identity: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    avatar: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: brand.avatarBackground,
    },
    titles: {
      flex: 1,
    },
    name: {
      fontSize: 18,
      fontWeight: '800',
      color: brand.textDark,
    },
    subtitle: {
      fontSize: 12,
      color: brand.textMuted,
    },
  });
}
