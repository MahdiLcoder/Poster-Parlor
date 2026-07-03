"use client";

import { GoogleSignInButton } from "@/features/auth/components/google-sign-in-button";
import { useGetCurrentUserQuery } from "@/store/api/auth.api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, Shield } from "lucide-react";

interface UserCheckProps {
  children: React.ReactNode;
}

interface UserData {
  _id: string;
  name: string;
  email: string;
  picture?: string;
}

export function UserCheck({ children }: UserCheckProps) {
  const { data, isLoading } = useGetCurrentUserQuery(undefined);

  const user = data?.data as UserData | undefined;

  if (isLoading) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span className="text-muted-foreground">
              Checking authentication...
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-amber-600" />
            <CardTitle className="text-lg">Sign in to Continue</CardTitle>
          </div>
          <CardDescription>
            Sign in with your Google account to track your orders and get a
            seamless checkout experience.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4">
            <p className="text-sm text-muted-foreground text-center">
              Your cart items will be preserved after signing in
            </p>
            <GoogleSignInButton />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Logged In User Card */}
      <Card className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20">
        <CardContent className="py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              {user.picture ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.picture}
                  alt={user.name}
                  className="h-10 w-10 rounded-full"
                />
              ) : (
                <User className="h-5 w-5 text-green-600" />
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <div className="flex items-center gap-1 text-green-600">
              <Shield className="h-4 w-4" />
              <span className="text-sm font-medium">Verified</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Render children (the rest of the checkout) */}
      {children}
    </div>
  );
}
