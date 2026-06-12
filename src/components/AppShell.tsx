import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  Upload,
  FileSpreadsheet,
  History,
  KeyRound,
  GitBranch,
  LogOut,
  Menu,
  X,
  BarChart3,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

const adminNav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/clients", label: "Clients", icon: Users },
  { to: "/admin/upload-client-master", label: "Upload Client Master", icon: Upload },
  { to: "/admin/upload-brokerage", label: "Upload Brokerage", icon: FileSpreadsheet },
  { to: "/admin/brokerage-report", label: "Brokerage Report", icon: BarChart3 },
  { to: "/admin/upload-history", label: "Upload History", icon: History },
  { to: "/admin/password-requests", label: "Password Requests", icon: KeyRound },
  { to: "/admin/tree", label: "Tree / Branch", icon: GitBranch },
] as const;

const clientNav = [
  { to: "/client", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/client/profile", label: "My Profile", icon: Users },
  { to: "/client/brokerage-history", label: "Brokerage History", icon: BarChart3 },
  { to: "/client/team", label: "My Team", icon: Users },
  { to: "/client/tree", label: "Tree View", icon: GitBranch },
] as const;

export function AppShell({ role, children }: { role: "admin" | "client"; children: ReactNode }) {
  const items = role === "admin" ? adminNav : clientNav;
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");

  const onLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 flex items-center justify-between px-5 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-primary text-primary-foreground grid place-items-center font-bold">
              T
            </div>
            <div>
              <div className="text-sm font-semibold text-sidebar-foreground leading-tight">TradeDesk</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {role === "admin" ? "Admin Portal" : "Client Portal"}
              </div>
            </div>
          </div>
          <button className="lg:hidden text-sidebar-foreground" onClick={() => setOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="p-3 space-y-1">
          {items.map((it) => {
            const Active = isActive(it.to, (it as any).exact);
            const Icon = it.icon;
            return (
              <Link
                key={it.to}
                to={it.to}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  Active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{it.label}</span>
              </Link>
            );
          })}
          <Link
            to="/change-password"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <KeyRound className="h-4 w-4" />
            Change Password
          </Link>
        </nav>
      </aside>

      {open && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-background border-b flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-base font-semibold">
                {role === "admin" ? "Admin Console" : "Welcome back"}
              </h1>
              <p className="text-xs text-muted-foreground">
                {user?.name} · {user?.clientCode}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </header>
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
