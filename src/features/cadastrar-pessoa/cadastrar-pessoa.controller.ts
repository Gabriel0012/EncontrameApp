import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Platform } from 'react-native';

import { useCreatePersonMutation } from '@/services/people/people.service';
import type { CreatePersonPayload } from '@/services/people/people.types';

export const ETHNICITY_OPTIONS = ['Branca', 'Preta', 'Parda', 'Amarela', 'Indígena'] as const;
export const BUILD_OPTIONS = ['Magro', 'Médio', 'Atlético', 'Forte'] as const;

const SUBMIT_END_THRESHOLD = 120;
const MAX_PHOTO_BYTES = 2 * 1024 * 1024;
const ALLOWED_WEB_MIME = new Set(['image/png', 'image/jpeg', 'image/jpg']);

/** Centraliza estado, validação e cadastro de uma nova pessoa desaparecida. */
export function useCadastrarPessoaController() {
  const router = useRouter();
  const createMutation = useCreatePersonMutation();

  const [photoUri, setPhotoUri] = useState('');
  const [photoBase64, setPhotoBase64] = useState('');
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

  const applyPhoto = (uri: string, base64OrDataUrl: string) => {
    const normalized = stripDataUrlPrefix(base64OrDataUrl);
    const size = estimateBase64Bytes(normalized);
    if (size > MAX_PHOTO_BYTES) {
      Alert.alert('Foto muito grande', 'A foto deve ter no máximo 2 MB.');
      return;
    }
    if (size <= 0) {
      Alert.alert('Foto inválida', 'Não foi possível ler a imagem selecionada.');
      return;
    }
    setPhotoUri(uri);
    setPhotoBase64(normalized);
  };

  const pickFromLibrary = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permissão necessária', 'Autorize o acesso à galeria para escolher uma foto.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.7,
      base64: true,
    });

    if (result.canceled || !result.assets[0]) return;
    const asset = result.assets[0];
    if (!asset.base64) {
      Alert.alert('Foto inválida', 'Não foi possível ler a imagem selecionada.');
      return;
    }
    applyPhoto(asset.uri, asset.base64);
  };

  const pickFromCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permissão necessária', 'Autorize o acesso à câmera para tirar uma foto.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.7,
      base64: true,
    });

    if (result.canceled || !result.assets[0]) return;
    const asset = result.assets[0];
    if (!asset.base64) {
      Alert.alert('Foto inválida', 'Não foi possível ler a imagem capturada.');
      return;
    }
    applyPhoto(asset.uri, asset.base64);
  };

  const pickFromWebFile = () => {
    if (typeof document === 'undefined') return;

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png,image/jpeg,.png,.jpg,.jpeg';
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;

      if (!ALLOWED_WEB_MIME.has(file.type) && !/\.(png|jpe?g)$/i.test(file.name)) {
        Alert.alert('Formato inválido', 'Envie apenas fotos PNG ou JPG.');
        return;
      }

      if (file.size > MAX_PHOTO_BYTES) {
        Alert.alert('Foto muito grande', 'A foto deve ter no máximo 2 MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const result = typeof reader.result === 'string' ? reader.result : '';
        if (!result) {
          Alert.alert('Foto inválida', 'Não foi possível ler o arquivo selecionado.');
          return;
        }
        applyPhoto(result, result);
      };
      reader.onerror = () => {
        Alert.alert('Foto inválida', 'Não foi possível ler o arquivo selecionado.');
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const handlePickPhoto = () => {
    if (Platform.OS === 'web') {
      pickFromWebFile();
      return;
    }

    Alert.alert('Adicionar foto', 'Escolha a origem da imagem', [
      { text: 'Câmera', onPress: () => void pickFromCamera() },
      { text: 'Galeria', onPress: () => void pickFromLibrary() },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  const handleRemovePhoto = () => {
    setPhotoUri('');
    setPhotoBase64('');
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
      photo: photoBase64 || undefined,
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
    handleRemovePhoto,
    handleLocationSearch,
    handleRegister,
  };
}

export type CadastrarPessoaController = ReturnType<typeof useCadastrarPessoaController>;

function stripDataUrlPrefix(value: string): string {
  const trimmed = value.trim();
  const comma = trimmed.indexOf(',');
  if (trimmed.startsWith('data:') && comma >= 0) {
    return trimmed.slice(comma + 1);
  }
  return trimmed;
}

function estimateBase64Bytes(base64: string): number {
  if (!base64) return 0;
  const padding = base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0;
  return Math.floor((base64.length * 3) / 4) - padding;
}
