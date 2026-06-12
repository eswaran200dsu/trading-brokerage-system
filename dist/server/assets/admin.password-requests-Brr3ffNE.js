import { jsxs, jsx } from "react/jsx-runtime";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent, T as Table, g as TableHeader, h as TableRow, i as TableHead, j as TableBody, k as TableCell, l as Badge, B as Button } from "./router-7vaADMHT.js";
import { A as AlertDialog, a as AlertDialogTrigger, b as AlertDialogContent, c as AlertDialogHeader, d as AlertDialogTitle, e as AlertDialogDescription, f as AlertDialogFooter, g as AlertDialogCancel, h as AlertDialogAction } from "./alert-dialog-D4Zx5TqL.js";
import { k as getPasswordResetRequests, m as approvePasswordReset, n as rejectPasswordReset } from "./api-DVTefHqP.js";
import "@tanstack/react-router";
import "react";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "lucide-react";
import "@radix-ui/react-alert-dialog";
function PasswordRequestsPage() {
  const qc = useQueryClient();
  const {
    data
  } = useQuery({
    queryKey: ["reset-requests"],
    queryFn: getPasswordResetRequests
  });
  const refresh = () => qc.invalidateQueries({
    queryKey: ["reset-requests"]
  });
  return /* @__PURE__ */ jsxs(Card, { children: [
    /* @__PURE__ */ jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsx(CardTitle, { children: "Password Reset Requests" }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Approve to reset the client password to their registered mobile number." })
    ] }),
    /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs(Table, { children: [
      /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableHead, { children: "ClientCode" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Name" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Mobile" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Requested" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Reason" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Status" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Action" })
      ] }) }),
      /* @__PURE__ */ jsx(TableBody, { children: data?.map((r) => /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs", children: r.clientCode }),
        /* @__PURE__ */ jsx(TableCell, { children: r.name }),
        /* @__PURE__ */ jsx(TableCell, { children: r.mobile }),
        /* @__PURE__ */ jsx(TableCell, { children: new Date(r.requestedAt).toLocaleString() }),
        /* @__PURE__ */ jsx(TableCell, { className: "text-xs text-muted-foreground max-w-[180px] truncate", children: r.reason || "—" }),
        /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: r.status === "Approved" ? "default" : r.status === "Rejected" ? "destructive" : "secondary", children: r.status }) }),
        /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: r.status === "Pending" ? /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2", children: [
          /* @__PURE__ */ jsxs(AlertDialog, { children: [
            /* @__PURE__ */ jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { size: "sm", children: "Approve" }) }),
            /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
              /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
                /* @__PURE__ */ jsx(AlertDialogTitle, { children: "Approve reset?" }),
                /* @__PURE__ */ jsx(AlertDialogDescription, { children: "Reset this client password to registered mobile number?" })
              ] }),
              /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
                /* @__PURE__ */ jsx(AlertDialogCancel, { children: "Cancel" }),
                /* @__PURE__ */ jsx(AlertDialogAction, { onClick: async () => {
                  await approvePasswordReset(r.id);
                  toast.success("Password reset approved");
                  refresh();
                }, children: "Approve" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs(AlertDialog, { children: [
            /* @__PURE__ */ jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { size: "sm", variant: "outline", children: "Reject" }) }),
            /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
              /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
                /* @__PURE__ */ jsx(AlertDialogTitle, { children: "Reject request?" }),
                /* @__PURE__ */ jsx(AlertDialogDescription, { children: "This request will be marked rejected." })
              ] }),
              /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
                /* @__PURE__ */ jsx(AlertDialogCancel, { children: "Cancel" }),
                /* @__PURE__ */ jsx(AlertDialogAction, { onClick: async () => {
                  await rejectPasswordReset(r.id);
                  toast.success("Request rejected");
                  refresh();
                }, children: "Reject" })
              ] })
            ] })
          ] })
        ] }) : /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "—" }) })
      ] }, r.id)) })
    ] }) }) })
  ] });
}
export {
  PasswordRequestsPage as component
};
