"use client";

import type { ReactNode } from "react";
import { AlertCircleIcon, InboxIcon, LoaderCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

type LoadingStateProps = {
  label?: string;
};

type ErrorStateProps = {
  message: string;
  onRetry: () => void;
};

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function LoadingState({ label = "Loading..." }: LoadingStateProps) {
  return (
    <div className="flex min-h-48 items-center justify-center gap-2 text-sm text-muted-foreground">
      <LoaderCircleIcon className="size-4 animate-spin" />
      {label}
    </div>
  );
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center gap-4 rounded-lg border bg-card p-6 text-center">
      <AlertCircleIcon className="size-6 text-destructive" />
      <div className="space-y-1">
        <h2 className="font-medium">Something went wrong</h2>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={onRetry}
      >
        Try again
      </Button>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center gap-4 rounded-lg border border-dashed bg-card p-6 text-center">
      <InboxIcon className="size-6 text-muted-foreground" />
      <div className="space-y-1">
        <h2 className="font-medium">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  );
}