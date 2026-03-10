"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Plus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  createIdeaSchema,
  type CreateIdeaValues,
} from "@/features/admin/schema";
import { AdminPlateEditor } from "./plate-editor";
import { FormSelect } from "./form-select";

const inputClass =
  "w-full border border-border bg-transparent px-3 py-2 text-sm text-primary outline-none placeholder:text-muted-foreground/50 focus:border-muted-foreground";
const labelClass = "text-[10px] uppercase tracking-widest text-muted-foreground";
const errorClass = "mt-1 text-[11px] text-red-400";

export function CreateIdeaForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [serverError, setServerError] = useState("");
  const [tagInput, setTagInput] = useState("");

  const form = useForm<CreateIdeaValues>({
    resolver: zodResolver(createIdeaSchema),
    defaultValues: {
      slug: "",
      title: "",
      category: "",
      description: "",
      content: "",
      tags: [],
      stage: "thinking",
      complexity: "small",
      published: false,
      inspirationLinks: [],
    },
  });

  const {
    fields: linkFields,
    append: appendLink,
    remove: removeLink,
  } = useFieldArray({ control: form.control, name: "inspirationLinks" });

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

  async function onSubmit(data: CreateIdeaValues) {
    setServerError("");
    try {
      const res = await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json();
        const msg: string = err.error ?? "failed to create idea";
        if (res.status === 409 && msg.includes("slug")) {
          form.setError("slug", { message: msg });
        } else {
          setServerError(msg);
        }
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["admin", "ideas"] });
      router.push("/0x00");
    } catch {
      setServerError("something went wrong");
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {/* slug + title */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>slug</label>
          <input {...form.register("slug")} placeholder="my-idea" className={inputClass} />
          {form.formState.errors.slug && (
            <p className={errorClass}>{form.formState.errors.slug.message}</p>
          )}
        </div>
        <div>
          <label className={labelClass}>title</label>
          <input {...form.register("title")} placeholder="My Idea" className={inputClass} />
          {form.formState.errors.title && (
            <p className={errorClass}>{form.formState.errors.title.message}</p>
          )}
        </div>
      </div>

      {/* category + stage + complexity */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>category</label>
          <input {...form.register("category")} placeholder="devtools" className={inputClass} />
          {form.formState.errors.category && (
            <p className={errorClass}>{form.formState.errors.category.message}</p>
          )}
        </div>
        <div>
          <label className={labelClass}>stage</label>
          <Controller
            control={form.control}
            name="stage"
            render={({ field }) => (
              <FormSelect
                value={field.value}
                onChange={field.onChange}
                options={[
                  { value: "thinking", label: "thinking" },
                  { value: "researching", label: "researching" },
                  { value: "scoping", label: "scoping" },
                  { value: "building", label: "building" },
                ]}
              />
            )}
          />
        </div>
        <div>
          <label className={labelClass}>complexity</label>
          <Controller
            control={form.control}
            name="complexity"
            render={({ field }) => (
              <FormSelect
                value={field.value}
                onChange={field.onChange}
                options={[
                  { value: "small", label: "small" },
                  { value: "medium", label: "medium" },
                  { value: "ambitious", label: "ambitious" },
                ]}
              />
            )}
          />
        </div>
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

      {/* content — Plate editor */}
      <div>
        <label className={labelClass}>content</label>
        <Controller
          control={form.control}
          name="content"
          render={({ field }) => (
            <AdminPlateEditor
              value={field.value}
              onChange={field.onChange}
              placeholder="Write your idea content..."
            />
          )}
        />
        {form.formState.errors.content && (
          <p className={errorClass}>{form.formState.errors.content.message}</p>
        )}
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

      {/* inspiration links */}
      <div>
        <label className={labelClass}>inspiration links</label>
        <div className="flex flex-col gap-2">
          {linkFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <input
                {...form.register(`inspirationLinks.${index}.label`)}
                placeholder="label"
                className={inputClass}
              />
              <input
                {...form.register(`inspirationLinks.${index}.href`)}
                placeholder="https://..."
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => removeLink(index)}
                className="cursor-pointer px-2 text-muted-foreground/50 hover:text-primary"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendLink({ label: "", href: "" })}
            className="flex items-center gap-1 text-[11px] text-muted-foreground/50 transition-colors hover:text-primary cursor-pointer"
          >
            <Plus className="size-3" />
            add link
          </button>
        </div>
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
        {form.formState.isSubmitting ? "creating..." : "create idea"}
      </Button>
    </form>
  );
}
