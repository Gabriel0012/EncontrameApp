import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Radius, type BrandColors } from '@/constants/brand';
import { PageGutter } from '@/constants/theme';
import type { InicioController } from '@/features/inicio/inicio.controller';
import { useBrand } from '@/lib/brand-theme';
import { resolvePersonStatusColor, resolvePersonStatusOnColor } from '@/lib/person-status';
import { useWideLayout } from '@/lib/use-wide-layout';
import type { Person } from '@/services/people/people.types';

interface InicioPeopleCarouselSectionProps {
  controller: InicioController;
}

const CARD_GAP = 12;
const CARD_HEIGHT = 112;
const PHOTO_WIDTH = 96;

export function InicioPeopleCarouselSection({ controller }: InicioPeopleCarouselSectionProps) {
  const brand = useBrand();
  const { width, isWide } = useWideLayout();
  const visibleCards = isWide ? 2.2 : 1.5;
  const cardWidth = (width - PageGutter * 2 - CARD_GAP) / visibleCards;
  const styles = useMemo(() => makeStyles(brand, cardWidth), [brand, cardWidth]);
  const { people } = controller;

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      {people.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>
            {controller.loading ? 'Buscando pessoas próximas…' : 'Nenhuma pessoa próxima.'}
          </Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.scroller}
          contentContainerStyle={styles.track}
        >
          {people.map((person) => (
            <CarouselCard
              key={person.id}
              person={person}
              controller={controller}
              brand={brand}
              styles={styles}
            />
          ))}
        </ScrollView>
      )}

      <Pressable onPress={controller.goToAllPeople} style={styles.allLink} accessibilityRole="button">
        <Text style={styles.allLinkText}>Ver todas</Text>
      </Pressable>
    </View>
  );
}

function CarouselCard({
  person,
  controller,
  brand,
  styles,
}: {
  person: Person;
  controller: InicioController;
  brand: BrandColors;
  styles: ReturnType<typeof makeStyles>;
}) {
  const statusLabel = person.statusDescription ?? '—';
  const badgeColor = resolvePersonStatusColor(brand, person.statusId, person.statusDescription);
  const badgeTextColor = resolvePersonStatusOnColor(brand);
  const location = controller.locationLine(person);

  return (
    <Pressable
      style={styles.card}
      onPress={() => controller.goToPerson(person.id)}
      accessibilityRole="button"
      accessibilityLabel={`Ver detalhes de ${person.fullName}`}
    >
      <View style={styles.photo}>
        {person.photoUri ? (
          <Image source={{ uri: person.photoUri }} style={styles.photoImage} resizeMode="cover" />
        ) : (
          <MaterialCommunityIcons name="account" size={48} color={brand.avatarIcon} />
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {person.fullName}
        </Text>
        <Text style={styles.meta}>Idade: {person.age ?? '—'}</Text>
        {location ? (
          <Text style={styles.meta} numberOfLines={1}>
            {location}
          </Text>
        ) : null}
        <View style={styles.statusRow}>
          <View style={[styles.statusBadge, { backgroundColor: badgeColor }]}>
            <Text style={[styles.statusBadgeText, { color: badgeTextColor }]} numberOfLines={1}>
              {statusLabel}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

function makeStyles(brand: BrandColors, cardWidth: number) {
  return StyleSheet.create({
    wrapper: {
      flexGrow: 0,
      flexShrink: 0,
      gap: 8,
      paddingHorizontal: PageGutter,
      paddingTop: 8,
    },
    allLink: {
      alignSelf: 'flex-end',
      paddingVertical: 4,
      paddingHorizontal: 10,
      borderRadius: Radius.pill,
      backgroundColor: brand.surface,
      borderWidth: 1,
      borderColor: brand.fieldBorder,
    },
    allLinkText: {
      color: brand.blue,
      fontWeight: '700',
      fontSize: 14,
    },
    scroller: {
      flexGrow: 0,
      height: CARD_HEIGHT,
    },
    track: {
      gap: CARD_GAP,
      alignItems: 'stretch',
    },
    card: {
      width: cardWidth,
      height: CARD_HEIGHT,
      flexDirection: 'row',
      borderRadius: Radius.md,
      overflow: 'hidden',
      backgroundColor: brand.cardInfo,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: brand.divider,
    },
    photo: {
      width: PHOTO_WIDTH,
      height: CARD_HEIGHT,
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: brand.avatarBackground,
    },
    photoImage: {
      width: PHOTO_WIDTH,
      height: CARD_HEIGHT,
    },
    info: {
      flex: 1,
      paddingHorizontal: 14,
      paddingVertical: 12,
      gap: 4,
      justifyContent: 'center',
      backgroundColor: brand.cardInfo,
    },
    name: {
      color: brand.textDark,
      fontSize: 15,
      fontWeight: '800',
    },
    meta: {
      color: brand.textDark,
      fontSize: 13,
      fontWeight: '600',
    },
    statusRow: {
      flexDirection: 'row',
      marginTop: 4,
    },
    statusBadge: {
      borderRadius: Radius.pill,
      paddingHorizontal: 8,
      paddingVertical: 3,
      maxWidth: '100%',
    },
    statusBadgeText: {
      fontSize: 11,
      fontWeight: '700',
    },
    empty: {
      minHeight: CARD_HEIGHT,
      borderRadius: Radius.md,
      backgroundColor: brand.surface,
      borderWidth: 1,
      borderColor: brand.fieldBorder,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 16,
    },
    emptyText: {
      color: brand.textMuted,
      fontWeight: '600',
      textAlign: 'center',
    },
  });
}
