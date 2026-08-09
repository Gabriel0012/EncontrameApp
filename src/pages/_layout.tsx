import { QueryClientProvider } from '@tanstack/react-query';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Brand } from '@/constants/brand';
import { setSessionExpiredHandler } from '@/lib/auth-events';
import { queryClient } from '@/lib/query-client';
import { hydrateSession } from '@/lib/session';

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    void hydrateSession();

    setSessionExpiredHandler(() => {
      router.replace('/login');
    });

    return () => setSessionExpiredHandler(null);
  }, [router]);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar style="auto" />
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
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
