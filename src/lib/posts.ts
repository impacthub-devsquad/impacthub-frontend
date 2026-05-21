import { api } from "./api";

export interface Post {
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

type PostApiResponse = {
  status?: string;
  data?: unknown;
  message?: string;
};

const mapPost = (raw: Record<string, unknown>): Post => {
  const createdBy =
    raw.createdBy && typeof raw.createdBy === "object"
      ? (raw.createdBy as Record<string, unknown>)
      : {};

  const createdAtValue = typeof raw.createdAt === "string" ? raw.createdAt : "";

  return {
    id: typeof raw.id === "string" ? raw.id : "",
    ongId: typeof raw.ongId === "string" ? raw.ongId : "",
    ongName:
      typeof createdBy.name === "string" && createdBy.name
        ? createdBy.name
        : typeof createdBy.username === "string"
          ? createdBy.username
          : "ONG",
    category: typeof raw.category === "string" ? raw.category : "",
    title: typeof raw.title === "string" ? raw.title : "",
    description: typeof raw.description === "string" ? raw.description : "",
    content: typeof raw.description === "string" ? raw.description : "",
    likes: typeof raw.likesCount === "number" ? raw.likesCount : 0,
    isLiked: typeof raw.isLiked === "boolean" ? raw.isLiked : false,
    comments: typeof raw.commentsCount === "number" ? raw.commentsCount : 0,
    createdAt: createdAtValue
      ? new Date(createdAtValue).toLocaleDateString("pt-BR")
      : "",
  };
};

export async function getPostById(postId: string): Promise<Post> {
  const response = await api.get<PostApiResponse>(`/api/v1/events/${postId}`);
  const postData = response?.data as Record<string, unknown>;
  return mapPost(postData);
}

export async function likePost(postId: string): Promise<void> {
  await api.post(`/api/v1/events/${postId}/likes/me`, {});
}

export async function unlikePost(postId: string): Promise<void> {
  await api.delete(`/api/v1/events/${postId}/likes/me`);
}
