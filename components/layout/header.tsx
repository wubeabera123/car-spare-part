import Link from "next/link";
import { Search, ShoppingCart, Heart, User, Wrench } from "lucide-react";
import { buttonStyles } from "@/components/ui/button";
import { MobileNav } from "@/components/layout/mobile-nav";

const NAV_LINKS = [
  { href: "/products", label: "Shop All" },
  { href: "/categories/engine-parts", label: "Engine" },
  { href: "/categories/brakes", label: "Brakes" },
  { href: "/categories/suspension", label: "Suspension" },
  { href: "/categories/electrical", label: "Electrical" },
  { href: "/brands", label: "Brands" },
  { href: "/deals", label: "Deals" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-surface/85 backdrop-blur supports-backdrop-filter:bg-surface/65">
      {/* Announcement bar */}
      <div className="bg-brand-900 text-white text-xs">
        <div className="container-page flex h-9 items-center justify-between">
          <p className="hidden sm:block">
            Free shipping on orders over $99 · Genuine OEM &amp; quality
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
            href="/account"
            className="hidden sm:inline-flex items-center justify-center h-10 w-10 rounded-lg hover:bg-surface-muted focus-ring"
            aria-label="Account"
          >
            <User className="h-5 w-5" />
          </Link>
          <Link
            href="/cart"
            className="relative inline-flex items-center justify-center h-10 w-10 rounded-lg hover:bg-surface-muted focus-ring"
            aria-label="Cart"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-accent-600 px-1 text-[10px] font-semibold text-white">
              0
            </span>
          </Link>
          <Link
            href="/login"
            className={
              buttonStyles({ size: "sm" }) + " ml-2 hidden sm:inline-flex"
            }
          >
            Sign in
          </Link>
          <MobileNav />
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
