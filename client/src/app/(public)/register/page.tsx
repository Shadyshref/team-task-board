"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { RegisterForm } from "@/components/auth/register-form";
import { useCurrentUser } from "@/hooks/use-auth";

export default function RegisterPage() {
  const router = useRouter();
  const { data: user, isPending } = useCurrentUser();

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [router, user]);

  if (isPending || user) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        Checking your session...
      </div>
    );
  }

  return (
    <section className="space-y-6 max-w-96">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create your account
        </h1>
        <p className="text-sm text-muted-foreground">
          Start organizing your team projects and tasks.
        </p>
      </div>

      <RegisterForm />
    </section>
  );
}