import { jsx } from "react/jsx-runtime";
import { Outlet } from "@tanstack/react-router";
import { R as RequireRole, A as AppShell } from "./RequireRole-CB1dJM0t.js";
import "lucide-react";
import "react";
import "./router-7vaADMHT.js";
import "@tanstack/react-query";
import "sonner";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
const SplitComponent = () => /* @__PURE__ */ jsx(RequireRole, { role: "admin", children: /* @__PURE__ */ jsx(AppShell, { role: "admin", children: /* @__PURE__ */ jsx(Outlet, {}) }) });
export {
  SplitComponent as component
};
