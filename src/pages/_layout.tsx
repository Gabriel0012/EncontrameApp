import { QueryClientProvider } from '@tanstack/react-query';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import type { BrandColors } from '@/constants/brand';
import { setSessionExpiredHandler } from '@/lib/auth-events';
import { BrandThemeProvider, useBrand, useBrandColorScheme } from '@/lib/brand-theme';
import { queryClient } from '@/lib/query-client';
import { hydrateSession } from '@/lib/session';

function RootLayoutInner() {
  const router = useRouter();
  const brand = useBrand();
  const colorScheme = useBrandColorScheme();
  const [sessionReady, setSessionReady] = useState(false);
  const styles = useMemo(() => makeStyles(brand), [brand]);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      await hydrateSession();
      if (!cancelled) {
        setSessionReady(true);
      }
    })();

    setSessionExpiredHandler(() => {
      router.replace('/login');
    });

    return () => {
      cancelled = true;
      setSessionExpiredHandler(null);
    };
  }, [router]);

  return (
    <>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      {sessionReady ? (
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: brand.white },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="signup" />
          <Stack.Screen name="signup-password" />
          <Stack.Screen name="inicio" />
          <Stack.Screen name="cadastrar-pessoa" />
          <Stack.Screen name="pessoas-proximas" />
          <Stack.Screen name="chat" />
          <Stack.Screen name="grupo-chat" />
        </Stack>
      ) : (
        <View style={styles.boot}>
          <ActivityIndicator size="large" color={brand.orange} />
        </View>
      )}
    </>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <BrandThemeProvider>
          <RootLayoutInner />
        </BrandThemeProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

function makeStyles(brand: BrandColors) {
  return StyleSheet.create({
    boot: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: brand.navy,
    },
  });
}
