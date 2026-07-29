"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeftIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import { MembersSection } from "@/components/project-members/members-section";
import { EditProjectDialog } from "@/components/projects/edit-project-dialog";
import { DeleteConfirmation } from "@/components/shared/delete-confirmation";
import { ErrorState, LoadingState } from "@/components/shared/query-state";
import { TaskFilters } from "@/components/tasks/task-filters";
import { TaskList } from "@/components/tasks/task-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCurrentUser } from "@/hooks/use-auth";
import { useProjectSummary } from "@/hooks/use-dashboard";
import { useProjectMembers } from "@/hooks/use-project-members";
import { useDeleteProject, useProject } from "@/hooks/use-projects";
import { useProjectTasks } from "@/hooks/use-tasks";
import { getApiErrorMessage } from "@/lib/api/client";
import type { TaskFilters as TaskFiltersValues } from "@/types/api";

type SummaryCardProps = {
  label: string;
  value: number;
};

function SummaryCard({ label, value }: SummaryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
}

export default function ProjectDetailsPage() {
  const router = useRouter();
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;

  const [filters, setFilters] = useState<TaskFiltersValues>({});
  const [deleteOpen, setDeleteOpen] = useState(false);

  const userQuery = useCurrentUser();
  const projectQuery = useProject(projectId);
  const summaryQuery = useProjectSummary(projectId);
  const membersQuery = useProjectMembers(projectId);
  const tasksQuery = useProjectTasks(projectId, filters);
  const deleteProject = useDeleteProject();

  const isLoading =
    userQuery.isPending ||
    projectQuery.isPending ||
    summaryQuery.isPending ||
    membersQuery.isPending ||
    tasksQuery.isPending;

  const pageError =
    userQuery.error ||
    projectQuery.error ||
    summaryQuery.error ||
    membersQuery.error ||
    tasksQuery.error;

  function retryPageData() {
    void userQuery.refetch();
    void projectQuery.refetch();
    void summaryQuery.refetch();
    void membersQuery.refetch();
    void tasksQuery.refetch();
  }

  async function handleDeleteProject() {
    try {
      await deleteProject.mutateAsync(projectId);
      toast.success("Project deleted successfully.");
      router.replace("/projects");
    } catch (error) {
      const errorMessage = getApiErrorMessage(error);
      toast.error(errorMessage);
    }
  }

  if (isLoading) {
    return <LoadingState label="Loading project..." />;
  }

  if (pageError) {
    return (
      <ErrorState
        message={getApiErrorMessage(pageError)}
        onRetry={retryPageData}
      />
    );
  }

  const user = userQuery.data;
  const project = projectQuery.data;
  const summary = summaryQuery.data;
  const members = membersQuery.data;
  const tasks = tasksQuery.data;

  if (!user || !project || !summary || !members || !tasks) {
    return null;
  }

  const isAdmin = user.role === "ADMIN";
  const isOwner = project.ownerId === user.id;
  const canManageProject = isAdmin || isOwner;

  return (
    <div className="space-y-8">
      <Button asChild variant="ghost" className="-ml-2">
        <Link href="/projects">
          <ArrowLeftIcon />
          Back to projects
        </Link>
      </Button>

      <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-semibold tracking-tight">
              {project.name}
            </h1>

            <Badge variant={canManageProject ? "default" : "secondary"}>
              {isOwner ? "Owner" : "Member"}
            </Badge>
          </div>

          <p className="max-w-3xl text-sm text-muted-foreground">
            {project.description ?? "No description provided."}
          </p>

          <p className="text-sm text-muted-foreground">
            Owner: {project.owner.name} ({project.owner.email})
          </p>
        </div>

        {canManageProject ? (
          <div className="flex flex-wrap gap-2">
            <EditProjectDialog project={project} />

            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                setDeleteOpen(true);
              }}
            >
              <Trash2Icon />
              Delete project
            </Button>
          </div>
        ) : null}
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <SummaryCard label="Members" value={summary.memberCount} />
        <SummaryCard label="Total tasks" value={summary.taskCount} />
        <SummaryCard label="Open tasks" value={summary.openTaskCount} />
        <SummaryCard label="Overdue tasks" value={summary.overdueTaskCount} />
        <SummaryCard
          label="Assigned to me"
          value={summary.assignedToCurrentUserCount}
        />
      </section>

      <MembersSection
        projectId={projectId}
        members={members}
        canManageProject={canManageProject}
      />

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Tasks</h2>
          <p className="text-sm text-muted-foreground">
            Everyone with project access can manage tasks.
          </p>
        </div>

        <TaskFilters
          filters={filters}
          members={members}
          onChange={setFilters}
        />

        <TaskList projectId={projectId} tasks={tasks} members={members} />
      </section>

      <DeleteConfirmation
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete project"
        description={`Delete "${project.name}" permanently? This also removes its members and tasks.`}
        confirmLabel="Delete project"
        isPending={deleteProject.isPending}
        errorMessage={
          deleteProject.isError
            ? getApiErrorMessage(deleteProject.error)
            : undefined
        }
        onConfirm={handleDeleteProject}
      />
    </div>
  );
}
