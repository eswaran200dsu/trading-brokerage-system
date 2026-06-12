import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/client/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { user } = useAuth();
  if (!user) return null;
  const rows: [string, string | undefined][] = [
    ["ClientCode", user.clientCode],
    ["Name", user.name],
    ["Mobile", user.mobile],
    ["Email", user.email],
    ["PAN", user.pan],
    ["Branch", user.branch],
    ["Parent Code", user.parentCode ?? "—"],
  ];
  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>My Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="divide-y">
          {rows.map(([k, v]) => (
            <div key={k} className="flex justify-between py-3 text-sm">
              <dt className="text-muted-foreground">{k}</dt>
              <dd className="font-medium">{v || "—"}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
