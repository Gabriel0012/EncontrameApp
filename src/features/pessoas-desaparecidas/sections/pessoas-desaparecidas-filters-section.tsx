import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { BrandButton } from '@/components/brand-button';
import { BrandField } from '@/components/brand-field';
import { BrandSelect } from '@/components/brand-select';
import { FormRow } from '@/components/form-row';
import { Radius, type BrandColors } from '@/constants/brand';
import {
  ADDRESS_SCOPE_OPTIONS,
  STATUS_FILTER_OPTIONS,
  type PessoasDesaparecidasController,
} from '@/features/pessoas-desaparecidas/pessoas-desaparecidas.controller';
import { useBrand } from '@/lib/brand-theme';

interface PessoasDesaparecidasFiltersSectionProps {
  controller: PessoasDesaparecidasController;
}

export function PessoasDesaparecidasFiltersSection({
  controller,
}: PessoasDesaparecidasFiltersSectionProps) {
  const brand = useBrand();
  const styles = useMemo(() => makeStyles(brand), [brand]);
  const statusLabel =
    STATUS_FILTER_OPTIONS.find((option) => option.id === controller.statusId)?.label ?? 'Todos';
  const scopeLabel =
    ADDRESS_SCOPE_OPTIONS.find((option) => option.id === controller.addressScope)?.label ??
    'Última vez vista';

  return (
    <View style={styles.wrapper}>
      <BrandField
        label="Pesquisar"
        value={controller.query}
        onChangeText={controller.setQuery}
        placeholder="Nome ou apelido"
        trailingIcon="magnify"
      />

      <BrandButton
        label={
          controller.filtersOpen
            ? 'Ocultar filtros'
            : controller.hasActiveFilters
              ? 'Filtros (ativos)'
              : 'Filtros'
        }
        variant="outline"
        trailingIcon="filter-outline"
        onPress={controller.toggleFilters}
      />

      {controller.filtersOpen ? (
        <View style={styles.panel}>
          <BrandSelect
            label="Status"
            value={statusLabel}
            options={STATUS_FILTER_OPTIONS.map((option) => option.label)}
            onSelect={(label) => {
              const option = STATUS_FILTER_OPTIONS.find((item) => item.label === label);
              controller.setStatusId(option?.id ?? '');
            }}
          />
          <FormRow>
            <BrandField
              label="Idade mínima"
              value={controller.ageMin}
              onChangeText={controller.setAgeMin}
              placeholder="18"
              keyboardType="number-pad"
            />
            <BrandField
              label="Idade máxima"
              value={controller.ageMax}
              onChangeText={controller.setAgeMax}
              placeholder="60"
              keyboardType="number-pad"
            />
          </FormRow>
          <BrandSelect
            label="Endereço considerado"
            value={scopeLabel}
            options={ADDRESS_SCOPE_OPTIONS.map((option) => option.label)}
            onSelect={(label) => {
              const option = ADDRESS_SCOPE_OPTIONS.find((item) => item.label === label);
              controller.setAddressScope(option?.id ?? 'lastSeen');
            }}
          />
          <FormRow>
            <BrandField
              label="Cidade"
              value={controller.city}
              onChangeText={controller.setCity}
              placeholder="Belo Horizonte"
              autoCapitalize="words"
            />
            <BrandField
              label="Estado"
              value={controller.state}
              onChangeText={controller.setState}
              placeholder="MG"
              autoCapitalize="characters"
            />
          </FormRow>
          <FormRow>
            <BrandField
              label="Bairro"
              value={controller.neighborhood}
              onChangeText={controller.setNeighborhood}
              placeholder="Savassi"
              autoCapitalize="words"
            />
            <BrandField
              label="País"
              value={controller.country}
              onChangeText={controller.setCountry}
              placeholder="Brasil"
              autoCapitalize="words"
            />
          </FormRow>
        </View>
      ) : null}
    </View>
  );
}

function makeStyles(brand: BrandColors) {
  return StyleSheet.create({
    wrapper: {
      gap: 10,
    },
    panel: {
      gap: 14,
      padding: 14,
      borderRadius: Radius.md,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: brand.divider,
      backgroundColor: brand.surface,
    },
  });
}
