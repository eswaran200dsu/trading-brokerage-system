const __vite_import_meta_env__ = {};
function detectApiBaseUrl() {
  const envUrl = typeof import.meta !== "undefined" && __vite_import_meta_env__?.VITE_API_BASE_URL;
  if (envUrl) return envUrl;
  if (typeof window === "undefined") return "http://127.0.0.1:5000";
  const host = window.location.hostname || "127.0.0.1";
  return `http://${host}:5000`;
}
const API_BASE_URL = detectApiBaseUrl();
function getToken() {
  return localStorage.getItem("auth_token");
}
function setToken(t) {
  localStorage.setItem("auth_token", t);
}
async function apiFetch(path, options = {}) {
  const token = getToken();
  const isFormData = options.body instanceof FormData;
  const headers = {
    ...options.headers
  };
  if (!isFormData) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body?.error || `Request failed (${res.status})`);
  return body;
}
async function login(clientCode, password) {
  const data = await apiFetch("/api/login", {
    method: "POST",
    body: JSON.stringify({ clientCode, password })
  });
  setToken(data.token);
  return data.user;
}
async function changePassword(oldPassword, newPassword, confirmPassword) {
  return apiFetch("/api/change-password", {
    method: "POST",
    body: JSON.stringify({ oldPassword, newPassword, confirmPassword: newPassword })
  });
}
async function requestPasswordReset(input) {
  return apiFetch("/api/forgot-password", { method: "POST", body: JSON.stringify(input) });
}
function mapBrokerageRow(r) {
  return {
    id: String(r.id),
    clientCode: r.client_code ?? r.clientCode ?? "",
    clientName: r.client_name ?? r.clientName ?? "",
    date: r.trade_date ?? r.date ?? "",
    segment: r.segment ?? "",
    brokerage: Number(r.brokerage_amount ?? r.brokerage ?? 0),
    remark: r.remark ?? "",
    turnover: 0
    // not provided by backend
  };
}
async function getAdminDashboardSummary() {
  return apiFetch("/api/admin/dashboard-summary");
}
async function getClients(query) {
  const qs = query ? `?q=${encodeURIComponent(query)}` : "";
  const rows = await apiFetch(`/api/admin/clients${qs}`);
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
    joinedAt: r.created_at ?? r.createdAt ?? (/* @__PURE__ */ new Date()).toISOString()
  }));
}
async function addClient(input) {
  return apiFetch("/api/admin/add-client", {
    method: "POST",
    body: JSON.stringify({
      clientCode: input.clientCode,
      name: input.name,
      pan: input.pan,
      mobile: input.mobile,
      parentCode: input.parentCode
    })
  });
}
async function updateClient(clientCode, patch) {
  return apiFetch(`/api/admin/update-client/${clientCode}`, {
    method: "PUT",
    body: JSON.stringify(patch)
  });
}
async function deactivateClient(clientCode) {
  return apiFetch(`/api/admin/delete-client/${clientCode}`, { method: "DELETE" });
}
async function uploadClientMaster(file) {
  const fd = new FormData();
  fd.append("file", file);
  return apiFetch("/api/admin/upload-client-master", { method: "POST", body: fd });
}
async function uploadBrokerage(file) {
  const fd = new FormData();
  fd.append("file", file);
  return apiFetch("/api/admin/upload-brokerage", { method: "POST", body: fd });
}
async function getUploadHistory() {
  const rows = await apiFetch("/api/admin/upload-history");
  return rows.map((r) => ({
    id: String(r.id),
    type: r.upload_type === "client_master" ? "Client Master" : "Brokerage",
    fileName: r.file_name,
    uploadedBy: r.uploaded_by,
    uploadedAt: r.uploaded_at,
    rows: r.total_rows,
    status: r.failed_rows === 0 ? "Success" : "Failed"
  }));
}
async function getBrokerageHistory(clientCode, limit) {
  const params = new URLSearchParams();
  if (limit) params.set("limit", String(limit));
  const qs = params.toString() ? `?${params}` : "";
  const rows = await apiFetch(`/api/admin/brokerage-report${qs}`);
  return rows.map(mapBrokerageRow);
}
async function getPasswordResetRequests() {
  const rows = await apiFetch("/api/admin/password-reset-requests");
  return rows.map((r) => ({
    id: String(r.id),
    clientCode: r.client_code,
    name: r.name,
    mobile: r.mobile,
    requestedAt: r.requested_at,
    status: r.status.charAt(0).toUpperCase() + r.status.slice(1)
  }));
}
async function approvePasswordReset(id) {
  return apiFetch(`/api/admin/approve-password-reset/${id}`, { method: "POST" });
}
async function rejectPasswordReset(id) {
  return apiFetch(`/api/admin/reject-password-reset/${id}`, { method: "POST" });
}
async function resetClientPassword(clientCode) {
  return apiFetch(`/api/admin/reset-password/${clientCode}`, { method: "POST" });
}
async function getTeamTree(rootCode) {
  const code = "all";
  const result = await apiFetch(`/api/admin/client-tree/${code}`);
  if (Array.isArray(result)) return result;
  if (result?.data && Array.isArray(result.data)) return result.data;
  if (result && typeof result === "object" && result.clientCode) return [result];
  return [];
}
async function getClientDashboardSummary(_clientCode) {
  return apiFetch("/api/client/dashboard-summary");
}
async function getClientBrokerageHistory() {
  const rows = await apiFetch("/api/client/brokerage-history");
  return rows.map(mapBrokerageRow);
}
async function getClientTeamTree() {
  const result = await apiFetch("/api/client/team-tree");
  if (Array.isArray(result)) return result;
  if (result?.data && Array.isArray(result.data)) return result.data;
  if (result && typeof result === "object" && result.clientCode) return [result];
  return [];
}
async function getClientTeamBrokerageSummary() {
  return apiFetch("/api/client/team-brokerage-summary");
}
export {
  getClientBrokerageHistory as a,
  getAdminDashboardSummary as b,
  changePassword as c,
  getBrokerageHistory as d,
  getClientTeamTree as e,
  getClientTeamBrokerageSummary as f,
  getClientDashboardSummary as g,
  getUploadHistory as h,
  uploadBrokerage as i,
  getTeamTree as j,
  getPasswordResetRequests as k,
  login as l,
  approvePasswordReset as m,
  rejectPasswordReset as n,
  getClients as o,
  addClient as p,
  updateClient as q,
  requestPasswordReset as r,
  resetClientPassword as s,
  deactivateClient as t,
  uploadClientMaster as u
};
