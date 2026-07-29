"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateTask,
  useUpdateTask,
} from "@/hooks/use-tasks";
import { getApiErrorMessage } from "@/lib/api/client";
import type {
  CreateTaskInput,
  ProjectMember,
  Task,
} from "@/types/api";
import { toast } from "sonner";

const taskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Task title must contain at least 2 characters.")
    .max(160, "Task title must be at most 160 characters."),
  description: z
    .string()
    .trim()
    .max(5000, "Description must be at most 5000 characters."),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  assigneeId: z.string(),
  dueDate: z.union([
    z.literal(""),
    z.iso.date("Due date must use YYYY-MM-DD format."),
  ]),
});

type TaskFormValues = z.infer<typeof taskSchema>;

type TaskFormProps = {
  projectId: string;
  members: ProjectMember[];
  task?: Task;
  onSuccess: () => void;
  onCancel: () => void;
};

export function TaskForm({
  projectId,
  members,
  task,
  onSuccess,
  onCancel,
}: TaskFormProps) {
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const isEditing = Boolean(task);
  const isPending = createTask.isPending || updateTask.isPending;

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title ?? "",
      description: task?.description ?? "",
      status: task?.status ?? "TODO",
      priority: task?.priority ?? "MEDIUM",
      assigneeId: task?.assigneeId ?? "unassigned",
      dueDate: task?.dueDate ? task.dueDate.slice(0, 10) : "",
    },
  });

  async function onSubmit(values: TaskFormValues) {
    const input: CreateTaskInput = {
      title: values.title,
      description: values.description || null,
      status: values.status,
      priority: values.priority,
      assigneeId:
        values.assigneeId === "unassigned" ? null : values.assigneeId,
      dueDate: values.dueDate || null,
    };

    try {
      if (task) {
        await updateTask.mutateAsync({
          projectId,
          taskId: task.id,
          input,
        });
      } else {
        await createTask.mutateAsync({
          projectId,
          input,
        });
      }

      onSuccess();
    } catch (error){
        toast.error(getApiErrorMessage(error))
     
    }
  }

  const mutationError = isEditing ? updateTask.error : createTask.error;
  const errorMessage =
    (isEditing ? updateTask.isError : createTask.isError)
      ? getApiErrorMessage(mutationError)
      : null;

  return (
    <form
      className="space-y-5"
      noValidate
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <div className="space-y-2">
        <Label htmlFor="task-title">Title</Label>
        <Input
          id="task-title"
          placeholder="Prepare project demo"
          disabled={isPending}
          aria-invalid={Boolean(form.formState.errors.title)}
          {...form.register("title")}
        />
        {form.formState.errors.title ? (
          <p className="text-sm text-destructive">
            {form.formState.errors.title.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="task-description">Description</Label>
        <Textarea
          id="task-description"
          placeholder="Optional task details"
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

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Status</Label>
          <Controller
            control={form.control}
            name="status"
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={isPending}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODO">To do</SelectItem>
                  <SelectItem value="IN_PROGRESS">In progress</SelectItem>
                  <SelectItem value="DONE">Done</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label>Priority</Label>
          <Controller
            control={form.control}
            name="priority"
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={isPending}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label>Assignee</Label>
          <Controller
            control={form.control}
            name="assigneeId"
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={isPending}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {members.map((member) => (
                    <SelectItem key={member.userId} value={member.userId}>
                      {member.user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="task-due-date">Due date</Label>
          <Input
            id="task-due-date"
            type="date"
            disabled={isPending}
            {...form.register("dueDate")}
          />
          {form.formState.errors.dueDate ? (
            <p className="text-sm text-destructive">
              {form.formState.errors.dueDate.message}
            </p>
          ) : null}
        </div>
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
          onClick={onCancel}
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
              : "Create task"}
        </Button>
      </div>
    </form>
  );
}