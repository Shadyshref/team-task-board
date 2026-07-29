"use client";

import Link from "next/link";
import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/projects/project-card";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/components/shared/query-state";
import { useCurrentUser } from "@/hooks/use-auth";
import { useProjects } from "@/hooks/use-projects";
import { getApiErrorMessage } from "@/lib/api/client";

export default function ProjectsPage() {
  const { data: user } = useCurrentUser();
  const projects = useProjects();

  if (projects.isPending) {
    return <LoadingState label="Loading projects..." />;
  }

  if (projects.isError) {
    return (
      <ErrorState
        message={getApiErrorMessage(projects.error)}
        onRetry={() => {
          void projects.refetch();
        }}
      />
    );
  }

  if (!user || !projects.data) {
    return null;
  }

  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground">
            Projects you own or have access to as a member.
          </p>
        </div>

        <Button asChild>
          <Link href="/projects/new">
            <PlusIcon />
            Create project
          </Link>
        </Button>
      </section>

      {projects.data.length === 0 ? (
        <EmptyState
          title="No projects yet"
          description="Create your first project to begin organizing work."
          action={
            <Button asChild>
              <Link href="/projects/new">
                <PlusIcon />
                Create project
              </Link>
            </Button>
          }
        />
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {projects.data.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              currentUserId={user.id}
            />
          ))}
        </section>
      )}
    </div>
  );
}