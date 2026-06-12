import { ChevronDown, ChevronRight, User } from "lucide-react";
import { useState } from "react";
import type { TreeNode } from "@/lib/api";
import { formatINR } from "./StatCard";
import { Badge } from "@/components/ui/badge";

export function TreeView({ nodes }: { nodes: TreeNode[] }) {
  if (!nodes || nodes.length === 0)
    return (
      <div className="text-sm text-muted-foreground py-4 text-center">
        No members in this tree.
      </div>
    );
  return (
    <ul className="space-y-1">
      {nodes.map((n) => (
        <TreeItem key={n.clientCode} node={n} depth={0} />
      ))}
    </ul>
  );
}

function TreeItem({ node, depth }: { node: TreeNode; depth: number }) {
  const [open, setOpen] = useState(depth < 2);
  const hasChildren = Array.isArray(node.children) && node.children.length > 0;

  return (
    <li>
      <div
        className="flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-muted/60 cursor-default"
        style={{ paddingLeft: 8 + depth * 20 }}
      >
        {/* Expand / collapse toggle */}
        <button
          onClick={() => hasChildren && setOpen((o) => !o)}
          className="h-5 w-5 flex-shrink-0 grid place-items-center text-muted-foreground"
          aria-label={open ? "Collapse" : "Expand"}
        >
          {hasChildren ? (
            open ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )
          ) : (
            <span className="h-2 w-2 rounded-full bg-border block" />
          )}
        </button>

        {/* Avatar */}
        <div className="h-7 w-7 flex-shrink-0 rounded-full bg-primary/10 text-primary grid place-items-center">
          <User className="h-3.5 w-3.5" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium truncate">{node.name}</span>
            <span className="text-xs text-muted-foreground font-mono">({node.clientCode})</span>
            {node.status && node.status !== "active" && (
              <Badge variant="secondary" className="text-[10px] px-1 py-0 h-4">
                {node.status}
              </Badge>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            Brokerage {formatINR(node.brokerage ?? 0)}
            {hasChildren && (
              <span className="ml-2 text-muted-foreground/70">
                · {node.children.length} direct{" "}
                {node.children.length === 1 ? "member" : "members"}
              </span>
            )}
          </div>
        </div>
      </div>

      {hasChildren && open && (
        <ul className="space-y-1">
          {node.children.map((c) => (
            <TreeItem key={c.clientCode} node={c} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}
