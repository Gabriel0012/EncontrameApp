/** Callback registrado no root para exibir o modal de erro da API. */
type ApiErrorHandler = (message: string) => void;

let onApiError: ApiErrorHandler | null = null;

export function setApiErrorHandler(handler: ApiErrorHandler | null) {
  onApiError = handler;
}

export function notifyApiError(message: string) {
  onApiError?.(message);
}
