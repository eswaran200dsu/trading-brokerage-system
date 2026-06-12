import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getClientTeamBrokerageSummary } from "@/lib/api";
import { formatINR } from "@/components/StatCard";

export const Route = createFileRoute("/client/team")({
  component: TeamPage,
});

function TeamPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["client-team-summary"],
    queryFn: () => getClientTeamBrokerageSummary(),
    staleTime: 60_000,
  });

  const grand = (data ?? []).reduce((s, r) => s + r.totalBrokerage, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Team</CardTitle>
        <p className="text-xs text-muted-foreground mt-1">
          {data?.length ?? 0} members · Total brokerage {formatINR(grand)}
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ClientCode</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Total Brokerage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                    Loading…
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && (data ?? []).length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                    No team members.
                  </TableCell>
                </TableRow>
              )}
              {data?.map((m) => (
                <TableRow key={m.clientCode}>
                  <TableCell className="font-mono text-xs">{m.clientCode}</TableCell>
                  <TableCell>{m.name}</TableCell>
                  <TableCell className="text-right font-medium">{formatINR(m.totalBrokerage)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
