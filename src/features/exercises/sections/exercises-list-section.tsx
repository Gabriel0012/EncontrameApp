import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Radius, type BrandColors } from '@/constants/brand';
import { PageGutter } from '@/constants/theme';
import type { ExercisesController } from '@/features/exercises/exercises.controller';
import { useBrand } from '@/lib/brand-theme';
import type { ExerciseKind } from '@/services/exercises/exercises.types';

type Props = {
  controller: ExercisesController;
};

function iconFor(kind: ExerciseKind): keyof typeof MaterialCommunityIcons.glyphMap {
  if (kind === 'breathing') return 'weather-windy';
  if (kind === 'grounding') return 'compass-outline';
  return 'white-balance-sunny';
}

export function ExercisesListSection({ controller }: Props) {
  const brand = useBrand();
  const styles = useMemo(() => makeStyles(brand), [brand]);

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.subtitle}>Pequenos gestos que fazem muita diferença</Text>
      {controller.exercises.map((exercise) => (
        <Pressable
          key={exercise.id}
          onPress={() => controller.start(exercise)}
          style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        >
          <View style={styles.iconWrap}>
            <MaterialCommunityIcons name={iconFor(exercise.kind)} size={22} color={brand.onPrimary} />
          </View>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>{exercise.title}</Text>
            <Text style={styles.cardSubtitle}>{exercise.subtitle}</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={22} color={brand.textMuted} />
        </Pressable>
      ))}
    </ScrollView>
  );
}

function makeStyles(brand: BrandColors) {
  return StyleSheet.create({
    content: {
      paddingHorizontal: PageGutter,
      paddingBottom: 32,
      gap: 12,
    },
    subtitle: {
      fontSize: 13,
      color: brand.textMuted,
      marginBottom: 4,
    },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 16,
      borderRadius: Radius.lg,
      borderWidth: 1,
      borderColor: brand.divider,
      backgroundColor: brand.surface,
    },
    cardPressed: {
      opacity: 0.85,
    },
    iconWrap: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: brand.blue,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardText: {
      flex: 1,
    },
    cardTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: brand.textDark,
    },
    cardSubtitle: {
      fontSize: 13,
      marginTop: 2,
      color: brand.textMuted,
    },
  });
}
