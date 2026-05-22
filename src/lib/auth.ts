import { api } from "./api";

interface LoginResponse {
  status: string;
  data: {
    accessToken: string;
    refreshToken?: string;
  };
}

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
  role: "ong" | "volunteer";
  avatar?: string;
  profilePicture?: string;
  description?: string;
}

/**
 * IDs de usuários ONG (TEMPORÁRIO)
 * Adicione aqui os userId das contas ONG.
 */
const ONG_USERS = [
  "aaf881e0-80c7-4de1-8213-3d38a77a8225",
  "b5c5a545-dd0c-473c-b11a-dea796ac19f3",
  "456f7f0e-cf69-47df-8987-3e5c3dd36173",
  "7f8b997c-5651-48de-8276-a02569bae346",
  
];

/**
 * Faz login e salva tokens
 */
export async function login(
  data: LoginRequest
): Promise<void> {
  const response = await api.post<LoginResponse>(
    "/api/v1/auth/login",
    data
  );

  const accessToken = response.data.accessToken;
  const refreshToken = response.data.refreshToken;

  if (!accessToken) {
    throw new Error("Token não recebido");
  }

  localStorage.setItem("token", accessToken);

  if (refreshToken) {
    localStorage.setItem(
      "refreshToken",
      refreshToken
    );
  }
}

/**
 * Registra usuário e faz login automático
 */
export async function register(
  data: RegisterRequest
): Promise<void> {
  await api.post(
    "/api/v1/auth/register",
    data
  );

  await login({
    email: data.email,
    password: data.password,
  });
}

/**
 * Logout
 */
export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
}

/**
 * Recupera token
 */
export function getToken() {
  return localStorage.getItem("token");
}

/**
 * Busca dados do usuário autenticado
 */
export async function getMe(): Promise<User> {
  const response = await api.get<any>(
    "/api/v1/users/me"
  );

  console.log(
    "GET ME RESPONSE:",
    response
  );

  const userData =
    response.data?.data ||
    response.data;

  /**
   * Como backend não envia role,
   * definimos ONG pelo userId.
   */
  const role: "ong" | "volunteer" =
    ONG_USERS.includes(userData.userId)
      ? "ong"
      : "volunteer";

  console.log(
    "ROLE FINAL:",
    role
  );

  return {
    id:
      userData.userId ||
      userData.id ||
      "",

    userId:
      userData.userId || "",

    username:
      userData.username || "",

    name:
      userData.name || "",

    email:
      userData.email || "",

    role,

    avatar:
      userData.avatar,

    profilePicture:
      userData.profilePicture,

    description:
      userData.description,
  };
}