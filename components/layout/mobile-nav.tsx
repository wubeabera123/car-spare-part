"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  X,
  Wrench,
  ChevronRight,
  LogOut,
  Package,
  User,
  Store,
  LayoutDashboard,
} from "lucide-react";

const NAV_LINKS = [
  { href: "/products", label: "Shop All Parts" },
  { href: "/categories/engine-parts", label: "Engine Parts" },
  { href: "/categories/brakes", label: "Brake Parts" },
  { href: "/categories/suspension", label: "Suspension" },
  { href: "/categories/electrical", label: "Electrical" },
  { href: "/brands", label: "Brands" },
  { href: "/deals", label: "Deals" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/help", label: "Help Center" },
];

interface MobileNavProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string | null;
    image?: string | null;
  } | null;
}

export function MobileNav({ user }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-lg hover:bg-surface-muted focus-ring"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden
          />

          {/* Drawer */}
          <div className="fixed inset-y-0 right-0 z-50 w-72 bg-surface shadow-xl flex flex-col">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 font-bold text-base"
              >
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent-600 text-white">
                  <Wrench className="h-4 w-4" />
                </span>
                AutoParts.Hub
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-lg hover:bg-surface-muted"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* User info if logged in */}
            {user && (
              <div className="border-b border-border px-5 py-3 bg-surface-muted">
                <div className="flex items-center gap-3">
                  <div className="relative grid h-9 w-9 shrink-0 overflow-hidden place-items-center rounded-full bg-accent-600 text-sm font-bold text-white">
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt="Avatar"
                        fill
                        sizes="36px"
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      (user.name?.[0]?.toUpperCase() ?? "U")
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{user.name}</p>
                    <p className="truncate text-xs text-foreground-muted">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <nav className="flex-1 overflow-y-auto py-4">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between px-5 py-3 text-sm font-medium hover:bg-surface-muted transition-colors"
                >
                  {l.label}
                  <ChevronRight className="h-4 w-4 text-foreground-muted" />
                </Link>
              ))}

              {user && (
                <>
                  <div className="my-2 border-t border-border" />
                  <Link
                    href="/account"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-5 py-3 text-sm font-medium hover:bg-surface-muted"
                  >
                    <User className="h-4 w-4" /> My Account
                  </Link>
                  <Link
                    href="/account/orders"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-5 py-3 text-sm font-medium hover:bg-surface-muted"
                  >
                    <Package className="h-4 w-4" /> Orders
                  </Link>
                  {(user.role === "SELLER" || user.role === "ADMIN") && (
                    <Link
                      href="/seller"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-5 py-3 text-sm font-medium hover:bg-surface-muted"
                    >
                      <Store className="h-4 w-4" /> Seller Dashboard
                    </Link>
                  )}
                  {user.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-5 py-3 text-sm font-medium hover:bg-surface-muted"
                    >
                      <LayoutDashboard className="h-4 w-4" /> Admin Panel
                    </Link>
                  )}
                </>
              )}
            </nav>

            <div className="border-t border-border p-5 space-y-2">
              {user ? (
                <form action="/api/auth/signout" method="POST">
                  <button
                    type="submit"
                    className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-border text-sm font-medium text-accent-600 hover:bg-surface-muted"
                  >
                    <LogOut className="h-4 w-4" /> Sign out
                  </button>
                </form>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="flex h-10 w-full items-center justify-center rounded-lg bg-accent-600 text-sm font-medium text-white hover:bg-accent-700"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setOpen(false)}
                    className="flex h-10 w-full items-center justify-center rounded-lg border border-border text-sm font-medium hover:bg-surface-muted"
                  >
                    Create account
                  </Link>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
