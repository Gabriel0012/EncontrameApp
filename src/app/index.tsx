import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandButton } from '@/components/brand-button';
import { Brand } from '@/constants/brand';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.hero}>
          <Image
            source={require('@/assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.actions}>
          <BrandButton label="Começar" variant="orange" onPress={() => router.push('/signup')} />
          <Pressable onPress={() => router.push('/login')} hitSlop={12}>
            <Text style={styles.loginLink}>Já possuo uma conta ›</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Brand.navy,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 28,
    paddingBottom: 24,
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '80%',
    height: 260,
  },
  actions: {
    gap: 18,
    alignItems: 'center',
  },
  loginLink: {
    color: Brand.cream,
    fontSize: 15,
    fontWeight: '600',
  },
});
