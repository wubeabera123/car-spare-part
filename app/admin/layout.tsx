import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import {
  LayoutDashboard,
  Users,
  Package,
  Tags,
  ShoppingBag,
  Store,
  Percent,
  Settings,
  Award,
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/brands", label: "Brands", icon: Award },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/sellers", label: "Sellers", icon: Store },
  { href: "/admin/promotions", label: "Promotions", icon: Percent },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/admin");
  if (session.user.role !== "ADMIN") redirect("/");

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-surface-muted">
      <div className="container-page py-8">
        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <aside>
            <div className="rounded-xl border border-border bg-brand-900 p-5 text-white">
              <p className="text-xs uppercase tracking-wider text-brand-300">
                Admin
              </p>
              <p className="mt-1 truncate font-semibold">
                {session.user.email}
              </p>
            </div>
            <nav className="mt-3 rounded-xl border border-border bg-surface p-2">
              {NAV.map((n) => {
                const Icon = n.icon;
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-surface-muted"
                  >
                    <Icon className="h-4 w-4 text-foreground-muted" />
                    {n.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}
