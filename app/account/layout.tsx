import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { LogOut, Package, Heart, MapPin, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/account", label: "Profile", icon: UserIcon },
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
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
            {NAV.map((n) => {
              const Icon = n.icon;
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-surface-muted",
                  )}
                >
                  <Icon className="h-4 w-4 text-foreground-muted" />
                  {n.label}
                </Link>
              );
            })}
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
