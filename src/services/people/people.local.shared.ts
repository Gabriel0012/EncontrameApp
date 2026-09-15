import {
  LOCAL_PERSON_STATUS_ID,
  LOCAL_PERSON_STATUS_LABEL,
} from '@/lib/person-status';
import type { CreatePersonPayload, Person } from '@/services/people/people.types';

export interface PendingRow {
  id: string;
  payload_json: string;
  created_at: number;
}

export interface LocalPendingPerson {
  id: string;
  payload: CreatePersonPayload;
  createdAt: number;
  person: Person;
}

export function mergeLocalPeople(local: Person[], remote: Person[]): Person[] {
  const remoteIds = new Set(remote.map((person) => person.id));
  const uniqueLocal = local.filter((person) => !remoteIds.has(person.id));
  return [...uniqueLocal, ...remote];
}

export function parsePayload(raw: string): CreatePersonPayload | null {
  try {
    return JSON.parse(raw) as CreatePersonPayload;
  } catch {
    return null;
  }
}

export function toPerson(id: string, payload: CreatePersonPayload): Person {
  const age = Number.parseInt(payload.age.replace(/\D/g, ''), 10);

  return {
    id,
    fullName: payload.fullName,
    nickname: payload.nickname || undefined,
    age: Number.isFinite(age) ? age : undefined,
    heightCm: payload.heightCm || undefined,
    ethnicity: payload.ethnicity || undefined,
    build: payload.build || undefined,
    clothes: payload.clothes || undefined,
    hair: payload.hair || undefined,
    eyes: payload.eyes || undefined,
    tattoo: payload.tattoo || undefined,
    accessories: payload.accessories || undefined,
    location: payload.location || undefined,
    lastSeen: payload.lastSeen || undefined,
    originCity: payload.originCity || undefined,
    originState: payload.originState || undefined,
    originCountry: payload.originCountry || undefined,
    originNeighborhood: payload.originNeighborhood || undefined,
    phone: payload.phone || undefined,
    photoUri: payload.photoUri || toPhotoUri(payload.photo),
    statusId: LOCAL_PERSON_STATUS_ID,
    statusDescription: LOCAL_PERSON_STATUS_LABEL,
  };
}

function toPhotoUri(photo?: string): string | undefined {
  if (!photo) return undefined;
  const value = photo.trim();
  if (!value) return undefined;
  if (value.startsWith('data:')) return value;
  return `data:image/jpeg;base64,${value}`;
}
