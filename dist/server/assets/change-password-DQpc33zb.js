import { jsx, jsxs } from "react/jsx-runtime";
import { useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { u as useAuth, e as evaluatePassword, C as Card, a as CardHeader, b as CardTitle, c as CardContent, A as Alert, f as AlertDescription, d as cn, B as Button, I as Input } from "./router-7vaADMHT.js";
import { L as Label } from "./label-mJwpTZxJ.js";
import { AlertCircle, CheckCircle2, Loader2, EyeOff, Eye } from "lucide-react";
import { c as changePassword } from "./api-DVTefHqP.js";
import "@tanstack/react-query";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-label";
function ChangePasswordPage() {
  const {
    user,
    setUser
  } = useAuth();
  const navigate = useNavigate();
  const [oldPwd, setOld] = useState("");
  const [newPwd, setNew] = useState("");
  const [confirmPwd, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState({
    old: false,
    n: false,
    c: false
  });
  const [touched, setTouched] = useState({
    old: false,
    n: false,
    c: false
  });
  const [apiError, setApiError] = useState(null);
  useEffect(() => {
    if (!user) navigate({
      to: "/login"
    });
  }, [user, navigate]);
  const strength = useMemo(() => evaluatePassword(newPwd, {
    mobile: user?.mobile
  }), [newPwd, user?.mobile]);
  if (!user) return null;
  const errors = {
    old: touched.old && !oldPwd ? "Current password is required" : "",
    n: touched.n && newPwd && strength.errors.length ? strength.errors[0] : touched.n && !newPwd ? "New password is required" : "",
    c: touched.c && confirmPwd !== newPwd ? "Passwords do not match" : "",
    same: touched.n && oldPwd && newPwd && oldPwd === newPwd ? "New password must differ from current password" : ""
  };
  const formValid = oldPwd && newPwd && confirmPwd && !strength.errors.length && newPwd === confirmPwd && oldPwd !== newPwd;
  const onSubmit = async (e) => {
    e.preventDefault();
    setTouched({
      old: true,
      n: true,
      c: true
    });
    setApiError(null);
    if (!formValid) return;
    setLoading(true);
    try {
      await changePassword(oldPwd, newPwd);
      toast.success("Password updated successfully");
      setUser({
        ...user,
        mustChangePassword: false
      });
      navigate({
        to: user.role === "admin" ? "/admin" : "/client"
      });
    } catch (err) {
      const msg = err.message || "Failed to update password. Please try again.";
      setApiError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };
  const meterColors = ["bg-destructive", "bg-destructive", "bg-amber-500", "bg-yellow-500", "bg-emerald-500"];
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen grid place-items-center bg-muted/40 p-6", children: /* @__PURE__ */ jsxs(Card, { className: "w-full max-w-md", children: [
    /* @__PURE__ */ jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsx(CardTitle, { children: user.mustChangePassword ? "Set a new password" : "Change password" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: user.mustChangePassword ? "You're using the default password. Please set a stronger one to continue." : "Enter your current password and choose a new one." })
    ] }),
    /* @__PURE__ */ jsxs(CardContent, { children: [
      apiError && /* @__PURE__ */ jsxs(Alert, { variant: "destructive", className: "mb-4", children: [
        /* @__PURE__ */ jsx(AlertCircle, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsx(AlertDescription, { children: apiError })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit, noValidate: true, className: "space-y-4", children: [
        /* @__PURE__ */ jsx(PasswordField, { label: "Current Password", value: oldPwd, show: show.old, onToggle: () => setShow((s) => ({
          ...s,
          old: !s.old
        })), onChange: (v) => setOld(v), onBlur: () => setTouched((t) => ({
          ...t,
          old: true
        })), error: errors.old }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(PasswordField, { label: "New Password", value: newPwd, show: show.n, onToggle: () => setShow((s) => ({
            ...s,
            n: !s.n
          })), onChange: (v) => setNew(v), onBlur: () => setTouched((t) => ({
            ...t,
            n: true
          })), error: errors.n || errors.same }),
          newPwd && /* @__PURE__ */ jsxs("div", { className: "mt-2 space-y-2", children: [
            /* @__PURE__ */ jsx("div", { className: "flex gap-1", children: [0, 1, 2, 3].map((i) => /* @__PURE__ */ jsx("div", { className: cn("h-1 flex-1 rounded-full", i < strength.score ? meterColors[strength.score] : "bg-muted") }, i)) }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "Strength: ",
              /* @__PURE__ */ jsx("span", { className: "font-medium", children: strength.label })
            ] }),
            /* @__PURE__ */ jsx("ul", { className: "text-xs space-y-1", children: ["At least 8 characters", "One uppercase letter", "One lowercase letter", "One number", "One symbol"].map((req) => {
              const passed = !strength.errors.includes(req);
              return /* @__PURE__ */ jsxs("li", { className: cn("flex items-center gap-1.5", passed ? "text-emerald-600" : "text-muted-foreground"), children: [
                passed ? /* @__PURE__ */ jsx(CheckCircle2, { className: "h-3 w-3" }) : /* @__PURE__ */ jsx(AlertCircle, { className: "h-3 w-3" }),
                req
              ] }, req);
            }) })
          ] })
        ] }),
        /* @__PURE__ */ jsx(PasswordField, { label: "Confirm New Password", value: confirmPwd, show: show.c, onToggle: () => setShow((s) => ({
          ...s,
          c: !s.c
        })), onChange: (v) => setConfirm(v), onBlur: () => setTouched((t) => ({
          ...t,
          c: true
        })), error: errors.c }),
        /* @__PURE__ */ jsxs(Button, { type: "submit", className: "w-full", disabled: loading, children: [
          loading && /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 mr-2 animate-spin" }),
          "Update Password"
        ] })
      ] })
    ] })
  ] }) });
}
function PasswordField({
  label,
  value,
  show,
  onToggle,
  onChange,
  onBlur,
  error
}) {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
    /* @__PURE__ */ jsx(Label, { children: label }),
    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsx(Input, { type: show ? "text" : "password", value, onChange: (e) => onChange(e.target.value), onBlur, "aria-invalid": !!error, className: cn(error && "border-destructive focus-visible:ring-destructive", "pr-9") }),
      /* @__PURE__ */ jsx("button", { type: "button", onClick: onToggle, className: "absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground", tabIndex: -1, "aria-label": show ? "Hide password" : "Show password", children: show ? /* @__PURE__ */ jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" }) })
    ] }),
    error && /* @__PURE__ */ jsx("p", { className: "text-xs text-destructive", children: error })
  ] });
}
export {
  ChangePasswordPage as component
};
