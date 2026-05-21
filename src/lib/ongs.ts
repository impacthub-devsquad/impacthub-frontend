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

export async function getOngs(): Promise<ONG[]> {
  const response = await api.get<any>("/api/v1/ongs?page=0&size=20");
  const list = response?.data?.content ?? response?.data ?? [];
  return list.map(mapOng);
}

export async function getOngById(ongId: string): Promise<ONGDetail> {
  const response = await api.get<any>(`/api/v1/ongs/${ongId}`);
  return response?.data;
}

export async function getOngEvents(ongId: string): Promise<ONGEvent[]> {
  const response = await api.get<{ data?: unknown }>(
    `/api/v1/ongs/${ongId}/events?page=0&size=10`,
  );

  const data = response?.data;
  const list = Array.isArray(data)
    ? data
    : data &&
        typeof data === "object" &&
        Array.isArray((data as { content?: unknown }).content)
      ? (data as { content: Record<string, unknown>[] }).content
      : [];

  return list.map(mapOngEvent);
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
