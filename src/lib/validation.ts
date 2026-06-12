// Lightweight validators used across the app. No external schema lib to keep bundle small.

export interface PasswordStrength {
  score: 0 | 1 | 2 | 3 | 4;
  label: "Too weak" | "Weak" | "Fair" | "Good" | "Strong";
  errors: string[];
}

export function evaluatePassword(pwd: string, opts?: { mobile?: string }): PasswordStrength {
  const errors: string[] = [];
  if (pwd.length < 8) errors.push("At least 8 characters");
  if (!/[A-Z]/.test(pwd)) errors.push("One uppercase letter");
  if (!/[a-z]/.test(pwd)) errors.push("One lowercase letter");
  if (!/[0-9]/.test(pwd)) errors.push("One number");
  if (!/[^A-Za-z0-9]/.test(pwd)) errors.push("One symbol");
  if (opts?.mobile && pwd && pwd === opts.mobile)
    errors.push("Cannot be same as your mobile number");

  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd) && pwd.length >= 10) score++;
  const label = (["Too weak", "Weak", "Fair", "Good", "Strong"] as const)[score];
  return { score: score as PasswordStrength["score"], label, errors };
}

const PAN_RE = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const MOBILE_RE = /^[6-9][0-9]{9}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CODE_RE = /^[A-Z0-9_-]{3,20}$/;

export interface ClientFormInput {
  clientCode: string;
  name: string;
  pan: string;
  mobile: string;
  email: string;
  branch: string;
  parentCode?: string | null;
}

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

export function validateClient(
  input: ClientFormInput,
  opts: { partial?: boolean } = {},
): FieldErrors<ClientFormInput> {
  const errs: FieldErrors<ClientFormInput> = {};
  const required = !opts.partial;

  if (required || input.clientCode !== undefined) {
    if (!input.clientCode?.trim()) errs.clientCode = "Required";
    else if (!CODE_RE.test(input.clientCode.trim().toUpperCase()))
      errs.clientCode = "3-20 letters, digits, _ or -";
  }
  if (required || input.name !== undefined) {
    if (!input.name?.trim()) errs.name = "Required";
    else if (input.name.trim().length < 2) errs.name = "Too short";
    else if (input.name.length > 80) errs.name = "Max 80 characters";
  }
  if (required || input.pan !== undefined) {
    if (!input.pan?.trim()) errs.pan = "Required";
    else if (!PAN_RE.test(input.pan.trim().toUpperCase()))
      errs.pan = "Format: ABCDE1234F";
  }
  if (required || input.mobile !== undefined) {
    if (!input.mobile?.trim()) errs.mobile = "Required";
    else if (!MOBILE_RE.test(input.mobile.trim())) errs.mobile = "10-digit Indian mobile";
  }
  if (input.email?.trim() && !EMAIL_RE.test(input.email.trim()))
    errs.email = "Invalid email address";
  if (required && !input.branch?.trim()) errs.branch = "Required";
  if (input.parentCode && !CODE_RE.test(input.parentCode.trim().toUpperCase()))
    errs.parentCode = "Invalid code format";

  return errs;
}

export const EXPECTED_HEADERS = {
  clientMaster: ["ClientCode", "Name", "PAN", "DOB", "Mobile", "ParentCode", "Status"],
  brokerage: ["ClientCode", "TradeDate", "BrokerageAmount", "Segment", "Remark"],
} as const;

export interface SheetPreview {
  headers: string[];
  rows: Record<string, unknown>[];
  totalRows: number;
  missingHeaders: string[];
  extraHeaders: string[];
}

export async function parseExcelPreview(
  file: File,
  expected: readonly string[],
  maxRows = 5,
): Promise<SheetPreview> {
  const XLSX = await import("xlsx");
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: "array" });
  const sheetName = wb.SheetNames[0];
  if (!sheetName) throw new Error("Workbook has no sheets");
  const ws = wb.Sheets[sheetName];
  const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { defval: "" });
  const headers = json.length
    ? Object.keys(json[0])
    : (XLSX.utils.sheet_to_json(ws, { header: 1 })[0] as string[] | undefined) ?? [];
  const lower = headers.map((h) => h.toLowerCase());
  const missingHeaders = expected.filter((h) => !lower.includes(h.toLowerCase()));
  const extraHeaders = headers.filter(
    (h) => !expected.map((e) => e.toLowerCase()).includes(h.toLowerCase()),
  );
  return {
    headers,
    rows: json.slice(0, maxRows),
    totalRows: json.length,
    missingHeaders,
    extraHeaders,
  };
}

export function fileSizeOk(file: File, maxMB = 10): string | null {
  if (file.size > maxMB * 1024 * 1024) return `File exceeds ${maxMB}MB limit`;
  const ok = file.name.toLowerCase().endsWith(".xlsx");
  if (!ok) return "Only .xlsx files are allowed";
  return null;
}
