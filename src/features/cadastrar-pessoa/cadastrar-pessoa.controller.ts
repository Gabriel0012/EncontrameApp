import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

import { useCreatePersonMutation } from '@/services/people/people.service';
import type { CreatePersonPayload } from '@/services/people/people.types';

export const ETHNICITY_OPTIONS = ['Branca', 'Preta', 'Parda', 'Amarela', 'Indígena'] as const;
export const BUILD_OPTIONS = ['Magro', 'Médio', 'Atlético', 'Forte'] as const;

const SUBMIT_END_THRESHOLD = 120;

/** Centraliza estado, validação e cadastro de uma nova pessoa desaparecida. */
export function useCadastrarPessoaController() {
  const router = useRouter();
  const createMutation = useCreatePersonMutation();

  const [photoUri, setPhotoUri] = useState('');
  const [fullName, setFullName] = useState('');
  const [nickname, setNickname] = useState('');
  const [age, setAge] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [ethnicity, setEthnicity] = useState('');
  const [build, setBuild] = useState('');
  const [clothes, setClothes] = useState('');
  const [hair, setHair] = useState('');
  const [eyes, setEyes] = useState('');
  const [tattoo, setTattoo] = useState('');
  const [accessories, setAccessories] = useState('');
  const [location, setLocation] = useState('');
  const [lastSeen, setLastSeen] = useState('');
  const [phone, setPhone] = useState('');
  /** True quando o botão "Cadastrar" do formulário entra na área visível. */
  const [nearFormEnd, setNearFormEnd] = useState(false);

  const canSubmit = Boolean(fullName.trim() && location.trim() && phone.trim());

  const updateSubmitVisibility = (metrics: {
    contentHeight: number;
    layoutHeight: number;
    offsetY: number;
  }) => {
    const { contentHeight, layoutHeight, offsetY } = metrics;
    if (layoutHeight <= 0) return;
    const fitsWithoutScroll = contentHeight <= layoutHeight + 8;
    const atEnd = offsetY + layoutHeight >= contentHeight - SUBMIT_END_THRESHOLD;
    setNearFormEnd(fitsWithoutScroll || atEnd);
  };

  const handlePickPhoto = () => {
    // TODO: abrir a câmera/galeria (expo-image-picker) na integração.
    Alert.alert('Foto', 'Seleção de foto será habilitada em breve.');
  };

  const handleLocationSearch = () => {
    // TODO: buscar coordenadas a partir do endereço na integração do mapa.
  };

  const handleRegister = async () => {
    if (!canSubmit) {
      Alert.alert('Campos obrigatórios', 'Informe ao menos nome, localidade e telefone.');
      return;
    }

    const payload: CreatePersonPayload = {
      fullName,
      nickname,
      age,
      heightCm,
      ethnicity,
      build,
      clothes,
      hair,
      eyes,
      tattoo,
      accessories,
      location,
      lastSeen,
      phone,
      photoUri: photoUri || undefined,
    };

    try {
      await createMutation.mutateAsync(payload);
      Alert.alert('Cadastro concluído', 'A pessoa foi cadastrada com sucesso.');
      router.replace('/inicio');
    } catch {
      Alert.alert('Falha no cadastro', 'Não foi possível cadastrar. Tente novamente.');
    }
  };

  return {
    photoUri,
    setPhotoUri,
    fullName,
    setFullName,
    nickname,
    setNickname,
    age,
    setAge,
    heightCm,
    setHeightCm,
    ethnicity,
    setEthnicity,
    build,
    setBuild,
    clothes,
    setClothes,
    hair,
    setHair,
    eyes,
    setEyes,
    tattoo,
    setTattoo,
    accessories,
    setAccessories,
    location,
    setLocation,
    lastSeen,
    setLastSeen,
    phone,
    setPhone,
    canSubmit,
    submitting: createMutation.isPending,
    nearFormEnd,
    updateSubmitVisibility,
    handlePickPhoto,
    handleLocationSearch,
    handleRegister,
  };
}

export type CadastrarPessoaController = ReturnType<typeof useCadastrarPessoaController>;
