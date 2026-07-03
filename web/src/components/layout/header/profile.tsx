"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Package, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useLazyGetCurrentUserQuery,
  useLogoutMutation,
} from "@/store/api/auth.api";
import { useRouter } from "next/navigation";
import { GoogleSignInButton } from "./auth";
import { useAppSelector } from "@/store";
import { toast } from "sonner";
import { ErrorResponse } from "@/types/api-response.type";

export default function Profile() {
  const router = useRouter();
  const [trigger, { isLoading, isFetching }] = useLazyGetCurrentUserQuery();
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const { user } = useAppSelector((state) => state.auth);

  const handleDropdownOpen = (open: boolean) => {
    if (open) {
      trigger({});
    }
  };

  const handleLogout = async () => {
    try {
      const result = await logout({}).unwrap();
      if (result) {
        toast.success(result.data.message);
      }
    } catch (err: unknown) {
      const error = err as ErrorResponse;
      toast.error(`Logout failed: ${error.data.message}`);
    }
  };

  const handleOrders = () => {
    router.push("/myorder");
  };

  return (
    <DropdownMenu onOpenChange={handleDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label="Profile"
          className="cursor-pointer"
        >
          <User className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-72 rounded-xl border border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-2 shadow-2xl shadow-black/10 dark:shadow-black/50 transition-colors duration-300"
      >
        {isLoading || isFetching ? (
          <div className="px-4 py-3 space-y-3">
            <Skeleton className="h-5 w-full rounded-md bg-muted/50 transition-colors duration-300" />
            <Skeleton className="h-4 w-3/4 rounded-md bg-muted/30 transition-colors duration-300" />
          </div>
        ) : user ? (
          <>
            <DropdownMenuLabel className="px-4 py-3 cursor-default">
              <div className="flex items-center space-x-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 transition-all duration-300">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div className="flex flex-col space-y-1 flex-1 min-w-0">
                  <p className="text-sm font-semibold leading-none text-foreground truncate">
                    {user.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="my-2 bg-border/50 transition-colors duration-300" />

            <DropdownMenuItem
              onClick={handleOrders}
              className="group mx-1 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 hover:bg-accent/80 focus:bg-accent/80 hover:pl-4"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary transition-all duration-200 group-hover:bg-primary/20">
                    <Package className="h-4 w-4" />
                  </div>
                  <span className="ml-3 text-sm font-medium text-foreground">
                    Orders
                  </span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" />
              </div>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-2 bg-border/50 transition-colors duration-300" />

            <DropdownMenuItem
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="group mx-1 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 hover:bg-destructive/10 focus:bg-destructive/10 disabled:opacity-50 disabled:cursor-not-allowed hover:pl-4"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10 text-destructive transition-all duration-200 group-hover:bg-destructive/20">
                    <LogOut className="h-4 w-4" />
                  </div>
                  <span className="ml-3 text-sm font-medium text-destructive">
                    {isLoggingOut ? "Logging out..." : "Log out"}
                  </span>
                </div>
                <ChevronRight className="h-4 w-4 text-destructive/60 opacity-0 -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" />
              </div>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuLabel className="px-4 py-3 text-sm font-semibold text-foreground transition-colors duration-300">
              Welcome
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-2 bg-border/50 transition-colors duration-300" />
            <div className="px-2 py-2">
              <GoogleSignInButton />
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
