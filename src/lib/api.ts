const BASE = import.meta.env.VITE_API_URL ?? "/api";

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem("admin_token");
  return token ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { headers: authHeaders(), ...options });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? res.statusText);
  }
  return res.json() as Promise<T>;
}

export const api = {
  login: (email: string, password: string) =>
    request<{ token: string }>("/admin/login", { method: "POST", body: JSON.stringify({ email, password }) }),

  me: () => request<{ admin: { id: number; email: string } }>("/admin/me"),

  getLeads: () => request<Lead[]>("/leads"),
  updateLeadStatus: (id: number, status: string) =>
    request(`/leads/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  deleteLead: (id: number) => request(`/leads/${id}`, { method: "DELETE" }),

  getChatSessions: () => request<ChatSession[]>("/chat-messages/sessions"),
  deleteChatSession: (sessionId: string) =>
    request(`/chat-messages/sessions/${sessionId}`, { method: "DELETE" }),

  getContent: (key: string) =>
    request<{ key: string; value: unknown }>(`/content/${key}`).catch(() => null),
  saveContent: (key: string, value: unknown) =>
    request<{ ok: boolean }>(`/content/${key}`, { method: "PUT", body: JSON.stringify({ value }) }),
};

export interface Lead {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  message: string | null;
  source: string | null;
  status: string | null;
  createdAt: string;
}

export interface ChatMessage {
  id: number;
  sessionId: string;
  from: string;
  text: string;
  createdAt: string;
}

export interface ChatSession {
  sessionId: string;
  messages: ChatMessage[];
  lastMessage: string;
  messageCount: number;
}
