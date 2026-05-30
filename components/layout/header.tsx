import Link from "next/link";
import Image from "next/image";
import {
  Search,
  ShoppingCart,
  Heart,
  Wrench,
  LogOut,
  User,
  LayoutDashboard,
  Package,
  Store,
} from "lucide-react";
import { buttonStyles } from "@/components/ui/button";
import { MobileNav } from "@/components/layout/mobile-nav";
import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";

const NAV_LINKS = [
  { href: "/products", label: "Shop All" },
  { href: "/categories/engine-parts", label: "Engine" },
  { href: "/categories/brakes", label: "Brakes" },
  { href: "/categories/suspension", label: "Suspension" },
  { href: "/categories/electrical", label: "Electrical" },
  { href: "/brands", label: "Brands" },
  { href: "/deals", label: "Deals" },
];

export async function Header() {
  const session = await auth();
  const user = session?.user;

  // Always fetch fresh image from DB — avoids stale JWT after avatar update
  const dbImage = user?.id
    ? ((
        await prisma.user.findUnique({
          where: { id: user.id },
          select: { image: true },
        })
      )?.image ?? null)
    : null;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-surface/85 backdrop-blur supports-backdrop-filter:bg-surface/65">
      {/* Announcement bar */}
      <div className="bg-brand-900 text-white text-xs">
        <div className="container-page flex h-9 items-center justify-between">
          <p className="hidden sm:block">
            Free shipping on orders over ETB 5,000 · Genuine OEM &amp; quality
            aftermarket parts
          </p>
          <div className="flex items-center gap-4">
            <Link href="/seller/onboarding" className="hover:underline">
              Sell on AutoParts
            </Link>
            <Link href="/help" className="hover:underline">
              Help
            </Link>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="container-page flex h-16 items-center gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-lg tracking-tight"
        >
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent-600 text-white">
            <Wrench className="h-5 w-5" />
          </span>
          <span>
            AutoParts<span className="text-accent-600">.</span>Hub
          </span>
        </Link>

        {/* Search */}
        <form
          action="/products"
          className="hidden md:flex flex-1 max-w-2xl"
          role="search"
        >
          <div className="flex w-full overflow-hidden rounded-lg border border-border focus-within:ring-2 focus-within:ring-brand-500/40">
            <input
              type="search"
              name="q"
              placeholder="Search by part name, SKU, or vehicle…"
              className="flex-1 bg-surface px-4 text-sm outline-none"
            />
            <button
              type="submit"
              className="bg-accent-600 px-5 text-white hover:bg-accent-700 transition-colors"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </form>

        <div className="ml-auto flex items-center gap-1">
          <Link
            href="/wishlist"
            className="hidden sm:inline-flex items-center justify-center h-10 w-10 rounded-lg hover:bg-surface-muted focus-ring"
            aria-label="Wishlist"
          >
            <Heart className="h-5 w-5" />
          </Link>

          <Link
            href="/cart"
            className="relative inline-flex items-center justify-center h-10 w-10 rounded-lg hover:bg-surface-muted focus-ring"
            aria-label="Cart"
          >
            <ShoppingCart className="h-5 w-5" />
          </Link>

          {user ? (
            <div className="relative ml-2 hidden sm:block group">
              {/* Avatar button */}
              <button className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-1.5 text-sm font-medium hover:bg-surface-muted focus-ring">
                <span className="relative grid h-6 w-6 shrink-0 overflow-hidden rounded-full bg-accent-600 text-xs text-white font-bold place-items-center">
                  {dbImage ? (
                    <Image
                      src={dbImage}
                      alt="Avatar"
                      fill
                      sizes="24px"
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    (user.name?.[0]?.toUpperCase() ?? "U")
                  )}
                </span>
                <span className="max-w-[100px] truncate">
                  {user.name ?? user.email}
                </span>
              </button>

              {/* Dropdown */}
              <div className="absolute right-0 top-full mt-1 w-52 rounded-xl border border-border bg-surface shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50">
                <div className="border-b border-border px-4 py-3">
                  <p className="text-xs text-foreground-muted">Signed in as</p>
                  <p className="truncate text-sm font-medium">{user.email}</p>
                </div>
                <div className="py-1">
                  <Link
                    href="/account"
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-surface-muted"
                  >
                    <User className="h-4 w-4" /> My Account
                  </Link>
                  <Link
                    href="/account/orders"
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-surface-muted"
                  >
                    <Package className="h-4 w-4" /> Orders
                  </Link>
                  {(user.role === "SELLER" || user.role === "ADMIN") && (
                    <Link
                      href="/seller"
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-surface-muted"
                    >
                      <Store className="h-4 w-4" /> Seller Dashboard
                    </Link>
                  )}
                  {user.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-surface-muted"
                    >
                      <LayoutDashboard className="h-4 w-4" /> Admin Panel
                    </Link>
                  )}
                </div>
                <div className="border-t border-border py-1">
                  <form
                    action={async () => {
                      "use server";
                      await signOut({ redirectTo: "/" });
                    }}
                  >
                    <button
                      type="submit"
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-accent-600 hover:bg-surface-muted"
                    >
                      <LogOut className="h-4 w-4" /> Sign out
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className={
                buttonStyles({ size: "sm" }) + " ml-2 hidden sm:inline-flex"
              }
            >
              Sign in
            </Link>
          )}

          <MobileNav
            user={
              user
                ? {
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    image: dbImage,
                  }
                : null
            }
          />
        </div>
      </div>

      {/* Category nav */}
      <nav className="hidden md:block border-t border-border bg-surface-muted">
        <div className="container-page flex h-11 items-center gap-6 text-sm">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-foreground-muted hover:text-foreground transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
