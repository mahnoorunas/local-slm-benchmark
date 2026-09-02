import type { BenchmarkData } from "@/lib/types";
import data from "@/data/results.json";

export function getBenchmarkData(): BenchmarkData {
  return data as BenchmarkData;
}
