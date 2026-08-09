import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type KeyboardTypeOptions,
  type TextInputProps,
} from 'react-native';
import Animated from 'react-native-reanimated';

import { Radius, type BrandColors } from '@/constants/brand';
import { useBrand } from '@/lib/brand-theme';
import { useTimedColor } from '@/lib/use-brand-transition';

type Props = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: TextInputProps['autoCapitalize'];
  trailingIcon?: keyof typeof MaterialCommunityIcons.glyphMap;
  onTrailingPress?: () => void;
  /** Labels claros para fundos escuros (ex.: home navy). */
  tone?: 'default' | 'onDark';
};

export function BrandField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  trailingIcon,
  onTrailingPress,
  tone = 'default',
}: Props) {
  const brand = useBrand();
  const styles = useMemo(() => makeStyles(brand), [brand]);
  const [focused, setFocused] = useState(false);
  const borderStyle = useTimedColor(focused, brand.fieldBorder, brand.blue, 'borderColor');

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, tone === 'onDark' && styles.labelOnDark]}>{label}</Text>
      <Animated.View style={[styles.field, borderStyle]}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={brand.placeholder}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {trailingIcon ? (
          <Pressable onPress={onTrailingPress} hitSlop={8}>
            <MaterialCommunityIcons name={trailingIcon} size={22} color={brand.placeholder} />
          </Pressable>
        ) : null}
      </Animated.View>
    </View>
  );
}

function makeStyles(brand: BrandColors) {
  return StyleSheet.create({
    wrapper: {
      gap: 8,
    },
    label: {
      fontSize: 14,
      fontWeight: '700',
      color: brand.label,
    },
    labelOnDark: {
      color: brand.cream,
    },
    field: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      minHeight: 52,
      paddingHorizontal: 18,
      borderRadius: Radius.md,
      borderWidth: 1,
      borderColor: brand.fieldBorder,
      backgroundColor: brand.fieldBackground,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: brand.textDark,
      paddingVertical: 12,
    },
  });
}
