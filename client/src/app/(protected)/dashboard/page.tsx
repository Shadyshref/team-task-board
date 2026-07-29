"use client";

import Link from "next/link";
import { FolderKanbanIcon, ListTodoIcon, PlusIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ErrorState,
  LoadingState,
} from "@/components/shared/query-state";
import { useCurrentUser } from "@/hooks/use-auth";
import { useDashboardSummary } from "@/hooks/use-dashboard";
import { useProjects } from "@/hooks/use-projects";
import { getApiErrorMessage } from "@/lib/api/client";

type StatCardProps = {
  label: string;
  value: number;
};

function StatCard({ label, value }: StatCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-3xl">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
}

export default function DashboardPage() {
  const { data: user } = useCurrentUser();
  const dashboard = useDashboardSummary();
  const projects = useProjects();

  if (dashboard.isPending || projects.isPending) {
    return <LoadingState label="Loading your dashboard..." />;
  }

  if (dashboard.isError || projects.isError) {
    const error = dashboard.error ?? projects.error;

    return (
      <ErrorState
        message={getApiErrorMessage(error)}
        onRetry={() => {
          void Promise.all([dashboard.refetch(), projects.refetch()]);
        }}
      />
    );
  }

  if (!user || !dashboard.data || !projects.data) {
    return null;
  }

  const summary = dashboard.data;
  const projectPreview = projects.data.slice(0, 3);

  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Welcome back</p>
          <h1 className="text-3xl font-semibold tracking-tight">
            {user.name}
          </h1>
          <Badge variant="secondary">{user.role}</Badge>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href="/projects">
              <FolderKanbanIcon />
              View projects
            </Link>
          </Button>

          <Button asChild>
            <Link href="/projects/new">
              <PlusIcon />
              Create project
            </Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Accessible projects"
          value={summary.accessibleProjectCount}
        />
        <StatCard label="Owned projects" value={summary.ownedProjectCount} />
        <StatCard label="Open tasks" value={summary.openTaskCount} />
        <StatCard
          label="Assigned to me"
          value={summary.assignedToCurrentUserCount}
        />
        <StatCard
          label="In progress"
          value={summary.inProgressTaskCount}
        />
        <StatCard label="Due this week" value={summary.dueThisWeekCount} />
        <StatCard
          label="High priority due this week"
          value={summary.highPriorityDueThisWeekCount}
        />
        <StatCard label="Overdue tasks" value={summary.overdueTaskCount} />
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Accessible projects</h2>
            <p className="text-sm text-muted-foreground">
              Projects you own or are a member of.
            </p>
          </div>

          <Button asChild variant="link">
            <Link href="/projects">View all</Link>
          </Button>
        </div>

        {projectPreview.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-sm text-muted-foreground">
              No projects are available yet.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {projectPreview.map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <CardTitle>{project.name}</CardTitle>
                  <CardDescription>
                    {project.description ?? "No description provided."}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{project._count.member} members</span>
                  <span>{project._count.task} open tasks</span>
                </CardContent>

                <CardContent>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/projects/${project.id}`}>Open project</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="flex items-center gap-2 text-sm text-muted-foreground">
        <ListTodoIcon className="size-4" />
        The dashboard refreshes automatically after project and task changes.
      </section>
    </div>
  );
}