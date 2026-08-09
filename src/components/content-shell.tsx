import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { MaxContentWidth } from '@/constants/theme';

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

/** Limita a largura do conteúdo em monitores grandes; no mobile ocupa 100%. */
export function ContentShell({ children, style }: Props) {
  return <View style={[styles.shell, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  shell: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
});
