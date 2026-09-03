import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Radius, type BrandColors } from '@/constants/brand';
import { PageGutter } from '@/constants/theme';
import type { SofiaThemeController } from '@/features/sofia-theme/sofia-theme.controller';
import { useBrand } from '@/lib/brand-theme';

type Props = {
  controller: SofiaThemeController;
};

export function SofiaThemePickerSection({ controller }: Props) {
  const brand = useBrand();
  const styles = useMemo(() => makeStyles(brand), [brand]);

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.previewCard}>
        <Image
          source={require('@/assets/images/sofia-avatar.jpg')}
          style={styles.previewAvatar}
          resizeMode="cover"
        />
        <View style={styles.previewTexts}>
          <Text style={styles.previewName}>Sofia</Text>
          <Text style={styles.previewMsg}>aqui com você</Text>
        </View>
        <View style={styles.previewDot} />
      </View>

      <Text style={styles.sectionTitle}>Aparência</Text>
      <View style={styles.segment}>
        <Pressable
          onPress={() => controller.setScheme('light')}
          style={[styles.segmentBtn, controller.colorScheme === 'light' && styles.segmentBtnActive]}
          accessibilityRole="button"
          accessibilityLabel="Tema claro"
        >
          <Text
            style={[
              styles.segmentText,
              controller.colorScheme === 'light' && styles.segmentTextActive,
            ]}
          >
            Claro
          </Text>
        </Pressable>
        <Pressable
          onPress={() => controller.setScheme('dark')}
          style={[styles.segmentBtn, controller.colorScheme === 'dark' && styles.segmentBtnActive]}
          accessibilityRole="button"
          accessibilityLabel="Tema escuro"
        >
          <Text
            style={[
              styles.segmentText,
              controller.colorScheme === 'dark' && styles.segmentTextActive,
            ]}
          >
            Escuro
          </Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>Cor da Sofia</Text>
      <View style={styles.paletteRow}>
        {controller.palettes.map((palette) => {
          const selected = palette.id === controller.selectedId;
          return (
            <Pressable
              key={palette.id}
              onPress={() => controller.setPalette(palette.id)}
              style={({ pressed }) => [
                styles.paletteCard,
                {
                  borderColor: selected ? palette.brand : brand.divider,
                  backgroundColor: palette.brandSoft,
                  opacity: pressed ? 0.85 : 1,
                  borderWidth: selected ? 2 : 1,
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel={palette.name}
              accessibilityState={{ selected }}
            >
              <View style={styles.swatchGroup}>
                <View style={[styles.swatch, { backgroundColor: palette.brand }]} />
                <View style={[styles.swatch, { backgroundColor: palette.brandStrong }]} />
                <View
                  style={[
                    styles.swatch,
                    { backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.border },
                  ]}
                />
              </View>
              <Text style={[styles.paletteName, { color: palette.onSurface }]}>{palette.name}</Text>
              {selected ? (
                <View style={[styles.checkBadge, { backgroundColor: palette.brand }]}>
                  <MaterialCommunityIcons name="check" size={12} color={palette.onBrand} />
                </View>
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

function makeStyles(brand: BrandColors) {
  return StyleSheet.create({
    content: {
      padding: PageGutter,
      paddingBottom: 32,
      gap: 16,
    },
    previewCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderRadius: Radius.lg,
      borderWidth: 1,
      gap: 12,
      backgroundColor: brand.surface,
      borderColor: brand.divider,
    },
    previewAvatar: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: brand.avatarBackground,
    },
    previewTexts: {
      flex: 1,
    },
    previewName: {
      fontSize: 16,
      fontWeight: '700',
      color: brand.textDark,
    },
    previewMsg: {
      fontSize: 13,
      marginTop: 2,
      color: brand.textMuted,
    },
    previewDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: brand.blue,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: brand.textDark,
      opacity: 0.9,
    },
    segment: {
      flexDirection: 'row',
      padding: 4,
      borderRadius: Radius.pill,
      borderWidth: 1,
      gap: 4,
      backgroundColor: brand.surface,
      borderColor: brand.divider,
    },
    segmentBtn: {
      flex: 1,
      height: 42,
      borderRadius: Radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
    },
    segmentBtnActive: {
      backgroundColor: brand.blue,
    },
    segmentText: {
      fontSize: 13,
      fontWeight: '600',
      color: brand.textDark,
    },
    segmentTextActive: {
      color: brand.onPrimary,
    },
    paletteRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    paletteCard: {
      width: '48%',
      borderRadius: Radius.lg,
      padding: 12,
      gap: 8,
      minHeight: 100,
      position: 'relative',
    },
    swatchGroup: {
      flexDirection: 'row',
      gap: 6,
    },
    swatch: {
      width: 22,
      height: 22,
      borderRadius: 11,
    },
    paletteName: {
      fontSize: 13,
      fontWeight: '600',
    },
    checkBadge: {
      position: 'absolute',
      top: 8,
      right: 8,
      width: 20,
      height: 20,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
}
