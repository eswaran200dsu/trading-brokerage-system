import { jsxs, jsx } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, TrendingUp, IndianRupee, Users } from "lucide-react";
import { S as StatCard, f as formatINR } from "./StatCard-CryFg_Ph.js";
import { u as useAuth, C as Card, a as CardHeader, b as CardTitle, c as CardContent, T as Table, g as TableHeader, h as TableRow, i as TableHead, j as TableBody, k as TableCell } from "./router-7vaADMHT.js";
import { g as getClientDashboardSummary, a as getClientBrokerageHistory } from "./api-DVTefHqP.js";
import "@tanstack/react-router";
import "react";
import "sonner";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
function ClientDashboard() {
  const {
    user
  } = useAuth();
  const code = user.clientCode;
  const summary = useQuery({
    queryKey: ["client-summary", code],
    queryFn: () => getClientDashboardSummary(),
    staleTime: 6e4
    // treat data fresh for 60 s — no redundant refetches
  });
  const history = useQuery({
    queryKey: ["client-brokerage-history"],
    queryFn: () => getClientBrokerageHistory(),
    staleTime: 6e4
  });
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsx(StatCard, { label: "Today's Brokerage", value: summary.data ? formatINR(summary.data.todayBrokerage) : "—", icon: CalendarDays, tone: "primary" }),
      /* @__PURE__ */ jsx(StatCard, { label: "This Month", value: summary.data ? formatINR(summary.data.monthBrokerage) : "—", icon: TrendingUp }),
      /* @__PURE__ */ jsx(StatCard, { label: "Total Brokerage", value: summary.data ? formatINR(summary.data.totalBrokerage) : "—", icon: IndianRupee, tone: "success" }),
      /* @__PURE__ */ jsx(StatCard, { label: "Team Members", value: summary.data?.teamSize ?? "—", icon: Users })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Recent activity" }) }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { children: "Date" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Segment" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Remark" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Brokerage" })
        ] }) }),
        /* @__PURE__ */ jsxs(TableBody, { children: [
          history.data?.length === 0 && /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 4, className: "text-center py-6 text-muted-foreground", children: "No brokerage activity yet." }) }),
          history.data?.slice(0, 8).map((r) => /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableCell, { children: new Date(r.date).toLocaleDateString() }),
            /* @__PURE__ */ jsx(TableCell, { children: r.segment }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-muted-foreground text-xs", children: r.remark ?? "—" }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-right font-medium", children: formatINR(r.brokerage) })
          ] }, r.id))
        ] })
      ] }) }) })
    ] })
  ] });
}
export {
  ClientDashboard as component
};
