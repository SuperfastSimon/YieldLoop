import { cn } from "@/lib/utils";

export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("text-accent", className)} aria-hidden>
      <rect x="2.5" y="8" width="16" height="16" rx="6" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="13.5" y="8" width="16" height="16" rx="6" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
