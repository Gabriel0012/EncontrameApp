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

interface InicioPeopleCarouselSectionProps {
  controller: InicioController;
}

const CARD_WIDTH = 150;
const CARD_GAP = 12;

export function InicioPeopleCarouselSection({ controller }: InicioPeopleCarouselSectionProps) {
  const brand = useBrand();
  const styles = useMemo(() => makeStyles(brand), [brand]);
  const { people } = controller;
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / (CARD_WIDTH + CARD_GAP));
    setActiveIndex(index);
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.track}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {people.map((person) => (
          <Pressable key={person.id} style={styles.card} onPress={controller.goToNearby}>
            <View style={styles.photo}>
              {person.photoUri ? (
                <Image source={{ uri: person.photoUri }} style={styles.photoImage} />
              ) : (
                <MaterialCommunityIcons name="account" size={96} color={brand.avatarIcon} />
              )}
            </View>
            <View style={styles.info}>
              <Text style={styles.infoText} numberOfLines={1}>
                Nome: {person.nickname ?? person.fullName}
              </Text>
              <Text style={styles.infoText}>Idade: {person.age ?? '—'}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.dots}>
        {people.map((person, index) => (
          <View key={person.id} style={[styles.dot, index === activeIndex && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
}

function makeStyles(brand: BrandColors) {
  return StyleSheet.create({
    wrapper: {
      gap: 10,
    },
    track: {
      gap: CARD_GAP,
    },
    card: {
      width: CARD_WIDTH,
      borderRadius: Radius.md,
      overflow: 'hidden',
      backgroundColor: brand.avatarBackground,
    },
    photo: {
      height: 200,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: brand.avatarBackground,
    },
    photoImage: {
      width: '100%',
      height: '100%',
    },
    info: {
      backgroundColor: brand.blue,
      paddingHorizontal: 12,
      paddingVertical: 8,
      gap: 2,
    },
    infoText: {
      color: brand.onPrimary,
      fontSize: 13,
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
  });
}
