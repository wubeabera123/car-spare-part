"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Boxes,
  ListOrdered,
  Settings,
  Users,
  Package,
  Tags,
  ShoppingBag,
  Store,
  Percent,
  Award,
  Heart,
  MapPin,
  User,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard,
  Boxes,
  ListOrdered,
  Settings,
  Users,
  Package,
  Tags,
  ShoppingBag,
  Store,
  Percent,
  Award,
  Heart,
  MapPin,
  User,
};

interface NavLinkProps {
  href: string;
  label: string;
  iconName: string;
  exact?: boolean;
}

export function NavLink({
  href,
  label,
  iconName,
  exact = false,
}: NavLinkProps) {
  const pathname = usePathname();
  const isActive = exact
    ? pathname === href
    : pathname === href || pathname.startsWith(href + "/");

  const Icon = ICON_MAP[iconName] ?? LayoutDashboard;

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
        isActive
          ? "bg-accent-600 text-white font-medium"
          : "text-foreground hover:bg-surface-muted",
      )}
    >
      <Icon
        className={cn(
          "h-4 w-4",
          isActive ? "text-white" : "text-foreground-muted",
        )}
      />
      {label}
    </Link>
  );
}
