import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { type BrandColors } from '@/constants/brand';
import { useBrand } from '@/lib/brand-theme';

export function ChatHeaderSection() {
  const router = useRouter();
  const brand = useBrand();
  const styles = useMemo(() => makeStyles(brand), [brand]);

  return (
    <View style={styles.header}>
      <Pressable onPress={() => router.back()} hitSlop={12} style={styles.back}>
        <MaterialCommunityIcons name="chevron-left" size={30} color={brand.textDark} />
      </Pressable>
      <View style={styles.avatar}>
        <MaterialCommunityIcons name="account" size={28} color={brand.avatarIcon} />
      </View>
      <Text style={styles.name}>Sofia</Text>
    </View>
  );
}

function makeStyles(brand: BrandColors) {
  return StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: brand.divider,
    },
    back: {
      marginLeft: -6,
    },
    avatar: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: brand.avatarBackground,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    name: {
      fontSize: 20,
      fontWeight: '800',
      color: brand.textDark,
    },
  });
}
