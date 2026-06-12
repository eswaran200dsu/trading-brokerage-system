import { jsxs, jsx } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent, T as Table, g as TableHeader, h as TableRow, i as TableHead, j as TableBody, k as TableCell } from "./router-7vaADMHT.js";
import { a as getClientBrokerageHistory } from "./api-DVTefHqP.js";
import { f as formatINR } from "./StatCard-CryFg_Ph.js";
import "@tanstack/react-router";
import "react";
import "sonner";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "lucide-react";
function BrokerageHistoryPage() {
  const {
    data
  } = useQuery({
    queryKey: ["client-brokerage-history"],
    queryFn: () => getClientBrokerageHistory(),
    staleTime: 6e4
  });
  const total = (data ?? []).reduce((s, r) => s + r.brokerage, 0);
  return /* @__PURE__ */ jsxs(Card, { children: [
    /* @__PURE__ */ jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsx(CardTitle, { children: "Brokerage History" }),
      /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
        data?.length ?? 0,
        " rows · Total ",
        formatINR(total)
      ] })
    ] }),
    /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs(Table, { children: [
      /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableHead, { children: "Date" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Segment" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Remark" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Brokerage" })
      ] }) }),
      /* @__PURE__ */ jsxs(TableBody, { children: [
        (data ?? []).length === 0 && /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 4, className: "text-center py-6 text-muted-foreground", children: "No brokerage activity yet." }) }),
        data?.map((r) => /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { children: new Date(r.date).toLocaleDateString() }),
          /* @__PURE__ */ jsx(TableCell, { children: r.segment }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-muted-foreground text-xs", children: r.remark ?? "—" }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-right font-medium", children: formatINR(r.brokerage) })
        ] }, r.id))
      ] })
    ] }) }) })
  ] });
}
export {
  BrokerageHistoryPage as component
};
