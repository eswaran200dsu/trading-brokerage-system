import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getClientTeamTree } from "@/lib/api";
import { TreeView } from "@/components/TreeView";

export const Route = createFileRoute("/client/tree")({
  component: ClientTreePage,
});

function ClientTreePage() {
  const { data, isLoading } = useQuery({
    queryKey: ["client-team-tree"],
    queryFn: () => getClientTeamTree(),
    staleTime: 60_000,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Tree</CardTitle>
        <p className="text-xs text-muted-foreground mt-1">
          Your branch and downline members.
        </p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-sm text-muted-foreground">Loading…</div>
        ) : (
          <TreeView nodes={data ?? []} />
        )}
      </CardContent>
    </Card>
  );
}
