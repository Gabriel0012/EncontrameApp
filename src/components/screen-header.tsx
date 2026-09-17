import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { useBrand } from '@/lib/brand-theme';
import { useSafeBack } from '@/lib/safe-back';
import { useTimedOpacity } from '@/lib/use-brand-transition';
import { useWideLayout } from '@/lib/use-wide-layout';

type Props = {
  title: string;
  onBack?: () => void;
  accessory?: ReactNode;
};

export function ScreenHeader({ title, onBack, accessory }: Props) {
  const brand = useBrand();
  const { control } = useWideLayout();
  const defaultBack = useSafeBack('/inicio');
  const handleBack = onBack ?? defaultBack;
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
          <MaterialCommunityIcons name="chevron-left" size={control.headerTitle + 8} color={brand.textDark} />
        </Animated.View>
      </Pressable>
      <Text
        style={[styles.title, { color: brand.textDark, fontSize: control.headerTitle }]}
        numberOfLines={1}
      >
        {title}
      </Text>
      {accessory}
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
    flexShrink: 1,
    fontWeight: '800',
  },
});
