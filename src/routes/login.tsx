import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Loader2 } from "lucide-react";
import { login } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — TradeDesk Brokerage" },
      { name: "description", content: "Sign in to the TradeDesk brokerage management system." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [clientCode, setClientCode] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(clientCode.trim(), password);
      setUser(user);
      toast.success(`Welcome, ${user.name}`);
      navigate({ to: user.role === "admin" ? "/admin" : "/client" });
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-primary text-primary-foreground">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-md bg-primary-foreground/10 grid place-items-center">
            <LineChart className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold">TradeDesk</span>
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl font-bold leading-tight">
            Trading Company Brokerage Management
          </h2>
          <p className="text-primary-foreground/80 max-w-md">
            Centralized brokerage tracking, branch trees, and client management for your trading desk.
          </p>
        </div>
        <div className="text-xs text-primary-foreground/60">
          Demo admin: <span className="font-mono">admin / Admin@123</span> · client{" "}
          <span className="font-mono">C1001 / 9876543210</span>
        </div>
      </div>

      <div className="flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Sign in to your account</CardTitle>
            <p className="text-sm text-muted-foreground">
              Use your ClientCode and password to continue.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">ClientCode / Username</Label>
                <Input
                  id="code"
                  autoFocus
                  value={clientCode}
                  onChange={(e) => setClientCode(e.target.value)}
                  placeholder="e.g. C1001 or ADMIN"
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="pwd">Password</Label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-primary hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <Input
                  id="pwd"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Sign in
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
