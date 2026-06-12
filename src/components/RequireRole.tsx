import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";

export function RequireRole({ role, children }: { role: "admin" | "client"; children: React.ReactNode }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    if (user.role !== role) {
      navigate({ to: user.role === "admin" ? "/admin" : "/client" });
      return;
    }
    // mustChangePassword no longer forces redirect — Change Password is optional from sidebar
  }, [user, role, navigate]);

  if (!user || user.role !== role) return null;
  return <>{children}</>;
}
