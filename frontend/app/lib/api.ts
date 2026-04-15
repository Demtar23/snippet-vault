const API_URL = "https://snippet-vault-l84r.onrender.com";
 
export type SnippetType = "link" | "note" | "command";
 
export type Snippet = {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  type: SnippetType;
  createdAt: string;
  updatedAt: string;
};
 
export type SnippetsResponse = {
  data: Snippet[];
  total: number;
  page: number;
  pages: number;
};
 
export type CreateSnippetPayload = {
  title: string;
  content: string;
  tags: string[];
  type: SnippetType;
};
 
export type UpdateSnippetPayload = Partial<CreateSnippetPayload>;
 
// --- helpers ---
 
async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.message ?? `HTTP ${res.status}`);
  }
  return res.json();
}
 
// --- API functions ---
 
export async function getSnippets(params: {
  page?: number;
  limit?: number;
  q?: string;
  tag?: string;
}): Promise<SnippetsResponse> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.q) query.set("q", params.q);
  if (params.tag) query.set("tag", params.tag);
 
  const res = await fetch(`${API_URL}/snippets?${query.toString()}`);
  return handleResponse<SnippetsResponse>(res);
}
 
export async function getSnippet(id: string): Promise<Snippet> {
  const res = await fetch(`${API_URL}/snippets/${id}`);
  return handleResponse<Snippet>(res);
}
 
export async function createSnippet(payload: CreateSnippetPayload): Promise<Snippet> {
  const res = await fetch(`${API_URL}/snippets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<Snippet>(res);
}
 
export async function updateSnippet(id: string, payload: UpdateSnippetPayload): Promise<Snippet> {
  const res = await fetch(`${API_URL}/snippets/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<Snippet>(res);
}
 
export async function deleteSnippet(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/snippets/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}
 