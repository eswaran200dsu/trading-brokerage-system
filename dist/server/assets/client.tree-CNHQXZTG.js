import { jsxs, jsx } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./router-7vaADMHT.js";
import { e as getClientTeamTree } from "./api-DVTefHqP.js";
import { T as TreeView } from "./TreeView-DaUEXclJ.js";
import "@tanstack/react-router";
import "react";
import "sonner";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "lucide-react";
import "./StatCard-CryFg_Ph.js";
function ClientTreePage() {
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["client-team-tree"],
    queryFn: () => getClientTeamTree(),
    staleTime: 6e4
  });
  return /* @__PURE__ */ jsxs(Card, { children: [
    /* @__PURE__ */ jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsx(CardTitle, { children: "My Tree" }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Your branch and downline members." })
    ] }),
    /* @__PURE__ */ jsx(CardContent, { children: isLoading ? /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground", children: "Loading…" }) : /* @__PURE__ */ jsx(TreeView, { nodes: data ?? [] }) })
  ] });
}
export {
  ClientTreePage as component
};
