import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { MaxContentWidth, PageGutter } from '@/constants/theme';

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Quando true, não aplica PageGutter (útil se o padding vier das sections). */
  noGutter?: boolean;
};

/** Limita a largura do conteúdo em monitores grandes; no mobile ocupa 100%. */
export function ContentShell({ children, style, noGutter = false }: Props) {
  return (
    <View style={[styles.shell, !noGutter && styles.gutter, style]}>{children}</View>
  );
}

const styles = StyleSheet.create({
  shell: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  gutter: {
    paddingHorizontal: PageGutter,
  },
});
