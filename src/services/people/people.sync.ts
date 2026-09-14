import { queryClient } from '@/lib/query-client';
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
    let uploaded = 0;

    for (const item of pending) {
      try {
        await repository.create(item.payload);
        await deleteLocalPending(item.id);
        uploaded += 1;
      } catch {
        // Mantém na fila para a próxima tentativa.
      }
    }

    if (uploaded > 0) {
      await queryClient.invalidateQueries({ queryKey: ['people'] });
    }
  } catch {
    // Falha ao ler o store local — tenta de novo no próximo boot/login.
  }
}
