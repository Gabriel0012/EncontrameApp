import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { BrandButton } from '@/components/brand-button';
import { BrandField } from '@/components/brand-field';
import { type BrandColors } from '@/constants/brand';
import type { ExercisesController } from '@/features/exercises/exercises.controller';
import { useBrand } from '@/lib/brand-theme';

type Props = {
  controller: ExercisesController;
};

export function ExerciseGratitudeSection({ controller }: Props) {
  const brand = useBrand();
  const styles = useMemo(() => makeStyles(brand), [brand]);

  return (
    <View style={styles.wrap}>
      <Text style={styles.prompt}>Pelo que você é grata(o) agora?</Text>
      {controller.gratitudes.map((value, index) => (
        <BrandField
          key={index}
          label={`${index + 1}.`}
          value={value}
          onChangeText={(text) => controller.setGratitudeAt(index, text)}
          placeholder="Escreva algo aqui…"
        />
      ))}
      {controller.gratitudeSaved ? (
        <Text style={styles.saved}>Guardado com carinho</Text>
      ) : null}
      <BrandButton label="Guardar" onPress={controller.saveGratitudes} />
    </View>
  );
}

function makeStyles(brand: BrandColors) {
  return StyleSheet.create({
    wrap: {
      width: '100%',
      marginTop: 24,
      gap: 8,
    },
    prompt: {
      fontSize: 16,
      fontWeight: '600',
      color: brand.textDark,
      marginBottom: 8,
      textAlign: 'center',
    },
    saved: {
      fontSize: 13,
      textAlign: 'center',
      color: brand.statusEncontrado,
      marginBottom: 8,
    },
  });
}
