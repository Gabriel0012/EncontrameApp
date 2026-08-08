import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type KeyboardTypeOptions,
  type TextInputProps,
} from 'react-native';

import { Brand, Radius } from '@/constants/brand';

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
}: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.field, focused && styles.fieldFocused]}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Brand.placeholder}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {trailingIcon ? (
          <Pressable onPress={onTrailingPress} hitSlop={8}>
            <MaterialCommunityIcons name={trailingIcon} size={22} color={Brand.placeholder} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: Brand.label,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 52,
    paddingHorizontal: 18,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Brand.fieldBorder,
    backgroundColor: Brand.fieldBackground,
  },
  fieldFocused: {
    borderColor: Brand.blue,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Brand.textDark,
    paddingVertical: 12,
  },
});
