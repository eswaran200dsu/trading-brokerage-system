import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { requestPasswordReset } from "@/lib/api";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Forgot Password — TradeDesk" }] }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [clientCode, setClientCode] = useState("");
  const [mobile, setMobile] = useState("");
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(mobile)) {
      toast.error("Enter a valid 10-digit mobile number");
      return;
    }
    setLoading(true);
    try {
      await requestPasswordReset({ clientCode: clientCode.trim(), mobile, reason });
      setSubmitted(true);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-muted/40 p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset your password</CardTitle>
          <p className="text-sm text-muted-foreground">
            Submit a request and an admin will reset your password.
          </p>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="space-y-4 text-center py-6">
              <CheckCircle2 className="h-12 w-12 mx-auto text-green-600" />
              <p className="text-sm">
                Your password reset request has been sent to admin. Please wait for admin approval.
              </p>
              <Button className="w-full" onClick={() => navigate({ to: "/login" })}>
                Back to Login
              </Button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cc">ClientCode</Label>
                <Input id="cc" value={clientCode} onChange={(e) => setClientCode(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mob">Registered Mobile Number</Label>
                <Input
                  id="mob"
                  inputMode="numeric"
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Message / Reason (optional)</Label>
                <Textarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)} rows={3} />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Request Password Reset
              </Button>
              <Link
                to="/login"
                className="flex items-center justify-center text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to login
              </Link>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
