import { BookOpen, Check, FileSearch2, PenLine, ScanSearch, ShieldCheck } from "lucide-react";
import type { StageState } from "@/types/research";
import { cn } from "@/lib/utils";

const icons = { search: ScanSearch, reader: BookOpen, writer: PenLine, critic: ShieldCheck };

export function ResearchTrace({ stages }: { stages: StageState[] }) {
  return (
    <div className="space-y-1">
      {stages.map((stage, index) => {
        const Icon = icons[stage.key] ?? FileSearch2;
        const active = stage.status === "running";
        const done = stage.status === "complete";
        return (
          <div key={stage.key} className="relative flex gap-3 py-2.5">
            {index < stages.length - 1 && <div className={cn("absolute left-[15px] top-9 h-[25px] w-px", done ? "bg-cyan-300/20" : "bg-white/[0.07]")} />}
            <div className={cn("relative z-10 grid size-[31px] shrink-0 place-items-center rounded-lg border transition-all", done && "border-cyan-300/20 bg-cyan-300/[0.08] text-cyan-200", active && "border-violet-300/30 bg-violet-300/[0.09] text-violet-200 shadow-[0_0_25px_rgba(167,139,250,.08)]", stage.status === "idle" && "border-white/[0.07] bg-white/[0.025] text-zinc-700", stage.status === "error" && "border-red-400/30 bg-red-400/[0.08] text-red-300") }>
              {done ? <Check className="size-3.5" /> : <Icon className={cn("size-3.5", active && "animate-pulse")} />}
            </div>
            <div className="min-w-0 pt-0.5">
              <div className={cn("text-xs font-medium", done ? "text-zinc-300" : active ? "text-white" : "text-zinc-600")}>{stage.label}</div>
              <p className="mt-0.5 text-[10px] leading-4 text-zinc-700">{active ? "Working…" : done ? "Completed" : stage.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
