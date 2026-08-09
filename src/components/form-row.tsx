import { Children, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useWideLayout } from '@/lib/use-wide-layout';

type Props = {
  children: ReactNode;
};

/** Empilha campos no mobile; em telas largas coloca lado a lado. */
export function FormRow({ children }: Props) {
  const { isWide } = useWideLayout();
  const items = Children.toArray(children).filter(Boolean);

  return (
    <View style={[styles.row, isWide ? styles.rowWide : styles.rowStack]}>
      {items.map((child, index) => (
        <View key={index} style={isWide ? styles.itemWide : styles.itemStack}>
          {child}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: Spacing.three,
  },
  rowWide: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  rowStack: {
    flexDirection: 'column',
  },
  itemWide: {
    flex: 1,
    minWidth: 0,
  },
  itemStack: {
    width: '100%',
  },
});
