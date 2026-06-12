import { jsxs, jsx } from "react/jsx-runtime";
import { u as useAuth, C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./router-7vaADMHT.js";
import "@tanstack/react-query";
import "@tanstack/react-router";
import "react";
import "sonner";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "lucide-react";
function ProfilePage() {
  const {
    user
  } = useAuth();
  if (!user) return null;
  const rows = [["ClientCode", user.clientCode], ["Name", user.name], ["Mobile", user.mobile], ["Email", user.email], ["PAN", user.pan], ["Branch", user.branch], ["Parent Code", user.parentCode ?? "—"]];
  return /* @__PURE__ */ jsxs(Card, { className: "max-w-2xl", children: [
    /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "My Profile" }) }),
    /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("dl", { className: "divide-y", children: rows.map(([k, v]) => /* @__PURE__ */ jsxs("div", { className: "flex justify-between py-3 text-sm", children: [
      /* @__PURE__ */ jsx("dt", { className: "text-muted-foreground", children: k }),
      /* @__PURE__ */ jsx("dd", { className: "font-medium", children: v || "—" })
    ] }, k)) }) })
  ] });
}
export {
  ProfilePage as component
};
