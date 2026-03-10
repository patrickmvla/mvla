"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import {
  signInSchema,
  signUpSchema,
  type SignInValues,
  type SignUpValues,
} from "@/features/auth/schema";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Oops() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<SignUpValues>({
    resolver: zodResolver(
      mode === "signup" ? signUpSchema : signInSchema
    ) as unknown as NonNullable<
      Parameters<typeof useForm<SignUpValues>>[0]
    >["resolver"],
    defaultValues: { username: "", email: "", password: "" },
  });

  // clear stale errors when switching modes
  useEffect(() => {
    form.clearErrors();
  }, [mode, form]);

  // clear server error on any field change
  useEffect(() => {
    const subscription = form.watch(() => {
      if (serverError) setServerError("");
    });
    return () => subscription.unsubscribe();
  }, [form, serverError]);

  async function onSubmit(data: SignInValues | SignUpValues) {
    setServerError("");

    try {
      if (mode === "signup") {
        const values = data as SignUpValues;
        const res = await authClient.signUp.email({
          email: values.email,
          password: values.password,
          name: values.username,
          username: values.username,
        });
        if (res.error) {
          setServerError(res.error.message ?? "signup failed");
          return;
        }
      } else {
        const res = await authClient.signIn.username({
          username: data.username,
          password: data.password,
        });
        if (res.error) {
          setServerError(res.error.message ?? "invalid credentials");
          return;
        }
      }
      const session = await authClient.getSession();
      if (session.data?.user.role === "admin") {
        router.push("/0x00");
      } else {
        router.push("/");
      }
    } catch {
      setServerError("something went wrong. try again.");
    }
  }

  function switchMode() {
    setMode(mode === "signin" ? "signup" : "signin");
    setServerError("");
    form.reset();
  }

  const inputClass =
    "w-full border border-border bg-transparent px-3 py-2 text-sm text-primary outline-none placeholder:text-muted-foreground/50 focus:border-muted-foreground";

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-xs">
        <h1 className="text-sm text-muted-foreground">
          you found me. now what?
        </h1>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-6 flex flex-col gap-3"
        >
          <div>
            <input
              {...form.register("username")}
              type="text"
              placeholder="username"
              autoComplete="off"
              className={inputClass}
            />
            {form.formState.errors.username && (
              <p className="mt-1 text-[11px] text-red-400">
                {form.formState.errors.username.message}
              </p>
            )}
          </div>

          {mode === "signup" && (
            <div>
              <input
                {...form.register("email")}
                type="email"
                placeholder="email"
                autoComplete="off"
                className={inputClass}
              />
              {form.formState.errors.email && (
                <p className="mt-1 text-[11px] text-red-400">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>
          )}

          <div>
            <div className="relative">
              <input
                {...form.register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="password"
                autoComplete="off"
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground/50 transition-colors hover:text-primary"
              >
                {showPassword ? (
                  <EyeOff className="size-3.5" />
                ) : (
                  <Eye className="size-3.5" />
                )}
              </button>
            </div>
            {form.formState.errors.password && (
              <p className="mt-1 text-[11px] text-red-400">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          {serverError && (
            <p className="text-[11px] text-red-400">{serverError}</p>
          )}

          <button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="cursor-pointer border border-border py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/20 hover:text-primary disabled:opacity-50"
          >
            {form.formState.isSubmitting
              ? "..."
              : mode === "signin"
                ? "get in"
                : "sign up"}
          </button>
        </form>

        <button
          onClick={switchMode}
          className="mt-4 cursor-pointer text-[11px] text-muted-foreground/50 transition-colors hover:text-muted-foreground"
        >
          {mode === "signin" ? "need an account?" : "already have one?"}
        </button>
      </div>
    </div>
  );
}
