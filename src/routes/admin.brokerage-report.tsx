import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getBrokerageHistory } from "@/lib/api";
import { formatINR } from "@/components/StatCard";

export const Route = createFileRoute("/admin/brokerage-report")({
  component: BrokerageReportPage,
});

function BrokerageReportPage() {
  const [q, setQ] = useState("");
  const { data } = useQuery({ queryKey: ["brokerage", "all"], queryFn: () => getBrokerageHistory() });

  const rows = useMemo(() => {
    if (!data) return [];
    if (!q) return data;
    const s = q.toLowerCase();
    return data.filter(
      (r) =>
        r.clientCode.toLowerCase().includes(s) ||
        r.clientName.toLowerCase().includes(s) ||
        r.segment.toLowerCase().includes(s),
    );
  }, [data, q]);

  const total = rows.reduce((s, r) => s + r.brokerage, 0);

  const downloadCSV = () => {
    const header = ["Date", "ClientCode", "ClientName", "Segment", "Brokerage", "Remark"];
    const body = rows.map((r) => [
      new Date(r.date).toISOString().slice(0, 10),
      r.clientCode,
      r.clientName,
      r.segment,
      r.brokerage,
      r.remark ?? "",
    ]);
    const csv = [header, ...body].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `brokerage-report-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV downloaded");
  };

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <CardTitle>Brokerage Report</CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            {rows.length} rows · Total {formatINR(total)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Filter..."
              className="pl-8 w-56"
            />
          </div>
          <Button onClick={downloadCSV} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>ClientCode</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Segment</TableHead>
                <TableHead>Remark</TableHead>
                <TableHead className="text-right">Brokerage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
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
  );
}
