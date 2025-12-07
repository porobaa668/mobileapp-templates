import { ApiResponse } from "../shared/types"

const API_URL = process.env.EXPO_PUBLIC_API_URL || '';

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { 
    headers: { 'Content-Type': 'application/json' }, 
    ...init 
  });
  const json = (await res.json()) as ApiResponse<T>;
  if (!res.ok || !json.success || json.data === undefined) {
    throw new Error(json.error || 'Request failed');
  }
  return json.data;
}

// Helper for POST requests with body
export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  return api<T>(path, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

// Helper for DELETE requests
export async function apiDelete<T>(path: string): Promise<T> {
  return api<T>(path, { method: 'DELETE' });
}
