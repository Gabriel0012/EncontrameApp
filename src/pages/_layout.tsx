import { QueryClientProvider } from '@tanstack/react-query';
import { type Href, Stack, usePathname, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import type { BrandColors } from '@/constants/brand';
import { ApiErrorModalProvider } from '@/lib/api-error-modal';
import { setSessionExpiredHandler } from '@/lib/auth-events';
import { isProtectedPath } from '@/lib/auth-guard';
import { BrandThemeProvider, useBrand, useBrandColorScheme } from '@/lib/brand-theme';
import { queryClient } from '@/lib/query-client';
import { getSessionUser, hydrateSession } from '@/lib/session';
import { syncLocalPeople } from '@/services/people/people.sync';

// Só no popup do OAuth (tem opener). Completa e deixa o app pai fechar a janela
// antes do Expo Router redirecionar `/` → `/inicio` → `/login`.
if (Platform.OS === 'web' && typeof window !== 'undefined' && window.opener) {
  WebBrowser.maybeCompleteAuthSession({ skipRedirectCheck: true });
}

function RootLayoutInner() {
  const router = useRouter();
  const pathname = usePathname();
  const brand = useBrand();
  const colorScheme = useBrandColorScheme();
  const [sessionReady, setSessionReady] = useState(false);
  const styles = useMemo(() => makeStyles(brand), [brand]);

  const blocked = sessionReady && isProtectedPath(pathname) && getSessionUser() == null;

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      await hydrateSession();
      if (!cancelled) {
        setSessionReady(true);
      }
      if (!cancelled && getSessionUser() != null) {
        void syncLocalPeople();
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

  useEffect(() => {
    if (!blocked) return;
    router.replace({ pathname: '/login', params: { returnTo: pathname } } as Href);
  }, [blocked, pathname, router]);

  const showStack = sessionReady && !blocked;

  return (
    <>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      {showStack ? (
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
          <Stack.Screen name="pessoa/[id]" />
          <Stack.Screen name="chat" />
          <Stack.Screen name="exercises" />
          <Stack.Screen name="grupo-chat" />
          <Stack.Screen name="sofia-welcome" />
          <Stack.Screen name="sofia-theme" />
          <Stack.Screen name="sofia-perfil" />
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
          <ApiErrorModalProvider>
            <RootLayoutInner />
          </ApiErrorModalProvider>
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
