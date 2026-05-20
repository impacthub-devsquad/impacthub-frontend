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
  username: string;
  email: string;
}

export async function login(data: LoginRequest): Promise<void> {
  const response = await api.post<any>("/api/v1/auth/login", data);
  const token = response?.data?.accessToken;
  if (!token) throw new Error("Token não recebido");
  localStorage.setItem("token", token);
}

export async function register(data: RegisterRequest): Promise<void> {
  const response = await api.post<any>("/api/v1/auth/register", data);
  const token = response?.data?.accessToken;
  if (!token) throw new Error("Token não recebido");
  localStorage.setItem("token", token);
}

export function logout() {
  localStorage.removeItem("token");
}

export function getToken() {
  return localStorage.getItem("token");
}

export async function getMe(): Promise<User> {
  const response = await api.get<any>("/api/v1/users/me");
  return response.data;
}
