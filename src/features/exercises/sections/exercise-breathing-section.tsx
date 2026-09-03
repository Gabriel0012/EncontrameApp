import { useEffect, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { type BrandColors } from '@/constants/brand';
import type { ExercisesController } from '@/features/exercises/exercises.controller';
import { useBrand } from '@/lib/brand-theme';

type Props = {
  controller: ExercisesController;
};

export function ExerciseBreathingSection({ controller }: Props) {
  const brand = useBrand();
  const styles = useMemo(() => makeStyles(brand), [brand]);
  const scale = useSharedValue(0.6);

  useEffect(() => {
    const loop = () => {
      scale.value = withSequence(
        withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 7000 }),
        withTiming(0.6, { duration: 8000, easing: Easing.inOut(Easing.ease) }),
      );
    };
    loop();
    const interval = setInterval(loop, 19000);
    return () => {
      clearInterval(interval);
      cancelAnimation(scale);
    };
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.wrap}>
      <View style={styles.ring}>
        <Animated.View style={[styles.circle, animatedStyle]} />
      </View>
      <Text style={styles.label}>{controller.breathLabel}</Text>
    </View>
  );
}

function makeStyles(brand: BrandColors) {
  return StyleSheet.create({
    wrap: {
      alignItems: 'center',
      marginTop: 40,
    },
    ring: {
      width: 260,
      height: 260,
      borderRadius: 130,
      borderWidth: 2,
      borderColor: brand.blue,
      alignItems: 'center',
      justifyContent: 'center',
    },
    circle: {
      width: 200,
      height: 200,
      borderRadius: 100,
      backgroundColor: brand.blue,
      opacity: 0.55,
    },
    label: {
      fontSize: 20,
      fontWeight: '600',
      color: brand.textDark,
      marginTop: 24,
    },
  });
}
