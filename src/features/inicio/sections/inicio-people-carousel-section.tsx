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

import { BrandEnter, useEnterOnce } from '@/components/brand-enter';
import { PersonAlertIcon } from '@/components/person-alert-icon';
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
const CARD_MAX_WIDTH = 104;
const NAME_GAP = 6;
const NAME_LINE_HEIGHT = 16;
const NAME_PAD_V = 2;
const NAME_BORDER = 1;
const NAME_HEIGHT = NAME_LINE_HEIGHT + NAME_PAD_V * 2 + NAME_BORDER * 2;
const SKELETON_COUNT = 4;
const STATUS_BORDER_WIDTH = 3;

export function InicioPeopleCarouselSection({ controller }: InicioPeopleCarouselSectionProps) {
  const brand = useBrand();
  const { width, isWide } = useWideLayout();
  const visibleCards = isWide ? 5.5 : 3.6;
  const cardWidth = Math.min(CARD_MAX_WIDTH, (width - PageGutter * 2 - CARD_GAP) / visibleCards);
  const itemHeight = cardWidth + NAME_GAP + NAME_HEIGHT;
  const styles = useMemo(
    () => makeStyles(brand, cardWidth, itemHeight),
    [brand, cardWidth, itemHeight],
  );
  const { people, showPeopleSkeleton } = controller;
  const claimEnter = useEnterOnce();

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      {showPeopleSkeleton ? (
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
        <BrandEnter from="fade" style={styles.empty}>
          <Text style={styles.emptyText}>Nenhuma pessoa próxima.</Text>
        </BrandEnter>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.scroller}
          contentContainerStyle={styles.track}
        >
          {people.map((person, index) => (
            <CarouselCard
              key={person.id}
              person={person}
              index={index}
              skip={!claimEnter(person.id)}
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
  index,
  skip,
  controller,
  brand,
  styles,
}: {
  person: Person;
  index: number;
  skip: boolean;
  controller: InicioController;
  brand: BrandColors;
  styles: ReturnType<typeof makeStyles>;
}) {
  const statusColor = resolvePersonStatusColor(brand, person.statusId, person.statusDescription);

  return (
    <BrandEnter from="right" index={index} skip={skip}>
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
        <View style={styles.nameChip}>
          <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
            {person.fullName}
          </Text>
          <PersonAlertIcon
            statusId={person.statusId}
            statusDescription={person.statusDescription}
            size={12}
          />
        </View>
      </Pressable>
    </BrandEnter>
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
    nameChip: {
      maxWidth: '100%',
      height: NAME_HEIGHT,
      paddingHorizontal: 8,
      paddingVertical: NAME_PAD_V,
      borderRadius: Radius.pill,
      backgroundColor: brand.surface,
      borderWidth: NAME_BORDER,
      borderColor: brand.fieldBorder,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
      overflow: 'hidden',
    },
    name: {
      flexShrink: 1,
      color: brand.textDark,
      fontSize: 12,
      lineHeight: NAME_LINE_HEIGHT,
      fontWeight: '400',
      textAlign: 'center',
    },
    skeletonName: {
      width: '72%',
      height: NAME_HEIGHT,
      borderRadius: Radius.pill,
      backgroundColor: brand.surface,
      borderWidth: NAME_BORDER,
      borderColor: brand.fieldBorder,
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
