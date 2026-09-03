import { useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { useBrand } from '@/lib/brand-theme';

const BOUNCE_MS = 280;

type DotProps = {
  delay: number;
  color: string;
};

function TypingDot({ delay, color }: DotProps) {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-5, { duration: BOUNCE_MS, easing: Easing.inOut(Easing.quad) }),
          withTiming(0, { duration: BOUNCE_MS, easing: Easing.inOut(Easing.quad) }),
        ),
        -1,
        false,
      ),
    );
  }, [delay, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={[styles.dot, { backgroundColor: color }, animatedStyle]} />;
}

/** Três bolinhas pulando — indicador clássico de “está digitando”. */
export function ChatTypingDots() {
  const brand = useBrand();
  const color = brand.textMuted;
  const delays = useMemo(() => [0, 140, 280], []);

  return (
    <View
      style={styles.row}
      accessibilityRole="progressbar"
      accessibilityLabel="Sofia está escrevendo"
    >
      {delays.map((delay) => (
        <TypingDot key={delay} delay={delay} color={color} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    height: 16,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
});
