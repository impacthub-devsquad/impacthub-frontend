const BASE_URL = import.meta.env.VITE_API_URL;

const PUBLIC_ROUTES = [
  "/api/v1/auth/login",
  "/api/v1/auth/register",
  "/api/v1/auth/refresh",
];

async function refreshToken(): Promise<string> {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BASE_URL}/api/v1/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ accessToken: token }),
  });

  if (!response.ok) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    throw new Error("Sessão expirada. Faça login novamente.");
  }

  const data = await response.json();
  const newToken = data?.data?.accessToken;
  if (!newToken) throw new Error("Token não recebido no refresh");
  localStorage.setItem("token", newToken);
  return newToken;
}

async function request<T>(
  path: string,
  options?: RequestInit,
  retry = true,
): Promise<T> {
  const token = localStorage.getItem("token");
  const isPublic = PUBLIC_ROUTES.some((route) => path.startsWith(route));

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(!isPublic && token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    let error: any = {};
    try {
      error = JSON.parse(text);
    } catch {
      /* ignora */
    }

    console.warn(`[API] ${response.status} em ${path}`, error);

    // Token expirado — tenta refresh e repete uma vez
    if (
      retry &&
      !isPublic &&
      (response.status === 401 || error?.message === "Access Token expired")
    ) {
      await refreshToken();
      return request<T>(path, options, false);
    }

    throw new Error(error.message || `Erro ${response.status}`);
  }

  const text = await response.text();
  if (!text) return {} as T;

  try {
    return JSON.parse(text) as T;
  } catch {
    console.warn(`[API] Resposta não-JSON em ${path}:`, text);
    return {} as T;
  }
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
