import { jsx, jsxs } from "react/jsx-runtime";
import { ChevronDown, ChevronRight, User } from "lucide-react";
import { useState } from "react";
import { f as formatINR } from "./StatCard-CryFg_Ph.js";
import { l as Badge } from "./router-7vaADMHT.js";
function TreeView({ nodes }) {
  if (!nodes || nodes.length === 0)
    return /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground py-4 text-center", children: "No members in this tree." });
  return /* @__PURE__ */ jsx("ul", { className: "space-y-1", children: nodes.map((n) => /* @__PURE__ */ jsx(TreeItem, { node: n, depth: 0 }, n.clientCode)) });
}
function TreeItem({ node, depth }) {
  const [open, setOpen] = useState(depth < 2);
  const hasChildren = Array.isArray(node.children) && node.children.length > 0;
  return /* @__PURE__ */ jsxs("li", { children: [
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-muted/60 cursor-default",
        style: { paddingLeft: 8 + depth * 20 },
        children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => hasChildren && setOpen((o) => !o),
              className: "h-5 w-5 flex-shrink-0 grid place-items-center text-muted-foreground",
              "aria-label": open ? "Collapse" : "Expand",
              children: hasChildren ? open ? /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded-full bg-border block" })
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "h-7 w-7 flex-shrink-0 rounded-full bg-primary/10 text-primary grid place-items-center", children: /* @__PURE__ */ jsx(User, { className: "h-3.5 w-3.5" }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm font-medium truncate", children: node.name }),
              /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground font-mono", children: [
                "(",
                node.clientCode,
                ")"
              ] }),
              node.status && node.status !== "active" && /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-[10px] px-1 py-0 h-4", children: node.status })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground", children: [
              "Brokerage ",
              formatINR(node.brokerage ?? 0),
              hasChildren && /* @__PURE__ */ jsxs("span", { className: "ml-2 text-muted-foreground/70", children: [
                "· ",
                node.children.length,
                " direct",
                " ",
                node.children.length === 1 ? "member" : "members"
              ] })
            ] })
          ] })
        ]
      }
    ),
    hasChildren && open && /* @__PURE__ */ jsx("ul", { className: "space-y-1", children: node.children.map((c) => /* @__PURE__ */ jsx(TreeItem, { node: c, depth: depth + 1 }, c.clientCode)) })
  ] });
}
export {
  TreeView as T
};
