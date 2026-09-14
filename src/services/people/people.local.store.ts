import { randomUUID } from 'expo-crypto';
import * as SQLite from 'expo-sqlite';

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

const DB_NAME = 'encontrame-people.db';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = (async () => {
      const db = await SQLite.openDatabaseAsync(DB_NAME);
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS pending_people (
          id TEXT PRIMARY KEY NOT NULL,
          payload_json TEXT NOT NULL,
          created_at INTEGER NOT NULL
        );
      `);
      return db;
    })();
  }

  return dbPromise;
}

/** Grava um cadastro guest no SQLite e devolve a pessoa para a UI. */
export async function saveLocalPending(payload: CreatePersonPayload): Promise<Person> {
  const id = `${LOCAL_PERSON_ID_PREFIX}${randomUUID()}`;
  const createdAt = Date.now();
  const db = await getDb();
  await db.runAsync(
    'INSERT INTO pending_people (id, payload_json, created_at) VALUES (?, ?, ?)',
    id,
    JSON.stringify(payload),
    createdAt,
  );
  return toPerson(id, payload);
}

export async function listLocalPending(): Promise<LocalPendingPerson[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<PendingRow>(
    'SELECT id, payload_json, created_at FROM pending_people ORDER BY created_at DESC',
  );
  return rows.flatMap(rowToPending);
}

export async function getLocalPending(id: string): Promise<Person | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<PendingRow>(
    'SELECT id, payload_json, created_at FROM pending_people WHERE id = ?',
    id,
  );
  if (!row) return null;
  const parsed = parsePayload(row.payload_json);
  if (!parsed) return null;
  return toPerson(row.id, parsed);
}

export async function deleteLocalPending(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM pending_people WHERE id = ?', id);
}

function rowToPending(row: PendingRow): LocalPendingPerson[] {
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
}
