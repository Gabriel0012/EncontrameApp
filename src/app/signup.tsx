import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomBar } from '@/components/bottom-bar';
import { BrandButton } from '@/components/brand-button';
import { BrandField } from '@/components/brand-field';
import { ScreenHeader } from '@/components/screen-header';
import { Brand } from '@/constants/brand';

export default function SignupScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cep, setCep] = useState('');
  const [clause, setClause] = useState('');

  const handleNext = () => {
    router.push({
      pathname: '/signup-password',
      params: { name, cpf, email, phone, cep, clause },
    });
  };

  const handleCepSearch = () => {
    // TODO: buscar endereço a partir do CEP (ex.: ViaCEP) e preencher campos.
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled">
          <ScreenHeader title="Criar uma conta" />

          <View style={styles.form}>
            <BrandField
              label="Nome"
              value={name}
              onChangeText={setName}
              placeholder="Fulano Beltrano da Silva"
              autoCapitalize="words"
            />
            <BrandField
              label="CPF"
              value={cpf}
              onChangeText={setCpf}
              placeholder="000.000.000-00"
              keyboardType="numeric"
            />
            <BrandField
              label="E-mail"
              value={email}
              onChangeText={setEmail}
              placeholder="exemplo@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <BrandField
              label="Telefone"
              value={phone}
              onChangeText={setPhone}
              placeholder="( 31 ) 9 9999-9999"
              keyboardType="phone-pad"
            />
            <BrandField
              label="CEP"
              value={cep}
              onChangeText={setCep}
              placeholder="30550-830"
              keyboardType="numeric"
              trailingIcon="magnify"
              onTrailingPress={handleCepSearch}
            />
            <BrandField
              label="Claúsula"
              value={clause}
              onChangeText={setClause}
              placeholder="Exemplo..."
            />

            <BrandButton
              label="Próximo"
              variant="outline"
              trailingIcon="chevron-double-right"
              onPress={handleNext}
              style={styles.submit}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <BottomBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Brand.white,
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
  },
  form: {
    marginTop: 20,
    gap: 18,
  },
  submit: {
    marginTop: 12,
  },
});
