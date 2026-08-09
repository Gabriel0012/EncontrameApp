/** Coordenada geográfica simples usada nos pins do mapa. */
export interface GeoPoint {
  latitude: number;
  longitude: number;
}

/** Pessoa desaparecida cadastrada / exibida no app. */
export interface Person {
  id: string;
  fullName: string;
  nickname?: string;
  age?: number;
  photoUri?: string;
  heightCm?: string;
  ethnicity?: string;
  build?: string;
  clothes?: string;
  hair?: string;
  eyes?: string;
  tattoo?: string;
  accessories?: string;
  location?: string;
  lastSeen?: string;
  phone?: string;
  coords?: GeoPoint;
  /** Quando true, o pin aparece com cadeado (dados restritos). */
  restricted?: boolean;
}

/** Dados enviados ao cadastrar uma nova pessoa. */
export interface CreatePersonPayload {
  fullName: string;
  nickname: string;
  age: string;
  heightCm: string;
  ethnicity: string;
  build: string;
  clothes: string;
  hair: string;
  eyes: string;
  tattoo: string;
  accessories: string;
  location: string;
  lastSeen: string;
  phone: string;
  photoUri?: string;
}
