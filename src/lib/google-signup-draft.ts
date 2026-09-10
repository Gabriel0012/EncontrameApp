/** Rascunho do cadastro via Google — o ID token não pode ir na URL. */
export interface GoogleSignupDraft {
  idToken: string;
  email: string;
  name: string;
}

let draft: GoogleSignupDraft | null = null;

export function setGoogleSignupDraft(next: GoogleSignupDraft) {
  draft = next;
}

export function getGoogleSignupDraft(): GoogleSignupDraft | null {
  return draft;
}

export function clearGoogleSignupDraft() {
  draft = null;
}
