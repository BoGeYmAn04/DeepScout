import { cn } from "@/lib/utils";

export function Logo({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative grid size-9 place-items-center border border-white/[0.12] bg-[#0d1013] text-[11px] font-semibold tracking-[-0.05em] text-[#83f3dc]">
        DS
        <span className="absolute -right-px -top-px size-2 border-r border-t border-[#83f3dc]/70" />
        <span className="absolute -bottom-px -left-px size-2 border-b border-l border-[#83f3dc]/40" />
      </div>
      {!compact && (
        <div className="leading-none">
          <div className="text-[14px] font-semibold tracking-[-0.025em] text-[#ecece8]">DeepScout</div>
          <div className="mono-label mt-1.5 text-[7px] text-zinc-600">Research system / v0.1</div>
        </div>
      )}
    </div>
  );
}
