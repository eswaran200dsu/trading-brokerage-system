import { jsxs, jsx } from "react/jsx-runtime";
import { useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { u as useAuth, C as Card, a as CardHeader, b as CardTitle, c as CardContent, I as Input, B as Button } from "./router-7vaADMHT.js";
import { L as Label } from "./label-mJwpTZxJ.js";
import { LineChart, Loader2 } from "lucide-react";
import { l as login } from "./api-DVTefHqP.js";
import "@tanstack/react-query";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-label";
function LoginPage() {
  const [clientCode, setClientCode] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    setUser
  } = useAuth();
  const navigate = useNavigate();
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(clientCode.trim(), password);
      setUser(user);
      toast.success(`Welcome, ${user.name}`);
      navigate({
        to: user.role === "admin" ? "/admin" : "/client"
      });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen grid lg:grid-cols-2 bg-background", children: [
    /* @__PURE__ */ jsxs("div", { className: "hidden lg:flex flex-col justify-between p-12 bg-primary text-primary-foreground", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "h-10 w-10 rounded-md bg-primary-foreground/10 grid place-items-center", children: /* @__PURE__ */ jsx(LineChart, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsx("span", { className: "text-lg font-semibold", children: "TradeDesk" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-4xl font-bold leading-tight", children: "Trading Company Brokerage Management" }),
        /* @__PURE__ */ jsx("p", { className: "text-primary-foreground/80 max-w-md", children: "Centralized brokerage tracking, branch trees, and client management for your trading desk." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-xs text-primary-foreground/60", children: [
        "Demo admin: ",
        /* @__PURE__ */ jsx("span", { className: "font-mono", children: "admin / Admin@123" }),
        " · client",
        " ",
        /* @__PURE__ */ jsx("span", { className: "font-mono", children: "C1001 / 9876543210" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center p-6", children: /* @__PURE__ */ jsxs(Card, { className: "w-full max-w-md", children: [
      /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsx(CardTitle, { children: "Sign in to your account" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Use your ClientCode and password to continue." })
      ] }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("form", { onSubmit, className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "code", children: "ClientCode / Username" }),
          /* @__PURE__ */ jsx(Input, { id: "code", autoFocus: true, value: clientCode, onChange: (e) => setClientCode(e.target.value), placeholder: "e.g. C1001 or ADMIN", required: true })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "pwd", children: "Password" }),
            /* @__PURE__ */ jsx(Link, { to: "/forgot-password", className: "text-xs text-primary hover:underline", children: "Forgot Password?" })
          ] }),
          /* @__PURE__ */ jsx(Input, { id: "pwd", type: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true })
        ] }),
        /* @__PURE__ */ jsxs(Button, { type: "submit", className: "w-full", disabled: loading, children: [
          loading && /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 mr-2 animate-spin" }),
          "Sign in"
        ] })
      ] }) })
    ] }) })
  ] });
}
export {
  LoginPage as component
};
