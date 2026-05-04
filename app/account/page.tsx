import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Profile" };

export default async function AccountPage() {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: { id: session!.user.id },
    select: { name: true, email: true, phone: true, createdAt: true },
  });

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
      <p className="mt-1 text-sm text-foreground-muted">
        Manage your account details.
      </p>

      <div className="mt-6 rounded-2xl border border-border bg-surface p-6">
        <dl className="grid gap-5 sm:grid-cols-2">
          {[
            ["Name", user?.name ?? "—"],
            ["Email", user?.email],
            ["Phone", user?.phone ?? "Not set"],
            ["Member since", user?.createdAt?.toLocaleDateString()],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-xs uppercase tracking-wider text-foreground-muted">
                {k}
              </dt>
              <dd className="mt-1 font-medium">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </>
  );
}
