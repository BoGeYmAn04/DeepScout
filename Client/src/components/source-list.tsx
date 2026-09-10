import { ExternalLink, Globe2 } from "lucide-react";

function host(url: string) {
  try { return new URL(url).hostname.replace("www.", ""); } catch { return url; }
}

export function SourceList({ sources }: { sources: string[] }) {
  if (!sources.length) return <p className="py-6 text-center text-xs text-zinc-700">Sources will appear after the search agent finishes.</p>;
  return (
    <div className="space-y-2">
      {sources.map((source, index) => (
        <a key={`${source}-${index}`} href={source} target="_blank" rel="noreferrer" className="group flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 transition hover:border-white/[0.12] hover:bg-white/[0.04]">
          <div className="grid size-8 shrink-0 place-items-center rounded-lg border border-white/[0.06] bg-black/20"><Globe2 className="size-3.5 text-zinc-500" /></div>
          <div className="min-w-0 flex-1"><p className="truncate text-xs text-zinc-300">{host(source)}</p><p className="mt-0.5 truncate text-[9px] text-zinc-700">{source}</p></div>
          <ExternalLink className="size-3.5 text-zinc-700 transition group-hover:text-zinc-400" />
        </a>
      ))}
    </div>
  );
}
