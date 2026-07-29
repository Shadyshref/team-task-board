"use client";

import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAddProjectMember } from "@/hooks/use-project-members";
import { getApiErrorMessage } from "@/lib/api/client";

const addMemberSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Email must be valid.")
    .max(255, "Email must be at most 255 characters."),
});

type AddMemberFormValues = z.infer<typeof addMemberSchema>;

type AddMemberFormProps = {
  projectId: string;
  onSuccess: () => void;
};

export function AddMemberForm({
  projectId,
  onSuccess,
}: AddMemberFormProps) {
  const addMember = useAddProjectMember();

  const form = useForm<AddMemberFormValues>({
    resolver: zodResolver(addMemberSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: AddMemberFormValues) {
    try {
      await addMember.mutateAsync({
        projectId,
        input: values,
      });

      toast.success("Member added successfully.");
      form.reset();
      onSuccess();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  }

  const errorMessage = addMember.isError
    ? getApiErrorMessage(addMember.error)
    : null;

  return (
    <form
      className="space-y-5"
      noValidate
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <div className="space-y-2">
        <Label htmlFor="member-email">Registered user email</Label>
        <Input
          id="member-email"
          type="email"
          autoComplete="email"
          placeholder="member@example.com"
          disabled={addMember.isPending}
          aria-invalid={Boolean(form.formState.errors.email)}
          {...form.register("email")}
        />
        {form.formState.errors.email ? (
          <p className="text-sm text-destructive">
            {form.formState.errors.email.message}
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

      <Button type="submit" className="w-full" disabled={addMember.isPending}>
        {addMember.isPending ? "Adding member..." : "Add member"}
      </Button>
    </form>
  );
}