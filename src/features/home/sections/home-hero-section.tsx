import { Image, StyleSheet, View } from 'react-native';

type Props = {
  /** Logo menor quando o login ocupa a home no desktop. */
  compact?: boolean;
  /** Coluna ao lado do formulário (web/tablet). */
  side?: boolean;
};

export function HomeHeroSection({ compact = false, side = false }: Props) {
  return (
    <View style={[styles.hero, compact && styles.heroCompact, side && styles.heroSide]}>
      <Image
        source={require('@/assets/images/logo.png')}
        style={[styles.logo, compact && styles.logoCompact, side && styles.logoSide]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCompact: {
    flex: 0,
    paddingTop: 24,
    paddingBottom: 20,
  },
  heroSide: {
    flex: 1,
    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: 24,
    minHeight: 280,
  },
  logo: {
    width: '80%',
    height: 260,
  },
  logoCompact: {
    width: '70%',
    height: 160,
  },
  logoSide: {
    width: '100%',
    maxWidth: 360,
    height: 280,
  },
});
