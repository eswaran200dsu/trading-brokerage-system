import { jsxs, jsx } from "react/jsx-runtime";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { C as Card, a as CardHeader, b as CardTitle, B as Button, c as CardContent } from "./router-7vaADMHT.js";
import { j as getTeamTree } from "./api-DVTefHqP.js";
import { T as TreeView } from "./TreeView-DaUEXclJ.js";
import "@tanstack/react-router";
import "react";
import "sonner";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./StatCard-CryFg_Ph.js";
function AdminTreePage() {
  const qc = useQueryClient();
  const {
    data,
    isLoading,
    isFetching
  } = useQuery({
    queryKey: ["admin-tree", "all"],
    queryFn: () => getTeamTree(),
    staleTime: 3e4
  });
  const totalNodes = countNodes(data ?? []);
  return /* @__PURE__ */ jsxs(Card, { children: [
    /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-start justify-between gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(CardTitle, { children: "Branch / Tree View" }),
        /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
          "Full client hierarchy.",
          " ",
          !isLoading && /* @__PURE__ */ jsxs("span", { children: [
            (data ?? []).length,
            " root",
            (data ?? []).length !== 1 ? "s" : "",
            ",",
            " ",
            totalNodes,
            " total",
            " ",
            totalNodes === 1 ? "member" : "members",
            "."
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Button, { size: "sm", variant: "outline", onClick: () => qc.invalidateQueries({
        queryKey: ["admin-tree"]
      }), disabled: isFetching, children: [
        /* @__PURE__ */ jsx(RefreshCw, { className: `h-3.5 w-3.5 mr-1 ${isFetching ? "animate-spin" : ""}` }),
        "Refresh"
      ] })
    ] }),
    /* @__PURE__ */ jsx(CardContent, { children: isLoading ? /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground py-6 text-center", children: "Loading tree…" }) : /* @__PURE__ */ jsx(TreeView, { nodes: data ?? [] }) })
  ] });
}
function countNodes(nodes) {
  return nodes.reduce((sum, n) => sum + 1 + countNodes(n.children ?? []), 0);
}
export {
  AdminTreePage as component
};
