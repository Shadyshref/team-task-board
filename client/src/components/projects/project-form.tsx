"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateProject,
  useUpdateProject,
} from "@/hooks/use-projects";
import { getApiErrorMessage } from "@/lib/api/client";
import type { CreateProjectInput, Project } from "@/types/api";

const projectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Project name must contain at least 2 characters.")
    .max(120, "Project name must be at most 120 characters."),
  description: z
    .string()
    .trim()
    .max(2000, "Description must be at most 2000 characters."),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

type ProjectFormProps = {
  project?: Project;
  onSuccess?: (project: Project) => void;
  onCancel?: () => void;
};

export function ProjectForm({
  project,
  onSuccess,
  onCancel,
}: ProjectFormProps) {
  const router = useRouter();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const isEditing = Boolean(project);
  const isPending = createProject.isPending || updateProject.isPending;

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: project?.name ?? "",
      description: project?.description ?? "",
    },
  });

  async function onSubmit(values: ProjectFormValues) {
    const input: CreateProjectInput = {
      name: values.name,
      description: values.description || null,
    };

    try {
      if (project) {
        const updatedProject = await updateProject.mutateAsync({
          projectId: project.id,
          input,
        });

        onSuccess?.(updatedProject);
        return;
      }

      const createdProject = await createProject.mutateAsync(input);
      router.replace(`/projects/${createdProject.id}`);
    } catch {
      // The safe backend error is rendered below.
    }
  }

  const mutationError = isEditing
    ? updateProject.error
    : createProject.error;

  const errorMessage =
    (isEditing ? updateProject.isError : createProject.isError)
      ? getApiErrorMessage(mutationError)
      : null;

  function handleCancel() {
    if (onCancel) {
      onCancel();
      return;
    }

    router.push("/projects");
  }

  return (
    <form
      className="space-y-5"
      noValidate
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <div className="space-y-2">
        <Label htmlFor="project-name">Project name</Label>
        <Input
          id="project-name"
          placeholder="Website redesign"
          disabled={isPending}
          aria-invalid={Boolean(form.formState.errors.name)}
          {...form.register("name")}
        />
        {form.formState.errors.name ? (
          <p className="text-sm text-destructive">
            {form.formState.errors.name.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="project-description">Description</Label>
        <Textarea
          id="project-description"
          placeholder="Describe the project goals and scope."
          disabled={isPending}
          aria-invalid={Boolean(form.formState.errors.description)}
          {...form.register("description")}
        />
        {form.formState.errors.description ? (
          <p className="text-sm text-destructive">
            {form.formState.errors.description.message}
          </p>
        ) : null}
      </div>

      {errorMessage ? (
        <p
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {errorMessage}
        </p>
      ) : null}

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={handleCancel}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={isPending}>
          {isPending
            ? isEditing
              ? "Saving..."
              : "Creating..."
            : isEditing
              ? "Save changes"
              : "Create project"}
        </Button>
      </div>
    </form>
  );
}