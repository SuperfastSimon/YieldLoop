import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AutonomyTier, CloneRequest, YieldState } from "./contracts.ts";
import {
  approveProposal,
  freezeStation,
  ingestCsv,
  mergePatch,
  publishArtefact,
  rejectProposal,
  resetDemo,
  rollbackPublish,
  runCycle,
  runGolden,
  seedState,
  setRunState,
  setStationTier,
  executeClone,
} from "./engine.ts";

type YieldStore = YieldState & {
  hydrated: boolean;
  markHydrated: () => void;
  applyClone: (req: CloneRequest) => { proposed: boolean; childId: string | null; code?: string };
  applyCycle: (stationId: string) => void;
  applyPublish: (artefactId: string, tokenId?: string) => void;
  applyRollback: (publishId: string) => void;
  applyApprove: (proposalId: string) => void;
  applyReject: (proposalId: string) => void;
  applyMerge: (patchId: string) => void;
  applyKill: (stop: boolean) => void;
  applyFreeze: (stationId: string) => void;
  applyTier: (stationId: string, tier: AutonomyTier) => void;
  applyGolden: () => void;
  applyCsv: (csv: string) => void;
  applyReset: () => void;
};

const DATA_KEYS: (keyof YieldState)[] = [
  "version",
  "now",
  "seq",
  "runState",
  "operatorId",
  "language",
  "budget",
  "policy",
  "stations",
  "programs",
  "offers",
  "artefacts",
  "publishes",
  "memos",
  "events",
  "jobs",
  "skills",
  "patches",
  "proposals",
  "tokens",
  "conversions",
  "clicks",
  "clones",
  "lastCycle",
  "golden",
];

function dataOf(s: YieldStore): YieldState {
  const out = {} as YieldState;
  for (const k of DATA_KEYS) (out as unknown as Record<string, unknown>)[k] = s[k];
  return out;
}

export const useYieldStore = create<YieldStore>()(
  persist(
    (set, get) => ({
      ...seedState(),
      hydrated: false,
      markHydrated: () => set({ hydrated: true }),
      applyClone: (req) => {
        const { state, child, gate } = executeClone(dataOf(get()), req);
        set(state);
        return {
          proposed: !gate.ok && gate.code === "NEEDS_APPROVAL",
          childId: child?.id ?? null,
          code: gate.ok ? undefined : gate.code,
        };
      },
      applyCycle: (stationId) => set(runCycle(dataOf(get()), stationId)),
      applyPublish: (artefactId, tokenId) =>
        set(publishArtefact(dataOf(get()), artefactId, { tokenId })),
      applyRollback: (publishId) => set(rollbackPublish(dataOf(get()), publishId)),
      applyApprove: (proposalId) => set(approveProposal(dataOf(get()), proposalId)),
      applyReject: (proposalId) => set(rejectProposal(dataOf(get()), proposalId)),
      applyMerge: (patchId) => set(mergePatch(dataOf(get()), patchId)),
      applyKill: (stop) => set(setRunState(dataOf(get()), stop ? "STOP" : "RUN")),
      applyFreeze: (stationId) => set(freezeStation(dataOf(get()), stationId)),
      applyTier: (stationId, tier) => set(setStationTier(dataOf(get()), stationId, tier)),
      applyGolden: () => set(runGolden(dataOf(get()))),
      applyCsv: (csv) => set(ingestCsv(dataOf(get()), csv)),
      applyReset: () => set({ ...resetDemo(), hydrated: true }),
    }),
    {
      name: "yieldloop-v1",
      skipHydration: true,
      partialize: (s) => {
        const data: Record<string, unknown> = {};
        for (const k of DATA_KEYS) data[k] = s[k];
        return data as unknown as YieldStore;
      },
    },
  ),
);
