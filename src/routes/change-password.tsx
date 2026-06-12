import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react";
import { changePassword } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { evaluatePassword } from "@/lib/validation";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/change-password")({
  head: () => ({ meta: [{ title: "Change Password — TradeDesk" }] }),
  component: ChangePasswordPage,
});

function ChangePasswordPage() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [oldPwd, setOld] = useState("");
  const [newPwd, setNew] = useState("");
  const [confirmPwd, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState({ old: false, n: false, c: false });
  const [touched, setTouched] = useState({ old: false, n: false, c: false });
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) navigate({ to: "/login" });
  }, [user, navigate]);

  const strength = useMemo(
    () => evaluatePassword(newPwd, { mobile: user?.mobile }),
    [newPwd, user?.mobile],
  );

  if (!user) return null;

  const errors = {
    old: touched.old && !oldPwd ? "Current password is required" : "",
    n:
      touched.n && newPwd && strength.errors.length
        ? strength.errors[0]
        : touched.n && !newPwd
        ? "New password is required"
        : "",
    c:
      touched.c && confirmPwd !== newPwd ? "Passwords do not match" : "",
    same:
      touched.n && oldPwd && newPwd && oldPwd === newPwd
        ? "New password must differ from current password"
        : "",
  };

  const formValid =
    oldPwd && newPwd && confirmPwd && !strength.errors.length && newPwd === confirmPwd && oldPwd !== newPwd;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ old: true, n: true, c: true });
    setApiError(null);
    if (!formValid) return;
    setLoading(true);
    try {
      await changePassword(oldPwd, newPwd);
      toast.success("Password updated successfully");
      setUser({ ...user, mustChangePassword: false });
      navigate({ to: user.role === "admin" ? "/admin" : "/client" });
    } catch (err) {
      const msg = (err as Error).message || "Failed to update password. Please try again.";
      setApiError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const meterColors = ["bg-destructive", "bg-destructive", "bg-amber-500", "bg-yellow-500", "bg-emerald-500"];

  return (
    <div className="min-h-screen grid place-items-center bg-muted/40 p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{user.mustChangePassword ? "Set a new password" : "Change password"}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {user.mustChangePassword
              ? "You're using the default password. Please set a stronger one to continue."
              : "Enter your current password and choose a new one."}
          </p>
        </CardHeader>
        <CardContent>
          {apiError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{apiError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={onSubmit} noValidate className="space-y-4">
            <PasswordField
              label="Current Password"
              value={oldPwd}
              show={show.old}
              onToggle={() => setShow((s) => ({ ...s, old: !s.old }))}
              onChange={(v) => setOld(v)}
              onBlur={() => setTouched((t) => ({ ...t, old: true }))}
              error={errors.old}
            />

            <div>
              <PasswordField
                label="New Password"
                value={newPwd}
                show={show.n}
                onToggle={() => setShow((s) => ({ ...s, n: !s.n }))}
                onChange={(v) => setNew(v)}
                onBlur={() => setTouched((t) => ({ ...t, n: true }))}
                error={errors.n || errors.same}
              />
              {newPwd && (
                <div className="mt-2 space-y-2">
                  <div className="flex gap-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={cn(
                          "h-1 flex-1 rounded-full",
                          i < strength.score ? meterColors[strength.score] : "bg-muted",
                        )}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Strength: <span className="font-medium">{strength.label}</span>
                  </p>
                  <ul className="text-xs space-y-1">
                    {["At least 8 characters", "One uppercase letter", "One lowercase letter", "One number", "One symbol"].map(
                      (req) => {
                        const passed = !strength.errors.includes(req);
                        return (
                          <li
                            key={req}
                            className={cn(
                              "flex items-center gap-1.5",
                              passed ? "text-emerald-600" : "text-muted-foreground",
                            )}
                          >
                            {passed ? (
                              <CheckCircle2 className="h-3 w-3" />
                            ) : (
                              <AlertCircle className="h-3 w-3" />
                            )}
                            {req}
                          </li>
                        );
                      },
                    )}
                  </ul>
                </div>
              )}
            </div>

            <PasswordField
              label="Confirm New Password"
              value={confirmPwd}
              show={show.c}
              onToggle={() => setShow((s) => ({ ...s, c: !s.c }))}
              onChange={(v) => setConfirm(v)}
              onBlur={() => setTouched((t) => ({ ...t, c: true }))}
              error={errors.c}
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function PasswordField({
  label,
  value,
  show,
  onToggle,
  onChange,
  onBlur,
  error,
}: {
  label: string;
  value: string;
  show: boolean;
  onToggle: () => void;
  onChange: (v: string) => void;
  onBlur: () => void;
  error?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="relative">
        <Input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          aria-invalid={!!error}
          className={cn(error && "border-destructive focus-visible:ring-destructive", "pr-9")}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          tabIndex={-1}
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
