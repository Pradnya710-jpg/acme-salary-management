const API = "http://localhost:4000/api";
export async function api<T>(path: string, options: RequestInit = {}) {
  const r = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const body = await r.json();
  if (!r.ok) throw new Error(body.error || "Request failed");
  return body as T;
}
