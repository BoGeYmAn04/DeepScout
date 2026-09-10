import { PanelLeftClose, Plus } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidebarProps {
  history: string[];
  activeQuery?: string;
  onNew: () => void;
  onSelect: (query: string) => void;
  onClose?: () => void;
}

export function Sidebar({ history, activeQuery, onNew, onSelect, onClose }: SidebarProps) {
  return (
    <aside className="relative z-10 flex h-full w-[248px] shrink-0 flex-col border-r border-white/[0.07] bg-[#0a0b0e] px-3 py-4">
      <div className="mb-7 flex items-center justify-between px-1">
        <Logo />
        {onClose && <Button variant="ghost" size="icon" className="md:hidden" onClick={onClose}><PanelLeftClose /></Button>}
      </div>

      <button onClick={onNew} className="group mb-7 flex h-10 w-full items-center border border-white/[0.09] bg-white/[0.025] px-3 text-left text-xs text-zinc-300 transition hover:border-white/[0.16] hover:bg-white/[0.045]">
        <Plus className="mr-2 size-3.5 text-[#83f3dc]" />
        New research
        <span className="mono-label ml-auto text-[8px] text-zinc-700 group-hover:text-zinc-500">N</span>
      </button>

      <div className="mono-label mb-2 flex items-center justify-between px-2 text-[8px] text-zinc-700">
        <span>Recent runs</span><span>{String(history.length).padStart(2, "0")}</span>
      </div>
      <ScrollArea className="min-h-0 flex-1">
        <div className="pr-1">
          {history.length === 0 ? (
            <p className="border-t border-white/[0.055] px-2 py-4 text-[11px] leading-5 text-zinc-700">No research sessions yet.</p>
          ) : history.map((query, index) => (
            <button
              key={query}
              onClick={() => onSelect(query)}
              className={`group flex w-full gap-2 border-t border-white/[0.05] px-2 py-3 text-left transition ${activeQuery === query ? "bg-white/[0.04] text-zinc-200" : "text-zinc-600 hover:bg-white/[0.025] hover:text-zinc-400"}`}
            >
              <span className="mono-label mt-[2px] w-5 shrink-0 text-[8px] text-zinc-800 group-hover:text-zinc-600">{String(index + 1).padStart(2, "0")}</span>
              <span className="line-clamp-2 text-[11px] leading-[1.45]">{query}</span>
            </button>
          ))}
        </div>
      </ScrollArea>

      <div className="mt-4 border-t border-white/[0.07] pt-4">
        <div className="mb-3 flex items-center justify-between px-2">
          <span className="mono-label text-[8px] text-zinc-700">Engine</span>
          <span className="flex items-center gap-1.5 text-[9px] text-zinc-500"><span className="size-1.5 rounded-full bg-emerald-400" /> Online</span>
        </div>
        <div className="grid grid-cols-2 gap-px overflow-hidden border border-white/[0.06] bg-white/[0.06]">
          <div className="bg-[#0a0b0e] p-2.5">
            <div className="mono-label text-[7px] text-zinc-700">Primary / fallback</div>
            <div className="mt-1 text-[10px] text-zinc-400">Gemini → Mistral</div>
          </div>
          <div className="bg-[#0a0b0e] p-2.5">
            <div className="mono-label text-[7px] text-zinc-700">Search</div>
            <div className="mt-1 text-[10px] text-zinc-400">Tavily</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
