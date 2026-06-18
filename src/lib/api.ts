// Real API layer – connects to Flask backend at VITE_API_BASE_URL.
// If no env is set, it follows the current browser host and uses port 5000.
function detectApiBaseUrl() {
  const envUrl =
    typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_API_BASE_URL;
  if (envUrl) return envUrl;
  if (typeof window === "undefined") return "http://127.0.0.1:5000";
  const host = window.location.hostname || "127.0.0.1";
  return `http://${host}:5000`;
}
export const API_BASE_URL = "https://trading-brokerage-system.onrender.com";

// ---------- Types ----------
export type Role = "admin" | "client";

export interface AuthUser {
  id: string;
  clientCode: string;
  name: string;
  role: Role;
  mobile: string;
  pan?: string;
  dob?: string;
  parentCode?: string | null;
  mustChangePassword?: boolean;
}

export interface Client {
  id: string;
  clientCode: string;
  name: string;
  pan: string;
  mobile: string;
  email: string;
  branch: string;
  parentCode: string | null;
  active: boolean;
  joinedAt: string;
}

export interface BrokerageRow {
  id: string;
  clientCode: string;
  clientName: string;
  date: string;
  segment: string;
  brokerage: number;
  remark?: string;
  /** turnover is not provided by the backend; kept for type compat, always 0 */
  turnover: number;
}

export interface PasswordResetRequest {
  id: string;
  clientCode: string;
  name: string;
  mobile: string;
  requestedAt: string;
  status: "Pending" | "Approved" | "Rejected";
}

export interface UploadHistoryRow {
  id: string;
  type: "Client Master" | "Brokerage";
  fileName: string;
  uploadedBy: string;
  uploadedAt: string;
  rows: number;
  status: "Success" | "Failed";
}

export interface TreeNode {
  clientCode: string;
  name: string;
  branch: string;
  brokerage: number;
  children: TreeNode[];
}

// ---------- Token storage ----------
export function getToken(): string | null {
  return localStorage.getItem("auth_token");
}
export function setToken(t: string) {
  localStorage.setItem("auth_token", t);
}
export function clearToken() {
  localStorage.removeItem("auth_token");
}

// ---------- HTTP helpers ----------
async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const isFormData = options.body instanceof FormData;
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };
  if (!isFormData) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body?.error || `Request failed (${res.status})`);
  return body as T;
}

// ---------- Auth ----------
export async function login(clientCode: string, password: string): Promise<AuthUser> {
  const data = await apiFetch<{ token: string; user: AuthUser }>("/api/login", {
    method: "POST",
    body: JSON.stringify({ clientCode, password }),
  });
  setToken(data.token);
  return data.user;
}

export async function logout(): Promise<void> {
  try { await apiFetch("/api/logout", { method: "POST" }); } finally { clearToken(); }
}

export async function changePassword(
  oldPassword: string,
  newPassword: string,
  confirmPassword?: string,
): Promise<{ ok: true }> {
  return apiFetch("/api/change-password", {
    method: "POST",
    body: JSON.stringify({ oldPassword, newPassword, confirmPassword: confirmPassword ?? newPassword }),
  });
}

export async function requestPasswordReset(input: {
  clientCode: string;
  mobile: string;
  reason?: string;
}): Promise<{ ok: true }> {
  return apiFetch("/api/forgot-password", { method: "POST", body: JSON.stringify(input) });
}

// ---------- Helper: map raw brokerage row ----------
function mapBrokerageRow(r: any): BrokerageRow {
  return {
    id: String(r.id),
    clientCode: r.client_code ?? r.clientCode ?? "",
    clientName: r.client_name ?? r.clientName ?? "",
    date: r.trade_date ?? r.date ?? "",
    segment: r.segment ?? "",
    brokerage: Number(r.brokerage_amount ?? r.brokerage ?? 0),
    remark: r.remark ?? "",
    turnover: 0, // not provided by backend
  };
}

// ---------- Admin APIs ----------
export async function getAdminDashboardSummary() {
  return apiFetch<{
    totalClients: number;
    activeClients: number;
    todayBrokerage: number;
    monthBrokerage: number;
    totalBrokerage: number;
    pendingRequests: number;
  }>("/api/admin/dashboard-summary");
}

export async function getClients(query?: string): Promise<Client[]> {
  const qs = query ? `?q=${encodeURIComponent(query)}` : "";
  const rows = await apiFetch<any[]>(`/api/admin/clients${qs}`);
  return rows.map((r) => ({
    id: String(r.id),
    clientCode: r.client_code ?? r.clientCode,
    name: r.name,
    pan: r.pan ?? "",
    mobile: r.mobile ?? "",
    email: r.email ?? "",
    branch: r.branch ?? "",
    parentCode: r.parent_code ?? r.parentCode ?? null,
    active: r.status === "active",
    joinedAt: r.created_at ?? r.createdAt ?? new Date().toISOString(),
  }));
}

