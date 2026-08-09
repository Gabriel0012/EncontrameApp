import { Image, StyleSheet, View } from 'react-native';

type Props = {
  /** Logo menor quando o login ocupa a home no desktop. */
  compact?: boolean;
};

export function HomeHeroSection({ compact = false }: Props) {
  return (
    <View style={[styles.hero, compact && styles.heroCompact]}>
      <Image
        source={require('@/assets/images/logo.png')}
        style={[styles.logo, compact && styles.logoCompact]}
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
  logo: {
    width: '80%',
    height: 260,
  },
  logoCompact: {
    width: '70%',
    height: 160,
  },
});
