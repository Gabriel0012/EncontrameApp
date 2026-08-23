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
        label="Última aparição"
        value={controller.lastSeen}
        onChangeText={controller.setLastSeen}
        placeholder="01/01/2001"
        keyboardType="numeric"
      />

      <BrandButton
        label="Cadastrar"
        variant="blue"
        loading={controller.submitting}
        disabled={!controller.nearFormEnd}
        onPress={controller.handleRegister}
        style={controller.nearFormEnd ? styles.submit : styles.submitHidden}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 18,
  },
  submit: {
    marginTop: 8,
  },
  submitHidden: {
    marginTop: 8,
    opacity: 0,
  },
});
