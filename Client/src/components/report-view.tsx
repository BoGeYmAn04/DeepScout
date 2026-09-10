import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Download, Check, Quote } from "lucide-react";
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
      <div className="mb-6 flex items-start justify-between gap-4 border-b border-white/[0.07] pb-5">
        <div>
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-300/70">Deep research report</div>
          <h1 className="max-w-3xl text-2xl font-semibold leading-tight tracking-[-0.03em] text-white md:text-[30px]">{query}</h1>
        </div>
        <div className="hidden shrink-0 items-center gap-1.5 sm:flex">
          <Button variant="ghost" size="sm" onClick={copy}>{copied ? <Check /> : <Copy />} {copied ? "Copied" : "Copy"}</Button>
          <Button variant="outline" size="sm" onClick={() => downloadText(`${safeFilename(query)}.md`, report)}><Download /> Export</Button>
        </div>
      </div>
      <article className="report-markdown">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ blockquote: ({ children }) => <blockquote><Quote className="mt-1 size-4 shrink-0 text-cyan-300/60" /><div>{children}</div></blockquote> }}>{report}</ReactMarkdown>
      </article>
    </div>
  );
}
