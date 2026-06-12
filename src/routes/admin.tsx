import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { RequireRole } from "@/components/RequireRole";

export const Route = createFileRoute("/admin")({
  component: () => (
    <RequireRole role="admin">
      <AppShell role="admin">
        <Outlet />
      </AppShell>
    </RequireRole>
  ),
});
