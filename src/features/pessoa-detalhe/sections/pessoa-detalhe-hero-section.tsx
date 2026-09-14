import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { Radius, type BrandColors } from '@/constants/brand';
import type { PessoaDetalheController } from '@/features/pessoa-detalhe/pessoa-detalhe.controller';
import { useBrand } from '@/lib/brand-theme';

interface PessoaDetalheHeroSectionProps {
  controller: PessoaDetalheController;
}

export function PessoaDetalheHeroSection({ controller }: PessoaDetalheHeroSectionProps) {
  const brand = useBrand();
  const styles = useMemo(() => makeStyles(brand), [brand]);
  const { person } = controller;
  if (!person) {
    return null;
  }

  return (
    <View style={styles.hero}>
      <View style={styles.photo}>
        {person.photoUri ? (
          <Image source={{ uri: person.photoUri }} style={styles.photoImage} resizeMode="cover" />
        ) : (
          <MaterialCommunityIcons name="account" size={96} color={brand.avatarIcon} />
        )}
      </View>
      <View style={styles.meta}>
        {person.nickname ? <Text style={styles.nickname}>{person.nickname}</Text> : null}
        {person.age != null ? <Text style={styles.detail}>{person.age} anos</Text> : null}
        {person.statusDescription ? (
          <Text style={styles.status}>{person.statusDescription}</Text>
        ) : null}
      </View>
    </View>
  );
}

function makeStyles(brand: BrandColors) {
  return StyleSheet.create({
    hero: {
      gap: 16,
    },
    photo: {
      height: 280,
      borderRadius: Radius.lg,
      backgroundColor: brand.avatarBackground,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    photoImage: {
      width: '100%',
      height: '100%',
    },
    meta: {
      gap: 4,
    },
    nickname: {
      fontSize: 18,
      fontWeight: '700',
      color: brand.textDark,
    },
    detail: {
      fontSize: 15,
      color: brand.textMuted,
    },
    status: {
      marginTop: 4,
      fontSize: 13,
      fontWeight: '700',
      color: brand.blue,
      textTransform: 'uppercase',
    },
  });
}
