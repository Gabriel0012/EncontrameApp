import { api } from '@/lib/axios';
import type { AuthRepository } from '@/services/auth/auth.repository';
import type { AuthResult, LoginPayload, SignupPayload } from '@/services/auth/auth.types';

/** Implementação real: fala com a API existente via axios. */
export const authAxiosRepository: AuthRepository = {
  async login(payload: LoginPayload) {
    const { data } = await api.post<AuthResult>('/auth/login', payload);
    return data;
  },

  async signup(payload: SignupPayload) {
    const { data } = await api.post<AuthResult>('/auth/signup', payload);
    return data;
  },
};
