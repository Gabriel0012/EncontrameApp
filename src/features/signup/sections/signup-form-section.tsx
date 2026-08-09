import { StyleSheet, View } from 'react-native';

import { BrandButton } from '@/components/brand-button';
import { BrandField } from '@/components/brand-field';
import { FormRow } from '@/components/form-row';
import type { SignupController } from '@/features/signup/signup.controller';

interface SignupFormSectionProps {
  controller: SignupController;
}

export function SignupFormSection({ controller }: SignupFormSectionProps) {
  return (
    <View style={styles.form}>
      <FormRow>
        <BrandField
          label="Nome"
          value={controller.name}
          onChangeText={controller.setName}
          placeholder="Fulano Beltrano da Silva"
          autoCapitalize="words"
        />
        <BrandField
          label="CPF"
          value={controller.cpf}
          onChangeText={controller.setCpf}
          placeholder="000.000.000-00"
          keyboardType="numeric"
        />
      </FormRow>
      <FormRow>
        <BrandField
          label="E-mail"
          value={controller.email}
          onChangeText={controller.setEmail}
          placeholder="exemplo@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <BrandField
          label="Telefone"
          value={controller.phone}
          onChangeText={controller.setPhone}
          placeholder="( 31 ) 9 9999-9999"
          keyboardType="phone-pad"
        />
      </FormRow>
      <FormRow>
        <BrandField
          label="CEP"
          value={controller.cep}
          onChangeText={controller.setCep}
          placeholder="30550-830"
          keyboardType="numeric"
          trailingIcon="magnify"
          onTrailingPress={controller.handleCepSearch}
        />
        <BrandField
          label="Claúsula"
          value={controller.clause}
          onChangeText={controller.setClause}
          placeholder="Exemplo..."
        />
      </FormRow>

      <BrandButton
        label="Próximo"
        variant="outline"
        trailingIcon="chevron-double-right"
        onPress={controller.handleNext}
        style={styles.submit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    marginTop: 20,
    gap: 18,
  },
  submit: {
    marginTop: 12,
  },
});
