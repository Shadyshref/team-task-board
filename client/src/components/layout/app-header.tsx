"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FolderKanbanIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  MenuIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCurrentUser, useLogout } from "@/hooks/use-auth";
import { getApiErrorMessage } from "@/lib/api/client";

function NavigationLinks() {
  return (
    <>
      <Link
        href="/dashboard"
        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
      >
        <LayoutDashboardIcon className="size-4" />
        Dashboard
      </Link>

      <Link
        href="/projects"
        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
      >
        <FolderKanbanIcon className="size-4" />
        Projects
      </Link>
    </>
  );
}

export function AppHeader() {
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const logout = useLogout();

  async function handleLogout() {
    try {
      await logout.mutateAsync();
      router.replace("/login");
    } catch {
      toast.error(getApiErrorMessage(logout.error));
    }
  }

  if (!user) {
    return null;
  }

  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/dashboard" className="font-semibold tracking-tight">
          Team Task Board
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <NavigationLinks />
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <div className="text-right">
            <p className="text-sm font-medium">{user.name}</p>
            <Badge variant="secondary">{user.role}</Badge>
          </div>

          <Button
            type="button"
            variant="outline"
            disabled={logout.isPending}
            onClick={() => {
              void handleLogout();
            }}
          >
            <LogOutIcon />
            {logout.isPending ? "Signing out..." : "Logout"}
          </Button>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="md:hidden"
            >
              <MenuIcon />
              <span className="sr-only">Open navigation menu</span>
            </Button>
          </SheetTrigger>

          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Team Task Board</SheetTitle>
              <SheetDescription>
                Signed in as {user.name}
              </SheetDescription>
            </SheetHeader>

            <nav className="flex flex-col gap-1 px-4">
              <SheetClose asChild>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                >
                  <LayoutDashboardIcon className="size-4" />
                  Dashboard
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link
                  href="/projects"
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                >
                  <FolderKanbanIcon className="size-4" />
                  Projects
                </Link>
              </SheetClose>

              <div className="mt-4 border-t pt-4">
                <Badge variant="secondary">{user.role}</Badge>

                <Button
                  type="button"
                  variant="outline"
                  className="mt-3 w-full"
                  disabled={logout.isPending}
                  onClick={() => {
                    void handleLogout();
                  }}
                >
                  <LogOutIcon />
                  {logout.isPending ? "Signing out..." : "Logout"}
                </Button>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}