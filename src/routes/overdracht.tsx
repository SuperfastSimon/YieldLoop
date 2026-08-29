import { createFileRoute } from "@tanstack/react-router";
import { Check, Copy, Download } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/overdracht")({ component: OverdrachtPage });

const FILES = [
  {
    href: "/YIELDLOOP_OVERDRACHT.md",
    name: "YIELDLOOP_OVERDRACHT.md",
    title: "Volledige overdracht",
    lede: "Startprompt + alle broncode. Upload dit bestand in een nieuw Grok-gesprek.",
  },
  {
    href: "/YIELDLOOP_NIEUW_GESPREK.md",
    name: "YIELDLOOP_NIEUW_GESPREK.md",
    title: "Startprompt",
    lede: "Kort. Plakken als eerste bericht als je de broncode apart uploadt.",
  },
  {
    href: "/HANDOVER.md",
    name: "HANDOVER.md",
    title: "Handover",
    lede: "Zero-context samenvatting: clone-gates, invariants, routes.",
  },
] as const;

async function readMarkdown(href: string): Promise<string> {
  const res = await fetch(href);
  if (!res.ok) throw new Error(`Kon ${href} niet laden`);
  return res.text();
}

function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  }
}

function OverdrachtPage() {
  const [active, setActive] = useState(0);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const areaRef = useRef<HTMLTextAreaElement>(null);
  const file = FILES[active];

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setCopied(false);
    void readMarkdown(file.href)
      .then((body) => {
        if (!cancelled) setText(body);
      })
      .catch(() => {
        if (!cancelled) {
          setText("");
          toast.error("Bestand kon niet geladen worden");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [file.href]);

  async function onCopy() {
    if (!text) return;
    const ok = await copyText(text);
    if (ok) {
      setCopied(true);
      toast.success(`${file.name} gekopieerd`);
      window.setTimeout(() => setCopied(false), 2000);
    } else {
      toast.message("Selecteer de tekst hieronder en kopieer");
      areaRef.current?.focus();
      areaRef.current?.select();
    }
  }

  function onDownload() {
    if (!text) return;
    downloadText(file.name, text);
    toast.success(`${file.name} gedownload`);
  }

  function onSelectAll() {
    areaRef.current?.focus();
    areaRef.current?.select();
  }

  return (
    <div>
      <PageHeader
        kicker="Overdracht"
        title="Markdown voor een nieuw Grok-gesprek"
        lede="Geen zip, geen link die de andere agent niet kan openen. Kopieer of download het markdown-bestand en upload het als bijlage in het nieuwe gesprek."
        actions={
          <>
            <Button onClick={() => void onCopy()} disabled={loading || !text}>
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              {copied ? "Gekopieerd" : "Kopieer markdown"}
            </Button>
            <Button variant="secondary" onClick={onDownload} disabled={loading || !text}>
              <Download className="size-4" />
              Download .md
            </Button>
          </>
        }
      />

      <section className="grid gap-3 px-5 py-6 sm:grid-cols-3">
        {FILES.map((item, i) => (
          <button
            key={item.name}
            type="button"
            onClick={() => setActive(i)}
            className={
              i === active
                ? "rounded-xl bg-elevated p-4 text-left shadow-[var(--shadow-border-hover)]"
                : "rounded-xl bg-surface p-4 text-left shadow-[var(--shadow-border)]"
            }
          >
            <p className="text-sm font-medium">{item.title}</p>
            <p className="mt-1 font-mono text-xs text-accent">{item.name}</p>
            <p className="mt-2 text-xs leading-relaxed text-muted">{item.lede}</p>
          </button>
        ))}
      </section>

      <section className="px-5 pb-10">
        <div className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="font-mono text-xs text-muted">
              {loading ? "Laden…" : `${file.name} · ${text.length.toLocaleString("nl-NL")} tekens`}
            </p>
            <Button size="sm" variant="ghost" onClick={onSelectAll} disabled={loading || !text}>
              Selecteer alles
            </Button>
          </div>
          <textarea
            ref={areaRef}
            readOnly
            value={loading ? "Laden…" : text}
            spellCheck={false}
            aria-label={file.name}
            className="h-[28rem] w-full resize-y rounded-lg bg-bg p-4 font-mono text-xs leading-relaxed text-fg outline-none ring-1 ring-border focus-visible:ring-2 focus-visible:ring-ring/50"
          />
          <p className="mt-3 text-xs leading-relaxed text-muted">
            Op telefoon: tik in het veld, kies Selecteer alles, dan Kopieer. In het nieuwe
            Grok-gesprek: plak of upload als .md-bijlage.
          </p>
        </div>
      </section>
    </div>
  );
}
