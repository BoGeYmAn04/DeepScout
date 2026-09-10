export type StageKey = "search" | "reader" | "writer" | "critic";
export type StageStatus = "idle" | "running" | "complete" | "error";
export type ModelProvider = "Gemini" | "Mistral";

export interface StageState {
  key: StageKey;
  label: string;
  description: string;
  status: StageStatus;
}

export interface ResearchResult {
  query: string;
  search_results: string;
  scraped_content: string;
  research_report: string;
  critic_feedback: string;
  sources: string[];
  final_model: ModelProvider;
  fallback_triggered: boolean;
  models_used: Partial<Record<StageKey, ModelProvider>>;
}

export type StreamEvent =
  | { type: "stage"; stage: StageKey; status: StageStatus; message?: string }
  | { type: "sources"; sources: string[] }
  | { type: "model"; provider: ModelProvider; stage?: StageKey; fallback: boolean; message?: string }
  | { type: "complete"; result: ResearchResult }
  | { type: "error"; message: string };
