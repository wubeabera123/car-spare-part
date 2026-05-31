import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { LogOut } from "lucide-react";
import { NavLink } from "@/components/ui/nav-link";

const NAV = [
  { href: "/account", label: "Profile", iconName: "User", exact: true },
  { href: "/account/orders", label: "Orders", iconName: "Package" },
  { href: "/wishlist", label: "Wishlist", iconName: "Heart", exact: true },
  { href: "/account/addresses", label: "Addresses", iconName: "MapPin" },
];

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/account");

  return (
    <div className="container-page py-8">
      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="space-y-1">
          <div className="rounded-xl border border-border bg-surface p-4">
            <p className="text-xs uppercase tracking-wider text-foreground-muted">
              Signed in as
            </p>
            <p className="mt-1 truncate font-semibold">{session.user.email}</p>
            <span className="mt-1 inline-block rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
              {session.user.role}
            </span>
          </div>
          <nav className="rounded-xl border border-border bg-surface p-2">
            {NAV.map((n) => (
              <NavLink
                key={n.href}
                href={n.href}
                label={n.label}
                iconName={n.iconName}
                exact={n.exact}
              />
            ))}
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-accent-600 hover:bg-accent-50"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </form>
          </nav>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
