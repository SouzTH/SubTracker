// Camada única de acesso à API (json-server).
//
// Antes, cada tela tinha o seu próprio `fetch("http://localhost:3000/...")`
// espalhado pelo código, cada uma tratando erro à sua maneira. Centralizar
// aqui segue o princípio DRY e dá um único lugar para trocar a URL base,
// ajustar headers ou mudar de backend no futuro.

import type { Subscription, CurrentUser } from "../App";

const BASE_URL = "http://localhost:3000";

export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...init,
    });
  } catch {
    throw new ApiError(
      "Não foi possível conectar ao servidor. Verifique se o json-server está rodando (npm run server).",
    );
  }

  if (!response.ok) {
    throw new ApiError(`Falha na requisição (HTTP ${response.status}).`);
  }

  // DELETE e algumas respostas não têm corpo
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

// --- Usuários / autenticação ---

export interface StoredUser extends CurrentUser {
  password: string;
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

export function updateUser(id: string, patch: Partial<StoredUser>) {
  return request<StoredUser>(`/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

// --- Assinaturas ---

export function getSubsByUser(userId: string) {
  return request<Subscription[]>(`/subs?userId=${userId}`);
}

export function createSub(data: Omit<Subscription, "id">) {
  return request<Subscription>(`/subs`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateSub(id: string | number, patch: Partial<Subscription>) {
  return request<Subscription>(`/subs/${id}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

export function deleteSub(id: string | number) {
  return request<void>(`/subs/${id}`, { method: "DELETE" });
}
