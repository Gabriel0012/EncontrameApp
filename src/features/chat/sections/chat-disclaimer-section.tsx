import { useMemo } from 'react';
import { Modal, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BrandButton } from '@/components/brand-button';
import { Radius, type BrandColors } from '@/constants/brand';
import { PageGutter } from '@/constants/theme';
import { useBrand } from '@/lib/brand-theme';

type Props = {
  visible: boolean;
  onAccept: () => void;
};

export function ChatDisclaimerSection({ visible, onAccept }: Props) {
  const brand = useBrand();
  const styles = useMemo(() => makeStyles(brand), [brand]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={() => {}}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>Antes de conversar com a Sofia</Text>
          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
            <Text style={styles.body}>
              Sofia é uma inteligência artificial criada para conversar e oferecer apoio e
              informações. Ela não substitui um terapeuta, psicólogo, psiquiatra, médico ou outro
              profissional de saúde qualificado.{'\n\n'}
              Sofia não realiza diagnósticos, tratamentos ou atendimento de emergência.{'\n\n'}
              Se você estiver em perigo ou passando por uma situação de emergência, procure ajuda
              profissional ou um serviço de emergência da sua região.
            </Text>
            <View style={styles.emergencyBox}>
              <Text style={styles.emergencyTitle}>Em emergência no Brasil, ligue:</Text>
              <Text style={styles.emergencyList}>
                188 · CVV (apoio emocional){'\n'}
                192 · SAMU{'\n'}
                193 · Bombeiros{'\n'}
                190 · Polícia Militar
              </Text>
            </View>
          </ScrollView>
          <BrandButton label="Entendi, continuar" onPress={onAccept} />
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
      maxHeight: '85%',
    },
    title: {
      fontSize: 20,
      fontWeight: '700',
      color: brand.textDark,
      marginBottom: 12,
    },
    scroll: {
      marginBottom: 16,
    },
    body: {
      fontSize: 14,
      lineHeight: 22,
      color: brand.textMuted,
    },
    emergencyBox: {
      marginTop: 16,
      padding: 12,
      borderRadius: Radius.md,
      backgroundColor: brand.fieldBackground,
      borderWidth: 1,
      borderColor: brand.divider,
    },
    emergencyTitle: {
      fontSize: 13,
      fontWeight: '700',
      color: brand.textDark,
      marginBottom: 6,
    },
    emergencyList: {
      fontSize: 13,
      lineHeight: 20,
      color: brand.textMuted,
    },
  });
}
