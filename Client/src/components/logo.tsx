import { Radar } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative grid size-9 place-items-center rounded-xl border border-cyan-300/20 bg-cyan-300/[0.07] shadow-[0_0_30px_rgba(34,211,238,.08)]">
        <Radar className="size-[18px] text-cyan-200" />
        <span className="absolute right-1 top-1 size-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(103,232,249,.9)]" />
      </div>
      {!compact && (
        <div>
          <div className="text-[15px] font-semibold tracking-[-0.02em] text-white">DeepScout</div>
          <div className="text-[9px] uppercase tracking-[0.22em] text-zinc-600">Research Intelligence</div>
        </div>
      )}
    </div>
  );
}
