import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ContentShell } from '@/components/content-shell';
import { type BrandColors } from '@/constants/brand';
import { useHomeController } from '@/features/home/home.controller';
import { HomeActionsSection } from '@/features/home/sections/home-actions-section';
import { HomeDesktopAuthSection } from '@/features/home/sections/home-desktop-auth-section';
import { HomeHeroSection } from '@/features/home/sections/home-hero-section';
import { useLoginController } from '@/features/login/login.controller';
import { useBrand } from '@/lib/brand-theme';
import { useWideLayout } from '@/lib/use-wide-layout';

export default function HomePage() {
  const brand = useBrand();
  const styles = useMemo(() => makeStyles(brand), [brand]);
  const home = useHomeController();
  const login = useLoginController();
  const { isWide } = useWideLayout();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            bounces={false}
          >
            <ContentShell style={[styles.shell, isWide && styles.shellWide]}>
              <HomeHeroSection compact={isWide} />
              {isWide ? (
                <HomeDesktopAuthSection home={home} login={login} />
              ) : (
                <HomeActionsSection controller={home} />
              )}
            </ContentShell>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

function makeStyles(brand: BrandColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: brand.navy,
    },
    safeArea: {
      flex: 1,
    },
    flex: {
      flex: 1,
    },
    scroll: {
      flexGrow: 1,
    },
    shell: {
      flexGrow: 1,
      paddingBottom: 24,
      justifyContent: 'flex-end',
    },
    shellWide: {
      justifyContent: 'center',
      gap: 8,
      maxWidth: 440,
    },
  });
}
