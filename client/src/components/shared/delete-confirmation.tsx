"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type DeleteConfirmationProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  isPending: boolean;
  errorMessage?: string;
  onConfirm: () => Promise<void>;
};

export function DeleteConfirmation({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  isPending,
  errorMessage,
  onConfirm,
}: DeleteConfirmationProps) {
  async function handleConfirm() {
    await onConfirm();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!isPending) {
          onOpenChange(nextOpen);
        }
      }}
    >
      <DialogContent showCloseButton={!isPending}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {errorMessage ? (
          <p
            role="alert"
            className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {errorMessage}
          </p>
        ) : null}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => {
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="destructive"
            disabled={isPending}
            onClick={() => {
              void handleConfirm();
            }}
          >
            {isPending ? "Deleting..." : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}