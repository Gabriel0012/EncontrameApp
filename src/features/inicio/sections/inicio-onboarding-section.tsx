import { useMemo } from 'react';
import { Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandButton } from '@/components/brand-button';
import { Radius, type BrandColors } from '@/constants/brand';
import { PageGutter } from '@/constants/theme';
import type { InicioController } from '@/features/inicio/inicio.controller';
import { useBrand } from '@/lib/brand-theme';
import { useWideLayout } from '@/lib/use-wide-layout';

const STEPS = [
  {
    title: 'Várias pessoas podem precisar da nossa ajuda neste momento.',
    message: 'Nos ajude a encontrá-las.',
  },
  {
    title: 'Cadastre pessoas desaparecidas que você conhece.',
    message: 'Receba ajuda para encontrá-las.',
  },
  {
    title: 'Como você quer começar?',
    message: null,
  },
] as const;

type Props = {
  controller: InicioController;
};

export function InicioOnboardingSection({ controller }: Props) {
  const brand = useBrand();
  const { isWide } = useWideLayout();
  const styles = useMemo(() => makeStyles(brand, isWide), [brand, isWide]);
  const step = controller.onboardingStep;
  const copy = STEPS[step] ?? STEPS[0];
  const isLast = step === STEPS.length - 1;

  return (
    <Modal
      visible={controller.onboardingVisible}
      transparent={isWide}
      animationType={isWide ? 'fade' : 'slide'}
      presentationStyle={isWide ? 'overFullScreen' : 'fullScreen'}
      onRequestClose={controller.onboardingRequestClose}
    >
      <View style={styles.shell}>
        <SafeAreaView style={styles.panel} edges={['top', 'bottom']}>
          <View style={styles.body}>
            <Image
              source={require('@/assets/images/sofia-avatar.jpg')}
              style={styles.avatar}
              resizeMode="cover"
              accessibilityLabel="Sofia"
            />
            <Text style={styles.name}>Oi, eu sou a Sofia.</Text>
            <Text style={styles.title}>{copy.title}</Text>
            {copy.message ? <Text style={styles.message}>{copy.message}</Text> : null}
          </View>

          <View style={styles.footer}>
            <View style={styles.dots} accessibilityLabel={`Passo ${step + 1} de ${STEPS.length}`}>
              {STEPS.map((_, index) => (
                <View
                  key={index}
                  style={[styles.dot, index === step ? styles.dotActive : styles.dotIdle]}
                />
              ))}
            </View>

            {isLast ? (
              <View style={styles.actions}>
                <BrandButton
                  label="Avistei uma pessoa — quero reportar"
                  variant="orange"
                  onPress={controller.onboardingReport}
                  style={styles.actionBtn}
                />
                <BrandButton
                  label="Quero cadastrar uma pessoa desaparecida"
                  variant="outline"
                  onPress={controller.onboardingRegister}
                  style={styles.actionBtn}
                />
                <Pressable
                  onPress={controller.onboardingExplore}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel="Quero só explorar o mapa"
                >
                  <Text style={styles.skip}>Quero só explorar o mapa</Text>
                </Pressable>
              </View>
            ) : (
              <BrandButton label="Continuar" variant="orange" onPress={controller.onboardingContinue} />
            )}
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

function makeStyles(brand: BrandColors, isWide: boolean) {
  return StyleSheet.create({
    shell: {
      flex: 1,
      backgroundColor: isWide ? brand.overlay : brand.white,
      justifyContent: isWide ? 'center' : 'flex-start',
      alignItems: isWide ? 'center' : 'stretch',
      padding: isWide ? PageGutter : 0,
    },
    panel: {
      flex: isWide ? undefined : 1,
      width: '100%',
      maxWidth: isWide ? 480 : undefined,
      backgroundColor: brand.white,
      borderRadius: isWide ? Radius.lg : 0,
      overflow: 'hidden',
      zIndex: 1,
    },
    body: {
      flex: isWide ? undefined : 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: PageGutter,
      paddingVertical: 24,
    },
    avatar: {
      width: 148,
      height: 148,
      borderRadius: 74,
      backgroundColor: brand.avatarBackground,
      borderWidth: 4,
      borderColor: brand.orange,
    },
    name: {
      marginTop: 16,
      fontSize: 15,
      fontWeight: '700',
      color: brand.textMuted,
    },
    title: {
      marginTop: 8,
      fontSize: 24,
      fontWeight: '800',
      textAlign: 'center',
      color: brand.textDark,
    },
    message: {
      marginTop: 12,
      fontSize: 16,
      lineHeight: 24,
      textAlign: 'center',
      color: brand.textMuted,
      maxWidth: 360,
    },
    footer: {
      paddingHorizontal: PageGutter,
      paddingBottom: 16,
      paddingTop: 8,
      gap: 16,
    },
    dots: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    dotActive: {
      backgroundColor: brand.orange,
      width: 18,
    },
    dotIdle: {
      backgroundColor: brand.divider,
    },
    actions: {
      gap: 12,
    },
    actionBtn: {
      height: 'auto',
      minHeight: 54,
      paddingVertical: 12,
    },
    skip: {
      marginTop: 4,
      fontSize: 15,
      fontWeight: '600',
      textAlign: 'center',
      color: brand.textMuted,
    },
  });
}
