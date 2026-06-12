import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getUploadHistory } from "@/lib/api";

export const Route = createFileRoute("/admin/upload-history")({
  component: UploadHistoryPage,
});

function UploadHistoryPage() {
  const { data } = useQuery({ queryKey: ["uploads"], queryFn: getUploadHistory });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>File</TableHead>
                <TableHead>Uploaded By</TableHead>
                <TableHead>Uploaded At</TableHead>
                <TableHead className="text-right">Rows</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>{u.type}</TableCell>
                  <TableCell className="font-mono text-xs">{u.fileName}</TableCell>
                  <TableCell>{u.uploadedBy}</TableCell>
                  <TableCell>{new Date(u.uploadedAt).toLocaleString()}</TableCell>
                  <TableCell className="text-right">{u.rows}</TableCell>
                  <TableCell>
                    <Badge variant={u.status === "Success" ? "default" : "destructive"}>
                      {u.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
