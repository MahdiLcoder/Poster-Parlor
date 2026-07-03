"use client";

import { Sidebar } from "@/components/dashboard";
import { useAppSelector } from "@/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Give a moment for auth state to hydrate
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Show loading while checking auth
  if (isChecking) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to home
  if (!isAuthenticated || !user) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-6 text-center max-w-md px-4">
          <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <ShieldAlert className="h-8 w-8 text-destructive" />
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
            <p className="text-muted-foreground">
              You need to be logged in to access this page.
            </p>
          </div>
          <Link href="/">
            <Button>Go to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Not an admin - show access denied
  if (user.role !== "ADMIN") {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-6 text-center max-w-md px-4">
          <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <ShieldAlert className="h-8 w-8 text-destructive" />
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2">Admin Access Required</h1>
            <p className="text-muted-foreground">
              This dashboard is only accessible to administrators. If you
              believe you should have access, please contact the system
              administrator.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/">
              <Button variant="outline">Go to Home</Button>
            </Link>
            <Link href="/posters">
              <Button>Browse Posters</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
