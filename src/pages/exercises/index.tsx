import { useMemo } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandButton } from '@/components/brand-button';
import { ContentShell } from '@/components/content-shell';
import { ScreenHeader } from '@/components/screen-header';
import { type BrandColors } from '@/constants/brand';
import { PageGutter } from '@/constants/theme';
import { useExercisesController } from '@/features/exercises/exercises.controller';
import { ExerciseBreathingSection } from '@/features/exercises/sections/exercise-breathing-section';
import { ExerciseGratitudeSection } from '@/features/exercises/sections/exercise-gratitude-section';
import { ExerciseGroundingSection } from '@/features/exercises/sections/exercise-grounding-section';
import { ExercisesListSection } from '@/features/exercises/sections/exercises-list-section';
import { useBrand } from '@/lib/brand-theme';

export default function ExercisesPage() {
  const brand = useBrand();
  const styles = useMemo(() => makeStyles(brand), [brand]);
  const controller = useExercisesController();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ContentShell style={styles.shell} noGutter>
        <View style={styles.header}>
          <ScreenHeader
            title={controller.active ? controller.active.title : 'Exercícios rápidos'}
            onBack={controller.active ? controller.closeActive : undefined}
          />
        </View>

        {controller.loading && controller.exercises.length === 0 ? (
          <View style={styles.loading}>
            <ActivityIndicator color={brand.blue} />
          </View>
        ) : controller.active ? (
          <ScrollView contentContainerStyle={styles.active} showsVerticalScrollIndicator={false}>
            <Text style={styles.activeSubtitle}>{controller.active.subtitle}</Text>
            {controller.active.kind === 'breathing' ? (
              <ExerciseBreathingSection controller={controller} />
            ) : null}
            {controller.active.kind === 'grounding' ? <ExerciseGroundingSection /> : null}
            {controller.active.kind === 'gratitude' ? (
              <ExerciseGratitudeSection controller={controller} />
            ) : null}
            <View style={styles.close}>
              <BrandButton label="Fechar" variant="outline" onPress={controller.closeActive} />
            </View>
          </ScrollView>
        ) : (
          <ExercisesListSection controller={controller} />
        )}
      </ContentShell>
    </SafeAreaView>
  );
}

function makeStyles(brand: BrandColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: brand.white,
    },
    shell: {
      flex: 1,
    },
    header: {
      paddingHorizontal: PageGutter,
    },
    loading: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    active: {
      paddingHorizontal: PageGutter,
      paddingBottom: 32,
      alignItems: 'center',
    },
    activeSubtitle: {
      fontSize: 13,
      color: brand.textMuted,
      textAlign: 'center',
    },
    close: {
      width: '100%',
      marginTop: 32,
    },
  });
}
