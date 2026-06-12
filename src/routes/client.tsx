import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { RequireRole } from "@/components/RequireRole";

export const Route = createFileRoute("/client")({
  component: () => (
    <RequireRole role="client">
      <AppShell role="client">
        <Outlet />
      </AppShell>
    </RequireRole>
  ),
});
