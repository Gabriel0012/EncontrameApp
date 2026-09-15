import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
  Image,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Radius, type BrandColors } from '@/constants/brand';
import type { InicioController } from '@/features/inicio/inicio.controller';
import { useBrand } from '@/lib/brand-theme';
import { resolvePersonStatusColor, resolvePersonStatusOnColor } from '@/lib/person-status';
import { useWideLayout } from '@/lib/use-wide-layout';

interface InicioPeopleCarouselSectionProps {
  controller: InicioController;
}

const CARD_MOBILE = { width: 150, gap: 12, photoHeight: 200 } as const;
const CARD_WIDE = { width: 420, gap: 16, photoWidth: 220 } as const;

export function InicioPeopleCarouselSection({ controller }: InicioPeopleCarouselSectionProps) {
  const brand = useBrand();
  const { isWide } = useWideLayout();
  const card = isWide ? CARD_WIDE : CARD_MOBILE;
  const styles = useMemo(() => makeStyles(brand, isWide), [brand, isWide]);
  const { people, locationDenied } = controller;
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / (card.width + card.gap));
    setActiveIndex(index);
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Encontre pessoas próximas</Text>
      {locationDenied ? (
        <Text style={styles.locationHint}>Ative a localização para ver pessoas próximas.</Text>
      ) : null}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.track}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {people.map((person) => {
          const statusLabel = person.statusDescription ?? '—';
          const badgeColor = resolvePersonStatusColor(
            brand,
            person.statusId,
            person.statusDescription,
          );
          const badgeTextColor = resolvePersonStatusOnColor(brand);

          return (
            <Pressable key={person.id} style={styles.card} onPress={() => controller.goToPerson(person.id)}>
              <View style={styles.photo}>
                {person.photoUri ? (
                  <Image
                    source={{ uri: person.photoUri }}
                    style={styles.photoImage}
                    resizeMode="cover"
                  />
                ) : (
                  <MaterialCommunityIcons
                    name="account"
                    size={isWide ? 120 : 96}
                    color={brand.avatarIcon}
                  />
                )}
              </View>
              <View style={styles.info}>
                <Text style={styles.infoText} numberOfLines={isWide ? 2 : 1}>
                  Nome: {person.fullName}
                </Text>
                <Text style={styles.infoText}>Idade: {person.age ?? '—'}</Text>
                <View style={styles.statusRow}>
                  <Text style={styles.infoText}>Status:</Text>
                  <View style={[styles.statusBadge, { backgroundColor: badgeColor }]}>
                    <Text style={[styles.statusBadgeText, { color: badgeTextColor }]} numberOfLines={1}>
                      {statusLabel}
                    </Text>
                  </View>
                </View>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.dots}>
        {people.map((person, index) => (
          <View key={person.id} style={[styles.dot, index === activeIndex && styles.dotActive]} />
        ))}
      </View>

      <Pressable onPress={controller.goToAllPeople} style={styles.allLink} accessibilityRole="button">
        <Text style={styles.allLinkText}>Ver todas</Text>
      </Pressable>
    </View>
  );
}

function makeStyles(brand: BrandColors, isWide: boolean) {
  return StyleSheet.create({
    wrapper: {
      gap: 10,
    },
    title: {
      color: brand.textDark,
      fontSize: isWide ? 16 : 14,
      fontWeight: '700',
    },
    locationHint: {
      color: brand.textMuted,
      fontSize: isWide ? 16 : 14,
      fontWeight: '600',
      textAlign: 'center',
      paddingHorizontal: 12,
    },
    track: {
      gap: isWide ? CARD_WIDE.gap : CARD_MOBILE.gap,
    },
    card: {
      width: isWide ? CARD_WIDE.width : CARD_MOBILE.width,
      borderRadius: Radius.md,
      overflow: 'hidden',
      backgroundColor: brand.cardInfo,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: brand.divider,
      ...(isWide
        ? {
            flexDirection: 'row' as const,
            height: 200,
          }
        : null),
    },
    photo: {
      ...(isWide
        ? {
            width: CARD_WIDE.photoWidth,
            height: '100%' as const,
          }
        : {
            height: CARD_MOBILE.photoHeight,
          }),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: brand.avatarBackground,
    },
    photoImage: {
      width: '100%',
      height: '100%',
    },
    info: {
      backgroundColor: brand.cardInfo,
      paddingHorizontal: isWide ? 20 : 12,
      paddingVertical: isWide ? 16 : 8,
      gap: isWide ? 6 : 4,
      ...(isWide
        ? {
            flex: 1,
            justifyContent: 'center' as const,
          }
        : null),
    },
    infoText: {
      color: brand.textDark,
      fontSize: isWide ? 16 : 13,
      fontWeight: '700',
    },
    statusRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 6,
    },
    statusBadge: {
      borderRadius: Radius.pill,
      paddingHorizontal: isWide ? 10 : 8,
      paddingVertical: isWide ? 4 : 2,
      maxWidth: '100%',
    },
    statusBadgeText: {
      fontSize: isWide ? 13 : 11,
      fontWeight: '700',
    },
    dots: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 6,
    },
    dot: {
      width: 7,
      height: 7,
      borderRadius: 4,
      backgroundColor: brand.fieldBorder,
    },
    dotActive: {
      backgroundColor: brand.textMuted,
    },
    allLink: {
      alignSelf: 'center',
      paddingVertical: 4,
    },
    allLinkText: {
      color: brand.blue,
      fontWeight: '700',
      fontSize: isWide ? 16 : 14,
    },
  });
}
