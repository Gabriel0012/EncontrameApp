import { StyleSheet, View } from 'react-native';

import { BrandButton } from '@/components/brand-button';
import { BrandField } from '@/components/brand-field';
import { FormRow } from '@/components/form-row';
import type { CadastrarPessoaController } from '@/features/cadastrar-pessoa/cadastrar-pessoa.controller';

interface CadastrarPessoaDetailsSectionProps {
  controller: CadastrarPessoaController;
}

export function CadastrarPessoaDetailsSection({ controller }: CadastrarPessoaDetailsSectionProps) {
  return (
    <View style={styles.form}>
      <FormRow>
        <BrandField
          label="Cabelo"
          value={controller.hair}
          onChangeText={controller.setHair}
          placeholder="Cabelo preto cacheado"
        />
        <BrandField
          label="Olhos"
          value={controller.eyes}
          onChangeText={controller.setEyes}
          placeholder="Olhos castanhos"
        />
      </FormRow>
      <FormRow>
        <BrandField
          label="Tatuagem"
          value={controller.tattoo}
          onChangeText={controller.setTattoo}
          placeholder="Tatuagem de leão no braço esquerdo"
        />
        <BrandField
          label="Acessórios"
          value={controller.accessories}
          onChangeText={controller.setAccessories}
          placeholder="Brincos, colar, pulseiras, etc..."
        />
      </FormRow>
      <BrandField
        label="Localidade"
        value={controller.location}
        onChangeText={controller.setLocation}
        placeholder="Rua dos timbiras 300"
        trailingIcon="map-marker-outline"
        onTrailingPress={controller.handleLocationSearch}
      />

      <View style={styles.row}>
        <View style={styles.rowItem}>
          <BrandField
            label="Última aparição"
            value={controller.lastSeen}
            onChangeText={controller.setLastSeen}
            placeholder="01/01/2001"
            keyboardType="numeric"
          />
        </View>
        <View style={styles.rowItem}>
          <BrandField
            label="Telefone"
            value={controller.phone}
            onChangeText={controller.setPhone}
            placeholder="( 99 ) 00000-0000"
            keyboardType="phone-pad"
          />
        </View>
      </View>

      <BrandButton
        label="Cadastrar"
        variant="blue"
        loading={controller.submitting}
        disabled={!controller.canSubmit}
        onPress={controller.handleRegister}
        style={styles.submit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 18,
  },
  row: {
    flexDirection: 'row',
    gap: 14,
  },
  rowItem: {
    flex: 1,
  },
  submit: {
    marginTop: 8,
  },
});
