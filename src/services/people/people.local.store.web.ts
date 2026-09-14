import { randomUUID } from 'expo-crypto';

import { LOCAL_PERSON_ID_PREFIX } from '@/lib/person-status';
import {
  type LocalPendingPerson,
  type PendingRow,
  mergeLocalPeople,
  parsePayload,
  toPerson,
} from '@/services/people/people.local.shared';
import type { CreatePersonPayload, Person } from '@/services/people/people.types';

export type { LocalPendingPerson } from '@/services/people/people.local.shared';
export { mergeLocalPeople };

const DB_NAME = 'encontrame-people';
const STORE_NAME = 'pending_people';

let dbPromise: Promise<IDBDatabase> | null = null;

function getIndexedDb(): IDBFactory {
  if (typeof indexedDB === 'undefined') {
    throw new Error('IndexedDB indisponível neste navegador.');
  }
  return indexedDB;
}

function openDb(): Promise<IDBDatabase> {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = getIndexedDb().open(DB_NAME, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => {
        dbPromise = null;
        reject(request.error ?? new Error('Falha ao abrir IndexedDB.'));
      };
    });
  }

  return dbPromise;
}

function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Falha no IndexedDB.'));
  });
}

async function withStore<T>(
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => Promise<T>,
): Promise<T> {
  const db = await openDb();
  const tx = db.transaction(STORE_NAME, mode);
  return run(tx.objectStore(STORE_NAME));
}

/** Grava um cadastro guest no IndexedDB (web) e devolve a pessoa para a UI. */
export async function saveLocalPending(payload: CreatePersonPayload): Promise<Person> {
  const id = `${LOCAL_PERSON_ID_PREFIX}${randomUUID()}`;
  const createdAt = Date.now();
  const row: PendingRow = {
    id,
    payload_json: JSON.stringify(payload),
    created_at: createdAt,
  };
  await withStore('readwrite', (store) => requestToPromise(store.put(row)));
  return toPerson(id, payload);
}

export async function listLocalPending(): Promise<LocalPendingPerson[]> {
  const rows = await withStore('readonly', (store) =>
    requestToPromise(store.getAll() as IDBRequest<PendingRow[]>),
  );
  return [...rows]
    .sort((a, b) => b.created_at - a.created_at)
    .flatMap((row) => {
      const parsed = parsePayload(row.payload_json);
      if (!parsed) return [];
      return [
        {
          id: row.id,
          payload: parsed,
          createdAt: row.created_at,
          person: toPerson(row.id, parsed),
        },
      ];
    });
}

export async function getLocalPending(id: string): Promise<Person | null> {
  const row = await withStore('readonly', (store) =>
    requestToPromise(store.get(id) as IDBRequest<PendingRow | undefined>),
  );
  if (!row) return null;
  const parsed = parsePayload(row.payload_json);
  if (!parsed) return null;
  return toPerson(row.id, parsed);
}

export async function deleteLocalPending(id: string): Promise<void> {
  await withStore('readwrite', (store) => requestToPromise(store.delete(id)));
}
