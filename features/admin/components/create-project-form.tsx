"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createProjectSchema,
  type CreateProjectValues,
} from "@/features/admin/schema";
import { FormSelect } from "./form-select";

const inputClass =
  "w-full border border-border bg-transparent px-3 py-2 text-sm text-primary outline-none placeholder:text-muted-foreground/50 focus:border-muted-foreground";
const labelClass = "text-[10px] uppercase tracking-widest text-muted-foreground";
const errorClass = "mt-1 text-[11px] text-red-400";
const buttonClass =
  "cursor-pointer border border-border py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/20 hover:text-primary disabled:opacity-50";

export function CreateProjectForm() {
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<CreateProjectValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      status: "active",
      href: "",
      description: "",
    },
  });

  async function onSubmit(data: CreateProjectValues) {
    // Phase 1: display the values for manual insertion into TRACKED_REPOS
    void data;
    setSubmitted(true);
  }

  if (submitted) {
    const data = form.getValues();
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          add this to <code className="text-primary">TRACKED_REPOS</code> in{" "}
          <code className="text-primary">features/github/api/index.ts</code>:
        </p>
        <pre className="overflow-x-auto border border-border bg-muted/10 p-4 text-xs text-primary">
{`{
  name: "${data.name}",
  status: "${data.status}" as const,
  href: "${data.href}",
  description: "${data.description}",
}`}
        </pre>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            form.reset();
          }}
          className={buttonClass + " w-full"}
        >
          add another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <p className="text-[11px] text-muted-foreground/50">
        generates config for manual insertion into TRACKED_REPOS
      </p>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>repo name</label>
          <input {...form.register("name")} placeholder="my-project" className={inputClass} />
          {form.formState.errors.name && (
            <p className={errorClass}>{form.formState.errors.name.message}</p>
          )}
        </div>
        <div>
          <label className={labelClass}>status</label>
          <Controller
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormSelect
                value={field.value}
                onChange={field.onChange}
                options={[
                  { value: "active", label: "active" },
                  { value: "shipped", label: "shipped" },
                ]}
              />
            )}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>url</label>
        <input {...form.register("href")} placeholder="https://github.com/..." className={inputClass} />
        {form.formState.errors.href && (
          <p className={errorClass}>{form.formState.errors.href.message}</p>
        )}
      </div>

      <div>
        <label className={labelClass}>description</label>
        <textarea
          {...form.register("description")}
          placeholder="what does this project do?"
          rows={2}
          className={inputClass + " resize-none"}
        />
        {form.formState.errors.description && (
          <p className={errorClass}>{form.formState.errors.description.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={form.formState.isSubmitting}
        className={buttonClass + " w-full"}
      >
        generate config
      </button>
    </form>
  );
}
