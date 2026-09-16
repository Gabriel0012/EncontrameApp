import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useMemo } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { Radius, type BrandColors } from '@/constants/brand';
import { PageGutter } from '@/constants/theme';
import type { InicioController } from '@/features/inicio/inicio.controller';
import { useBrand } from '@/lib/brand-theme';
import { resolvePersonStatusColor } from '@/lib/person-status';
import { useWideLayout } from '@/lib/use-wide-layout';
import type { Person } from '@/services/people/people.types';

interface InicioPeopleCarouselSectionProps {
  controller: InicioController;
}

const CARD_GAP = 12;
const NAME_GAP = 6;
const NAME_HEIGHT = 18;
const SKELETON_COUNT = 4;
const STATUS_BORDER_WIDTH = 3;

export function InicioPeopleCarouselSection({ controller }: InicioPeopleCarouselSectionProps) {
  const brand = useBrand();
  const { width, isWide } = useWideLayout();
  const visibleCards = isWide ? 5.5 : 3.6;
  const cardWidth = (width - PageGutter * 2 - CARD_GAP) / visibleCards;
  const itemHeight = cardWidth + NAME_GAP + NAME_HEIGHT;
  const styles = useMemo(
    () => makeStyles(brand, cardWidth, itemHeight),
    [brand, cardWidth, itemHeight],
  );
  const { people, loading, locationDenied, userLocation } = controller;
  const showSkeleton =
    people.length === 0 && (loading || (!locationDenied && userLocation == null));

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      {showSkeleton ? (
        <ScrollView
          horizontal
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          style={styles.scroller}
          contentContainerStyle={styles.track}
        >
          {Array.from({ length: SKELETON_COUNT }, (_, index) => (
            <PersonCardSkeleton key={index} index={index} brand={brand} styles={styles} />
          ))}
        </ScrollView>
      ) : people.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Nenhuma pessoa próxima.</Text>
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
  const statusColor = resolvePersonStatusColor(brand, person.statusId, person.statusDescription);

  return (
    <Pressable
      style={styles.item}
      onPress={() => controller.goToPerson(person.id)}
      accessibilityRole="button"
      accessibilityLabel={`Ver detalhes de ${person.fullName}`}
    >
      <View style={[styles.card, { borderColor: statusColor }]}>
        {person.photoUri ? (
          <Image source={{ uri: person.photoUri }} style={styles.photoImage} resizeMode="cover" />
        ) : (
          <MaterialCommunityIcons name="account" size={36} color={brand.avatarIcon} />
        )}
      </View>
      <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
        {person.fullName}
      </Text>
    </Pressable>
  );
}

function PersonCardSkeleton({
  index,
  brand,
  styles,
}: {
  index: number;
  brand: BrandColors;
  styles: ReturnType<typeof makeStyles>;
}) {
  const opacity = useSharedValue(0.45);

  useEffect(() => {
    opacity.value = withDelay(
      index * 90,
      withRepeat(
        withTiming(1, { duration: 700, easing: Easing.inOut(Easing.quad) }),
        -1,
        true,
      ),
    );
  }, [index, opacity]);

  const pulseStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <View style={styles.item} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Animated.View style={[styles.card, { backgroundColor: brand.avatarBackground }, pulseStyle]} />
      <Animated.View style={[styles.skeletonName, pulseStyle]} />
    </View>
  );
}

function makeStyles(brand: BrandColors, cardWidth: number, itemHeight: number) {
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
      height: itemHeight,
    },
    track: {
      gap: CARD_GAP,
      alignItems: 'flex-start',
    },
    item: {
      width: cardWidth,
      height: itemHeight,
      alignItems: 'center',
      gap: NAME_GAP,
    },
    card: {
      width: cardWidth,
      height: cardWidth,
      borderRadius: Radius.xl,
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: brand.avatarBackground,
      borderWidth: STATUS_BORDER_WIDTH,
      borderColor: brand.divider,
    },
    photoImage: {
      width: '100%',
      height: '100%',
    },
    name: {
      width: '100%',
      height: NAME_HEIGHT,
      color: brand.textDark,
      fontSize: 13,
      lineHeight: NAME_HEIGHT,
      fontWeight: '800',
      textAlign: 'center',
      textShadowColor: brand.surface,
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 6,
    },
    skeletonName: {
      width: '72%',
      height: 10,
      borderRadius: Radius.pill,
      backgroundColor: brand.avatarBackground,
    },
    empty: {
      minHeight: itemHeight,
      borderRadius: Radius.xl,
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
