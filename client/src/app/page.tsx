"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useCurrentUser } from "@/hooks/use-auth";

export default function HomePage() {
  const router = useRouter();
  const { data: user, isError, isPending, refetch } = useCurrentUser();

  useEffect(() => {
    if (isPending || isError) {
      return;
    }

    router.replace(user ? "/dashboard" : "/login");
  }, [isError, isPending, router, user]);

  if (isPending) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Checking your session...
        </p>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <div>
          <h1 className="text-xl font-semibold">Unable to check your session</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Please check that the backend server is running and try again.
          </p>
        </div>

        <button
          type="button"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          onClick={() => {
                                void refetch();
          }}
        >
          Try again
        </button>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <p className="text-sm text-muted-foreground">Redirecting...</p>
    </main>
  );
}