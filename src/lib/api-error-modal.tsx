import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';

import { BrandButton } from '@/components/brand-button';
import { Radius, type BrandColors } from '@/constants/brand';
import { PageGutter } from '@/constants/theme';
import { setApiErrorHandler } from '@/lib/api-error-events';
import { useBrand } from '@/lib/brand-theme';

/** Modal global: qualquer falha da API aparece aqui (o Alert nativo não funciona no web). */
export function ApiErrorModalProvider({ children }: { children: ReactNode }) {
  const brand = useBrand();
  const styles = useMemo(() => makeStyles(brand), [brand]);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setApiErrorHandler((next) => setMessage(next));
    return () => setApiErrorHandler(null);
  }, []);

  return (
    <>
      {children}
      <Modal
        transparent
        visible={message != null}
        animationType="fade"
        onRequestClose={() => setMessage(null)}
      >
        <View style={styles.backdrop}>
          <View style={styles.card}>
            <Text style={styles.title}>Algo deu errado</Text>
            <Text style={styles.body}>{message}</Text>
            <BrandButton label="Entendi" onPress={() => setMessage(null)} />
          </View>
        </View>
      </Modal>
    </>
  );
}

function makeStyles(brand: BrandColors) {
  return StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: brand.overlay,
      justifyContent: 'center',
      padding: PageGutter,
    },
    card: {
      backgroundColor: brand.surface,
      borderRadius: Radius.lg,
      padding: PageGutter,
    },
    title: {
      fontSize: 20,
      fontWeight: '700',
      color: brand.textDark,
      marginBottom: 12,
    },
    body: {
      fontSize: 15,
      lineHeight: 22,
      color: brand.textMuted,
      marginBottom: 20,
    },
  });
}
