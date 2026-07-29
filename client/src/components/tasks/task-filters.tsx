"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  ProjectMember,
  TaskFilters as TaskFiltersValues,
  TaskPriority,
  TaskStatus,
} from "@/types/api";

const allValue = "all";

type TaskFiltersProps = {
  filters: TaskFiltersValues;
  members: ProjectMember[];
  onChange: (filters: TaskFiltersValues) => void;
};

export function TaskFilters({
  filters,
  members,
  onChange,
}: TaskFiltersProps) {
  const hasFilters = Boolean(
    filters.status || filters.priority || filters.assigneeId,
  );

  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 md:flex-row md:items-center">
      <Select
        value={filters.status ?? allValue}
        onValueChange={(value) => {
          onChange({
            ...filters,
            status:
              value === allValue ? undefined : (value as TaskStatus),
          });
        }}
      >
        <SelectTrigger className="w-full md:w-44">
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={allValue}>All statuses</SelectItem>
          <SelectItem value="TODO">To do</SelectItem>
          <SelectItem value="IN_PROGRESS">In progress</SelectItem>
          <SelectItem value="DONE">Done</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.priority ?? allValue}
        onValueChange={(value) => {
          onChange({
            ...filters,
            priority:
              value === allValue ? undefined : (value as TaskPriority),
          });
        }}
      >
        <SelectTrigger className="w-full md:w-44">
          <SelectValue placeholder="All priorities" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={allValue}>All priorities</SelectItem>
          <SelectItem value="LOW">Low</SelectItem>
          <SelectItem value="MEDIUM">Medium</SelectItem>
          <SelectItem value="HIGH">High</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.assigneeId ?? allValue}
        onValueChange={(value) => {
          onChange({
            ...filters,
            assigneeId:
              value === allValue
                ? undefined
                : value === "unassigned"
                  ? "unassigned"
                  : value,
          });
        }}
      >
        <SelectTrigger className="w-full md:w-52">
          <SelectValue placeholder="All assignees" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={allValue}>All assignees</SelectItem>
          <SelectItem value="unassigned">Unassigned</SelectItem>
          {members.map((member) => (
            <SelectItem key={member.userId} value={member.userId}>
              {member.user.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters ? (
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            onChange({});
          }}
        >
          Clear filters
        </Button>
      ) : null}
    </div>
  );
}