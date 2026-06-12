import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useRouterState, useNavigate, Link } from "@tanstack/react-router";
import { X, LayoutDashboard, Users, Upload, FileSpreadsheet, BarChart3, History, KeyRound, GitBranch, Menu, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { u as useAuth, B as Button } from "./router-7vaADMHT.js";
const adminNav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/clients", label: "Clients", icon: Users },
  { to: "/admin/upload-client-master", label: "Upload Client Master", icon: Upload },
  { to: "/admin/upload-brokerage", label: "Upload Brokerage", icon: FileSpreadsheet },
  { to: "/admin/brokerage-report", label: "Brokerage Report", icon: BarChart3 },
  { to: "/admin/upload-history", label: "Upload History", icon: History },
  { to: "/admin/password-requests", label: "Password Requests", icon: KeyRound },
  { to: "/admin/tree", label: "Tree / Branch", icon: GitBranch }
];
const clientNav = [
  { to: "/client", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/client/profile", label: "My Profile", icon: Users },
  { to: "/client/brokerage-history", label: "Brokerage History", icon: BarChart3 },
  { to: "/client/team", label: "My Team", icon: Users },
  { to: "/client/tree", label: "Tree View", icon: GitBranch }
];
function AppShell({ role, children }) {
  const items = role === "admin" ? adminNav : clientNav;
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const isActive = (to, exact) => exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");
  const onLogout = () => {
    logout();
    navigate({ to: "/login" });
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-muted/30 flex", children: [
    /* @__PURE__ */ jsxs(
      "aside",
      {
        className: `fixed lg:static inset-y-0 left-0 z-40 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`,
        children: [
          /* @__PURE__ */ jsxs("div", { className: "h-16 flex items-center justify-between px-5 border-b border-sidebar-border", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("div", { className: "h-8 w-8 rounded-md bg-primary text-primary-foreground grid place-items-center font-bold", children: "T" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "text-sm font-semibold text-sidebar-foreground leading-tight", children: "TradeDesk" }),
                /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: role === "admin" ? "Admin Portal" : "Client Portal" })
              ] })
            ] }),
            /* @__PURE__ */ jsx("button", { className: "lg:hidden text-sidebar-foreground", onClick: () => setOpen(false), children: /* @__PURE__ */ jsx(X, { className: "h-5 w-5" }) })
          ] }),
          /* @__PURE__ */ jsxs("nav", { className: "p-3 space-y-1", children: [
            items.map((it) => {
              const Active = isActive(it.to, it.exact);
              const Icon = it.icon;
              return /* @__PURE__ */ jsxs(
                Link,
                {
                  to: it.to,
                  onClick: () => setOpen(false),
                  className: `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${Active ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}`,
                  children: [
                    /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4 shrink-0" }),
                    /* @__PURE__ */ jsx("span", { className: "truncate", children: it.label })
                  ]
                },
                it.to
              );
            }),
            /* @__PURE__ */ jsxs(
              Link,
              {
                to: "/change-password",
                onClick: () => setOpen(false),
                className: "flex items-center gap-3 px-3 py-2 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent",
                children: [
                  /* @__PURE__ */ jsx(KeyRound, { className: "h-4 w-4" }),
                  "Change Password"
                ]
              }
            )
          ] })
        ]
      }
    ),
    open && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/40 z-30 lg:hidden", onClick: () => setOpen(false) }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col min-w-0", children: [
      /* @__PURE__ */ jsxs("header", { className: "h-16 bg-background border-b flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("button", { className: "lg:hidden", onClick: () => setOpen(true), "aria-label": "Open menu", children: /* @__PURE__ */ jsx(Menu, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h1", { className: "text-base font-semibold", children: role === "admin" ? "Admin Console" : "Welcome back" }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
              user?.name,
              " · ",
              user?.clientCode
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", onClick: onLogout, children: [
          /* @__PURE__ */ jsx(LogOut, { className: "h-4 w-4 mr-2" }),
          "Logout"
        ] })
      ] }),
      /* @__PURE__ */ jsx("main", { className: "flex-1 p-4 lg:p-6", children })
    ] })
  ] });
}
function RequireRole({ role, children }) {
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
  }, [user, role, navigate]);
  if (!user || user.role !== role) return null;
  return /* @__PURE__ */ jsx(Fragment, { children });
}
export {
  AppShell as A,
  RequireRole as R
};
