import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Users, UserCheck, CalendarDays, TrendingUp, IndianRupee, KeyRound } from "lucide-react";
import { b as getAdminDashboardSummary, d as getBrokerageHistory } from "./api-DVTefHqP.js";
import { S as StatCard, f as formatINR } from "./StatCard-CryFg_Ph.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent, B as Button, T as Table, g as TableHeader, h as TableRow, i as TableHead, j as TableBody, k as TableCell } from "./router-7vaADMHT.js";
import "react";
import "sonner";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
function AdminDashboard() {
  const summary = useQuery({
    queryKey: ["admin", "summary"],
    queryFn: getAdminDashboardSummary,
    staleTime: 6e4
  });
  const recent = useQuery({
    queryKey: ["admin", "recent-brokerage"],
    queryFn: () => getBrokerageHistory(void 0, 10),
    staleTime: 6e4
  });
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4", children: [
      /* @__PURE__ */ jsx(StatCard, { label: "Total Clients", value: summary.data?.totalClients ?? "—", icon: Users, tone: "primary" }),
      /* @__PURE__ */ jsx(StatCard, { label: "Active Clients", value: summary.data?.activeClients ?? "—", icon: UserCheck, tone: "success" }),
      /* @__PURE__ */ jsx(StatCard, { label: "Today's Brokerage", value: summary.data ? formatINR(summary.data.todayBrokerage) : "—", icon: CalendarDays }),
      /* @__PURE__ */ jsx(StatCard, { label: "This Month", value: summary.data ? formatINR(summary.data.monthBrokerage) : "—", icon: TrendingUp }),
      /* @__PURE__ */ jsx(StatCard, { label: "Total Brokerage", value: summary.data ? formatINR(summary.data.totalBrokerage) : "—", icon: IndianRupee, tone: "primary" })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { className: "flex flex-row items-center justify-between", children: /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Quick actions" }) }) }),
      /* @__PURE__ */ jsxs(CardContent, { className: "flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsx(Button, { asChild: true, children: /* @__PURE__ */ jsx(Link, { to: "/admin/upload-client-master", children: "Upload Client Master" }) }),
        /* @__PURE__ */ jsx(Button, { asChild: true, variant: "secondary", children: /* @__PURE__ */ jsx(Link, { to: "/admin/upload-brokerage", children: "Upload Brokerage" }) }),
        /* @__PURE__ */ jsx(Button, { asChild: true, variant: "outline", children: /* @__PURE__ */ jsx(Link, { to: "/admin/clients", children: "Manage Clients" }) }),
        /* @__PURE__ */ jsx(Button, { asChild: true, variant: "outline", children: /* @__PURE__ */ jsxs(Link, { to: "/admin/password-requests", children: [
          /* @__PURE__ */ jsx(KeyRound, { className: "h-4 w-4 mr-2" }),
          "Reset Requests ",
          summary.data ? `(${summary.data.pendingRequests})` : ""
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Recent brokerage" }) }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { children: "Date" }),
          /* @__PURE__ */ jsx(TableHead, { children: "ClientCode" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Name" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Segment" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Remark" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Brokerage" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: recent.data?.slice(0, 8).map((r) => /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { children: new Date(r.date).toLocaleDateString() }),
          /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs", children: r.clientCode }),
          /* @__PURE__ */ jsx(TableCell, { children: r.clientName }),
          /* @__PURE__ */ jsx(TableCell, { children: r.segment }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-muted-foreground text-xs", children: r.remark ?? "—" }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-right font-medium", children: formatINR(r.brokerage) })
        ] }, r.id)) })
      ] }) }) })
    ] })
  ] });
}
export {
  AdminDashboard as component
};
