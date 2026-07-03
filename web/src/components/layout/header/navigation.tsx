"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store";

export function Navigation() {
  const pathname = usePathname();
  const { user } = useAppSelector((state) => state.auth);

  const navigation = [
    { href: "/", name: "Home" },
    { href: "/posters", name: "Posters" },
    // Add dashboard link only for admin users
    ...(user?.role === "ADMIN"
      ? [{ href: "/dashboard", name: "Dashboard" }]
      : []),
  ];

  return (
    <nav className="hidden md:flex">
      <ul className="flex items-center gap-6">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname?.startsWith(item.href));

          return (
            <li key={item.name}>
              <Link
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive
                    ? "font-semibold text-primary"
                    : "text-muted-foreground"
                )}
              >
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
