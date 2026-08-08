import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { Brand, Radius } from '@/constants/brand';

type Props = {
  label: string;
  value: string;
  options: readonly string[];
  onSelect: (value: string) => void;
  placeholder?: string;
};

export function BrandSelect({ label, value, options, onSelect, placeholder = 'Escolher' }: Props) {
  const [open, setOpen] = useState(false);

  const handleSelect = (option: string) => {
    onSelect(option);
    setOpen(false);
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <Pressable style={styles.field} onPress={() => setOpen(true)}>
        <Text style={[styles.value, !value && styles.placeholder]} numberOfLines={1}>
          {value || placeholder}
        </Text>
        <MaterialCommunityIcons name="chevron-down" size={22} color={Brand.placeholder} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={styles.sheet}>
            <Text style={styles.sheetTitle}>{label}</Text>
            {options.map((option) => {
              const selected = option === value;
              return (
                <Pressable key={option} style={styles.option} onPress={() => handleSelect(option)}>
                  <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>
                    {option}
                  </Text>
                  {selected ? (
                    <MaterialCommunityIcons name="check" size={20} color={Brand.blue} />
                  ) : null}
                </Pressable>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
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
    justifyContent: 'space-between',
    gap: 8,
    minHeight: 52,
    paddingHorizontal: 18,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Brand.fieldBorder,
    backgroundColor: Brand.fieldBackground,
  },
  value: {
    flex: 1,
    fontSize: 16,
    color: Brand.textDark,
  },
  placeholder: {
    color: Brand.placeholder,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(11, 36, 66, 0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Brand.white,
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
    color: Brand.textDark,
    marginBottom: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Brand.divider,
  },
  optionLabel: {
    fontSize: 16,
    color: Brand.textDark,
  },
  optionLabelSelected: {
    fontWeight: '700',
    color: Brand.blue,
  },
});
