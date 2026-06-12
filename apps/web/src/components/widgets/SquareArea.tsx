"use client";

import { useState } from "react";
import type { SquareAreaConfig } from "@/lib/lesson-types";
import { StepperInput } from "@/components/StepperInput";

const CELL = 32;
const GAP = 3;
const PADDING = 24;

type SquareAreaProps = {
  config: SquareAreaConfig;
  cycle: number;
  onComplete?: () => void;
};

export function SquareArea({ config, cycle, onComplete }: SquareAreaProps) {
  const isExplore = config.mode === "explore";
  const [side, setSide] = useState(config.side);
  const displaySide = isExplore ? side : config.side;
  const area = displaySide * displaySide;

  const gridSize =
    PADDING * 2 + displaySide * CELL + (displaySide - 1) * GAP + 40;

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <svg
        viewBox={`0 0 ${gridSize} ${gridSize}`}
        className="h-auto w-full max-w-sm"
        role="img"
        aria-label={`边长 ${displaySide} 厘米的正方形`}
      >
        <rect
          x={PADDING - 6}
          y={PADDING - 6}
          width={displaySide * CELL + (displaySide - 1) * GAP + 12}
          height={displaySide * CELL + (displaySide - 1) * GAP + 12}
          fill="var(--paper)"
          stroke="var(--border)"
          rx="6"
        />
        {Array.from({ length: displaySide * displaySide }, (_, i) => {
          const row = Math.floor(i / displaySide);
          const col = i % displaySide;
          const x = PADDING + col * (CELL + GAP);
          const y = PADDING + row * (CELL + GAP);
          return (
            <rect
              key={`${cycle}-${row}-${col}`}
              x={x}
              y={y}
              width={CELL}
              height={CELL}
              rx="3"
              fill="var(--accent)"
              stroke="var(--accent-hover)"
              strokeWidth="1.5"
              className="area-cell-fill"
              style={{ animationDelay: `${i * 20}ms` }}
            />
          );
        })}
        <text
          x={gridSize / 2}
          y={gridSize - 10}
          textAnchor="middle"
          fill="var(--ink-muted)"
          fontSize="13"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          边长 {displaySide} cm
        </text>
        <text
          x={gridSize / 2}
          y={18}
          textAnchor="middle"
          fill="var(--accent)"
          fontSize="15"
          fontWeight="500"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {displaySide} × {displaySide} = {area} cm²
        </text>
      </svg>

      {isExplore ? (
        <div className="w-full max-w-sm rounded-xl border border-border bg-surface/80 p-4">
          <StepperInput
            label="边长"
            value={side}
            min={2}
            max={12}
            unit="cm"
            onChange={(v) => {
              setSide(v);
              onComplete?.();
            }}
          />
          <p className="mt-3 text-center text-base text-ink">
            正方形面积 = 边长 × 边长 ={" "}
            <span className="font-semibold text-accent">{area} cm²</span>
          </p>
        </div>
      ) : (
        <p className="text-center text-sm text-ink-muted">
          正方形是特殊的长方形，长 = 宽，所以面积 = 边长 × 边长。
        </p>
      )}
    </div>
  );
}
