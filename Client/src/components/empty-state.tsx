import { ArrowDownRight } from "lucide-react";
import { QueryComposer } from "@/components/query-composer";

export function EmptyState({ query, setQuery, onSubmit }: { query: string; setQuery: (v: string) => void; onSubmit: () => void }) {
  return (
    <main className="relative z-10 flex min-h-full flex-1 overflow-hidden px-5 py-12 md:px-10 lg:px-16">
      <div className="mx-auto grid w-full max-w-[1160px] content-center gap-12 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-20">
        <section>
          <div className="mono-label mb-8 flex items-center gap-3 text-[8px] text-zinc-600">
            <span>DeepScout / autonomous research</span>
            <span className="h-px w-10 bg-[#83f3dc]/35" />
            <span>04 modules</span>
          </div>
          <h1 className="max-w-[760px] text-[46px] font-medium leading-[.96] tracking-[-0.06em] text-[#ecece8] sm:text-[62px] lg:text-[74px]">
            Ask a hard question.<br />
            <span className="text-zinc-600">Get a researched answer.</span>
          </h1>
          <p className="mb-8 mt-6 max-w-[590px] text-[13px] leading-6 text-zinc-600">
            DeepScout searches current sources, opens the strongest evidence, writes a structured briefing, then critiques its own output before returning it to you.
          </p>
          <QueryComposer query={query} setQuery={setQuery} onSubmit={onSubmit} />
        </section>

        <aside className="hidden self-end lg:block">
          <div className="mb-3 flex items-center justify-between">
            <span className="mono-label text-[8px] text-zinc-700">Pipeline map</span>
            <span className="mono-label text-[8px] text-zinc-800">DS-04</span>
          </div>
          <div className="border-l border-white/[0.08]">
            {[
              ["01", "SEARCH", "Find live evidence"],
              ["02", "READ", "Inspect strongest source"],
              ["03", "WRITE", "Synthesize findings"],
              ["04", "CRITIC", "Stress-test report"],
            ].map(([n, name, description], index) => (
              <div key={name} className="relative border-t border-white/[0.06] py-4 pl-5 last:border-b">
                <span className="absolute -left-[4px] top-[22px] size-[7px] rounded-full border border-[#83f3dc]/30 bg-[#090a0c]" />
                <div className="flex items-baseline justify-between"><span className="text-[11px] font-medium text-zinc-400">{name}</span><span className="mono-label text-[7px] text-zinc-800">{n}</span></div>
                <p className="mt-1 text-[9px] text-zinc-700">{description}</p>
                {index === 0 && <ArrowDownRight className="absolute right-0 top-4 size-3 text-[#83f3dc]/35" />}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </main>
  );
}
