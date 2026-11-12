import type { Subscription, CurrentUser, CategoryBudgets } from "../App";

const API_BASE_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:3001/api").replace(/\/$/, "");
const TOKEN_KEY = "subtracker_token";
const USER_KEY = "subtracker_user";

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "ApiError";
  }
}

export interface AuthResponse {
  accessToken: string;
  user: CurrentUser;
}

interface RefreshResponse {
  accessToken: string;
}

let refreshInProgress: Promise<string | null> | null = null;

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): CurrentUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as CurrentUser) : null;
  } catch {
    return null;
  }
}

export function saveSession(token: string, user: CurrentUser) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

async function renewAccessToken(): Promise<string | null> {
  if (refreshInProgress) {
    return refreshInProgress;
  }

  refreshInProgress = (async () => {
    let response: Response;
    try {
      response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      throw new ApiError("Não foi possível renovar a sessão. Verifique se a API está em execução.", 0);
    }

    if (!response.ok) {
      clearSession();
      return null;
    }

    const payload = (await response.json()) as RefreshResponse;
    const user = getStoredUser();
    if (!payload.accessToken || !user) {
      clearSession();
      return null;
    }

    saveSession(payload.accessToken, user);
    return payload.accessToken;
  })();

  try {
    return await refreshInProgress;
  } finally {
    refreshInProgress = null;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers ?? {});
  if (!headers.has("Content-Type") && !(init?.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const token = getStoredToken();
  if (token && !(path.startsWith("/auth/login") || path.startsWith("/auth/register"))) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const canRefresh = ![
    "/auth/login",
    "/auth/register",
    "/auth/refresh",
    "/auth/logout",
  ].some((authPath) => path.startsWith(authPath));

  const send = async () => {
    try {
      return await fetch(`${API_BASE_URL}${path}`, {
        ...init,
        headers,
        credentials: "include",
      });
    } catch {
      throw new ApiError("Não foi possível conectar ao servidor. Verifique se a API está em execução.", 0);
    }
  };

  let response = await send();
  if (response.status === 401 && canRefresh && getStoredToken()) {
    const renewedToken = await renewAccessToken();
    if (renewedToken) {
      headers.set("Authorization", `Bearer ${renewedToken}`);
      response = await send();
    }
  }

  if (response.status === 401 && canRefresh) {
    clearSession();
  }

  let payload: any = null;
  const text = await response.text();
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = text;
    }
  }

  if (!response.ok) {
    const message = payload?.error ?? payload?.message ?? `Falha na requisição (HTTP ${response.status}).`;
    throw new ApiError(message, response.status);
  }

  if (response.status === 204 || payload === null || payload === undefined) {
    return undefined as T;
  }

  return payload as T;
}

export async function logoutUser() {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    if (!response.ok) {
      throw new ApiError(`Não foi possível encerrar a sessão (HTTP ${response.status}).`, response.status);
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError("Não foi possível conectar ao servidor para encerrar a sessão.", 0);
  } finally {
    clearSession();
  }
}

export interface StoredUser extends CurrentUser {
  password?: string;
}

export function findUsersByEmail(email: string) {
  return request<StoredUser[]>(`/users?email=${encodeURIComponent(email)}`);
}

export function createUser(data: { nome: string; email: string; password: string }) {
  return request<StoredUser>(`/users`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getCurrentUser() {
  return request<CurrentUser>(`/auth/me`);
}

export function updateProfile(patch: Partial<CurrentUser>) {
  return request<CurrentUser>(`/auth/me`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

export function getBudgets() {
  return request<CategoryBudgets>(`/budgets`);
}

export function updateBudgets(patch: Record<string, number>) {
  return request<CategoryBudgets>(`/budgets`, {
    method: "PUT",
    body: JSON.stringify(patch),
  });
}

export function updateUser(_id: string, patch: Partial<StoredUser>) {
  return request<CurrentUser>(`/auth/me`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

export function resetPasswordDemo(data: { email: string; password: string }) {
  return request<{ ok: boolean; message: string }>(`/auth/reset-password`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function loginUser(data: { email: string; password: string }) {
  return request<AuthResponse>(`/auth/login`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function registerUser(data: { nome: string; email: string; password: string }) {
  return request<AuthResponse>(`/auth/register`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// --- Assinaturas ---

export function getSubsByUser() {
  return request<Subscription[]>(`/subscriptions`);
}

export function createSub(data: Omit<Subscription, "id" | "userId">) {
  const { userId: _userId, ...payload } = data as Subscription;
  return request<Subscription>(`/subscriptions`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateSub(id: string | number, patch: Partial<Omit<Subscription, "id" | "userId">>) {
  const { userId: _userId, ...payload } = patch as Partial<Subscription>;
  return request<Subscription>(`/subscriptions/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteSub(id: string | number) {
  return request<void>(`/subscriptions/${id}`, { method: "DELETE" });
}
