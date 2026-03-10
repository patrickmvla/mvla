import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center border text-sm whitespace-nowrap transition-colors outline-none select-none cursor-pointer disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "border-border bg-transparent text-muted-foreground hover:bg-muted/20 hover:text-primary",
        primary:
          "border-primary bg-primary text-primary-foreground hover:bg-primary/90",
        ghost:
          "border-transparent text-muted-foreground hover:text-primary",
        destructive:
          "border-red-400/30 text-red-400 hover:bg-red-400/10",
      },
      size: {
        default: "h-9 gap-1.5 px-4 py-2",
        sm: "h-7 gap-1 px-2.5 text-xs",
        lg: "h-10 gap-2 px-6",
        icon: "size-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
