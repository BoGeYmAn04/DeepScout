import { AlertTriangle, Braces, FileText, Menu, RefreshCcw, Search, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QueryComposer } from "@/components/query-composer";
import { ReportView } from "@/components/report-view";
import { ResearchTrace } from "@/components/research-trace";
import { SourceList } from "@/components/source-list";
import type { ModelProvider, ResearchResult, StageState } from "@/types/research";

interface Props {
  query: string;
  setQuery: (v: string) => void;
  submittedQuery: string;
  result: ResearchResult | null;
  liveSources: string[];
  activeModel: ModelProvider;
  stages: StageState[];
  loading: boolean;
  error: string | null;
  onSubmit: () => void;
  onOpenSidebar: () => void;
}

export function ResearchWorkspace({ query, setQuery, submittedQuery, result, liveSources, activeModel, stages, loading, error, onSubmit, onOpenSidebar }: Props) {
  const completed = stages.filter((s) => s.status === "complete").length;
  const activeIndex = Math.max(0, stages.findIndex((s) => s.status === "running"));
  const activeStage = stages.find((s) => s.status === "running") ?? stages[Math.min(completed, stages.length - 1)];
  const progress = result ? 100 : Math.min(100, Math.max(8, ((completed + (loading ? 0.35 : 0)) / stages.length) * 100));
  const evidenceSources = result?.sources ?? liveSources;
  const fallbackActive = activeModel === "Mistral";

  return (
    <div className="relative z-10 flex min-w-0 flex-1 flex-col bg-[#090a0c]">
      <header className="flex h-[62px] items-center border-b border-white/[0.07] bg-[#090a0c] px-4 md:px-6">
        <Button variant="ghost" size="icon" className="mr-2 md:hidden" onClick={onOpenSidebar}><Menu /></Button>
        <div className="min-w-0 flex-1">
          <div className="mono-label mb-1 flex items-center gap-2 text-[7px] text-zinc-700"><span>Session</span><span className="text-zinc-500">DS-{String(Math.min(4, Math.max(1, completed + 1))).padStart(2, "0")}</span></div>
          <div className="truncate text-[11px] font-medium text-zinc-400">{submittedQuery}</div>
        </div>
        <div className="ml-5 hidden items-center gap-4 sm:flex">
          <div className="flex gap-1">
            {stages.map((stage) => <span key={stage.key} className={`h-5 w-[3px] ${stage.status === "complete" ? "bg-[#83f3dc]/80" : stage.status === "running" ? "animate-pulse bg-[#83f3dc]" : "bg-white/[0.08]"}`} />)}
          </div>
          <div className="min-w-[96px]">
            <div className="mono-label text-[7px] text-zinc-700">Status</div>
            <div className={`mt-1 text-[9px] ${loading ? "text-[#83f3dc]" : "text-zinc-500"}`}>{loading ? `${activeStage?.label ?? "Running"} · ${activeModel}` : `Complete · ${activeModel}`}</div>
          </div>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-1 xl:grid-cols-[minmax(0,1fr)_300px]">
        <ScrollArea className="h-[calc(100vh-62px)]">
          <div className="mx-auto w-full max-w-[1080px] px-5 py-7 md:px-10 md:py-10">
            {error ? (
              <Card className="border-red-400/20 bg-red-400/[0.025] p-5">
                <div className="flex gap-3"><AlertTriangle className="mt-0.5 size-5 shrink-0 text-red-300" /><div><h3 className="text-sm font-medium text-red-100">Research stopped</h3><p className="mt-1 text-xs leading-5 text-red-200/50">{error}</p><Button variant="outline" size="sm" className="mt-4" onClick={onSubmit}><RefreshCcw /> Try again</Button></div></div>
              </Card>
            ) : result ? (
              <Tabs defaultValue="report">
                <div className="mb-8 flex items-center justify-between gap-3">
                  <TabsList>
                    <TabsTrigger value="report"><FileText className="mr-1.5 size-3" /> Report</TabsTrigger>
                    <TabsTrigger value="sources"><Search className="mr-1.5 size-3" /> Sources</TabsTrigger>
                    <TabsTrigger value="critique"><ShieldCheck className="mr-1.5 size-3" /> Critique</TabsTrigger>
                    <TabsTrigger value="raw" className="hidden sm:block"><Braces className="mr-1.5 inline size-3" /> Raw</TabsTrigger>
                  </TabsList>
                  <div className="mono-label hidden text-[7px] text-zinc-700 md:block">04 / 04 passes complete</div>
                </div>
                <TabsContent value="report"><ReportView query={submittedQuery} report={result.research_report} /></TabsContent>
                <TabsContent value="sources">
                  <SectionHeading index="01" title="Evidence index" copy="Sources discovered during this run." />
                  <SourceList sources={result.sources} />
                </TabsContent>
                <TabsContent value="critique">
                  <SectionHeading index="02" title="Critic review" copy="Independent quality pass on the generated briefing." />
                  <div className="report-markdown max-w-[820px]"><p className="whitespace-pre-wrap">{result.critic_feedback}</p></div>
                </TabsContent>
                <TabsContent value="raw"><div className="space-y-7"><RawPanel title="Search results" content={result.search_results} /><RawPanel title="Deep-read content" content={result.scraped_content} /></div></TabsContent>
              </Tabs>
            ) : (
              <div>
                <div className="mb-8 grid gap-8 border-b border-white/[0.07] pb-8 md:grid-cols-[1fr_180px]">
                  <div>
                    <div className="mono-label mb-4 text-[8px] text-[#83f3dc]/70">Research run / active</div>
                    <h1 className="max-w-3xl text-[34px] font-medium leading-[1.04] tracking-[-0.045em] text-[#ecece8] md:text-[46px]">{submittedQuery}</h1>
                  </div>
                  <div className="self-end md:text-right">
                    <div className="mono-label text-[7px] text-zinc-700">Pass</div>
                    <div className="mt-1 font-mono text-[34px] tracking-[-0.08em] text-zinc-400">{String(Math.min(activeIndex + 1, 4)).padStart(2, "0")}<span className="text-zinc-800">/04</span></div>
                  </div>
                </div>

                <div className="scan-beam border border-white/[0.07] bg-[#0b0d10] p-5 md:p-7">
                  <div className="mb-7 flex items-center justify-between gap-4">
                    <div>
                      <div className="mono-label text-[7px] text-zinc-700">Current operation</div>
                      <div className="mt-2 flex items-center gap-2 text-[14px] font-medium text-zinc-200">
  <span>{activeStage?.label ?? "Initializing research"}</span>
  {fallbackActive && <span className="mono-label border border-amber-300/20 bg-amber-300/[0.04] px-1.5 py-1 text-[6px] text-amber-200/70">Mistral fallback</span>}
</div>
                      <p className="mt-1 text-[10px] text-zinc-700">{activeStage?.description ?? "Preparing agents and context"}</p>
                    </div>
                    <span className="font-mono text-[10px] text-[#83f3dc]/75">{Math.round(progress)}%</span>
                  </div>
                  <div className="h-px w-full bg-white/[0.07]"><div className="h-px bg-[#83f3dc]/70 transition-all duration-700" style={{ width: `${progress}%` }} /></div>
                  <div className="mt-7 grid grid-cols-4 gap-3">
                    {stages.map((stage, index) => (
                      <div key={stage.key}>
                        <div className={`mono-label text-[7px] ${stage.status === "complete" ? "text-zinc-500" : stage.status === "running" ? "text-[#83f3dc]" : "text-zinc-800"}`}>0{index + 1}</div>
                        <div className={`mt-1 truncate text-[9px] ${stage.status === "running" ? "text-zinc-300" : "text-zinc-700"}`}>{stage.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-10 max-w-[760px] space-y-3 opacity-45">
                  <div className="h-[9px] w-[28%] bg-white/[0.08]" />
                  <div className="h-[6px] w-full bg-white/[0.055]" />
                  <div className="h-[6px] w-[91%] bg-white/[0.055]" />
                  <div className="h-[6px] w-[77%] bg-white/[0.055]" />
                  <div className="mt-7 h-[9px] w-[20%] bg-white/[0.08]" />
                  <div className="h-[6px] w-[96%] bg-white/[0.055]" />
                  <div className="h-[6px] w-[82%] bg-white/[0.055]" />
                </div>
              </div>
            )}

            <div className="mt-14 border-t border-white/[0.07] pt-6">
              <div className="mono-label mb-3 text-[7px] text-zinc-800">Run another query</div>
              <QueryComposer compact query={query} setQuery={setQuery} onSubmit={onSubmit} loading={loading} />
            </div>
          </div>
        </ScrollArea>

        <aside className="hidden border-l border-white/[0.07] bg-[#0a0b0e] xl:block">
          <ScrollArea className="h-[calc(100vh-62px)]">
            <div className="p-5">
              <div className="mb-3 flex items-end justify-between">
                <div><div className="mono-label text-[8px] text-zinc-600">Execution trace</div><div className="mt-1 text-[10px] text-zinc-700">Agent pipeline</div></div>
                <div className="font-mono text-[12px] text-zinc-600">{String(completed).padStart(2,"0")}<span className="text-zinc-800">/04</span></div>
              </div>
              <ResearchTrace stages={stages} />

              <div className="mb-3 mt-8 flex items-center justify-between">
                <div className="mono-label text-[8px] text-zinc-600">Evidence</div>
                <div className="mono-label text-[7px] text-zinc-800">{String(evidenceSources.length).padStart(2,"0")} links</div>
              </div>
              <SourceList sources={evidenceSources} />

              <div className="mt-8 border-t border-white/[0.06] pt-4">
                <div className="mono-label mb-2 text-[7px] text-zinc-800">System note</div>
                <p className="text-[9px] leading-4 text-zinc-700">Search → read → synthesize → critique. Evidence appears after search. Gemini is primary; Mistral takes over automatically if Gemini fails.</p>
              </div>
            </div>
          </ScrollArea>
        </aside>
      </div>
    </div>
  );
}

function SectionHeading({ index, title, copy }: { index: string; title: string; copy: string }) {
  return <div className="mb-7 border-b border-white/[0.07] pb-5"><div className="mono-label mb-2 text-[7px] text-zinc-700">Section / {index}</div><h2 className="text-[26px] font-medium tracking-[-0.035em] text-[#ecece8]">{title}</h2><p className="mt-1 text-[10px] text-zinc-700">{copy}</p></div>;
}

function RawPanel({ title, content }: { title: string; content: string }) {
  return <div><div className="mono-label mb-2 text-[7px] text-zinc-700">{title}</div><pre className="overflow-x-auto whitespace-pre-wrap border border-white/[0.07] bg-[#07080a] p-4 font-mono text-[10px] leading-5 text-zinc-600">{content}</pre></div>;
}
