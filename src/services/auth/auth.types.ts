export interface LoginPayload {
  /** E-mail ou CPF informado no login. */
  identifier: string;
  password: string;
}

export interface SignupPayload {
  name: string;
  cpf: string;
  email: string;
  phone: string;
  cep: string;
  clause: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthResult {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface GoogleProfile {
  email: string;
  name: string;
}

export type GoogleStartResult =
  | { status: 'authenticated'; session: AuthResult }
  | { status: 'needsRegistration'; profile: GoogleProfile };

export interface GoogleRegisterPayload {
  idToken: string;
  name: string;
  cpf: string;
  phone: string;
  cep: string;
}
