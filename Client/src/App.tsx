import { useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { ResearchWorkspace } from "@/components/research-workspace";
import { Sidebar } from "@/components/sidebar";
import { checkHealth, streamResearch } from "@/lib/api";
import type { ResearchResult, StageKey, StageState, StreamEvent } from "@/types/research";

const initialStages: StageState[] = [
  { key: "search", label: "Search the web", description: "Discover recent, relevant evidence", status: "idle" },
  { key: "reader", label: "Deep read", description: "Open and inspect the strongest source", status: "idle" },
  { key: "writer", label: "Synthesize report", description: "Structure evidence into findings", status: "idle" },
  { key: "critic", label: "Critic review", description: "Stress-test quality and gaps", status: "idle" },
];

export default function App() {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [stages, setStages] = useState<StageState[]>(initialStages);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [history, setHistory] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("deepscout-history") || "[]") as string[]; } catch { return []; }
  });
  const controller = useRef<AbortController | null>(null);

  const hasSession = Boolean(submittedQuery);
  const activeQuery = useMemo(() => submittedQuery || undefined, [submittedQuery]);

  useEffect(() => {
    const c = new AbortController();
    checkHealth(c.signal).catch(() => undefined);
    return () => c.abort();
  }, []);

  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "n" && !event.ctrlKey && !event.metaKey && !event.altKey && (event.target as HTMLElement).tagName !== "TEXTAREA") reset();
    };
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, []);

  function updateStage(key: StageKey, status: StageState["status"]) {
    setStages((current) => current.map((stage) => stage.key === key ? { ...stage, status } : stage));
  }

  function handleStreamEvent(event: StreamEvent) {
    if (event.type === "stage") updateStage(event.stage, event.status);
    if (event.type === "complete") {
      setResult(event.result);
      setLoading(false);
    }
    if (event.type === "error") {
      setError(event.message);
      setLoading(false);
    }
  }

  async function runResearch() {
    const clean = query.trim();
    if (!clean || loading) return;
    controller.current?.abort();
    controller.current = new AbortController();
    setSubmittedQuery(clean);
    setResult(null);
    setError(null);
    setStages(initialStages.map((stage) => ({ ...stage })));
    setLoading(true);
    setSidebarOpen(false);
    const nextHistory = [clean, ...history.filter((item) => item !== clean)].slice(0, 12);
    setHistory(nextHistory);
    localStorage.setItem("deepscout-history", JSON.stringify(nextHistory));

    try {
      await streamResearch(clean, handleStreamEvent, controller.current.signal);
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setError(err instanceof Error ? err.message : "Research failed");
      setLoading(false);
    }
  }

  function reset() {
    controller.current?.abort();
    setQuery("");
    setSubmittedQuery("");
    setResult(null);
    setError(null);
    setLoading(false);
    setStages(initialStages.map((stage) => ({ ...stage })));
  }

  function selectHistory(item: string) {
    setQuery(item);
    setSidebarOpen(false);
  }

  return (
    <div className="app-shell flex h-screen overflow-hidden text-zinc-100">
      <div className="hidden md:block"><Sidebar history={history} activeQuery={activeQuery} onNew={reset} onSelect={selectHistory} /></div>
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button aria-label="Close sidebar" className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}><X className="absolute right-5 top-5 size-5 text-zinc-400" /></button>
          <div className="relative h-full w-[280px]"><Sidebar history={history} activeQuery={activeQuery} onNew={reset} onSelect={selectHistory} onClose={() => setSidebarOpen(false)} /></div>
        </div>
      )}
      {!hasSession ? (
        <div className="relative flex min-w-0 flex-1 flex-col">
          <button className="absolute left-4 top-4 z-20 grid size-10 place-items-center rounded-xl border border-white/10 bg-black/20 text-zinc-400 md:hidden" onClick={() => setSidebarOpen(true)}>☰</button>
          <EmptyState query={query} setQuery={setQuery} onSubmit={runResearch} />
        </div>
      ) : (
        <ResearchWorkspace query={query} setQuery={setQuery} submittedQuery={submittedQuery} result={result} stages={stages} loading={loading} error={error} onSubmit={runResearch} onOpenSidebar={() => setSidebarOpen(true)} />
      )}
    </div>
  );
}
