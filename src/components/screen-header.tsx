import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { Brand } from '@/constants/brand';
import { useTimedOpacity } from '@/lib/use-brand-transition';

type Props = {
  title: string;
  onBack?: () => void;
};

export function ScreenHeader({ title, onBack }: Props) {
  const router = useRouter();
  const handleBack = onBack ?? (() => router.back());
  const [highlighted, setHighlighted] = useState(false);
  const opacityStyle = useTimedOpacity(highlighted ? 0.85 : 1);

  return (
    <View style={styles.header}>
      <Pressable
        onPress={handleBack}
        hitSlop={12}
        onPressIn={() => setHighlighted(true)}
        onPressOut={() => setHighlighted(false)}
        onHoverIn={() => setHighlighted(true)}
        onHoverOut={() => setHighlighted(false)}
      >
        <Animated.View style={[styles.backButton, opacityStyle]}>
          <MaterialCommunityIcons name="chevron-left" size={30} color={Brand.textDark} />
        </Animated.View>
      </Pressable>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  backButton: {
    marginLeft: -6,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Brand.textDark,
  },
});
