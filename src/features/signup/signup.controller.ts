import { useRouter } from 'expo-router';
import { useState } from 'react';

/** Centraliza estado e navegação da etapa 1 do cadastro (dados pessoais). */
export function useSignupController() {
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

  return {
    name,
    setName,
    cpf,
    setCpf,
    email,
    setEmail,
    phone,
    setPhone,
    cep,
    setCep,
    clause,
    setClause,
    handleNext,
    handleCepSearch,
  };
}

export type SignupController = ReturnType<typeof useSignupController>;
