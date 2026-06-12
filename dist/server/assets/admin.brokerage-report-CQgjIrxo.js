import { jsxs, jsx } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { C as Card, a as CardHeader, b as CardTitle, I as Input, B as Button, c as CardContent, T as Table, g as TableHeader, h as TableRow, i as TableHead, j as TableBody, k as TableCell } from "./router-7vaADMHT.js";
import { Search, Download } from "lucide-react";
import { d as getBrokerageHistory } from "./api-DVTefHqP.js";
import { f as formatINR } from "./StatCard-CryFg_Ph.js";
import "@tanstack/react-router";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
function BrokerageReportPage() {
  const [q, setQ] = useState("");
  const {
    data
  } = useQuery({
    queryKey: ["brokerage", "all"],
    queryFn: () => getBrokerageHistory()
  });
  const rows = useMemo(() => {
    if (!data) return [];
    if (!q) return data;
    const s = q.toLowerCase();
    return data.filter((r) => r.clientCode.toLowerCase().includes(s) || r.clientName.toLowerCase().includes(s) || r.segment.toLowerCase().includes(s));
  }, [data, q]);
  const total = rows.reduce((s, r) => s + r.brokerage, 0);
  const downloadCSV = () => {
    const header = ["Date", "ClientCode", "ClientName", "Segment", "Brokerage", "Remark"];
    const body = rows.map((r) => [new Date(r.date).toISOString().slice(0, 10), r.clientCode, r.clientName, r.segment, r.brokerage, r.remark ?? ""]);
    const csv = [header, ...body].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], {
      type: "text/csv"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `brokerage-report-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV downloaded");
  };
  return /* @__PURE__ */ jsxs(Card, { children: [
    /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(CardTitle, { children: "Brokerage Report" }),
        /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
          rows.length,
          " rows · Total ",
          formatINR(total)
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(Search, { className: "absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ jsx(Input, { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Filter...", className: "pl-8 w-56" })
        ] }),
        /* @__PURE__ */ jsxs(Button, { onClick: downloadCSV, variant: "outline", children: [
          /* @__PURE__ */ jsx(Download, { className: "h-4 w-4 mr-2" }),
          "Download CSV"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs(Table, { children: [
      /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableHead, { children: "Date" }),
        /* @__PURE__ */ jsx(TableHead, { children: "ClientCode" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Client" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Segment" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Remark" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Brokerage" })
      ] }) }),
      /* @__PURE__ */ jsx(TableBody, { children: rows.map((r) => /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableCell, { children: new Date(r.date).toLocaleDateString() }),
        /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs", children: r.clientCode }),
        /* @__PURE__ */ jsx(TableCell, { children: r.clientName }),
        /* @__PURE__ */ jsx(TableCell, { children: r.segment }),
        /* @__PURE__ */ jsx(TableCell, { className: "text-muted-foreground text-xs", children: r.remark ?? "—" }),
        /* @__PURE__ */ jsx(TableCell, { className: "text-right font-medium", children: formatINR(r.brokerage) })
      ] }, r.id)) })
    ] }) }) })
  ] });
}
export {
  BrokerageReportPage as component
};
