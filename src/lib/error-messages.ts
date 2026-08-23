/**
 * A API devolve apenas códigos (`{ field, error }`); o texto exibido é decidido aqui.
 */

/** Texto padrão de cada código, quando o campo não tem mensagem própria. */
const byCode: Record<string, string> = {
  required: 'Campo obrigatório.',
  invalid_format: 'Formato inválido.',
  too_short: 'Muito curto.',
  out_of_range: 'Valor fora do permitido.',
  already_registered: 'Já cadastrado.',
  photo_invalid: 'Imagem inválida.',
  photo_empty: 'Imagem vazia.',
  photo_too_large: 'A imagem deve ter no máximo 2 MB.',
};

/** Mensagens específicas, na chave `campo.codigo`. */
const byField: Record<string, string> = {
  'cpf.invalid_format': 'CPF inválido.',
  'cpf.already_registered': 'Este CPF já está cadastrado.',
  'document.invalid_format': 'CPF inválido.',
  'document.already_registered': 'Este CPF já está cadastrado.',
  'email.invalid_format': 'Informe um e-mail válido.',
  'email.already_registered': 'Este e-mail já está cadastrado.',
  'phone.invalid_format': 'Informe DDD e número, como (31) 99999-9999.',
  'cellPhone.invalid_format': 'Informe DDD e número, como (31) 99999-9999.',
  'cep.invalid_format': 'O CEP deve ter 8 dígitos.',
  'name.too_short': 'Informe o nome completo.',
  'fullName.too_short': 'Informe o nome completo.',
  'password.too_short': 'A senha deve ter ao menos 6 caracteres.',
  'confirm.invalid_format': 'A confirmação não corresponde à senha.',
  'age.out_of_range': 'Idade inválida.',
  'height.out_of_range': 'Altura inválida.',
};

/** Mensagem de um campo específico do formulário. */
export function fieldErrorMessage(field: string, code: string) {
  return byField[`${field}.${code}`] ?? byCode[code] ?? 'Campo inválido.';
}

/** Mensagem geral, usada quando a falha não aponta para um campo. */
export function generalErrorMessage(code?: string) {
  switch (code) {
    case 'validation_failed':
      return 'Verifique os campos destacados.';
    case 'conflict':
      return 'Estes dados já estão cadastrados.';
    case 'invalid_credentials':
      return 'E-mail/CPF ou senha inválidos.';
    case 'not_found':
      return 'Registro não encontrado.';
    default:
      return 'Não foi possível concluir. Tente novamente.';
  }
}
