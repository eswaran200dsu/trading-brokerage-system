import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  approvePasswordReset,
  getPasswordResetRequests,
  rejectPasswordReset,
} from "@/lib/api";

export const Route = createFileRoute("/admin/password-requests")({
  component: PasswordRequestsPage,
});

function PasswordRequestsPage() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["reset-requests"], queryFn: getPasswordResetRequests });
  const refresh = () => qc.invalidateQueries({ queryKey: ["reset-requests"] });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Password Reset Requests</CardTitle>
        <p className="text-xs text-muted-foreground mt-1">
          Approve to reset the client password to their registered mobile number.
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ClientCode</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Requested</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs">{r.clientCode}</TableCell>
                  <TableCell>{r.name}</TableCell>
                  <TableCell>{r.mobile}</TableCell>
                  <TableCell>{new Date(r.requestedAt).toLocaleString()}</TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[180px] truncate">
                    {r.reason || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        r.status === "Approved"
                          ? "default"
                          : r.status === "Rejected"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {r.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {r.status === "Pending" ? (
                      <div className="flex justify-end gap-2">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm">Approve</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Approve reset?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Reset this client password to registered mobile number?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={async () => {
                                  await approvePasswordReset(r.id);
                                  toast.success("Password reset approved");
                                  refresh();
                                }}
                              >
                                Approve
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              Reject
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Reject request?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This request will be marked rejected.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={async () => {
                                  await rejectPasswordReset(r.id);
                                  toast.success("Request rejected");
                                  refresh();
                                }}
                              >
                                Reject
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
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
