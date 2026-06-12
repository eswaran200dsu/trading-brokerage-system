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
import { getClientBrokerageHistory } from "@/lib/api";
import { formatINR } from "@/components/StatCard";

export const Route = createFileRoute("/client/brokerage-history")({
  component: BrokerageHistoryPage,
});

function BrokerageHistoryPage() {
  const { data } = useQuery({
    queryKey: ["client-brokerage-history"],
    queryFn: () => getClientBrokerageHistory(),
    staleTime: 60_000,
  });
  const total = (data ?? []).reduce((s, r) => s + r.brokerage, 0);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Brokerage History</CardTitle>
        <p className="text-xs text-muted-foreground mt-1">
          {data?.length ?? 0} rows · Total {formatINR(total)}
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Segment</TableHead>
                <TableHead>Remark</TableHead>
                <TableHead className="text-right">Brokerage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(data ?? []).length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                    No brokerage activity yet.
                  </TableCell>
                </TableRow>
              )}
              {data?.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{new Date(r.date).toLocaleDateString()}</TableCell>
                  <TableCell>{r.segment}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{r.remark ?? "—"}</TableCell>
                  <TableCell className="text-right font-medium">{formatINR(r.brokerage)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
