"use client";

import { cn } from "@/lib/utils";
import {
  Package,
  ShoppingCart,
  Users,
  LayoutDashboard,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const menuItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    icon: ShoppingCart,
    label: "Orders",
    href: "/dashboard/orders",
  },
  {
    icon: Package,
    label: "Products",
    href: "/dashboard/products",
  },
  {
    icon: Users,
    label: "Customers",
    href: "/dashboard/customers",
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <aside
      className={cn(
        "border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-slate-950 transition-all duration-300 flex flex-col h-screen",
        isExpanded ? "w-72" : "w-24",
        className
      )}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-between gap-3 border-b border-gray-200 dark:border-gray-800 px-6 py-8">
        <div className={cn("flex items-center gap-3", !isExpanded && "hidden")}>
          <div className="h-10 w-10 rounded-lg bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-bold text-lg">
            P
          </div>
          <div>
            <span className="font-bold text-gray-900 dark:text-white text-sm">
              Posterparlor.inc
            </span>
            <p className="text-xs text-gray-500 dark:text-gray-400">Admin</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800"
        >
          <ChevronRight
            className={cn(
              "h-4 w-4 transition-transform duration-300",
              !isExpanded && "rotate-180"
            )}
          />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-8 space-y-4 overflow-y-auto">
        {menuItems.map((item, index) => (
          <div key={item.href}>
            <Link href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 rounded-lg py-6",
                  !isExpanded && "justify-center px-3",
                  isExpanded && "justify-start gap-4 px-5"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {isExpanded && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </Button>
            </Link>
            {index < menuItems.length - 1 && (
              <div className="my-2 mx-2 border-t border-gray-200 dark:border-gray-700" />
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
