import { getSessionUser } from '@/lib/session';
import {
  deleteLocalPending,
  listLocalPending,
} from '@/services/people/people.local.store';
import { getPeopleRepository } from '@/services/people/people.repository';

let syncInFlight: Promise<void> | null = null;

/**
 * Envia cadastros locais para a API quando há sessão.
 * Falhas individuais mantêm o item na fila; o login não é bloqueado.
 */
export async function syncLocalPeople(): Promise<void> {
  if (getSessionUser() == null) return;
  if (syncInFlight) return syncInFlight;

  syncInFlight = runSync().finally(() => {
    syncInFlight = null;
  });
  return syncInFlight;
}

async function runSync(): Promise<void> {
  try {
    const pending = await listLocalPending();
    if (pending.length === 0) return;

    const repository = getPeopleRepository();

    for (const item of pending) {
      try {
        await repository.create(item.payload);
        await deleteLocalPending(item.id);
      } catch {
        // Mantém na fila para a próxima tentativa.
      }
    }
  } catch {
    // Falha ao ler o store local — tenta de novo no próximo boot/login.
  }
}
