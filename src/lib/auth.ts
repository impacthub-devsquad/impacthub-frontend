import { api } from "./api";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface User {
  id: string;
  userId: string;
  username: string;
  name: string;
  email: string;
}

export async function login(data: LoginRequest): Promise<void> {
  const response = await api.post<any>("/api/v1/auth/login", data);
  const accessToken = response?.data?.accessToken;
  const refreshToken = response?.data?.refreshToken;
  if (!accessToken) throw new Error("Token não recebido");
  localStorage.setItem("token", accessToken);
  if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
}

export async function register(data: RegisterRequest): Promise<void> {
  await api.post<any>("/api/v1/auth/register", data);
  await login({ email: data.email, password: data.password });
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
}

export function getToken() {
  return localStorage.getItem("token");
}

export async function getMe(): Promise<User> {
  const response = await api.get<any>("/api/v1/users/me");
  return {
    ...response.data,
    id: response.data.userId,
  };
}
