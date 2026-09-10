import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Check, Copy, Download, Quote } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { downloadText, safeFilename } from "@/lib/utils";

export function ReportView({ query, report }: { query: string; report: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(report);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div>
      <div className="mb-8 border-b border-white/[0.07] pb-7">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div className="mono-label flex items-center gap-3 text-[8px] text-zinc-700"><span>DeepScout briefing</span><span className="h-px w-8 bg-[#83f3dc]/30"/><span>final</span></div>
          <div className="hidden shrink-0 items-center gap-1 sm:flex">
            <Button variant="ghost" size="sm" onClick={copy}>{copied ? <Check /> : <Copy />} {copied ? "Copied" : "Copy"}</Button>
            <Button variant="outline" size="sm" onClick={() => downloadText(`${safeFilename(query)}.md`, report)}><Download /> Export</Button>
          </div>
        </div>
        <h1 className="max-w-4xl text-[34px] font-medium leading-[1.03] tracking-[-0.045em] text-[#ecece8] md:text-[44px]">{query}</h1>
        <div className="mono-label mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[7px] text-zinc-700">
          <span>Mode / deep research</span><span>Passes / 04</span><span>Output / synthesized</span>
        </div>
      </div>
      <article className="report-markdown max-w-[820px]">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ blockquote: ({ children }) => <blockquote><Quote className="mt-1 size-4 shrink-0 text-[#83f3dc]/55" /><div>{children}</div></blockquote> }}>{report}</ReactMarkdown>
      </article>
    </div>
  );
}
