"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegister } from "@/hooks/use-auth";
import { getApiErrorMessage } from "@/lib/api/client";

const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must contain at least 2 characters.")
      .max(100, "Name must be at most 100 characters."),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Email must be valid.")
      .max(255, "Email must be at most 255 characters."),
    password: z
      .string()
      .min(8, "Password must contain at least 8 characters.")
      .max(72, "Password must be at most 72 characters.")
      .refine(
        (password) => new TextEncoder().encode(password).length <= 72,
        "Password must be at most 72 bytes for bcrypt.",
      ),
    confirmPassword: z.string(),
  })
  .superRefine(({ password, confirmPassword }, context) => {
    if (password !== confirmPassword) {
      context.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "Passwords do not match.",
      });
    }
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const registerUser = useRegister();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
      mode: "onBlur",                                                                                                                                                              
     reValidateMode: "onChange",   
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    try {
      await registerUser.mutateAsync(values);
      router.replace("/dashboard");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  }

  const registerError = registerUser.isError
    ? getApiErrorMessage(registerUser.error)
    : null;

  return (
    <form
      className="space-y-5"
      noValidate
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <div className="space-y-2">
        <Label htmlFor="name">Full name</Label>
        <Input
          id="name"
          autoComplete="name"
          placeholder="Your name"
          disabled={registerUser.isPending}
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
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          disabled={registerUser.isPending}
          aria-invalid={Boolean(form.formState.errors.email)}
          {...form.register("email")}
        />
        {form.formState.errors.email ? (
          <p className="text-sm text-destructive">
            {form.formState.errors.email.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="At least 8 characters"
            disabled={registerUser.isPending}
            className="pr-10"
            aria-invalid={Boolean(form.formState.errors.password)}
            {...form.register("password")}
          />

          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => {
              setShowPassword(!showPassword);
            }}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
        {form.formState.errors.password ? (
          <p className="text-sm text-destructive">
            {form.formState.errors.password.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Repeat your password"
            disabled={registerUser.isPending}
            className="pr-10"
            aria-invalid={Boolean(form.formState.errors.confirmPassword)}
            {...form.register("confirmPassword")}
          />

          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => {
              setShowConfirmPassword(!showConfirmPassword);
            }}
            aria-label={
              showConfirmPassword ? "Hide password" : "Show password"
            }
          >
            {showConfirmPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
        {form.formState.errors.confirmPassword ? (
          <p className="text-sm text-destructive">
            {form.formState.errors.confirmPassword.message}
          </p>
        ) : null}
      </div>

      {registerError ? (
        <p
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {registerError}
        </p>
      ) : null}

      <Button
        type="submit"
        className="w-full"
        disabled={registerUser.isPending}
      >
        {registerUser.isPending ? "Creating account..." : "Create account"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}