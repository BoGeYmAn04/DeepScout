import { ArrowUpRight } from "lucide-react";

function host(url: string) {
  try { return new URL(url).hostname.replace("www.", ""); } catch { return url; }
}

export function SourceList({ sources }: { sources: string[] }) {
  if (!sources.length) return <p className="border-t border-white/[0.06] py-5 text-[10px] leading-5 text-zinc-700">Evidence links will populate after search completes.</p>;
  return (
    <div className="border-t border-white/[0.06]">
      {sources.map((source, index) => (
        <a key={`${source}-${index}`} href={source} target="_blank" rel="noreferrer" className="group grid grid-cols-[28px_1fr_18px] items-center border-b border-white/[0.06] py-3 transition hover:bg-white/[0.018]">
          <span className="mono-label text-[7px] text-zinc-800">{String(index + 1).padStart(2, "0")}</span>
          <div className="min-w-0">
            <p className="truncate text-[10px] text-zinc-400 transition group-hover:text-zinc-200">{host(source)}</p>
            <p className="mt-0.5 truncate text-[8px] text-zinc-800">{source}</p>
          </div>
          <ArrowUpRight className="size-3 text-zinc-800 transition group-hover:text-[#83f3dc]/80" />
        </a>
      ))}
    </div>
  );
}
