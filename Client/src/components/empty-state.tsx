import { Binary, Network, SearchCheck } from "lucide-react";
import { QueryComposer } from "@/components/query-composer";

export function EmptyState({ query, setQuery, onSubmit }: { query: string; setQuery: (v: string) => void; onSubmit: () => void }) {
  return (
    <main className="relative flex min-h-full flex-1 items-center justify-center overflow-hidden px-5 py-16">
      <div className="pointer-events-none absolute left-1/2 top-[38%] h-[520px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/[0.035] blur-[100px]" />
      <div className="pointer-events-none absolute left-[62%] top-[42%] h-[400px] w-[500px] rounded-full bg-violet-500/[0.035] blur-[110px]" />
      <div className="relative z-10 flex w-full flex-col items-center text-center">
        <div className="mb-5 flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-500">
          <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" /> Autonomous research system
        </div>
        <h1 className="max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.055em] text-white md:text-6xl">
          Research deeper.<br /><span className="bg-gradient-to-r from-zinc-400 via-zinc-200 to-zinc-500 bg-clip-text text-transparent">Know what matters.</span>
        </h1>
        <p className="mb-9 mt-5 max-w-xl text-sm leading-6 text-zinc-600 md:text-[15px]">DeepScout autonomously searches the web, reads primary sources, synthesizes findings, and stress-tests its own conclusions.</p>
        <QueryComposer query={query} setQuery={setQuery} onSubmit={onSubmit} />
        <div className="mt-12 grid w-full max-w-2xl grid-cols-3 gap-3 border-t border-white/[0.055] pt-6">
          {[ [SearchCheck, "Search", "Fresh evidence"], [Network, "Synthesize", "Cross-source context"], [Binary, "Critique", "Quality checked"] ].map(([Icon, label, sub]) => {
            const IconComp = Icon as typeof SearchCheck;
            return <div key={label as string} className="text-left sm:text-center"><div className="mb-1 flex items-center gap-1.5 text-[11px] font-medium text-zinc-400 sm:justify-center"><IconComp className="size-3.5 text-cyan-300/60" />{label as string}</div><p className="text-[9px] text-zinc-700">{sub as string}</p></div>;
          })}
        </div>
      </div>
    </main>
  );
}
