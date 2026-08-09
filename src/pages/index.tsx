import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ContentShell } from '@/components/content-shell';
import { Brand } from '@/constants/brand';
import { useHomeController } from '@/features/home/home.controller';
import { HomeActionsSection } from '@/features/home/sections/home-actions-section';
import { HomeHeroSection } from '@/features/home/sections/home-hero-section';

export default function HomePage() {
  const controller = useHomeController();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <ContentShell style={styles.shell}>
          <HomeHeroSection />
          <HomeActionsSection controller={controller} />
        </ContentShell>
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
  },
  shell: {
    flex: 1,
    paddingHorizontal: 28,
    paddingBottom: 24,
  },
});
