"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-auth";

type AuthGuardProps = Readonly<{
  children: ReactNode;
}>;

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const { data: user, isError, isPending, refetch } = useCurrentUser();

  useEffect(() => {
    if (!isPending && !isError && !user) {
      router.replace("/login");
    }
  }, [isError, isPending, router, user]);

  if (isPending) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Checking your session...</p>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="space-y-2">
          <h1 className="text-xl font-semibold">Unable to verify your session</h1>
          <p className="text-sm text-muted-foreground">
            Please check that the backend server is running, then try again.
          </p>
        </div>

        <Button
          type="button"
          onClick={() => {
            void refetch();
          }}
        >
          Try again
        </Button>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Redirecting to login...</p>
      </main>
    );
  }

  return <>{children}</>;
}