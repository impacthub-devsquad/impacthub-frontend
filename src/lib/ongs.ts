import { api } from "./api";

export interface ONG {
  id: string;
  name: string;
  title: string;
  category: string;
  city: string;
  description: string;
  followers: number;
  isFollowing: boolean;
}

export interface ONGDetail {
  ongId: string;
  userOwnerId: string;
  name: string;
  title: string;
  description: string;
  category: string;
  createdAt: string;
  participantsCount: number;
  followersCount: number;
  isParticipant: boolean;
  isFollowing: boolean;
  isInvited: boolean;
}

export interface ONGEvent {
  id: string;
  name: string;
  date: string;
  location: string;
}

export interface ONGParticipant {
  id: string;
  name: string;
  username: string;
  role: string;
}

export interface CreateOngPayload {
  name: string;
  title: string;
  description: string;
  category: string;
}

function mapOng(raw: any): ONG {
  return {
    id: raw.ongId,
    name: raw.name,
    title: raw.title,
    category: raw.category,
    city: raw.city ?? "",
    description: raw.description,
    followers: raw.followersCount ?? 0,
    isFollowing: raw.isFollowing ?? false,
  };
}

function mapOngEvent(raw: Record<string, unknown>): ONGEvent {
  const name =
    typeof raw.title === "string"
      ? raw.title
      : typeof raw.name === "string"
        ? raw.name
        : "Evento";
  const date =
    typeof raw.date === "string"
      ? raw.date
      : typeof raw.createdAt === "string"
        ? new Date(raw.createdAt).toLocaleDateString("pt-BR")
        : "";
  const location =
    typeof raw.location === "string"
      ? raw.location
      : typeof raw.city === "string"
        ? raw.city
        : typeof raw.place === "string"
          ? raw.place
          : "";

  return {
    id: typeof raw.id === "string" ? raw.id : crypto.randomUUID(),
    name,
    date,
    location,
  };
}

function mapOngParticipant(raw: Record<string, unknown>): ONGParticipant {
  const name =
    typeof raw.name === "string"
      ? raw.name
      : typeof raw.fullName === "string"
        ? raw.fullName
        : typeof raw.username === "string"
          ? raw.username
          : "Voluntário";
  const username = typeof raw.username === "string" ? raw.username : name;
  const role =
    typeof raw.role === "string"
      ? raw.role
      : typeof raw.participantRole === "string"
        ? raw.participantRole
        : "Participante";

  return {
    id:
      typeof raw.userId === "string"
        ? raw.userId
        : typeof raw.id === "string"
          ? raw.id
          : crypto.randomUUID(),
    name,
    username,
    role,
  };
}

function getListFromEnvelope(data: unknown): Record<string, unknown>[] {
  if (Array.isArray(data)) {
    return data.filter(
      (item): item is Record<string, unknown> =>
        Boolean(item) && typeof item === "object",
    );
  }

  if (data && typeof data === "object") {
    const envelope = data as { content?: unknown };
    if (Array.isArray(envelope.content)) {
      return envelope.content.filter(
        (item): item is Record<string, unknown> =>
          Boolean(item) && typeof item === "object",
      );
    }
  }

  return [];
}

export async function getOngs(): Promise<ONG[]> {
  const response = await api.get<any>("/api/v1/ongs?page=0&size=20");
  const list = response?.data?.content ?? response?.data ?? [];
  return list.map(mapOng);
}

function extractCategoryList(data: unknown): string[] {
  if (Array.isArray(data)) {
    return data
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }

        if (item && typeof item === "object") {
          const record = item as Record<string, unknown>;
          const value = record.category ?? record.name ?? record.title;
          return typeof value === "string" ? value : null;
        }

        return null;
      })
      .filter((item): item is string => Boolean(item));
  }

  if (data && typeof data === "object") {
    const record = data as { content?: unknown };
    if (Array.isArray(record.content)) {
      return extractCategoryList(record.content);
    }
  }

  return [];
}

export async function getOngCategories(): Promise<string[]> {
  const response = await api.get<{ data?: unknown }>("/api/v1/ong-categories");
  return extractCategoryList(response?.data);
}

export async function getOngById(ongId: string): Promise<ONGDetail> {
  const response = await api.get<any>(`/api/v1/ongs/${ongId}`);
  return response?.data;
}

export async function getOngEvents(ongId: string): Promise<ONGEvent[]> {
  const response = await api.get<{ data?: unknown }>(
    `/api/v1/ongs/${ongId}/events?page=0&size=10`,
  );

  const list = getListFromEnvelope(response?.data);

  return list.map(mapOngEvent);
}

export async function getOngParticipants(
  ongId: string,
): Promise<ONGParticipant[]> {
  const response = await api.get<{ data?: unknown }>(
    `/api/v1/ongs/${ongId}/participants`,
  );

  const list = getListFromEnvelope(response?.data);
  return list.map(mapOngParticipant);
}

export async function createOng(payload: CreateOngPayload): Promise<string> {
  const response = await api.post<any>("/api/v1/ongs", payload);
  return response?.data?.ongId;
}

export async function followOng(ongId: string): Promise<void> {
  await api.post(`/api/v1/ongs/${ongId}/followers/me`, {});
}

export async function unfollowOng(ongId: string): Promise<void> {
  await api.delete(`/api/v1/ongs/${ongId}/followers/me`);
}
