import { useMemo, useState } from "react";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { evaluateClone } from "@/lib/yieldloop/engine";
import { useYieldStore } from "@/lib/yieldloop/store";
import type { Channel, Language, Station } from "@/lib/yieldloop/contracts";
import { eur } from "@/lib/utils";

export function CloneDialog({ station, compact }: { station: Station; compact?: boolean }) {
  const applyClone = useYieldStore((s) => s.applyClone);
  const data = useYieldStore((s) => s);
  const [open, setOpen] = useState(false);
  const remaining = station.budgetCapEur - station.budgetSpentEur;
  const maxSlice = Math.max(0, remaining - station.policy.minParentReserveEur);
  const niches = station.policy.nicheAllowlist.filter(
    (n) => n !== station.niche,
  );
  const [name, setName] = useState("");
  const [niche, setNiche] = useState(niches[0] ?? station.niche);
  const [lang, setLang] = useState<Language>(station.language);
  const [channel, setChannel] = useState<Channel>(station.channel);
  const [slice, setSlice] = useState(Math.min(90, maxSlice));

  const preview = useMemo(() => {
    const key = `clone:${station.id}:${niche}:${channel}:${name || "x"}`;
    return evaluateClone(data, {
      parentId: station.id,
      childName: name || `Kloon ${niche}`,
      childNiche: niche,
      language: lang,
      channel,
      budgetSliceEur: slice,
      actorId: data.operatorId,
      idempotencyKey: key,
    });
  }, [data, station.id, niche, channel, name, lang, slice]);

  function submit() {
    const childName = name.trim() || `Kloon ${niche}`;
    const result = applyClone({
      parentId: station.id,
      childName,
      childNiche: niche,
      language: lang,
      channel,
      budgetSliceEur: slice,
      actorId: data.operatorId,
      idempotencyKey: `clone:${station.id}:${niche}:${channel}:${childName}`,
    });
    if (result.childId) {
      toast.success(`${childName} is gekloond. Start op T1 Concept.`);
      setOpen(false);
    } else if (result.proposed) {
      toast.message("Voorstel gezet. Kloon wacht op goedkeuring (T4 / token).");
      setOpen(false);
    } else {
      toast.error(result.code ?? "Kloon geweigerd");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={compact ? "ghost" : "secondary"} size={compact ? "sm" : "default"}>
          <Copy className="size-4" />
          Kloon station
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Kloon {station.name}</DialogTitle>
        <DialogDescription>
          Het kind erft skills en een aangescherpt beleid. Autonomy valt terug naar T1
          Concept. Geen stille publicatie, geen lossere compliance.
        </DialogDescription>
        <div className="mt-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="clone-name">Naam</Label>
            <Input
              id="clone-name"
              value={name}
              placeholder={`Kloon ${niche}`}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="clone-niche">Niche</Label>
            <select
              id="clone-niche"
              className="h-11 rounded-md border border-border bg-bg px-3 text-sm"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
            >
              {station.policy.nicheAllowlist.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="clone-lang">Taal</Label>
              <select
                id="clone-lang"
                className="h-11 rounded-md border border-border bg-bg px-3 text-sm"
                value={lang}
                onChange={(e) => setLang(e.target.value as Language)}
              >
                {station.policy.languageAllowlist.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="clone-ch">Kanaal</Label>
              <select
                id="clone-ch"
                className="h-11 rounded-md border border-border bg-bg px-3 text-sm"
                value={channel}
                onChange={(e) => setChannel(e.target.value as Channel)}
              >
                {station.policy.channelAllowlist.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="clone-slice">
              Budget-slice {eur(slice)} · max {eur(maxSlice)}
            </Label>
            <input
              id="clone-slice"
              type="range"
              min={20}
              max={Math.max(20, maxSlice)}
              step={10}
              value={slice}
              onChange={(e) => setSlice(Number(e.target.value))}
              className="w-full accent-accent"
            />
          </div>
          <p className="text-xs text-muted">
            {preview.ok
              ? "Gates groen — token aanwezig of T4-envelope."
              : preview.code === "NEEDS_APPROVAL"
                ? "Geen T4-token: dit wordt een voorstel, geen live station."
                : `Weigering: ${preview.code}`}
          </p>
          <Button onClick={submit} disabled={maxSlice < 20}>
            {preview.ok ? "Kloon nu" : preview.code === "NEEDS_APPROVAL" ? "Voorstel indienen" : "Niet toegestaan"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
