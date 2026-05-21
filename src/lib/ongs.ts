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

export async function getOngs(): Promise<ONG[]> {
  const response = await api.get<any>("/api/v1/ongs?page=0&size=20");
  const list = response?.data?.content ?? response?.data ?? [];
  return list.map(mapOng);
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
