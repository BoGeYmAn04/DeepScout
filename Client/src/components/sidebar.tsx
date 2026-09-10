import { History, Plus, Github, Radio, PanelLeftClose } from "lucide-react";
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
    <aside className="flex h-full w-[260px] shrink-0 flex-col border-r border-white/[0.06] bg-[#07090d]/90 px-3.5 py-4 backdrop-blur-xl">
      <div className="mb-6 flex items-center justify-between px-1.5">
        <Logo />
        {onClose && <Button variant="ghost" size="icon" className="md:hidden" onClick={onClose}><PanelLeftClose /></Button>}
      </div>
      <Button variant="outline" className="mb-5 w-full justify-start" onClick={onNew}>
        <Plus className="size-4" /> New research
        <span className="ml-auto rounded border border-white/10 px-1.5 py-0.5 text-[9px] text-zinc-600">N</span>
      </Button>

      <div className="mb-2 flex items-center gap-2 px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
        <History className="size-3" /> Recent
      </div>
      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-1 pr-2">
          {history.length === 0 ? (
            <p className="px-2 py-3 text-xs leading-5 text-zinc-700">Your research history will appear here.</p>
          ) : history.map((query) => (
            <button
              key={query}
              onClick={() => onSelect(query)}
              className={`w-full truncate rounded-lg px-2.5 py-2 text-left text-xs transition ${activeQuery === query ? "bg-white/[0.07] text-zinc-200" : "text-zinc-600 hover:bg-white/[0.04] hover:text-zinc-400"}`}
            >
              {query}
            </button>
          ))}
        </div>
      </ScrollArea>

      <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.025] p-3">
        <div className="mb-1.5 flex items-center gap-2 text-xs font-medium text-zinc-300"><Radio className="size-3.5 text-emerald-400" /> Agent workspace</div>
        <p className="text-[10px] leading-4 text-zinc-600">Gemini + Tavily research pipeline</p>
      </div>
      <a href="https://github.com/BoGeYmAn04/DeepScout" target="_blank" rel="noreferrer" className="mt-2 flex items-center gap-2 px-2 py-2 text-xs text-zinc-600 transition hover:text-zinc-300">
        <Github className="size-3.5" /> GitHub repository
      </a>
    </aside>
  );
}
