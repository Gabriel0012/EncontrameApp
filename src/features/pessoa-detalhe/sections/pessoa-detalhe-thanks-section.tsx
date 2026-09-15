import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandButton } from '@/components/brand-button';
import { Radius, type BrandColors } from '@/constants/brand';
import { PageGutter } from '@/constants/theme';
import type { PessoaDetalheController } from '@/features/pessoa-detalhe/pessoa-detalhe.controller';
import { useBrand } from '@/lib/brand-theme';
import { useWideLayout } from '@/lib/use-wide-layout';

interface PessoaDetalheThanksSectionProps {
  controller: PessoaDetalheController;
}

export function PessoaDetalheThanksSection({ controller }: PessoaDetalheThanksSectionProps) {
  const brand = useBrand();
  const { isWide } = useWideLayout();
  const styles = useMemo(() => makeStyles(brand, isWide), [brand, isWide]);
  const personName = controller.person?.nickname ?? controller.person?.fullName;

  return (
    <Modal
      visible={controller.thanksOpen}
      transparent={isWide}
      animationType={isWide ? 'fade' : 'slide'}
      presentationStyle={isWide ? 'overFullScreen' : 'fullScreen'}
      onRequestClose={controller.closeThanks}
    >
      <View style={styles.shell}>
        {isWide ? (
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={controller.closeThanks}
            accessibilityRole="button"
            accessibilityLabel="Fechar"
          />
        ) : null}
        <SafeAreaView style={styles.panel} edges={['top', 'bottom']}>
          <View style={styles.header}>
            <Pressable
              onPress={controller.closeThanks}
              hitSlop={12}
              style={styles.closeBtn}
              accessibilityRole="button"
              accessibilityLabel="Fechar"
            >
              <MaterialCommunityIcons name="close" size={28} color={brand.textDark} />
            </Pressable>
          </View>

          <View style={styles.body}>
            <Image
              source={require('@/assets/images/sofia-avatar.jpg')}
              style={styles.avatar}
              resizeMode="cover"
              accessibilityLabel="Sofia"
            />
            <Text style={styles.name}>Sofia</Text>
            <Text style={styles.title}>Obrigada por ajudar</Text>
            <Text style={styles.message}>
              {personName
                ? `Cada avistamento pode ser o passo que faltava para encontrar ${personName}. Sua ajuda é muito importante — de verdade.`
                : 'Cada avistamento pode ser o passo que faltava para alguém voltar para casa. Sua ajuda é muito importante — de verdade.'}
            </Text>
          </View>

          <View style={styles.footer}>
            <BrandButton
              label="Voltar para o início"
              variant="orange"
              onPress={controller.goToInicio}
            />
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
    header: {
      alignItems: 'flex-end',
      paddingHorizontal: PageGutter,
      paddingTop: 8,
    },
    closeBtn: {
      padding: 4,
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
      fontSize: 28,
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
    },
  });
}
