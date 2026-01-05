"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const Sheet = Dialog.Root;
const SheetTrigger = Dialog.Trigger;
const SheetClose = Dialog.Close;

function SheetContent({
  side = "right",
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof Dialog.Content> & {
  side?: "left" | "right";
}) {
  const sideClasses =
    side === "right"
      ? "right-0 top-0 translate-x-full data-[state=open]:translate-x-0"
      : "left-0 top-0 -translate-x-full data-[state=open]:translate-x-0";

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
      <Dialog.Content
        className={cn(
          "fixed z-50 h-full w-[88vw] max-w-sm bg-background shadow-2xl outline-none",
          "transition-transform duration-200 ease-out",
          "flex flex-col",
          sideClasses,
          className
        )}
        {...props}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4">
          <Dialog.Title className="text-sm font-semibold">Menu</Dialog.Title>
          <SheetClose className="inline-flex h-9 w-9 items-center justify-center rounded-xl hover:bg-secondary/70">
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </SheetClose>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain p-4">{children}</div>
      </Dialog.Content>
    </Dialog.Portal>
  );
}

function SheetHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-1", className)} {...props} />;
}

function SheetTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <Dialog.Title className={cn("text-base font-semibold", className)} {...props} />;
}

function SheetDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <Dialog.Description className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

function SheetFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-2", className)} {...props} />;
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter
};
