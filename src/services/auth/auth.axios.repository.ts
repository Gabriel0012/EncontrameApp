import { api } from '@/lib/axios';
import type { AuthRepository } from '@/services/auth/auth.repository';
import type { AuthResult, LoginPayload, SignupPayload } from '@/services/auth/auth.types';

interface ApiAuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

/** Implementação real: fala com a EncontrameApi via axios. */
export const authAxiosRepository: AuthRepository = {
  async login(payload: LoginPayload) {
    const { data } = await api.post<ApiAuthResponse>('/api/Auth/login', {
      identifier: payload.identifier,
      password: payload.password,
    });
    return mapAuthResult(data);
  },

  async signup(payload: SignupPayload) {
    const { data } = await api.post<ApiAuthResponse>('/api/Auth/register', {
      name: payload.name,
      document: payload.cpf,
      email: payload.email,
      cellPhone: payload.phone,
      cep: payload.cep,
      password: payload.password,
    });
    return mapAuthResult(data);
  },
};

function mapAuthResult(data: ApiAuthResponse): AuthResult {
  return {
    token: data.token,
    user: {
      id: String(data.user.id),
      name: data.user.name,
      email: data.user.email,
    },
  };
}
