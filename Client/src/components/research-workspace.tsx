import { AlertTriangle, Braces, FileText, Menu, RefreshCcw, Search, ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QueryComposer } from "@/components/query-composer";
import { ReportView } from "@/components/report-view";
import { ResearchTrace } from "@/components/research-trace";
import { SourceList } from "@/components/source-list";
import { Skeleton } from "@/components/ui/skeleton";
import type { ResearchResult, StageState } from "@/types/research";

interface Props {
  query: string;
  setQuery: (v: string) => void;
  submittedQuery: string;
  result: ResearchResult | null;
  stages: StageState[];
  loading: boolean;
  error: string | null;
  onSubmit: () => void;
  onOpenSidebar: () => void;
}

export function ResearchWorkspace({ query, setQuery, submittedQuery, result, stages, loading, error, onSubmit, onOpenSidebar }: Props) {
  const completed = stages.filter((s) => s.status === "complete").length;
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <header className="flex h-[58px] items-center justify-between border-b border-white/[0.06] bg-[#07090d]/75 px-4 backdrop-blur-xl md:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={onOpenSidebar}><Menu /></Button>
          <div className="min-w-0"><div className="truncate text-xs font-medium text-zinc-300">{submittedQuery}</div><div className="mt-0.5 text-[9px] text-zinc-700">DeepScout research session</div></div>
        </div>
        <Badge className={loading ? "border-violet-300/15 text-violet-300" : "border-emerald-300/15 text-emerald-400"}>
          <span className={`size-1.5 rounded-full ${loading ? "animate-pulse bg-violet-400" : "bg-emerald-400"}`} /> {loading ? "Agent running" : "Research complete"}
        </Badge>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px]">
        <ScrollArea className="h-[calc(100vh-58px)]">
          <div className="mx-auto w-full max-w-5xl px-4 py-6 md:px-8 md:py-8">
            {error ? (
              <Card className="border-red-400/15 bg-red-400/[0.03] p-5">
                <div className="flex gap-3"><AlertTriangle className="mt-0.5 size-5 shrink-0 text-red-300" /><div><h3 className="text-sm font-medium text-red-100">Research stopped</h3><p className="mt-1 text-xs leading-5 text-red-200/50">{error}</p><Button variant="outline" size="sm" className="mt-4" onClick={onSubmit}><RefreshCcw /> Try again</Button></div></div>
              </Card>
            ) : result ? (
              <Tabs defaultValue="report">
                <div className="mb-6 flex items-center justify-between gap-3">
                  <TabsList>
                    <TabsTrigger value="report"><FileText className="mr-1.5 size-3" /> Report</TabsTrigger>
                    <TabsTrigger value="sources"><Search className="mr-1.5 size-3" /> Sources</TabsTrigger>
                    <TabsTrigger value="critique"><ShieldCheck className="mr-1.5 size-3" /> Critique</TabsTrigger>
                    <TabsTrigger value="raw" className="hidden sm:block"><Braces className="mr-1.5 inline size-3" /> Raw</TabsTrigger>
                  </TabsList>
                  <div className="hidden items-center gap-1.5 text-[10px] text-zinc-700 md:flex"><Sparkles className="size-3 text-cyan-300/50" /> 4-stage pipeline complete</div>
                </div>
                <TabsContent value="report"><ReportView query={submittedQuery} report={result.research_report} /></TabsContent>
                <TabsContent value="sources"><div className="mb-6"><h2 className="text-xl font-semibold text-white">Sources discovered</h2><p className="mt-1 text-xs text-zinc-600">URLs surfaced by the search agent during this run.</p></div><SourceList sources={result.sources} /></TabsContent>
                <TabsContent value="critique"><div className="mb-6"><h2 className="text-xl font-semibold text-white">Critic review</h2><p className="mt-1 text-xs text-zinc-600">Independent quality pass on the generated research report.</p></div><div className="report-markdown"><p className="whitespace-pre-wrap">{result.critic_feedback}</p></div></TabsContent>
                <TabsContent value="raw"><div className="space-y-6"><RawPanel title="Search results" content={result.search_results} /><RawPanel title="Deep-read content" content={result.scraped_content} /></div></TabsContent>
              </Tabs>
            ) : (
              <div className="space-y-4">
                <div className="mb-8"><div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-300/60">Researching</div><h1 className="max-w-3xl text-2xl font-semibold tracking-[-0.03em] text-white md:text-3xl">{submittedQuery}</h1><p className="mt-2 text-sm text-zinc-600">DeepScout is gathering and evaluating evidence.</p></div>
                <Skeleton className="h-8 w-1/3" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-[92%]" /><Skeleton className="h-4 w-[84%]" /><Skeleton className="mt-7 h-6 w-1/4" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-[90%]" /><Skeleton className="h-4 w-[73%]" />
              </div>
            )}
            <div className="mt-12 border-t border-white/[0.06] pt-5"><QueryComposer compact query={query} setQuery={setQuery} onSubmit={onSubmit} loading={loading} /></div>
          </div>
        </ScrollArea>

        <aside className="hidden border-l border-white/[0.06] bg-[#080a0f]/60 xl:block">
          <ScrollArea className="h-[calc(100vh-58px)]">
            <div className="p-5">
              <div className="mb-4 flex items-center justify-between"><div><div className="text-xs font-semibold text-zinc-300">Research trace</div><div className="mt-0.5 text-[9px] text-zinc-700">Agent execution graph</div></div><div className="text-[10px] font-medium text-zinc-600">{completed}/4</div></div>
              <ResearchTrace stages={stages} />
              <div className="my-5 h-px bg-white/[0.06]" />
              <div className="mb-3 text-xs font-semibold text-zinc-300">Sources</div>
              <SourceList sources={result?.sources ?? []} />
            </div>
          </ScrollArea>
        </aside>
      </div>
    </div>
  );
}

function RawPanel({ title, content }: { title: string; content: string }) {
  return <div><h3 className="mb-2 text-xs font-medium text-zinc-400">{title}</h3><pre className="overflow-x-auto whitespace-pre-wrap rounded-2xl border border-white/[0.07] bg-black/25 p-4 text-[11px] leading-5 text-zinc-500">{content}</pre></div>;
}
