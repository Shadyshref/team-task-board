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
import { useLogin } from "@/hooks/use-auth";
import { getApiErrorMessage } from "@/lib/api/client";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Enter a valid email address."),

  password: z
    .string()
    .min(1, "Password is required."),
});

type LoginFormValues = z.infer<
  typeof loginSchema
>;

export function LoginForm() {
  const router = useRouter();
  const login = useLogin();
  
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(
    values: LoginFormValues,
  ) {
    try {
      await login.mutateAsync(values);

      router.replace("/dashboard");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  }

  const loginError = login.isError
    ? getApiErrorMessage(login.error)
    : null;

  return (
    <form
      className="space-y-5"
      noValidate
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <div className="space-y-2">
        <Label htmlFor="email">
          Email address
        </Label>

        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          disabled={login.isPending}
          aria-invalid={Boolean(
            form.formState.errors.email,
          )}
          aria-describedby={
            form.formState.errors.email
              ? "email-error"
              : undefined
          }
          {...form.register("email")}
        />

        {form.formState.errors.email ? (
          <p
            id="email-error"
            className="text-sm text-destructive"
          >
            {
              form.formState.errors.email
                .message
            }
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">
          Password
        </Label>

        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
            disabled={login.isPending}
            className="pr-10"
            aria-invalid={Boolean(
              form.formState.errors.password,
            )}
            aria-describedby={
              form.formState.errors.password
                ? "password-error"
                : undefined
            }
            {...form.register("password")}
          />

          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => {
              setShowPassword(!showPassword);
            }}
            aria-label={
              showPassword
                ? "Hide password"
                : "Show password"
            }
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>

        {form.formState.errors.password ? (
          <p
            id="password-error"
            className="text-sm text-destructive"
          >
            {
              form.formState.errors.password
                .message
            }
          </p>
        ) : null}
      </div>

      {loginError ? (
        <p
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {loginError}
        </p>
      ) : null}

      <Button
        type="submit"
        className="w-full"
        disabled={login.isPending}
      >
        {login.isPending
          ? "Signing in..."
          : "Sign in"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Do not have an account?{" "}

        <Link
          href="/register"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Create one
        </Link>
      </p>
    </form>
  );
}