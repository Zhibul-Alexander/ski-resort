import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: "default" | "secondary" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          "active:translate-y-[1px]",
          variant === "default" && "bg-brand text-white hover:bg-brand/90",
          variant === "secondary" && "bg-secondary text-secondary-foreground hover:bg-brand-hover/15 hover:text-brand",
          variant === "outline" && "border border-border bg-transparent hover:bg-brand-hover/10 hover:border-brand-hover/50 hover:text-brand",
          variant === "ghost" && "bg-transparent hover:bg-brand-hover/10 hover:text-brand",
          size === "default" && "h-10 px-4",
          size === "sm" && "h-9 px-3",
          size === "lg" && "h-11 px-5 text-base",
          size === "icon" && "h-10 w-10",
          className
        )}
        ref={ref}
        suppressHydrationWarning
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
