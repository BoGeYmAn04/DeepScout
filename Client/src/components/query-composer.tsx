import { useRef } from "react";
import { ArrowUp, Globe2, Sparkles, WandSparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
  const submit = () => {
    if (query.trim() && !loading) onSubmit();
  };

  return (
    <div className={compact ? "w-full" : "w-full max-w-3xl"}>
      <div className="group relative rounded-[22px] border border-white/[0.10] bg-[#0b0e14]/95 p-2 shadow-[0_30px_100px_rgba(0,0,0,.45)] transition focus-within:border-cyan-300/20 focus-within:shadow-[0_30px_100px_rgba(0,0,0,.5),0_0_50px_rgba(34,211,238,.04)]">
        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/40 to-transparent opacity-60" />
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
          placeholder="What do you want DeepScout to investigate?"
          className={`${compact ? "min-h-[72px]" : "min-h-[118px]"} border-0 bg-transparent px-3.5 py-3 text-[15px] leading-6 shadow-none focus:ring-0`}
        />
        <div className="flex items-center justify-between gap-3 px-1 pb-1">
          <div className="flex items-center gap-2">
            <Badge><Globe2 className="size-3 text-cyan-300" /> Live web</Badge>
            {!compact && <Badge className="hidden sm:inline-flex"><WandSparkles className="size-3 text-violet-300" /> Multi-agent</Badge>}
          </div>
          <Button size="icon" onClick={submit} disabled={!query.trim() || loading} className="rounded-xl">
            {loading ? <span className="size-4 animate-spin rounded-full border-2 border-black/20 border-t-black" /> : <ArrowUp className="size-4" />}
          </Button>
        </div>
      </div>
      {!compact && (
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {examples.map((example) => (
            <button key={example} onClick={() => { setQuery(example); ref.current?.focus(); }} className="rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1.5 text-[11px] text-zinc-600 transition hover:border-white/15 hover:text-zinc-400">
              {example}
            </button>
          ))}
        </div>
      )}
      {!compact && <p className="mt-5 flex items-center justify-center gap-1.5 text-[10px] text-zinc-700"><Sparkles className="size-3" /> DeepScout searches, reads, synthesizes, and critiques every report.</p>}
    </div>
  );
}
