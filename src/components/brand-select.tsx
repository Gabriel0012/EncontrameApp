import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { Radius, type BrandColors } from '@/constants/brand';
import type { ControlMetrics } from '@/constants/theme';
import { useBrand } from '@/lib/brand-theme';
import { useTimedColor, useTimedOpacity } from '@/lib/use-brand-transition';
import { useWideLayout } from '@/lib/use-wide-layout';

type Props = {
  label: string;
  value: string;
  options: readonly string[];
  onSelect: (value: string) => void;
  placeholder?: string;
};

function SelectOption({
  option,
  selected,
  onPress,
  brand,
  styles,
}: {
  option: string;
  selected: boolean;
  onPress: () => void;
  brand: BrandColors;
  styles: ReturnType<typeof makeStyles>;
}) {
  const [highlighted, setHighlighted] = useState(false);
  const bgStyle = useTimedColor(
    selected || highlighted,
    'transparent',
    brand.divider,
    'backgroundColor',
  );

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setHighlighted(true)}
      onPressOut={() => setHighlighted(false)}
      onHoverIn={() => setHighlighted(true)}
      onHoverOut={() => setHighlighted(false)}
    >
      <Animated.View style={[styles.option, bgStyle]}>
        <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>{option}</Text>
        {selected ? (
          <MaterialCommunityIcons name="check" size={20} color={brand.blue} />
        ) : null}
      </Animated.View>
    </Pressable>
  );
}

export function BrandSelect({ label, value, options, onSelect, placeholder = 'Escolher' }: Props) {
  const brand = useBrand();
  const { control } = useWideLayout();
  const styles = useMemo(() => makeStyles(brand, control), [brand, control]);
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(false);
  const fieldOpacity = useTimedOpacity(highlighted ? 0.85 : 1);

  const handleSelect = (option: string) => {
    onSelect(option);
    setOpen(false);
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        onPress={() => setOpen(true)}
        onPressIn={() => setHighlighted(true)}
        onPressOut={() => setHighlighted(false)}
        onHoverIn={() => setHighlighted(true)}
        onHoverOut={() => setHighlighted(false)}
      >
        <Animated.View style={[styles.field, fieldOpacity]}>
          <Text style={[styles.value, !value && styles.placeholder]} numberOfLines={1}>
            {value || placeholder}
          </Text>
          <MaterialCommunityIcons name="chevron-down" size={control.icon} color={brand.placeholder} />
        </Animated.View>
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={styles.sheet}>
            <Text style={styles.sheetTitle}>{label}</Text>
            {options.map((option) => (
              <SelectOption
                key={option}
                option={option}
                selected={option === value}
                onPress={() => handleSelect(option)}
                brand={brand}
                styles={styles}
              />
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

function makeStyles(brand: BrandColors, control: ControlMetrics) {
  return StyleSheet.create({
    wrapper: {
      gap: 8,
    },
    label: {
      fontSize: control.labelFont,
      fontWeight: '700',
      color: brand.label,
    },
    field: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
      minHeight: control.fieldMinHeight,
      paddingHorizontal: control.fieldPadH,
      borderRadius: Radius.md,
      borderWidth: 1,
      borderColor: brand.fieldBorder,
      backgroundColor: brand.fieldBackground,
    },
    value: {
      flex: 1,
      fontSize: control.fieldFont,
      color: brand.textDark,
    },
    placeholder: {
      color: brand.placeholder,
    },
    backdrop: {
      flex: 1,
      backgroundColor: brand.overlay,
      justifyContent: 'flex-end',
    },
    sheet: {
      backgroundColor: brand.surface,
      borderTopLeftRadius: Radius.lg,
      borderTopRightRadius: Radius.lg,
      paddingHorizontal: 24,
      paddingTop: 20,
      paddingBottom: 36,
      gap: 4,
    },
    sheetTitle: {
      fontSize: 16,
      fontWeight: '800',
      color: brand.textDark,
      marginBottom: 8,
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 14,
      paddingHorizontal: 8,
      borderRadius: Radius.sm,
      borderBottomWidth: 1,
      borderBottomColor: brand.divider,
    },
    optionLabel: {
      fontSize: 16,
      color: brand.textDark,
    },
    optionLabelSelected: {
      fontWeight: '700',
      color: brand.blue,
    },
  });
}
