import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getTeamTree } from "@/lib/api";
import { TreeView } from "@/components/TreeView";

export const Route = createFileRoute("/admin/tree")({
  component: AdminTreePage,
});

function AdminTreePage() {
  const qc = useQueryClient();
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["admin-tree", "all"],
    queryFn: () => getTeamTree(),
    staleTime: 30_000,
  });

  const totalNodes = countNodes(data ?? []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>Branch / Tree View</CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Full client hierarchy.{" "}
            {!isLoading && (
              <span>
                {(data ?? []).length} root{(data ?? []).length !== 1 ? "s" : ""},{" "}
                {totalNodes} total{" "}
                {totalNodes === 1 ? "member" : "members"}.
              </span>
            )}
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => qc.invalidateQueries({ queryKey: ["admin-tree"] })}
          disabled={isFetching}
        >
          <RefreshCw className={`h-3.5 w-3.5 mr-1 ${isFetching ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-sm text-muted-foreground py-6 text-center">Loading tree…</div>
        ) : (
          <TreeView nodes={data ?? []} />
        )}
      </CardContent>
    </Card>
  );
}

function countNodes(nodes: { children?: any[] }[]): number {
  return nodes.reduce((sum, n) => sum + 1 + countNodes(n.children ?? []), 0);
}
