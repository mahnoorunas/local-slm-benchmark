"use client";

import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { useIsNarrow } from "@/lib/useIsNarrow";
import type { ModelSummary } from "@/lib/types";

export function QualityScatter({ models }: { models: ModelSummary[] }) {
  const narrow = useIsNarrow();
  const data = models
    .filter((m) => m.avg_quality != null)
    .map((m) => ({
      model: m.model,
      x: m.avg_tokens_per_sec,
      y: m.avg_quality as number,
    }));

  return (
    <div className="w-full min-w-0">
      <div className="h-56 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{
              top: 8,
              right: narrow ? 8 : 16,
              left: narrow ? -8 : 0,
              bottom: narrow ? 4 : 8,
            }}
          >
            <CartesianGrid stroke="#1E2A3C" strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="x"
              name="tokens/sec"
              tick={{
                fill: "#8B9BB0",
                fontSize: narrow ? 10 : 12,
                fontFamily: "JetBrains Mono",
              }}
              axisLine={{ stroke: "#1E2A3C" }}
              label={
                narrow
                  ? undefined
                  : {
                      value: "Avg tokens/sec",
                      position: "insideBottom",
                      offset: -2,
                      style: { fill: "#8B9BB0", fontSize: 11 },
                    }
              }
            />
            <YAxis
              type="number"
              dataKey="y"
              name="quality"
              domain={[0.5, 5.5]}
              width={narrow ? 32 : 48}
              tick={{
                fill: "#8B9BB0",
                fontSize: narrow ? 10 : 12,
                fontFamily: "JetBrains Mono",
              }}
              axisLine={false}
              label={
                narrow
                  ? undefined
                  : {
                      value: "Quality (1–5)",
                      angle: -90,
                      position: "insideLeft",
                      style: { fill: "#8B9BB0", fontSize: 11 },
                    }
              }
            />
            <ZAxis range={narrow ? [100, 100] : [160, 160]} />
            <Tooltip
              cursor={{ strokeDasharray: "3 3", stroke: "#5EEAD4" }}
              contentStyle={{
                background: "#0E1522",
                border: "1px solid #1E2A3C",
                borderRadius: 8,
                fontFamily: "JetBrains Mono",
                fontSize: 12,
                color: "#E8EEF6",
                boxShadow: "0 0 24px -6px rgba(240, 180, 41, 0.25)",
              }}
              formatter={(value: number, name: string) => [
                typeof value === "number" ? value.toFixed(2) : value,
                name === "x" ? "tokens/sec" : "quality",
              ]}
              labelFormatter={(_, payload) =>
                payload?.[0]?.payload?.model
                  ? String(payload[0].payload.model)
                  : ""
              }
            />
            <Scatter
              data={data}
              fill="#F0B429"
              animationDuration={1000}
              animationEasing="ease-out"
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <ul className="mt-3 flex flex-col sm:flex-row sm:flex-wrap gap-y-1.5 gap-x-5 font-mono text-[11px] sm:text-xs text-muted">
        {data.map((d) => (
          <li key={d.model} className="break-words">
            <span className="text-cyan font-semibold">{d.model}</span>
            {" — "}
            {d.x.toFixed(1)} t/s · quality {d.y.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
}
