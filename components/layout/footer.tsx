import Link from "next/link";
import {
  Wrench,
  Globe2,
  MessageCircleQuestion,
  SendHorizontal,
  SquarePlay,
} from "lucide-react";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { href: "/products", label: "All Parts" },
      { href: "/categories/engine-parts", label: "Engine Parts" },
      { href: "/categories/brakes", label: "Brake Parts" },
      { href: "/categories/suspension", label: "Suspension" },
      { href: "/categories/electrical", label: "Electrical" },
      { href: "/categories/tires-wheels", label: "Tires & Wheels" },
    ],
  },
  {
    title: "Sell",
    links: [
      { href: "/seller/onboarding", label: "Become a Seller" },
      { href: "/seller/dashboard", label: "Seller Dashboard" },
      { href: "/seller/help", label: "Seller Help" },
      { href: "/seller/fees", label: "Fees & Pricing" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/help", label: "Help Center" },
      { href: "/contact", label: "Contact Us" },
      { href: "/shipping", label: "Shipping" },
      { href: "/returns", label: "Returns" },
      { href: "/warranty", label: "Warranty" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/blog", label: "Blog" },
      { href: "/careers", label: "Careers" },
      { href: "/press", label: "Press" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-brand-900 text-brand-100">
      <div className="container-page py-14 grid grid-cols-2 gap-10 md:grid-cols-6">
        <div className="col-span-2">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-white text-lg"
          >
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent-600">
              <Wrench className="h-5 w-5" />
            </span>
            AutoParts.Hub
          </Link>
          <p className="mt-4 text-sm text-brand-200 max-w-xs">
            Your trusted automotive marketplace. Genuine OEM and premium
            aftermarket parts for every make and model.
          </p>
          <div className="mt-5 flex gap-2">
            {[Globe2, MessageCircleQuestion, SendHorizontal, SquarePlay].map(
              (Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid h-9 w-9 place-items-center rounded-lg bg-brand-800 hover:bg-brand-700 transition-colors"
                  aria-label="Social link"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ),
            )}
          </div>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="font-semibold text-white text-sm">{col.title}</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-brand-200 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-brand-800">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-brand-300 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} AutoParts.Hub. All rights reserved.
          </p>
          <p>Built with Next.js, Prisma & PostgreSQL.</p>
        </div>
      </div>
    </footer>
  );
}
