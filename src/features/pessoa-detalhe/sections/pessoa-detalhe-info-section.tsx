import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { BrandButton } from '@/components/brand-button';
import { type BrandColors } from '@/constants/brand';
import type { PessoaDetalheController } from '@/features/pessoa-detalhe/pessoa-detalhe.controller';
import { useBrand } from '@/lib/brand-theme';

interface PessoaDetalheInfoSectionProps {
  controller: PessoaDetalheController;
}

export function PessoaDetalheInfoSection({ controller }: PessoaDetalheInfoSectionProps) {
  const brand = useBrand();
  const styles = useMemo(() => makeStyles(brand), [brand]);
  const { person } = controller;
  if (!person) {
    return null;
  }

  const lastWhen = formatLastSeenDate(person.dtLastSeen);

  const rows = [
    { label: 'Último local', value: person.lastSeen || person.location },
    { label: 'Visto em', value: lastWhen },
    { label: 'Altura', value: person.heightCm ? `${person.heightCm} cm` : undefined },
    { label: 'Etnia', value: person.ethnicity },
    { label: 'Porte', value: person.build },
    { label: 'Roupas', value: person.clothes },
    { label: 'Cabelo', value: person.hair },
    { label: 'Olhos', value: person.eyes },
    { label: 'Tatuagem', value: person.tattoo },
    { label: 'Acessórios', value: person.accessories },
  ].filter((row) => Boolean(row.value));

  return (
    <View style={styles.list}>
      {rows.map((row) => (
        <View key={row.label} style={styles.row}>
          <Text style={styles.label}>{row.label}</Text>
          <Text style={styles.value}>{row.value}</Text>
        </View>
      ))}
      <BrandButton
        label="Histórico de avistamentos"
        variant="outline"
        onPress={controller.openHistory}
      />
    </View>
  );
}

function formatLastSeenDate(value?: string) {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
}

function makeStyles(brand: BrandColors) {
  return StyleSheet.create({
    list: {
      gap: 14,
    },
    row: {
      gap: 2,
    },
    label: {
      fontSize: 12,
      fontWeight: '700',
      color: brand.label,
      textTransform: 'uppercase',
    },
    value: {
      fontSize: 16,
      color: brand.textDark,
    },
  });
}
