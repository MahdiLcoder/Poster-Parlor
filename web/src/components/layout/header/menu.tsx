import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Menu, User, Package, LogOut, Home, Image } from "lucide-react";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { GoogleSignInButton } from "./auth";
import { ModeToggle } from "@/components/theme/theme-toggle";
import { MobileMenuProps } from "@/types/components.type";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useLazyGetCurrentUserQuery,
  useLogoutMutation,
} from "@/store/api/auth.api";
import { useAppSelector } from "@/store";
import { toast } from "sonner";
import { ErrorResponse } from "@/types/api-response.type";
import { useEffect } from "react";

export function MobileMenu({ mobileOpen, setMobileOpen }: MobileMenuProps) {
  const navigation = [
    { href: "/", name: "Home", icon: Home },
    { href: "/posters", name: "Posters", icon: Image },
  ];

  const pathname = usePathname();
  const router = useRouter();
  const [trigger, { isLoading, isFetching }] = useLazyGetCurrentUserQuery();
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (mobileOpen) {
      trigger({});
    }
  }, [mobileOpen, trigger]);

  const handleLogout = async () => {
    try {
      await logout({}).unwrap();
      setMobileOpen(false);
      toast.success("Logged out successfully");
    } catch (err: unknown) {
      const error = err as ErrorResponse;
      toast.error(`Logout failed: ${error.data.message}`);
    }
  };

  const handleNavigation = (href: string) => {
    router.push(href);
    setMobileOpen(false);
  };

  const handleOrders = () => {
    router.push("/myorder");
    setMobileOpen(false);
  };

  return (
    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="md:hidden border-border/40 bg-background/95 backdrop-blur hover:bg-accent hover:border-accent-foreground/20 transition-all duration-300"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-80 p-0 bg-background/98 backdrop-blur-xl border-r border-border/40 flex flex-col"
      >
        <SheetHeader className="px-6 py-5 border-b border-border/40 bg-gradient-to-r from-primary/5 to-transparent">
          <SheetTitle className="text-lg font-semibold">Menu</SheetTitle>
        </SheetHeader>

        {/* User Profile Section */}
        <div className="px-6 py-6 border-b border-border/40">
          {isLoading || isFetching ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-12 w-12 rounded-full bg-muted/50" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full bg-muted/50" />
                  <Skeleton className="h-3 w-3/4 bg-muted/30" />
                </div>
              </div>
            </div>
          ) : user ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">
                Sign in to access your account
              </p>
              <GoogleSignInButton className="w-full justify-center" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <ul className="flex flex-col gap-2">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname?.startsWith(item.href));
              const Icon = item.icon;

              return (
                <li key={item.name}>
                  <button
                    onClick={() => handleNavigation(item.href)}
                    className={`
                      group w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium 
                      transition-all duration-200 hover:scale-[1.02]
                      ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                          : "bg-accent/50 text-foreground hover:bg-accent hover:shadow-md"
                      }
                    `}
                  >
                    <div
                      className={`
                      flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200
                      ${
                        isActive
                          ? "bg-primary-foreground/20"
                          : "bg-background/50"
                      }
                    `}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm">{item.name}</span>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-primary-foreground animate-pulse" />
                    )}
                  </button>
                </li>
              );
            })}

            {/* Orders - Only show when logged in */}
            {user && (
              <li>
                <button
                  onClick={handleOrders}
                  className="group w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium 
                    bg-accent/50 text-foreground hover:bg-accent hover:shadow-md
                    transition-all duration-200 hover:scale-[1.02]"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-background/50 transition-all duration-200">
                    <Package className="h-4 w-4" />
                  </div>
                  <span className="text-sm">Orders</span>
                </button>
              </li>
            )}
          </ul>

          {/* Theme Toggle */}
          <div className="mt-6 pt-6 border-t border-border/40">
            <ModeToggle variant="full" />
          </div>

          {/* Logout Button - Only show when logged in */}
          {user && (
            <div className="mt-4">
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="group w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium 
                  bg-destructive/10 text-destructive hover:bg-destructive/20
                  transition-all duration-200 hover:scale-[1.02]
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/20 transition-all duration-200">
                  <LogOut className="h-4 w-4" />
                </div>
                <span className="text-sm">
                  {isLoggingOut ? "Logging out..." : "Log out"}
                </span>
              </button>
            </div>
          )}
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border/40 bg-gradient-to-t from-muted/20 to-transparent">
          <p className="text-xs text-center text-muted-foreground">
            © 2024 Your Brand
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
