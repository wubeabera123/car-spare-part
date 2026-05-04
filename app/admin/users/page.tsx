import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Users · Admin" };

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: { select: { orders: true } },
    },
  });

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">Users</h1>
      <p className="mt-1 text-sm text-foreground-muted">
        Showing {users.length} most recent users.
      </p>

      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-surface">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-surface-muted text-left text-xs uppercase tracking-wider text-foreground-muted">
            <tr>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Role</th>
              <th className="px-5 py-3">Orders</th>
              <th className="px-5 py-3">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-surface-muted/40">
                <td className="px-5 py-3 font-medium">{u.name ?? "—"}</td>
                <td className="px-5 py-3">{u.email}</td>
                <td className="px-5 py-3">
                  <Badge variant="brand">{u.role}</Badge>
                </td>
                <td className="px-5 py-3">{u._count.orders}</td>
                <td className="px-5 py-3 text-foreground-muted">
                  {u.createdAt.toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
