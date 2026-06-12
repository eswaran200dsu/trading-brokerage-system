import { jsxs, jsx } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent, T as Table, g as TableHeader, h as TableRow, i as TableHead, j as TableBody, k as TableCell } from "./router-7vaADMHT.js";
import { f as getClientTeamBrokerageSummary } from "./api-DVTefHqP.js";
import { f as formatINR } from "./StatCard-CryFg_Ph.js";
import "@tanstack/react-router";
import "react";
import "sonner";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "lucide-react";
function TeamPage() {
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["client-team-summary"],
    queryFn: () => getClientTeamBrokerageSummary(),
    staleTime: 6e4
  });
  const grand = (data ?? []).reduce((s, r) => s + r.totalBrokerage, 0);
  return /* @__PURE__ */ jsxs(Card, { children: [
    /* @__PURE__ */ jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsx(CardTitle, { children: "My Team" }),
      /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
        data?.length ?? 0,
        " members · Total brokerage ",
        formatINR(grand)
      ] })
    ] }),
    /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs(Table, { children: [
      /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableHead, { children: "ClientCode" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Name" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Total Brokerage" })
      ] }) }),
      /* @__PURE__ */ jsxs(TableBody, { children: [
        isLoading && /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 3, className: "text-center py-6 text-muted-foreground", children: "Loading…" }) }),
        !isLoading && (data ?? []).length === 0 && /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 3, className: "text-center py-6 text-muted-foreground", children: "No team members." }) }),
        data?.map((m) => /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs", children: m.clientCode }),
          /* @__PURE__ */ jsx(TableCell, { children: m.name }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-right font-medium", children: formatINR(m.totalBrokerage) })
        ] }, m.clientCode))
      ] })
    ] }) }) })
  ] });
}
export {
  TeamPage as component
};
