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
  token: string;
  user: AuthUser;
}
