import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, TrendingUp, IndianRupee, Users } from "lucide-react";
import { StatCard, formatINR } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getClientDashboardSummary, getClientBrokerageHistory } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/client/")({
  component: ClientDashboard,
});

function ClientDashboard() {
  const { user } = useAuth();
  const code = user!.clientCode;

  const summary = useQuery({
    queryKey: ["client-summary", code],
    queryFn: () => getClientDashboardSummary(code),
    staleTime: 60_000,   // treat data fresh for 60 s — no redundant refetches
  });
  const history = useQuery({
    queryKey: ["client-brokerage-history"],
    queryFn: () => getClientBrokerageHistory(),
    staleTime: 60_000,
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Today's Brokerage"
          value={summary.data ? formatINR(summary.data.todayBrokerage) : "—"}
          icon={CalendarDays}
          tone="primary"
        />
        <StatCard
          label="This Month"
          value={summary.data ? formatINR(summary.data.monthBrokerage) : "—"}
          icon={TrendingUp}
        />
        <StatCard
          label="Total Brokerage"
          value={summary.data ? formatINR(summary.data.totalBrokerage) : "—"}
          icon={IndianRupee}
          tone="success"
        />
        <StatCard
          label="Team Members"
          value={summary.data?.teamSize ?? "—"}
          icon={Users}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent activity</CardTitle>
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
                {history.data?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                      No brokerage activity yet.
                    </TableCell>
                  </TableRow>
                )}
                {history.data?.slice(0, 8).map((r) => (
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
    </div>
  );
}
