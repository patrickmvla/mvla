"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FormSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function FormSelect({
  value,
  onChange,
  options,
  placeholder = "select...",
}: FormSelectProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex w-full cursor-pointer items-center justify-between border border-border bg-transparent px-3 py-2 text-sm text-primary outline-none focus:border-muted-foreground"
        >
          <span className={selected ? "text-primary" : "text-muted-foreground/50"}>
            {selected?.label ?? placeholder}
          </span>
          <ChevronDown className="size-3 text-muted-foreground/50" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="border border-border bg-black">
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            className={
              option.value === value
                ? "bg-muted/20 text-primary"
                : "text-muted-foreground"
            }
            onSelect={() => {
              onChange(option.value);
              setOpen(false);
            }}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
