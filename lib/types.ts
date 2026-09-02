export type BenchmarkRow = {
  model: string;
  prompt_id: string;
  prompt: string;
  run: number;
  latency_s: number;
  tokens: number;
  tokens_per_sec: number;
  quality_score: number | null;
  keyword_hit: number | null;
};

export type ModelSummary = {
  model: string;
  avg_tokens_per_sec: number;
  avg_latency_s: number;
  avg_quality: number | null;
  n: number;
};

export type BenchmarkData = {
  generated_at: string;
  source: string;
  models: ModelSummary[];
  rows: BenchmarkRow[];
};
