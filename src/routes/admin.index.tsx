import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Users, UserCheck, IndianRupee, CalendarDays, TrendingUp, KeyRound } from "lucide-react";
import { getAdminDashboardSummary, getBrokerageHistory } from "@/lib/api";
import { StatCard, formatINR } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const summary = useQuery({
    queryKey: ["admin", "summary"],
    queryFn: getAdminDashboardSummary,
    staleTime: 60_000,
  });
  const recent = useQuery({
    queryKey: ["admin", "recent-brokerage"],
    queryFn: () => getBrokerageHistory(undefined, 10),
    staleTime: 60_000,
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard
          label="Total Clients"
          value={summary.data?.totalClients ?? "—"}
          icon={Users}
          tone="primary"
        />
        <StatCard
          label="Active Clients"
          value={summary.data?.activeClients ?? "—"}
          icon={UserCheck}
          tone="success"
        />
        <StatCard
          label="Today's Brokerage"
          value={summary.data ? formatINR(summary.data.todayBrokerage) : "—"}
          icon={CalendarDays}
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
          tone="primary"
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Quick actions</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button asChild>
            <Link to="/admin/upload-client-master">Upload Client Master</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/admin/upload-brokerage">Upload Brokerage</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/admin/clients">Manage Clients</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/admin/password-requests">
              <KeyRound className="h-4 w-4 mr-2" />
              Reset Requests {summary.data ? `(${summary.data.pendingRequests})` : ""}
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent brokerage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>ClientCode</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Segment</TableHead>
                  <TableHead>Remark</TableHead>
                  <TableHead className="text-right">Brokerage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.data?.slice(0, 8).map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{new Date(r.date).toLocaleDateString()}</TableCell>
                    <TableCell className="font-mono text-xs">{r.clientCode}</TableCell>
                    <TableCell>{r.clientName}</TableCell>
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
