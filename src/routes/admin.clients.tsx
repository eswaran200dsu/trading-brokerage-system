import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Plus, Search, KeyRound, Trash2, Pencil, Loader2 } from "lucide-react";
import {
  addClient,
  deactivateClient,
  getClients,
  resetClientPassword,
  updateClient,
  type Client,
} from "@/lib/api";
import { validateClient, type ClientFormInput, type FieldErrors } from "@/lib/validation";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/clients")({
  component: ClientsPage,
});

function ClientsPage() {
  const [search, setSearch] = useState("");
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["clients", search],
    queryFn: () => getClients(search),
  });

  const refresh = () => qc.invalidateQueries({ queryKey: ["clients"] });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
          <div>
            <CardTitle className="text-base">All Clients</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Search by ClientCode, name, PAN, or mobile.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="pl-8 w-64"
              />
            </div>
            <AddClientDialog onCreated={refresh} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ClientCode</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>PAN</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Parent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      Loading clients…
                    </TableCell>
                  </TableRow>
                )}
                {!isLoading && data?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No clients found.
                    </TableCell>
                  </TableRow>
                )}
                {data?.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-mono text-xs">{c.clientCode}</TableCell>
                    <TableCell>{c.name}</TableCell>
                    <TableCell className="font-mono text-xs">{c.pan}</TableCell>
                    <TableCell>{c.mobile}</TableCell>
                    <TableCell>{c.branch}</TableCell>
                    <TableCell className="font-mono text-xs">{c.parentCode ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant={c.active ? "default" : "secondary"}>
                        {c.active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <ClientRowActions client={c} onChange={refresh} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const EMPTY: ClientFormInput = {
  clientCode: "",
  name: "",
  pan: "",
  mobile: "",
  email: "",
  branch: "",
  parentCode: "",
};

function FormField({
  label,
  value,
  onChange,
  error,
  placeholder,
  className,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
}) {
  return (
    <div className={className}>
      <Label className="mb-1 block">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-invalid={!!error}
        className={cn(error && "border-destructive focus-visible:ring-destructive")}
      />
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}

function AddClientDialog({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<ClientFormInput>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors<ClientFormInput>>({});
  const [submitting, setSubmitting] = useState(false);

  const update = (k: keyof ClientFormInput, v: string) => {
    const next = { ...form, [k]: v };
    setForm(next);
    if (errors[k]) setErrors(validateClient(next));
  };

  const submit = async (e: React.FormEvent) => {
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
        parentCode: form.parentCode?.trim() ? form.parentCode.trim().toUpperCase() : null,
      });
      toast.success(`Client ${form.clientCode.toUpperCase()} created`);
      setOpen(false);
      setForm(EMPTY);
      setErrors({});
      onCreated();
    } catch (err) {
      toast.error((err as Error).message || "Failed to add client");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) {
          setForm(EMPTY);
          setErrors({});
        }
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Client
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new client</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} noValidate className="grid grid-cols-2 gap-3">
          <FormField label="ClientCode" value={form.clientCode} onChange={(v) => update("clientCode", v)} error={errors.clientCode} required placeholder="C1234" />
          <FormField label="Name" value={form.name} onChange={(v) => update("name", v)} error={errors.name} required />
          <FormField label="PAN" value={form.pan} onChange={(v) => update("pan", v)} error={errors.pan} required placeholder="ABCDE1234F" />
          <FormField label="Mobile" value={form.mobile} onChange={(v) => update("mobile", v)} error={errors.mobile} required placeholder="9876543210" />
          <FormField label="Email" value={form.email} onChange={(v) => update("email", v)} error={errors.email} placeholder="name@example.com" />
          <FormField label="Branch" value={form.branch} onChange={(v) => update("branch", v)} error={errors.branch} required />
          <FormField label="Parent ClientCode (optional)" value={form.parentCode ?? ""} onChange={(v) => update("parentCode", v)} error={errors.parentCode} className="col-span-2" />
          <DialogFooter className="col-span-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ClientRowActions({ client, onChange }: { client: Client; onChange: () => void }) {
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState<ClientFormInput>({
    clientCode: client.clientCode,
    name: client.name,
    pan: client.pan,
    mobile: client.mobile,
    email: client.email,
    branch: client.branch,
    parentCode: client.parentCode ?? "",
  });
  const [errors, setErrors] = useState<FieldErrors<ClientFormInput>>({});
  const [busy, setBusy] = useState<"edit" | "reset" | "deactivate" | null>(null);

  const update = (k: keyof ClientFormInput, v: string) => {
    const next = { ...form, [k]: v };
    setForm(next);
    if (errors[k]) setErrors(validateClient(next));
  };

  const saveEdit = async (e: React.FormEvent) => {
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
        parentCode: form.parentCode?.trim() ? form.parentCode.trim().toUpperCase() : null,
      });
      toast.success(`Updated ${client.clientCode}`);
      setEditOpen(false);
      onChange();
    } catch (err) {
      toast.error((err as Error).message || "Failed to update client");
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
      toast.error((err as Error).message || "Failed to reset password");
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
      toast.error((err as Error).message || "Failed to deactivate client");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="flex items-center justify-end gap-1">
      <Dialog
        open={editOpen}
        onOpenChange={(o) => {
          setEditOpen(o);
          if (!o) setErrors({});
        }}
      >
        <DialogTrigger asChild>
          <Button size="icon" variant="ghost" title="Edit client">
            <Pencil className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit client — {client.clientCode}</DialogTitle>
          </DialogHeader>
          <form onSubmit={saveEdit} noValidate className="grid grid-cols-2 gap-3">
            <FormField label="Name" value={form.name} onChange={(v) => update("name", v)} error={errors.name} required />
            <FormField label="PAN" value={form.pan} onChange={(v) => update("pan", v)} error={errors.pan} required />
            <FormField label="Mobile" value={form.mobile} onChange={(v) => update("mobile", v)} error={errors.mobile} required />
            <FormField label="Email" value={form.email} onChange={(v) => update("email", v)} error={errors.email} />
            <FormField label="Branch" value={form.branch} onChange={(v) => update("branch", v)} error={errors.branch} required />
            <FormField label="Parent ClientCode" value={form.parentCode ?? ""} onChange={(v) => update("parentCode", v)} error={errors.parentCode} />
            <DialogFooter className="col-span-2">
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={busy === "edit"}>
                {busy === "edit" && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button size="icon" variant="ghost" title="Reset password">
            <KeyRound className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset password?</AlertDialogTitle>
            <AlertDialogDescription>
              The password for <span className="font-medium">{client.name}</span> ({client.clientCode})
              will be reset to their registered mobile number{" "}
              <span className="font-mono">{client.mobile}</span>. They will be forced to set a new
              password on next login.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={doReset} disabled={busy === "reset"}>
              {busy === "reset" && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Reset password
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button size="icon" variant="ghost" title="Deactivate client" disabled={!client.active}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate this client?</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-medium">{client.name}</span> ({client.clientCode}) will be marked
              inactive and unable to log in. You can reactivate them later by editing the record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={doDeactivate}
              disabled={busy === "deactivate"}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {busy === "deactivate" && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
