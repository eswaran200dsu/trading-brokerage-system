import { jsxs, jsx } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent, T as Table, g as TableHeader, h as TableRow, i as TableHead, j as TableBody, k as TableCell, l as Badge } from "./router-7vaADMHT.js";
import { h as getUploadHistory } from "./api-DVTefHqP.js";
import "@tanstack/react-router";
import "react";
import "sonner";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "lucide-react";
function UploadHistoryPage() {
  const {
    data
  } = useQuery({
    queryKey: ["uploads"],
    queryFn: getUploadHistory
  });
  return /* @__PURE__ */ jsxs(Card, { children: [
    /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Upload History" }) }),
    /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs(Table, { children: [
      /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableHead, { children: "Type" }),
        /* @__PURE__ */ jsx(TableHead, { children: "File" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Uploaded By" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Uploaded At" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Rows" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Status" })
      ] }) }),
      /* @__PURE__ */ jsx(TableBody, { children: data?.map((u) => /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableCell, { children: u.type }),
        /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs", children: u.fileName }),
        /* @__PURE__ */ jsx(TableCell, { children: u.uploadedBy }),
        /* @__PURE__ */ jsx(TableCell, { children: new Date(u.uploadedAt).toLocaleString() }),
        /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: u.rows }),
        /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: u.status === "Success" ? "default" : "destructive", children: u.status }) })
      ] }, u.id)) })
    ] }) }) })
  ] });
}
export {
  UploadHistoryPage as component
};
