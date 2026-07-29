import { ProjectForm } from "@/components/projects/project-form";

export default function NewProjectPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Create project
        </h1>
        <p className="text-sm text-muted-foreground">
          Add a project, then invite members and create tasks.
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <ProjectForm />
      </div>
    </div>
  );
}