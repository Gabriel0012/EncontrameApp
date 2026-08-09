/** Callback registrado no boot para redirecionar quando a sessão expira de vez. */
type SessionExpiredHandler = () => void;

let onSessionExpired: SessionExpiredHandler | null = null;

export function setSessionExpiredHandler(handler: SessionExpiredHandler | null) {
  onSessionExpired = handler;
}

export function notifySessionExpired() {
  onSessionExpired?.();
}
