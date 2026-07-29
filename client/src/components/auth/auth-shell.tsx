
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { ReactNode } from "react";


export function AuthShell({ children }: { children: ReactNode }) {
     return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-10">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <p className="text-xl font-semibold">
            Team Task Board
          </p>

          <p className="text-sm text-muted-foreground">
            Organize projects, tasks, and your team in one place.
          </p>
        </div>

        <Card>
          <CardContent className="space-y-6">
            {children}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}