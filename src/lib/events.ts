import { api } from "./api";

export interface Event {
  id: string;
  ongId: string;
  ongName: string;
  category: string;
  title: string;
  description: string;
  content: string;
  likes: number;
  isLiked: boolean;
  comments: number;
  createdAt: string;
}

export interface EventPayload {
  ongId: string;
  title: string;
  description: string;
}

export type EventUpdatePayload = Partial<EventPayload>;

function mapEvent(raw: any): Event {
  return {
    id: raw.id,
    ongId: raw.ongId,
    ongName: raw.createdBy?.username ?? "ONG",
    category: raw.category ?? "",
    title: raw.title,
    description: raw.description,
    content: raw.description,
    likes: raw.likesCount ?? 0,
    isLiked: raw.isLiked ?? false,
    comments: 0,
    createdAt: new Date(raw.createdAt).toLocaleDateString("pt-BR"),
  };
}

export async function getEvents(): Promise<Event[]> {
  const response = await api.get<any>("/api/v1/events?page=0&size=20");
  const list = response?.data?.content ?? [];
  return list.map(mapEvent);
}

export async function createEvent(payload: EventPayload): Promise<void> {
  await api.post("/api/v1/events", payload);
}

export async function updateEvent(
  eventId: string,
  payload: EventUpdatePayload,
): Promise<void> {
  await api.patch(`/api/v1/events/${eventId}`, payload);
}

export async function deleteEvent(eventId: string): Promise<void> {
  await api.delete(`/api/v1/events/${eventId}`);
}

export async function likeEvent(eventId: string): Promise<void> {
  await api.post(`/api/v1/events/${eventId}/likes/me`, {});
}

export async function unlikeEvent(eventId: string): Promise<void> {
  await api.delete(`/api/v1/events/${eventId}/likes/me`);
}
