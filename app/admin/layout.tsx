import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { NavLink } from "@/components/ui/nav-link";

const NAV = [
  {
    href: "/admin",
    label: "Overview",
    iconName: "LayoutDashboard",
    exact: true,
  },
  { href: "/admin/products", label: "Products", iconName: "Package" },
  { href: "/admin/categories", label: "Categories", iconName: "Tags" },
  { href: "/admin/brands", label: "Brands", iconName: "Award" },
  { href: "/admin/orders", label: "Orders", iconName: "ShoppingBag" },
  { href: "/admin/users", label: "Users", iconName: "Users" },
  { href: "/admin/sellers", label: "Sellers", iconName: "Store" },
  { href: "/admin/promotions", label: "Promotions", iconName: "Percent" },
  { href: "/admin/settings", label: "Settings", iconName: "Settings" },
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
              {NAV.map((n) => (
                <NavLink
                  key={n.href}
                  href={n.href}
                  label={n.label}
                  iconName={n.iconName}
                  exact={n.exact}
                />
              ))}
            </nav>
          </aside>
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}
