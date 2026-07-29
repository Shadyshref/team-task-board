"use client";

import { useState } from "react";
import { PlusIcon, Trash2Icon } from "lucide-react";

import { AddMemberForm } from "@/components/project-members/add-member-form";
import { DeleteConfirmation } from "@/components/shared/delete-confirmation";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRemoveProjectMember } from "@/hooks/use-project-members";
import { getApiErrorMessage } from "@/lib/api/client";
import type { ProjectMember } from "@/types/api";
import { toast } from "sonner";

type MembersSectionProps = {
  projectId: string;
  members: ProjectMember[];
  canManageProject: boolean;
};

export function MembersSection({
  projectId,
  members,
  canManageProject,
}: MembersSectionProps) {
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] =
    useState<ProjectMember | null>(null);
  const removeMember = useRemoveProjectMember();

  async function handleRemoveMember() {
    if (!memberToRemove) {
      return;
    }

    try {
      await removeMember.mutateAsync({
        projectId,
        userId: memberToRemove.userId,
      });

      setMemberToRemove(null);
    } catch (error) {
        toast.error(getApiErrorMessage(error))
      
    }
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Members ({members.length})</CardTitle>

        {canManageProject ? (
          <Dialog open={addMemberOpen} onOpenChange={setAddMemberOpen}>
            <DialogTrigger asChild>
              <Button type="button" size="sm">
                <PlusIcon />
                Add member
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add project member</DialogTitle>
                <DialogDescription>
                  Enter the email address of an already registered user.
                </DialogDescription>
              </DialogHeader>

              <AddMemberForm
                projectId={projectId}
                onSuccess={() => {
                  setAddMemberOpen(false);
                }}
              />
            </DialogContent>
          </Dialog>
        ) : null}
      </CardHeader>

      <CardContent>
        <ul className="divide-y">
          {members.map((member) => (
            <li
              key={member.userId}
              className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">{member.user.name}</p>
                  {member.isOwner ? <Badge>Owner</Badge> : null}
                  <Badge variant="secondary">{member.user.role}</Badge>
                </div>
                <p className="truncate text-sm text-muted-foreground">
                  {member.user.email}
                </p>
              </div>

              {canManageProject && !member.isOwner ? (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setMemberToRemove(member);
                  }}
                >
                  <Trash2Icon />
                  Remove
                </Button>
              ) : null}
            </li>
          ))}
        </ul>
      </CardContent>

      <DeleteConfirmation
        open={Boolean(memberToRemove)}
        onOpenChange={(open) => {
          if (!open) {
            setMemberToRemove(null);
          }
        }}
        title="Remove member"
        description={
          memberToRemove
            ? `Remove ${memberToRemove.user.name} from this project? Their tasks will become unassigned.`
            : ""
        }
        confirmLabel="Remove member"
        isPending={removeMember.isPending}
        errorMessage={
          removeMember.isError
            ? getApiErrorMessage(removeMember.error)
            : undefined
        }
        onConfirm={handleRemoveMember}
      />
    </Card>
  );
}