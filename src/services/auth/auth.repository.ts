import { env } from '@/lib/env';
import { authAxiosRepository } from '@/services/auth/auth.axios.repository';
import { authMockRepository } from '@/services/auth/auth.mock.repository';
import type { AuthResult, LoginPayload, SignupPayload } from '@/services/auth/auth.types';

/** Contrato comum aos repositórios de autenticação (axios e mock). */
export interface AuthRepository {
  login(payload: LoginPayload): Promise<AuthResult>;
  signup(payload: SignupPayload): Promise<AuthResult>;
}

/**
 * Escolhe o repositório conforme a env: mock quando EXPO_PUBLIC_USE_MOCKS,
 * caso contrário o repositório real via axios.
 */
export function getAuthRepository(): AuthRepository {
  return env.useMocks ? authMockRepository : authAxiosRepository;
}
