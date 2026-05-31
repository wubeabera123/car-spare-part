import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { NavLink } from "@/components/ui/nav-link";

const NAV = [
  {
    href: "/seller",
    label: "Overview",
    iconName: "LayoutDashboard",
    exact: true,
  },
  { href: "/seller/products", label: "Products", iconName: "Boxes" },
  { href: "/seller/orders", label: "Orders", iconName: "ListOrdered" },
  { href: "/seller/store", label: "Store settings", iconName: "Settings" },
];

export default async function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/seller");
  if (session.user.role !== "SELLER" && session.user.role !== "ADMIN") {
    redirect("/seller/onboarding");
  }

  return (
    <div className="container-page py-8">
      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside>
          <div className="rounded-xl border border-border bg-brand-900 p-5 text-white">
            <p className="text-xs uppercase tracking-wider text-brand-300">
              Seller portal
            </p>
            <p className="mt-1 font-semibold">
              {session.user.name ?? "Your store"}
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
  );
}
