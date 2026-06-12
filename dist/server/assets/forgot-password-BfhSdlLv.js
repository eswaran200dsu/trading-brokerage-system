import { jsx, jsxs } from "react/jsx-runtime";
import { useNavigate, Link } from "@tanstack/react-router";
import * as React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { d as cn, C as Card, a as CardHeader, b as CardTitle, c as CardContent, B as Button, I as Input } from "./router-7vaADMHT.js";
import { L as Label } from "./label-mJwpTZxJ.js";
import { CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import { r as requestPasswordReset } from "./api-DVTefHqP.js";
import "@tanstack/react-query";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-label";
const Textarea = React.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "textarea",
      {
        className: cn(
          "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Textarea.displayName = "Textarea";
function ForgotPasswordPage() {
  const [clientCode, setClientCode] = useState("");
  const [mobile, setMobile] = useState("");
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(mobile)) {
      toast.error("Enter a valid 10-digit mobile number");
      return;
    }
    setLoading(true);
    try {
      await requestPasswordReset({
        clientCode: clientCode.trim(),
        mobile,
        reason
      });
      setSubmitted(true);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen grid place-items-center bg-muted/40 p-6", children: /* @__PURE__ */ jsxs(Card, { className: "w-full max-w-md", children: [
    /* @__PURE__ */ jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsx(CardTitle, { children: "Reset your password" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Submit a request and an admin will reset your password." })
    ] }),
    /* @__PURE__ */ jsx(CardContent, { children: submitted ? /* @__PURE__ */ jsxs("div", { className: "space-y-4 text-center py-6", children: [
      /* @__PURE__ */ jsx(CheckCircle2, { className: "h-12 w-12 mx-auto text-green-600" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm", children: "Your password reset request has been sent to admin. Please wait for admin approval." }),
      /* @__PURE__ */ jsx(Button, { className: "w-full", onClick: () => navigate({
        to: "/login"
      }), children: "Back to Login" })
    ] }) : /* @__PURE__ */ jsxs("form", { onSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "cc", children: "ClientCode" }),
        /* @__PURE__ */ jsx(Input, { id: "cc", value: clientCode, onChange: (e) => setClientCode(e.target.value), required: true })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "mob", children: "Registered Mobile Number" }),
        /* @__PURE__ */ jsx(Input, { id: "mob", inputMode: "numeric", maxLength: 10, value: mobile, onChange: (e) => setMobile(e.target.value.replace(/\D/g, "")), required: true })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "reason", children: "Message / Reason (optional)" }),
        /* @__PURE__ */ jsx(Textarea, { id: "reason", value: reason, onChange: (e) => setReason(e.target.value), rows: 3 })
      ] }),
      /* @__PURE__ */ jsxs(Button, { type: "submit", className: "w-full", disabled: loading, children: [
        loading && /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 mr-2 animate-spin" }),
        "Request Password Reset"
      ] }),
      /* @__PURE__ */ jsxs(Link, { to: "/login", className: "flex items-center justify-center text-sm text-muted-foreground hover:text-foreground", children: [
        /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4 mr-1" }),
        " Back to login"
      ] })
    ] }) })
  ] }) });
}
export {
  ForgotPasswordPage as component
};
