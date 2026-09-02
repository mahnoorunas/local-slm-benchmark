"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useIsNarrow } from "@/lib/useIsNarrow";
import type { ModelSummary } from "@/lib/types";

const BAR_COLORS = ["#5EEAD4", "#F0B429", "#2A9B8F"];

export function SpeedChart({ models }: { models: ModelSummary[] }) {
  const narrow = useIsNarrow();
  const data = [...models].sort(
    (a, b) => b.avg_tokens_per_sec - a.avg_tokens_per_sec
  );

  return (
    <div className="h-56 sm:h-72 w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 8,
            right: narrow ? 4 : 8,
            left: narrow ? -12 : 0,
            bottom: narrow ? 28 : 8,
          }}
        >
          <CartesianGrid stroke="#1E2A3C" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="model"
            interval={0}
            angle={narrow ? -25 : 0}
            textAnchor={narrow ? "end" : "middle"}
            height={narrow ? 50 : 30}
            tick={{
              fill: "#8B9BB0",
              fontSize: narrow ? 10 : 12,
              fontFamily: "JetBrains Mono",
            }}
            axisLine={{ stroke: "#1E2A3C" }}
            tickLine={false}
          />
          <YAxis
            width={narrow ? 36 : 48}
            tick={{
              fill: "#8B9BB0",
              fontSize: narrow ? 10 : 12,
              fontFamily: "JetBrains Mono",
            }}
            axisLine={false}
            tickLine={false}
            label={
              narrow
                ? undefined
                : {
                    value: "tokens/sec",
                    angle: -90,
                    position: "insideLeft",
                    style: { fill: "#8B9BB0", fontSize: 11 },
                  }
            }
          />
          <Tooltip
            cursor={{ fill: "rgba(94, 234, 212, 0.06)" }}
            contentStyle={{
              background: "#0E1522",
              border: "1px solid #1E2A3C",
              borderRadius: 8,
              fontFamily: "JetBrains Mono",
              fontSize: 12,
              color: "#E8EEF6",
              boxShadow: "0 0 24px -6px rgba(94, 234, 212, 0.2)",
            }}
            formatter={(value: number) => [`${value.toFixed(2)} t/s`, "Speed"]}
          />
          <Bar
            dataKey="avg_tokens_per_sec"
            radius={[6, 6, 0, 0]}
            animationDuration={900}
            animationEasing="ease-out"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
