import { useRouter } from 'expo-router';
import { useState } from 'react';

import { maskCep, maskCpf, maskPhone } from '@/lib/masks';
import { useFieldErrors } from '@/lib/use-field-errors';
import {
  collectErrors,
  formatError,
  isCep,
  isCpf,
  isEmail,
  isPhone,
  NAME_MIN_LENGTH,
  optionalFormatError,
  textError,
} from '@/lib/validation';

/** Centraliza estado, validação e navegação da etapa 1 do cadastro (dados pessoais). */
export function useSignupController() {
  const router = useRouter();
  const { errors, setErrors, setFieldCode, markDirty, isDirty, fieldError } = useFieldErrors();

  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cep, setCep] = useState('');
  const [clause, setClause] = useState('');

  const changeName = (value: string) => {
    setName(value);
    if (isDirty('name')) setFieldCode('name', textError(value, NAME_MIN_LENGTH));
  };

  const blurName = () => {
    markDirty('name');
    setFieldCode('name', textError(name, NAME_MIN_LENGTH));
  };

  const changeCpf = (value: string) => {
    const next = maskCpf(value);
    setCpf(next);
    if (isDirty('cpf')) setFieldCode('cpf', formatError(next, isCpf));
  };

  const blurCpf = () => {
    markDirty('cpf');
    setFieldCode('cpf', formatError(cpf, isCpf));
  };

  const changeEmail = (value: string) => {
    setEmail(value);
    if (isDirty('email')) setFieldCode('email', formatError(value, isEmail));
  };

  const blurEmail = () => {
    markDirty('email');
    setFieldCode('email', formatError(email, isEmail));
  };

  const changePhone = (value: string) => {
    const next = maskPhone(value);
    setPhone(next);
    if (isDirty('phone')) setFieldCode('phone', formatError(next, isPhone));
  };

  const blurPhone = () => {
    markDirty('phone');
    setFieldCode('phone', formatError(phone, isPhone));
  };

  const changeCep = (value: string) => {
    const next = maskCep(value);
    setCep(next);
    if (isDirty('cep')) setFieldCode('cep', optionalFormatError(next, isCep));
  };

  const blurCep = () => {
    markDirty('cep');
    setFieldCode('cep', optionalFormatError(cep, isCep));
  };

  const handleNext = () => {
    const found = collectErrors({
      name: textError(name, NAME_MIN_LENGTH),
      cpf: formatError(cpf, isCpf),
      email: formatError(email, isEmail),
      phone: formatError(phone, isPhone),
      cep: optionalFormatError(cep, isCep),
    });

    setErrors(found);
    if (Object.keys(found).length > 0) return;

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
    setName: changeName,
    blurName,
    cpf,
    setCpf: changeCpf,
    blurCpf,
    email,
    setEmail: changeEmail,
    blurEmail,
    phone,
    setPhone: changePhone,
    blurPhone,
    cep,
    setCep: changeCep,
    blurCep,
    clause,
    setClause,
    errors,
    fieldError,
    handleNext,
    handleCepSearch,
  };
}

export type SignupController = ReturnType<typeof useSignupController>;
