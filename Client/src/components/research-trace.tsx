import { Check, Circle, Loader2, X } from "lucide-react";
import type { StageState } from "@/types/research";
import { cn } from "@/lib/utils";

export function ResearchTrace({ stages }: { stages: StageState[] }) {
  return (
    <div className="border-t border-white/[0.06]">
      {stages.map((stage, index) => {
        const active = stage.status === "running";
        const done = stage.status === "complete";
        const error = stage.status === "error";
        return (
          <div key={stage.key} className={cn("grid grid-cols-[34px_1fr_auto] items-center border-b border-white/[0.06] py-3", active && "bg-white/[0.018]") }>
            <span className={cn("mono-label text-[8px]", active ? "text-[#83f3dc]" : done ? "text-zinc-500" : "text-zinc-800")}>{String(index + 1).padStart(2, "0")}</span>
            <div className="min-w-0">
              <div className={cn("text-[11px] font-medium", active ? "text-[#ecece8]" : done ? "text-zinc-400" : "text-zinc-700")}>{stage.label}</div>
              <div className="mt-0.5 truncate text-[8px] text-zinc-800">{active ? "executing" : done ? "complete" : stage.description}</div>
            </div>
            <div className="pr-1">
              {done ? <Check className="size-3.5 text-[#83f3dc]/75" /> : active ? <Loader2 className="size-3.5 animate-spin text-[#83f3dc]" /> : error ? <X className="size-3.5 text-red-400" /> : <Circle className="size-2.5 text-zinc-800" />}
            </div>
          </div>
        );
      })}
    </div>
  );
}
