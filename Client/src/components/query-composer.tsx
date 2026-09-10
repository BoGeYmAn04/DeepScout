import { useRef } from "react";
import { ArrowUpRight, Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const examples = [
  "Latest breakthroughs in solid-state batteries",
  "How AI agents are changing software engineering",
  "Climate risk and Indian agriculture",
];

interface QueryComposerProps {
  query: string;
  setQuery: (value: string) => void;
  onSubmit: () => void;
  loading?: boolean;
  compact?: boolean;
}

export function QueryComposer({ query, setQuery, onSubmit, loading = false, compact = false }: QueryComposerProps) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const submit = () => { if (query.trim() && !loading) onSubmit(); };

  return (
    <div className={compact ? "w-full" : "w-full max-w-[760px]"}>
      <div className="relative border border-white/[0.10] bg-[#0c0e11] transition focus-within:border-[#83f3dc]/35">
        <div className="flex h-9 items-center justify-between border-b border-white/[0.065] px-3.5">
          <span className="mono-label text-[8px] text-zinc-600">Query input</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-[9px] text-zinc-600"><Globe2 className="size-3 text-[#83f3dc]/70" /> web on</span>
            <span className="mono-label text-[7px] text-zinc-700">{String(query.length).padStart(3, "0")}</span>
          </div>
        </div>
        <div className="flex items-end gap-2 p-2">
          <span className="mb-[17px] ml-1 select-none font-mono text-[14px] text-[#83f3dc]/70">›</span>
          <Textarea
            ref={ref}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            placeholder="Enter a topic, event, company, or question…"
            className={`${compact ? "min-h-[58px]" : "min-h-[96px]"} flex-1 border-0 bg-transparent px-1 py-3 text-[15px] leading-6 shadow-none focus:ring-0`}
          />
          <Button size="icon" onClick={submit} disabled={!query.trim() || loading} className="mb-1 size-10 rounded-none bg-[#e9e9e4] text-black hover:bg-white">
            {loading ? <span className="size-4 animate-spin rounded-full border-2 border-black/20 border-t-black" /> : <ArrowUpRight className="size-4" />}
          </Button>
        </div>
      </div>

      {!compact && (
        <div className="mt-5 border-t border-white/[0.055]">
          {examples.map((example, index) => (
            <button key={example} onClick={() => { setQuery(example); ref.current?.focus(); }} className="group flex w-full items-center border-b border-white/[0.055] py-2.5 text-left text-[11px] text-zinc-600 transition hover:text-zinc-300">
              <span className="mono-label mr-3 text-[7px] text-zinc-800">0{index + 1}</span>
              <span>{example}</span>
              <ArrowUpRight className="ml-auto size-3 text-zinc-800 transition group-hover:text-[#83f3dc]/80" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
