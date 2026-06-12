import { jsxs, jsx } from "react/jsx-runtime";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import * as React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { d as cn, C as Card, a as CardHeader, b as CardTitle, I as Input, c as CardContent, T as Table, g as TableHeader, h as TableRow, i as TableHead, j as TableBody, k as TableCell, l as Badge, B as Button, v as validateClient } from "./router-7vaADMHT.js";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, Search, Plus, Loader2, Pencil, KeyRound, Trash2 } from "lucide-react";
import { A as AlertDialog, a as AlertDialogTrigger, b as AlertDialogContent, c as AlertDialogHeader, d as AlertDialogTitle, e as AlertDialogDescription, f as AlertDialogFooter, g as AlertDialogCancel, h as AlertDialogAction } from "./alert-dialog-D4Zx5TqL.js";
import { L as Label } from "./label-mJwpTZxJ.js";
import { o as getClients, p as addClient, q as updateClient, s as resetClientPassword, t as deactivateClient } from "./api-DVTefHqP.js";
import "@tanstack/react-router";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-alert-dialog";
import "@radix-ui/react-label";
const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Overlay,
  {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DialogPortal, { children: [
  /* @__PURE__ */ jsx(DialogOverlay, {}),
  /* @__PURE__ */ jsxs(
    DialogPrimitive.Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxs(DialogPrimitive.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
          /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
DialogContent.displayName = DialogPrimitive.Content.displayName;
const DialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsx("div", { className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className), ...props });
DialogHeader.displayName = "DialogHeader";
const DialogFooter = ({ className, ...props }) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
    ...props
  }
);
DialogFooter.displayName = "DialogFooter";
const DialogTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Title,
  {
    ref,
    className: cn("text-lg font-semibold leading-none tracking-tight", className),
    ...props
  }
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;
const DialogDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;
function ClientsPage() {
  const [search, setSearch] = useState("");
  const qc = useQueryClient();
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["clients", search],
    queryFn: () => getClients(search)
  });
  const refresh = () => qc.invalidateQueries({
    queryKey: ["clients"]
  });
  return /* @__PURE__ */ jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsxs(Card, { children: [
    /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "All Clients" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Search by ClientCode, name, PAN, or mobile." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(Search, { className: "absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ jsx(Input, { value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Search...", className: "pl-8 w-64" })
        ] }),
        /* @__PURE__ */ jsx(AddClientDialog, { onCreated: refresh })
      ] })
    ] }),
    /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs(Table, { children: [
      /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableHead, { children: "ClientCode" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Name" }),
        /* @__PURE__ */ jsx(TableHead, { children: "PAN" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Mobile" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Branch" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Parent" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Status" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxs(TableBody, { children: [
        isLoading && /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 8, className: "text-center py-8 text-muted-foreground", children: "Loading clients…" }) }),
        !isLoading && data?.length === 0 && /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 8, className: "text-center py-8 text-muted-foreground", children: "No clients found." }) }),
        data?.map((c) => /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs", children: c.clientCode }),
          /* @__PURE__ */ jsx(TableCell, { children: c.name }),
          /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs", children: c.pan }),
          /* @__PURE__ */ jsx(TableCell, { children: c.mobile }),
          /* @__PURE__ */ jsx(TableCell, { children: c.branch }),
          /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs", children: c.parentCode ?? "—" }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: c.active ? "default" : "secondary", children: c.active ? "Active" : "Inactive" }) }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsx(ClientRowActions, { client: c, onChange: refresh }) })
        ] }, c.id))
      ] })
    ] }) }) })
  ] }) });
}
const EMPTY = {
  clientCode: "",
  name: "",
  pan: "",
  mobile: "",
  email: "",
  branch: "",
  parentCode: ""
};
function FormField({
  label,
  value,
  onChange,
  error,
  placeholder,
  className,
  required
}) {
  return /* @__PURE__ */ jsxs("div", { className, children: [
    /* @__PURE__ */ jsxs(Label, { className: "mb-1 block", children: [
      label,
      " ",
      required && /* @__PURE__ */ jsx("span", { className: "text-destructive", children: "*" })
    ] }),
    /* @__PURE__ */ jsx(Input, { value, onChange: (e) => onChange(e.target.value), placeholder, "aria-invalid": !!error, className: cn(error && "border-destructive focus-visible:ring-destructive") }),
    error && /* @__PURE__ */ jsx("p", { className: "text-xs text-destructive mt-1", children: error })
  ] });
}
function AddClientDialog({
  onCreated
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const update = (k, v) => {
    const next = {
      ...form,
      [k]: v
    };
    setForm(next);
    if (errors[k]) setErrors(validateClient(next));
  };
  const submit = async (e) => {
    e.preventDefault();
    const errs = validateClient(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSubmitting(true);
    try {
      await addClient({
        clientCode: form.clientCode.trim().toUpperCase(),
        name: form.name.trim(),
        pan: form.pan.trim().toUpperCase(),
        mobile: form.mobile.trim(),
        email: form.email.trim(),
        branch: form.branch.trim(),
        parentCode: form.parentCode?.trim() ? form.parentCode.trim().toUpperCase() : null
      });
      toast.success(`Client ${form.clientCode.toUpperCase()} created`);
      setOpen(false);
      setForm(EMPTY);
      setErrors({});
      onCreated();
    } catch (err) {
      toast.error(err.message || "Failed to add client");
    } finally {
      setSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsxs(Dialog, { open, onOpenChange: (o) => {
    setOpen(o);
    if (!o) {
      setForm(EMPTY);
      setErrors({});
    }
  }, children: [
    /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { children: [
      /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4 mr-2" }),
      "Add Client"
    ] }) }),
    /* @__PURE__ */ jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Add new client" }) }),
      /* @__PURE__ */ jsxs("form", { onSubmit: submit, noValidate: true, className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsx(FormField, { label: "ClientCode", value: form.clientCode, onChange: (v) => update("clientCode", v), error: errors.clientCode, required: true, placeholder: "C1234" }),
        /* @__PURE__ */ jsx(FormField, { label: "Name", value: form.name, onChange: (v) => update("name", v), error: errors.name, required: true }),
        /* @__PURE__ */ jsx(FormField, { label: "PAN", value: form.pan, onChange: (v) => update("pan", v), error: errors.pan, required: true, placeholder: "ABCDE1234F" }),
        /* @__PURE__ */ jsx(FormField, { label: "Mobile", value: form.mobile, onChange: (v) => update("mobile", v), error: errors.mobile, required: true, placeholder: "9876543210" }),
        /* @__PURE__ */ jsx(FormField, { label: "Email", value: form.email, onChange: (v) => update("email", v), error: errors.email, placeholder: "name@example.com" }),
        /* @__PURE__ */ jsx(FormField, { label: "Branch", value: form.branch, onChange: (v) => update("branch", v), error: errors.branch, required: true }),
        /* @__PURE__ */ jsx(FormField, { label: "Parent ClientCode (optional)", value: form.parentCode ?? "", onChange: (v) => update("parentCode", v), error: errors.parentCode, className: "col-span-2" }),
        /* @__PURE__ */ jsxs(DialogFooter, { className: "col-span-2", children: [
          /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", onClick: () => setOpen(false), children: "Cancel" }),
          /* @__PURE__ */ jsxs(Button, { type: "submit", disabled: submitting, children: [
            submitting && /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 mr-2 animate-spin" }),
            "Create"
          ] })
        ] })
      ] })
    ] })
  ] });
}
function ClientRowActions({
  client,
  onChange
}) {
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({
    clientCode: client.clientCode,
    name: client.name,
    pan: client.pan,
    mobile: client.mobile,
    email: client.email,
    branch: client.branch,
    parentCode: client.parentCode ?? ""
  });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(null);
  const update = (k, v) => {
    const next = {
      ...form,
      [k]: v
    };
    setForm(next);
    if (errors[k]) setErrors(validateClient(next));
  };
  const saveEdit = async (e) => {
    e.preventDefault();
    const errs = validateClient(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setBusy("edit");
    try {
      await updateClient(client.id, {
        name: form.name.trim(),
        pan: form.pan.trim().toUpperCase(),
        mobile: form.mobile.trim(),
        email: form.email.trim(),
        branch: form.branch.trim(),
        parentCode: form.parentCode?.trim() ? form.parentCode.trim().toUpperCase() : null
      });
      toast.success(`Updated ${client.clientCode}`);
      setEditOpen(false);
      onChange();
    } catch (err) {
      toast.error(err.message || "Failed to update client");
    } finally {
      setBusy(null);
    }
  };
  const doReset = async () => {
    setBusy("reset");
    try {
      await resetClientPassword(client.clientCode);
      toast.success(`Password reset for ${client.clientCode}. New password is mobile number.`);
    } catch (err) {
      toast.error(err.message || "Failed to reset password");
    } finally {
      setBusy(null);
    }
  };
  const doDeactivate = async () => {
    setBusy("deactivate");
    try {
      await deactivateClient(client.id);
      toast.success(`${client.name} deactivated`);
      onChange();
    } catch (err) {
      toast.error(err.message || "Failed to deactivate client");
    } finally {
      setBusy(null);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-1", children: [
    /* @__PURE__ */ jsxs(Dialog, { open: editOpen, onOpenChange: (o) => {
      setEditOpen(o);
      if (!o) setErrors({});
    }, children: [
      /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { size: "icon", variant: "ghost", title: "Edit client", children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }) }) }),
      /* @__PURE__ */ jsxs(DialogContent, { children: [
        /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsxs(DialogTitle, { children: [
          "Edit client — ",
          client.clientCode
        ] }) }),
        /* @__PURE__ */ jsxs("form", { onSubmit: saveEdit, noValidate: true, className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsx(FormField, { label: "Name", value: form.name, onChange: (v) => update("name", v), error: errors.name, required: true }),
          /* @__PURE__ */ jsx(FormField, { label: "PAN", value: form.pan, onChange: (v) => update("pan", v), error: errors.pan, required: true }),
          /* @__PURE__ */ jsx(FormField, { label: "Mobile", value: form.mobile, onChange: (v) => update("mobile", v), error: errors.mobile, required: true }),
          /* @__PURE__ */ jsx(FormField, { label: "Email", value: form.email, onChange: (v) => update("email", v), error: errors.email }),
          /* @__PURE__ */ jsx(FormField, { label: "Branch", value: form.branch, onChange: (v) => update("branch", v), error: errors.branch, required: true }),
          /* @__PURE__ */ jsx(FormField, { label: "Parent ClientCode", value: form.parentCode ?? "", onChange: (v) => update("parentCode", v), error: errors.parentCode }),
          /* @__PURE__ */ jsxs(DialogFooter, { className: "col-span-2", children: [
            /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", onClick: () => setEditOpen(false), children: "Cancel" }),
            /* @__PURE__ */ jsxs(Button, { type: "submit", disabled: busy === "edit", children: [
              busy === "edit" && /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 mr-2 animate-spin" }),
              "Save changes"
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(AlertDialog, { children: [
      /* @__PURE__ */ jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { size: "icon", variant: "ghost", title: "Reset password", children: /* @__PURE__ */ jsx(KeyRound, { className: "h-4 w-4" }) }) }),
      /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
        /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
          /* @__PURE__ */ jsx(AlertDialogTitle, { children: "Reset password?" }),
          /* @__PURE__ */ jsxs(AlertDialogDescription, { children: [
            "The password for ",
            /* @__PURE__ */ jsx("span", { className: "font-medium", children: client.name }),
            " (",
            client.clientCode,
            ") will be reset to their registered mobile number",
            " ",
            /* @__PURE__ */ jsx("span", { className: "font-mono", children: client.mobile }),
            ". They will be forced to set a new password on next login."
          ] })
        ] }),
        /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
          /* @__PURE__ */ jsx(AlertDialogCancel, { children: "Cancel" }),
          /* @__PURE__ */ jsxs(AlertDialogAction, { onClick: doReset, disabled: busy === "reset", children: [
            busy === "reset" && /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 mr-2 animate-spin" }),
            "Reset password"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(AlertDialog, { children: [
      /* @__PURE__ */ jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { size: "icon", variant: "ghost", title: "Deactivate client", disabled: !client.active, children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }) }) }),
      /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
        /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
          /* @__PURE__ */ jsx(AlertDialogTitle, { children: "Deactivate this client?" }),
          /* @__PURE__ */ jsxs(AlertDialogDescription, { children: [
            /* @__PURE__ */ jsx("span", { className: "font-medium", children: client.name }),
            " (",
            client.clientCode,
            ") will be marked inactive and unable to log in. You can reactivate them later by editing the record."
          ] })
        ] }),
        /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
          /* @__PURE__ */ jsx(AlertDialogCancel, { children: "Cancel" }),
          /* @__PURE__ */ jsxs(AlertDialogAction, { onClick: doDeactivate, disabled: busy === "deactivate", className: "bg-destructive text-destructive-foreground hover:bg-destructive/90", children: [
            busy === "deactivate" && /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 mr-2 animate-spin" }),
            "Deactivate"
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  ClientsPage as component
};
