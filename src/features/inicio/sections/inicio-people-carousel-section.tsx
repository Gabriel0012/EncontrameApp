import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
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

import { Brand, Radius } from '@/constants/brand';
import type { InicioController } from '@/features/inicio/inicio.controller';

interface InicioPeopleCarouselSectionProps {
  controller: InicioController;
}

const CARD_WIDTH = 150;
const CARD_GAP = 12;

export function InicioPeopleCarouselSection({ controller }: InicioPeopleCarouselSectionProps) {
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
                <MaterialCommunityIcons name="account" size={96} color={Brand.avatarIcon} />
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

const styles = StyleSheet.create({
  wrapper: {
    gap: 10,
  },
  track: {
    paddingHorizontal: 20,
    gap: CARD_GAP,
  },
  card: {
    width: CARD_WIDTH,
    borderRadius: Radius.md,
    overflow: 'hidden',
    backgroundColor: Brand.avatarBackground,
  },
  photo: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Brand.avatarBackground,
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  info: {
    backgroundColor: Brand.blue,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 2,
  },
  infoText: {
    color: Brand.white,
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
    backgroundColor: Brand.fieldBorder,
  },
  dotActive: {
    backgroundColor: Brand.textMuted,
  },
});
