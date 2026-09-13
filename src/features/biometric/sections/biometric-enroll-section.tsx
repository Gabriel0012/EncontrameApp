import { useMemo } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';

import { BrandButton } from '@/components/brand-button';
import { Radius, type BrandColors } from '@/constants/brand';
import { PageGutter } from '@/constants/theme';
import type { BiometricEnrollController } from '@/features/biometric/use-biometric-enroll';
import { useBrand } from '@/lib/brand-theme';

interface BiometricEnrollSectionProps {
  controller: BiometricEnrollController;
}

/** Pergunta se o usuário quer entrar pela biometria deste celular da próxima vez. */
export function BiometricEnrollSection({ controller }: BiometricEnrollSectionProps) {
  const brand = useBrand();
  const styles = useMemo(() => makeStyles(brand), [brand]);

  return (
    <Modal
      transparent
      visible={controller.visible}
      animationType="fade"
      onRequestClose={controller.decline}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>{controller.copy.enrollTitle}</Text>
          <Text style={styles.body}>{controller.copy.enrollBody}</Text>
          <BrandButton
            label={controller.copy.enrollConfirm}
            variant="blue"
            loading={controller.busy}
            onPress={controller.accept}
            trailingIcon={controller.copy.icon}
          />
          <BrandButton
            label="Agora não"
            variant="outline"
            disabled={controller.busy}
            onPress={controller.decline}
            style={styles.secondary}
          />
        </View>
      </View>
    </Modal>
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
    secondary: {
      marginTop: 12,
    },
  });
}
