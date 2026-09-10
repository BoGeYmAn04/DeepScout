export type StageKey = "search" | "reader" | "writer" | "critic";
export type StageStatus = "idle" | "running" | "complete" | "error";

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
}

export type StreamEvent =
  | { type: "stage"; stage: StageKey; status: StageStatus; message?: string }
  | { type: "complete"; result: ResearchResult }
  | { type: "error"; message: string };
