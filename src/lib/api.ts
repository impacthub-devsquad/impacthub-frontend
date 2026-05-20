const BASE_URL = import.meta.env.VITE_API_URL;

const PUBLIC_ROUTES = ["/api/v1/auth/login", "/api/v1/auth/register"];

async function request<T>(path: string, options?: RequestInit): Promise<T> {
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
    const error = await response.json().catch(() => ({}));
    console.warn(`[API] ${response.status} em ${path}`, error);
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
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
