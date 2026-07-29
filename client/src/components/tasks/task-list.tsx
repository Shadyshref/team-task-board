"use client";

import { useState } from "react";
import { PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";

import { DeleteConfirmation } from "@/components/shared/delete-confirmation";
import { TaskForm } from "@/components/tasks/task-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDeleteTask } from "@/hooks/use-tasks";
import { getApiErrorMessage } from "@/lib/api/client";
import type { ProjectMember, Task } from "@/types/api";
import { toast } from "sonner";

const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

type TaskListProps = {
  projectId: string;
  tasks: Task[];
  members: ProjectMember[];
};

function formatStatus(status: Task["status"]) {
  return status.replace("_", " ").toLowerCase();
}

function formatPriority(priority: Task["priority"]) {
  return priority.charAt(0) + priority.slice(1).toLowerCase();
}

function formatDueDate(dueDate: string | null) {
  if (!dueDate) {
    return "No due date";
  }

  return dateFormatter.format(
    new Date(`${dueDate.slice(0, 10)}T00:00:00`),
  );
}

export function TaskList({
  projectId,
  tasks,
  members,
}: TaskListProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const deleteTask = useDeleteTask();

  async function handleDeleteTask() {
    if (!taskToDelete) {
      return;
    }

    try {
      await deleteTask.mutateAsync({
        projectId,
        taskId: taskToDelete.id,
      });

      setTaskToDelete(null);
    } catch (error) {
        toast.error(getApiErrorMessage(error));
     
    }
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Tasks ({tasks.length})</CardTitle>

        <Button
          type="button"
          size="sm"
          onClick={() => {
            setCreateOpen(true);
          }}
        >
          <PlusIcon />
          Create task
        </Button>
      </CardHeader>

      <CardContent>
        {tasks.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No tasks match the current filters.
          </p>
        ) : (
          <>
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Assignee</TableHead>
                    <TableHead>Creator</TableHead>
                    <TableHead>Due date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="max-w-56 whitespace-normal">
                        <p className="font-medium">{task.title}</p>
                        {task.description ? (
                          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                            {task.description}
                          </p>
                        ) : null}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {formatStatus(task.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {formatPriority(task.priority)}
                        </Badge>
                      </TableCell>
                      <TableCell>{task.assignee?.name ?? "Unassigned"}</TableCell>
                      <TableCell>{task.creator.name}</TableCell>
                      <TableCell>{formatDueDate(task.dueDate)}</TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon-sm"
                            onClick={() => {
                              setTaskToEdit(task);
                            }}
                          >
                            <PencilIcon />
                            <span className="sr-only">Edit task</span>
                          </Button>

                          <Button
                            type="button"
                            variant="destructive"
                            size="icon-sm"
                            onClick={() => {
                              setTaskToDelete(task);
                            }}
                          >
                            <Trash2Icon />
                            <span className="sr-only">Delete task</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="space-y-3 md:hidden">
              {tasks.map((task) => (
                <article key={task.id} className="rounded-lg border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-medium">{task.title}</h3>
                      {task.description ? (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {task.description}
                        </p>
                      ) : null}
                    </div>

                    <div className="flex gap-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        onClick={() => {
                          setTaskToEdit(task);
                        }}
                      >
                        <PencilIcon />
                        <span className="sr-only">Edit task</span>
                      </Button>

                      <Button
                        type="button"
                        variant="destructive"
                        size="icon-sm"
                        onClick={() => {
                          setTaskToDelete(task);
                        }}
                      >
                        <Trash2Icon />
                        <span className="sr-only">Delete task</span>
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Status</p>
                      <p>{formatStatus(task.status)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Priority</p>
                      <p>{formatPriority(task.priority)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Assignee</p>
                      <p>{task.assignee?.name ?? "Unassigned"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Due date</p>
                      <p>{formatDueDate(task.dueDate)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Creator</p>
                      <p>{task.creator.name}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </CardContent>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create task</DialogTitle>
            <DialogDescription>
              Add a task and optionally assign it to a project member.
            </DialogDescription>
          </DialogHeader>

          {createOpen ? (
            <TaskForm
              projectId={projectId}
              members={members}
              onSuccess={() => {
                setCreateOpen(false);
              }}
              onCancel={() => {
                setCreateOpen(false);
              }}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(taskToEdit)}
        onOpenChange={(open) => {
          if (!open) {
            setTaskToEdit(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit task</DialogTitle>
            <DialogDescription>
              Update the task details, assignee, status, or priority.
            </DialogDescription>
          </DialogHeader>

          {taskToEdit ? (
            <TaskForm
              key={taskToEdit.id}
              projectId={projectId}
              members={members}
              task={taskToEdit}
              onSuccess={() => {
                setTaskToEdit(null);
              }}
              onCancel={() => {
                setTaskToEdit(null);
              }}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      <DeleteConfirmation
        open={Boolean(taskToDelete)}
        onOpenChange={(open) => {
          if (!open) {
            setTaskToDelete(null);
          }
        }}
        title="Delete task"
        description={
          taskToDelete
            ? `Delete "${taskToDelete.title}" permanently?`
            : ""
        }
        confirmLabel="Delete task"
        isPending={deleteTask.isPending}
        errorMessage={
          deleteTask.isError
            ? getApiErrorMessage(deleteTask.error)
            : undefined
        }
        onConfirm={handleDeleteTask}
      />
    </Card>
  );
}