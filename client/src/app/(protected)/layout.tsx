import type { ReactNode } from "react";

import { AuthGuard } from "@/components/auth/auth-guard";
import { AppHeader } from "@/components/layout/app-header";

type ProtectedLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function ProtectedLayout({
  children,
}: ProtectedLayoutProps) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-muted/40">
        <AppHeader />
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}