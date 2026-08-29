import * as DialogPrimitive from "@radix-ui/react-dialog";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;

export function SheetContent({
  className,
  side = "right",
  children,
  ...props
}: ComponentProps<typeof DialogPrimitive.Content> & { side?: "right" | "bottom" }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-bg/70" />
      <DialogPrimitive.Content
        className={cn(
          "fixed z-50 bg-surface shadow-[var(--shadow-border)] focus:outline-none",
          side === "right" && "top-0 right-0 h-full w-[min(100%,20rem)]",
          side === "bottom" && "right-0 bottom-0 left-0 rounded-t-xl",
          className,
        )}
        {...props}
      >
        <DialogPrimitive.Title className="sr-only">Paneel</DialogPrimitive.Title>
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
