import { Image, StyleSheet, View } from 'react-native';

export function HomeHeroSection() {
  return (
    <View style={styles.hero}>
      <Image
        source={require('@/assets/images/logo.png')}
        style={styles.logo}
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
  logo: {
    width: '80%',
    height: 260,
  },
});
