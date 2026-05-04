import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LayoutDashboard, Boxes, ListOrdered, Settings } from "lucide-react";

const NAV = [
  { href: "/seller", label: "Overview", icon: LayoutDashboard },
  { href: "/seller/products", label: "Products", icon: Boxes },
  { href: "/seller/orders", label: "Orders", icon: ListOrdered },
  { href: "/seller/store", label: "Store settings", icon: Settings },
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
  );
}
