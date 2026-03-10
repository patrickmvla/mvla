"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  createRabbitHoleSchema,
  type CreateRabbitHoleValues,
} from "@/features/admin/schema";
import { AdminPlateEditor } from "./plate-editor";
import { FormSelect } from "./form-select";

const inputClass =
  "w-full border border-border bg-transparent px-3 py-2 text-sm text-primary outline-none placeholder:text-muted-foreground/50 focus:border-muted-foreground";
const labelClass = "text-[10px] uppercase tracking-widest text-muted-foreground";
const errorClass = "mt-1 text-[11px] text-red-400";

export function CreateRabbitHoleForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [serverError, setServerError] = useState("");
  const [tagInput, setTagInput] = useState("");

  const form = useForm<CreateRabbitHoleValues>({
    resolver: zodResolver(createRabbitHoleSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "concept",
      tags: [],
      url: "",
      repo: "",
      status: "queued",
      notes: "",
      published: false,
    },
  });

  const tags = form.watch("tags");

  function addTag() {
    const trimmed = tagInput.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      form.setValue("tags", [...tags, trimmed], { shouldValidate: true });
    }
    setTagInput("");
  }

  function removeTag(tag: string) {
    form.setValue(
      "tags",
      tags.filter((t) => t !== tag),
      { shouldValidate: true }
    );
  }

  async function onSubmit(data: CreateRabbitHoleValues) {
    setServerError("");
    try {
      const res = await fetch("/api/rabbit-holes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json();
        setServerError(err.error ?? "failed to create rabbit hole");
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["admin", "rabbit-holes"] });
      router.push("/0x00");
    } catch {
      setServerError("something went wrong");
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {/* title */}
      <div>
        <label className={labelClass}>title</label>
        <input {...form.register("title")} placeholder="Rabbit Hole Title" className={inputClass} />
        {form.formState.errors.title && (
          <p className={errorClass}>{form.formState.errors.title.message}</p>
        )}
      </div>

      {/* description */}
      <div>
        <label className={labelClass}>description</label>
        <Textarea
          {...form.register("description")}
          placeholder="brief description"
        />
        {form.formState.errors.description && (
          <p className={errorClass}>{form.formState.errors.description.message}</p>
        )}
      </div>

      {/* category + status */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>category</label>
          <Controller
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormSelect
                value={field.value}
                onChange={field.onChange}
                options={[
                  { value: "paper", label: "paper" },
                  { value: "repo", label: "repo" },
                  { value: "book", label: "book" },
                  { value: "talk", label: "talk" },
                  { value: "tool", label: "tool" },
                  { value: "concept", label: "concept" },
                ]}
              />
            )}
          />
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
                  { value: "queued", label: "queued" },
                  { value: "exploring", label: "exploring" },
                  { value: "absorbed", label: "absorbed" },
                ]}
              />
            )}
          />
        </div>
      </div>

      {/* url + repo */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>url (optional)</label>
          <input {...form.register("url")} placeholder="https://..." className={inputClass} />
          {form.formState.errors.url && (
            <p className={errorClass}>{form.formState.errors.url.message}</p>
          )}
        </div>
        <div>
          <label className={labelClass}>repo (optional)</label>
          <input {...form.register("repo")} placeholder="user/repo" className={inputClass} />
        </div>
      </div>

      {/* tags */}
      <div>
        <label className={labelClass}>tags</label>
        <div className="flex gap-2">
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              }
            }}
            placeholder="add tag + enter"
            className={inputClass}
          />
        </div>
        {tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 border border-border px-2 py-0.5 text-[11px] text-muted-foreground"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="cursor-pointer text-muted-foreground/50 hover:text-primary"
                >
                  <X className="size-2.5" />
                </button>
              </span>
            ))}
          </div>
        )}
        {form.formState.errors.tags && (
          <p className={errorClass}>{form.formState.errors.tags.message}</p>
        )}
      </div>

      {/* notes — Plate editor */}
      <div>
        <label className={labelClass}>notes</label>
        <Controller
          control={form.control}
          name="notes"
          render={({ field }) => (
            <AdminPlateEditor
              value={field.value ?? ""}
              onChange={field.onChange}
              placeholder="Write notes..."
            />
          )}
        />
        {form.formState.errors.notes && (
          <p className={errorClass}>{form.formState.errors.notes.message}</p>
        )}
      </div>

      {/* published */}
      <Controller
        control={form.control}
        name="published"
        render={({ field }) => (
          <label className="flex items-center gap-2.5 cursor-pointer">
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <span className="text-sm text-muted-foreground">publish immediately</span>
          </label>
        )}
      />

      {serverError && <p className={errorClass}>{serverError}</p>}

      <Button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="w-full"
      >
        {form.formState.isSubmitting ? "creating..." : "create rabbit hole"}
      </Button>
    </form>
  );
}