export async function addClient(input: Omit<Client, "id" | "joinedAt" | "active">) {
  return apiFetch("/api/admin/add-client", {
    method: "POST",
    body: JSON.stringify({
      clientCode: input.clientCode,
      name: input.name,
      pan: input.pan,
      mobile: input.mobile,
      parentCode: input.parentCode,
    }),
  });
}

export async function updateClient(clientCode: string, patch: Partial<Client>) {
  return apiFetch(`/api/admin/update-client/${clientCode}`, {
    method: "PUT",
    body: JSON.stringify(patch),
  });
}

export async function deactivateClient(clientCode: string) {
  return apiFetch(`/api/admin/delete-client/${clientCode}`, { method: "DELETE" });
}

export async function uploadClientMaster(file: File): Promise<{ ok: true; rows: number }> {
  const fd = new FormData();
  fd.append("file", file);
  return apiFetch("/api/admin/upload-client-master", { method: "POST", body: fd });
}

export async function uploadBrokerage(file: File): Promise<{ ok: true; rows: number }> {
  const fd = new FormData();
  fd.append("file", file);
  return apiFetch("/api/admin/upload-brokerage", { method: "POST", body: fd });
}

export async function getUploadHistory(): Promise<UploadHistoryRow[]> {
  const rows = await apiFetch<any[]>("/api/admin/upload-history");
  return rows.map((r) => ({
    id: String(r.id),
    type: r.upload_type === "client_master" ? "Client Master" : "Brokerage",
    fileName: r.file_name,
    uploadedBy: r.uploaded_by,
    uploadedAt: r.uploaded_at,
    rows: r.total_rows,
    status: r.failed_rows === 0 ? "Success" : "Failed",
  }));
}

/** Admin brokerage report — calls /api/admin/brokerage-report */
export async function getBrokerageHistory(
  clientCode?: string,
  limit?: number,
): Promise<BrokerageRow[]> {
  const params = new URLSearchParams();
  if (clientCode) params.set("clientCode", clientCode);
  if (limit) params.set("limit", String(limit));
  const qs = params.toString() ? `?${params}` : "";
  const rows = await apiFetch<any[]>(`/api/admin/brokerage-report${qs}`);
  return rows.map(mapBrokerageRow);
}

export async function getPasswordResetRequests(): Promise<PasswordResetRequest[]> {
  const rows = await apiFetch<any[]>("/api/admin/password-reset-requests");
  return rows.map((r) => ({
    id: String(r.id),
    clientCode: r.client_code,
    name: r.name,
    mobile: r.mobile,
    requestedAt: r.requested_at,
    status: (r.status.charAt(0).toUpperCase() + r.status.slice(1)) as any,
  }));
}

export async function approvePasswordReset(id: string): Promise<{ ok: true }> {
  return apiFetch(`/api/admin/approve-password-reset/${id}`, { method: "POST" });
}

export async function rejectPasswordReset(id: string): Promise<{ ok: true }> {
  return apiFetch(`/api/admin/reject-password-reset/${id}`, { method: "POST" });
}

export async function resetClientPassword(clientCode: string) {
  return apiFetch(`/api/admin/reset-password/${clientCode}`, { method: "POST" });
}

/** Admin tree — calls /api/admin/client-tree/all or /api/admin/client-tree/:code */
export async function getTeamTree(rootCode?: string): Promise<TreeNode[]> {
  const code = rootCode ?? "all";
  const result = await apiFetch<any>(`/api/admin/client-tree/${code}`);
  // Handle both bare array and { ok, data } wrapper shapes
  if (Array.isArray(result)) return result;
  if (result?.data && Array.isArray(result.data)) return result.data;
  if (result && typeof result === "object" && result.clientCode) return [result];
  return [];
}

// ---------- Client APIs ----------

/** Client dashboard summary — calls /api/client/dashboard-summary */
export async function getClientDashboardSummary(_clientCode: string) {
  return apiFetch<{
    todayBrokerage: number;
    monthBrokerage: number;
    totalBrokerage: number;
    teamSize: number;
  }>("/api/client/dashboard-summary");
}

/** Client brokerage history — calls /api/client/brokerage-history */
export async function getClientBrokerageHistory(): Promise<BrokerageRow[]> {
  const rows = await apiFetch<any[]>("/api/client/brokerage-history");
  return rows.map(mapBrokerageRow);
}

/** Client team tree — calls /api/client/team-tree */
export async function getClientTeamTree(): Promise<TreeNode[]> {
  const result = await apiFetch<any>("/api/client/team-tree");
  if (Array.isArray(result)) return result;
  if (result?.data && Array.isArray(result.data)) return result.data;
  if (result && typeof result === "object" && result.clientCode) return [result];
  return [];
}

/** Client team brokerage summary — calls /api/client/team-brokerage-summary */
export async function getClientTeamBrokerageSummary(): Promise<
  { clientCode: string; name: string; totalBrokerage: number }[]
> {
  return apiFetch("/api/client/team-brokerage-summary");
}
