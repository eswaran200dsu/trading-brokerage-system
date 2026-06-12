import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, useRouter, Link, Outlet, HeadContent, Scripts, createFileRoute, lazyRouteComponent, redirect, createRouter } from "@tanstack/react-router";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import * as React from "react";
import { useState, useEffect, createContext, useContext } from "react";
import { Toaster as Toaster$1, toast } from "sonner";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { CheckCircle2, UploadCloud, AlertCircle, FileSpreadsheet, X, Loader2 } from "lucide-react";
const appCss = "/assets/styles-BNOAr8ku.css";
function reportLovableError(error, context = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error"
    }
  );
}
const Ctx = createContext(null);
const KEY = "tcbms.auth";
function AuthProvider({ children }) {
  const [user, setUserState] = useState(null);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setUserState(JSON.parse(raw));
    } catch {
    }
  }, []);
  const setUser = (u) => {
    setUserState(u);
    if (typeof window !== "undefined") {
      if (u) {
        localStorage.setItem(KEY, JSON.stringify(u));
      } else {
        localStorage.removeItem(KEY);
        localStorage.removeItem("auth_token");
      }
    }
  };
  return /* @__PURE__ */ jsx(Ctx.Provider, { value: { user, setUser, logout: () => setUser(null) }, children });
}
function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used inside AuthProvider");
  return c;
}
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsx(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
function NotFoundComponent() {
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$j = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "TradeDesk Brokerage" },
      { name: "description", content: "Trading Company Brokerage Management System" },
      { name: "author", content: "TradeDesk" },
      { property: "og:title", content: "TradeDesk Brokerage" },
      { property: "og:description", content: "Trading Company Brokerage Management System" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@TradeDesk" }
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$j.useRouteContext();
  useEffect(() => {
    document.title = "TradeDesk Brokerage";
  }, []);
  return /* @__PURE__ */ jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxs(AuthProvider, { children: [
    /* @__PURE__ */ jsx(Outlet, {}),
    /* @__PURE__ */ jsx(Toaster, { richColors: true, position: "top-right" })
  ] }) });
}
const $$splitComponentImporter$h = () => import("./login-WHH-onZj.js");
const Route$i = createFileRoute("/login")({
  head: () => ({
    meta: [{
      title: "Login — TradeDesk Brokerage"
    }, {
      name: "description",
      content: "Sign in to the TradeDesk brokerage management system."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$h, "component")
});
const $$splitComponentImporter$g = () => import("./forgot-password-BfhSdlLv.js");
const Route$h = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [{
      title: "Forgot Password — TradeDesk"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$g, "component")
});
const $$splitComponentImporter$f = () => import("./client-S7AT0HKB.js");
const Route$g = createFileRoute("/client")({
  component: lazyRouteComponent($$splitComponentImporter$f, "component")
});
const $$splitComponentImporter$e = () => import("./change-password-DQpc33zb.js");
const Route$f = createFileRoute("/change-password")({
  head: () => ({
    meta: [{
      title: "Change Password — TradeDesk"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitComponentImporter$d = () => import("./admin-B2jtHdYb.js");
const Route$e = createFileRoute("/admin")({
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const Route$d = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/login" });
  }
});
const $$splitComponentImporter$c = () => import("./client.index-CHNOuyEx.js");
const Route$c = createFileRoute("/client/")({
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./admin.index-JBpc-xFq.js");
const Route$b = createFileRoute("/admin/")({
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./client.tree-CNHQXZTG.js");
const Route$a = createFileRoute("/client/tree")({
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./client.team-Bjy8J6uS.js");
const Route$9 = createFileRoute("/client/team")({
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./client.profile-CKKDYjDB.js");
const Route$8 = createFileRoute("/client/profile")({
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./client.brokerage-history-sAqZp9oa.js");
const Route$7 = createFileRoute("/client/brokerage-history")({
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./admin.upload-history-DCG4mpX_.js");
const Route$6 = createFileRoute("/admin/upload-history")({
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const Card = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      className: cn("rounded-xl border bg-card text-card-foreground shadow", className),
      ...props
    }
  )
);
Card.displayName = "Card";
const CardHeader = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("flex flex-col space-y-1.5 p-6", className), ...props })
);
CardHeader.displayName = "CardHeader";
const CardTitle = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      className: cn("font-semibold leading-none tracking-tight", className),
      ...props
    }
  )
);
CardTitle.displayName = "CardTitle";
const CardDescription = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("text-sm text-muted-foreground", className), ...props })
);
CardDescription.displayName = "CardDescription";
const CardContent = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("p-6 pt-0", className), ...props })
);
CardContent.displayName = "CardContent";
const CardFooter = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("flex items-center p-6 pt-0", className), ...props })
);
CardFooter.displayName = "CardFooter";
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx(Comp, { className: cn(buttonVariants({ variant, size, className })), ref, ...props });
  }
);
Button.displayName = "Button";
const Input = React.forwardRef(
  ({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "input",
      {
        type,
        className: cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Input.displayName = "Input";
const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
const Alert = React.forwardRef(({ className, variant, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, role: "alert", className: cn(alertVariants({ variant }), className), ...props }));
Alert.displayName = "Alert";
const AlertTitle = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx(
    "h5",
    {
      ref,
      className: cn("mb-1 font-medium leading-none tracking-tight", className),
      ...props
    }
  )
);
AlertTitle.displayName = "AlertTitle";
const AlertDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("text-sm [&_p]:leading-relaxed", className), ...props }));
AlertDescription.displayName = "AlertDescription";
const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({ className, variant, ...props }) {
  return /* @__PURE__ */ jsx("div", { className: cn(badgeVariants({ variant }), className), ...props });
}
const Table = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { className: "relative w-full overflow-auto", children: /* @__PURE__ */ jsx("table", { ref, className: cn("w-full caption-bottom text-sm", className), ...props }) })
);
Table.displayName = "Table";
const TableHeader = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("thead", { ref, className: cn("[&_tr]:border-b", className), ...props }));
TableHeader.displayName = "TableHeader";
const TableBody = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("tbody", { ref, className: cn("[&_tr:last-child]:border-0", className), ...props }));
TableBody.displayName = "TableBody";
const TableFooter = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "tfoot",
  {
    ref,
    className: cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className),
    ...props
  }
));
TableFooter.displayName = "TableFooter";
const TableRow = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx(
    "tr",
    {
      ref,
      className: cn(
        "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
        className
      ),
      ...props
    }
  )
);
TableRow.displayName = "TableRow";
const TableHead = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "th",
  {
    ref,
    className: cn(
      "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    ),
    ...props
  }
));
TableHead.displayName = "TableHead";
const TableCell = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "td",
  {
    ref,
    className: cn(
      "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    ),
    ...props
  }
));
TableCell.displayName = "TableCell";
const TableCaption = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("caption", { ref, className: cn("mt-4 text-sm text-muted-foreground", className), ...props }));
TableCaption.displayName = "TableCaption";
function evaluatePassword(pwd, opts) {
  const errors = [];
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
  const label = ["Too weak", "Weak", "Fair", "Good", "Strong"][score];
  return { score, label, errors };
}
const PAN_RE = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const MOBILE_RE = /^[6-9][0-9]{9}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CODE_RE = /^[A-Z0-9_-]{3,20}$/;
function validateClient(input, opts = {}) {
  const errs = {};
  const required = !opts.partial;
  if (required || input.clientCode !== void 0) {
    if (!input.clientCode?.trim()) errs.clientCode = "Required";
    else if (!CODE_RE.test(input.clientCode.trim().toUpperCase()))
      errs.clientCode = "3-20 letters, digits, _ or -";
  }
  if (required || input.name !== void 0) {
    if (!input.name?.trim()) errs.name = "Required";
    else if (input.name.trim().length < 2) errs.name = "Too short";
    else if (input.name.length > 80) errs.name = "Max 80 characters";
  }
  if (required || input.pan !== void 0) {
    if (!input.pan?.trim()) errs.pan = "Required";
    else if (!PAN_RE.test(input.pan.trim().toUpperCase()))
      errs.pan = "Format: ABCDE1234F";
  }
  if (required || input.mobile !== void 0) {
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
const EXPECTED_HEADERS = {
  clientMaster: ["ClientCode", "Name", "PAN", "DOB", "Mobile", "ParentCode", "Status"],
  brokerage: ["ClientCode", "TradeDate", "BrokerageAmount", "Segment", "Remark"]
};
async function parseExcelPreview(file, expected, maxRows = 5) {
  const XLSX = await import("xlsx");
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: "array" });
  const sheetName = wb.SheetNames[0];
  if (!sheetName) throw new Error("Workbook has no sheets");
  const ws = wb.Sheets[sheetName];
  const json = XLSX.utils.sheet_to_json(ws, { defval: "" });
  const headers = json.length ? Object.keys(json[0]) : XLSX.utils.sheet_to_json(ws, { header: 1 })[0] ?? [];
  const lower = headers.map((h) => h.toLowerCase());
  const missingHeaders = expected.filter((h) => !lower.includes(h.toLowerCase()));
  const extraHeaders = headers.filter(
    (h) => !expected.map((e) => e.toLowerCase()).includes(h.toLowerCase())
  );
  return {
    headers,
    rows: json.slice(0, maxRows),
    totalRows: json.length,
    missingHeaders,
    extraHeaders
  };
}
function fileSizeOk(file, maxMB = 10) {
  if (file.size > maxMB * 1024 * 1024) return `File exceeds ${maxMB}MB limit`;
  const ok = file.name.toLowerCase().endsWith(".xlsx");
  if (!ok) return "Only .xlsx files are allowed";
  return null;
}
const $$splitComponentImporter$5 = () => import("./admin.upload-client-master-DEw6J0qy.js");
const Route$5 = createFileRoute("/admin/upload-client-master")({
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
function UploadCard({
  title,
  description,
  expected,
  action
}) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileError, setFileError] = useState(null);
  const [result, setResult] = useState(null);
  const reset = () => {
    setFile(null);
    setPreview(null);
    setFileError(null);
    setResult(null);
  };
  const onFile = async (f) => {
    setResult(null);
    setPreview(null);
    setFileError(null);
    if (!f) {
      setFile(null);
      return;
    }
    const sizeErr = fileSizeOk(f);
    if (sizeErr) {
      setFileError(sizeErr);
      setFile(null);
      return;
    }
    setFile(f);
    setParsing(true);
    try {
      const p = await parseExcelPreview(f, expected);
      setPreview(p);
      if (p.totalRows === 0) setFileError("The file appears to be empty");
    } catch (e) {
      setFileError(`Could not read file: ${e.message}`);
    } finally {
      setParsing(false);
    }
  };
  const headersValid = preview && preview.missingHeaders.length === 0;
  const canUpload = !!file && !!preview && headersValid && !loading;
  const onUpload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const r = await action(file);
      setResult({
        rows: r.rows,
        fileName: file.name
      });
      toast.success(`Uploaded ${r.rows} rows from ${file.name}`);
      setFile(null);
      setPreview(null);
    } catch (e) {
      toast.error(e.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs(Card, { className: "max-w-4xl", children: [
    /* @__PURE__ */ jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsx(CardTitle, { children: title }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: description }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5 pt-2", children: expected.map((h) => /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "font-mono text-xs", children: h }, h)) })
    ] }),
    /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
      result && /* @__PURE__ */ jsxs(Alert, { className: "border-emerald-500/40 bg-emerald-500/5", children: [
        /* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4 text-emerald-600" }),
        /* @__PURE__ */ jsx(AlertTitle, { children: "Upload successful" }),
        /* @__PURE__ */ jsxs(AlertDescription, { children: [
          "Processed ",
          result.rows,
          " rows from ",
          /* @__PURE__ */ jsx("span", { className: "font-medium", children: result.fileName }),
          "."
        ] })
      ] }),
      /* @__PURE__ */ jsxs("label", { className: "block border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-muted/40 transition-colors", children: [
        /* @__PURE__ */ jsx(UploadCloud, { className: "h-10 w-10 mx-auto text-muted-foreground" }),
        /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm font-medium", children: "Click to choose an Excel file" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: ".xlsx only • max 10MB" }),
        /* @__PURE__ */ jsx(Input, { type: "file", accept: ".xlsx", className: "hidden", onChange: (e) => onFile(e.target.files?.[0] ?? null) })
      ] }),
      fileError && /* @__PURE__ */ jsxs(Alert, { variant: "destructive", children: [
        /* @__PURE__ */ jsx(AlertCircle, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsx(AlertDescription, { children: fileError })
      ] }),
      file && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 p-3 rounded-md bg-muted/40", children: [
        /* @__PURE__ */ jsx(FileSpreadsheet, { className: "h-5 w-5 text-primary" }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm font-medium truncate", children: file.name }),
          /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground", children: [
            (file.size / 1024).toFixed(1),
            " KB",
            preview && ` • ${preview.totalRows} rows`,
            parsing && " • parsing…"
          ] })
        ] }),
        /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", onClick: reset, children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }) })
      ] }),
      preview && /* @__PURE__ */ jsxs(Fragment, { children: [
        preview.missingHeaders.length > 0 && /* @__PURE__ */ jsxs(Alert, { variant: "destructive", children: [
          /* @__PURE__ */ jsx(AlertCircle, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx(AlertTitle, { children: "Missing required columns" }),
          /* @__PURE__ */ jsxs(AlertDescription, { children: [
            "Add these columns to your sheet:",
            " ",
            /* @__PURE__ */ jsx("span", { className: "font-mono", children: preview.missingHeaders.join(", ") })
          ] })
        ] }),
        preview.extraHeaders.length > 0 && /* @__PURE__ */ jsxs(Alert, { children: [
          /* @__PURE__ */ jsx(AlertCircle, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxs(AlertDescription, { children: [
            "Unrecognized columns will be ignored:",
            " ",
            /* @__PURE__ */ jsx("span", { className: "font-mono", children: preview.extraHeaders.join(", ") })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "text-xs font-medium text-muted-foreground mb-2", children: [
            "Preview (first ",
            preview.rows.length,
            " rows)"
          ] }),
          /* @__PURE__ */ jsx("div", { className: "overflow-x-auto border rounded-md", children: /* @__PURE__ */ jsxs(Table, { children: [
            /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsx(TableRow, { children: preview.headers.map((h) => /* @__PURE__ */ jsx(TableHead, { className: "whitespace-nowrap text-xs", children: h }, h)) }) }),
            /* @__PURE__ */ jsx(TableBody, { children: preview.rows.map((r, i) => /* @__PURE__ */ jsx(TableRow, { children: preview.headers.map((h) => /* @__PURE__ */ jsx(TableCell, { className: "whitespace-nowrap text-xs", children: String(r[h] ?? "") }, h)) }, i)) })
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Button, { onClick: onUpload, disabled: !canUpload, children: [
        loading && /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 mr-2 animate-spin" }),
        "Upload"
      ] })
    ] })
  ] });
}
const $$splitComponentImporter$4 = () => import("./admin.upload-brokerage-AdbG_tCq.js");
const Route$4 = createFileRoute("/admin/upload-brokerage")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./admin.tree-BAhgTHA0.js");
const Route$3 = createFileRoute("/admin/tree")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./admin.password-requests-Brr3ffNE.js");
const Route$2 = createFileRoute("/admin/password-requests")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./admin.clients-DJldLYHI.js");
const Route$1 = createFileRoute("/admin/clients")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./admin.brokerage-report-CQgjIrxo.js");
const Route = createFileRoute("/admin/brokerage-report")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const LoginRoute = Route$i.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$j
});
const ForgotPasswordRoute = Route$h.update({
  id: "/forgot-password",
  path: "/forgot-password",
  getParentRoute: () => Route$j
});
const ClientRoute = Route$g.update({
  id: "/client",
  path: "/client",
  getParentRoute: () => Route$j
});
const ChangePasswordRoute = Route$f.update({
  id: "/change-password",
  path: "/change-password",
  getParentRoute: () => Route$j
});
const AdminRoute = Route$e.update({
  id: "/admin",
  path: "/admin",
  getParentRoute: () => Route$j
});
const IndexRoute = Route$d.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$j
});
const ClientIndexRoute = Route$c.update({
  id: "/",
  path: "/",
  getParentRoute: () => ClientRoute
});
const AdminIndexRoute = Route$b.update({
  id: "/",
  path: "/",
  getParentRoute: () => AdminRoute
});
const ClientTreeRoute = Route$a.update({
  id: "/tree",
  path: "/tree",
  getParentRoute: () => ClientRoute
});
const ClientTeamRoute = Route$9.update({
  id: "/team",
  path: "/team",
  getParentRoute: () => ClientRoute
});
const ClientProfileRoute = Route$8.update({
  id: "/profile",
  path: "/profile",
  getParentRoute: () => ClientRoute
});
const ClientBrokerageHistoryRoute = Route$7.update({
  id: "/brokerage-history",
  path: "/brokerage-history",
  getParentRoute: () => ClientRoute
});
const AdminUploadHistoryRoute = Route$6.update({
  id: "/upload-history",
  path: "/upload-history",
  getParentRoute: () => AdminRoute
});
const AdminUploadClientMasterRoute = Route$5.update({
  id: "/upload-client-master",
  path: "/upload-client-master",
  getParentRoute: () => AdminRoute
});
const AdminUploadBrokerageRoute = Route$4.update({
  id: "/upload-brokerage",
  path: "/upload-brokerage",
  getParentRoute: () => AdminRoute
});
const AdminTreeRoute = Route$3.update({
  id: "/tree",
  path: "/tree",
  getParentRoute: () => AdminRoute
});
const AdminPasswordRequestsRoute = Route$2.update({
  id: "/password-requests",
  path: "/password-requests",
  getParentRoute: () => AdminRoute
});
const AdminClientsRoute = Route$1.update({
  id: "/clients",
  path: "/clients",
  getParentRoute: () => AdminRoute
});
const AdminBrokerageReportRoute = Route.update({
  id: "/brokerage-report",
  path: "/brokerage-report",
  getParentRoute: () => AdminRoute
});
const AdminRouteChildren = {
  AdminBrokerageReportRoute,
  AdminClientsRoute,
  AdminPasswordRequestsRoute,
  AdminTreeRoute,
  AdminUploadBrokerageRoute,
  AdminUploadClientMasterRoute,
  AdminUploadHistoryRoute,
  AdminIndexRoute
};
const AdminRouteWithChildren = AdminRoute._addFileChildren(AdminRouteChildren);
const ClientRouteChildren = {
  ClientBrokerageHistoryRoute,
  ClientProfileRoute,
  ClientTeamRoute,
  ClientTreeRoute,
  ClientIndexRoute
};
const ClientRouteWithChildren = ClientRoute._addFileChildren(ClientRouteChildren);
const rootRouteChildren = {
  IndexRoute,
  AdminRoute: AdminRouteWithChildren,
  ChangePasswordRoute,
  ClientRoute: ClientRouteWithChildren,
  ForgotPasswordRoute,
  LoginRoute
};
const routeTree = Route$j._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Alert as A,
  Button as B,
  Card as C,
  EXPECTED_HEADERS as E,
  Input as I,
  Table as T,
  UploadCard as U,
  CardHeader as a,
  CardTitle as b,
  CardContent as c,
  cn as d,
  evaluatePassword as e,
  AlertDescription as f,
  TableHeader as g,
  TableRow as h,
  TableHead as i,
  TableBody as j,
  TableCell as k,
  Badge as l,
  AlertTitle as m,
  fileSizeOk as n,
  buttonVariants as o,
  parseExcelPreview as p,
  router as r,
  useAuth as u,
  validateClient as v
};
