import { QueryClientProvider } from '@tanstack/react-query';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Brand } from '@/constants/brand';
import { setSessionExpiredHandler } from '@/lib/auth-events';
import { queryClient } from '@/lib/query-client';
import { hydrateSession } from '@/lib/session';

export default function RootLayout() {
  const router = useRouter();
  const [sessionReady, setSessionReady] = useState(false);

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
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        {sessionReady ? (
          <Stack
            screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Brand.white } }}
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
            <ActivityIndicator size="large" color={Brand.orange} />
          </View>
        )}
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Brand.navy,
  },
});
