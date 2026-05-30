"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Wrench, ChevronRight } from "lucide-react";

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

export function MobileNav() {
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
            </nav>

            <div className="border-t border-border p-5 space-y-2">
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
            </div>
          </div>
        </>
      )}
    </>
  );
}
