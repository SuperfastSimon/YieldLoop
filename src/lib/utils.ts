import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function eur(n: number, lang: "nl-NL" | "en-US" = "nl-NL"): string {
  return new Intl.NumberFormat(lang, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(n);
}

export function pct(n: number): string {
  return `${(n * 100).toFixed(1)}%`;
}

export function shortId(id: string): string {
  const parts = id.split("_");
  return parts[parts.length - 1]?.slice(0, 8) ?? id.slice(0, 8);
}

export function formatWhen(iso: string, lang: "nl-NL" | "en-US" = "nl-NL"): string {
  const d = new Date(iso);
  return new Intl.DateTimeFormat(lang, {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}
