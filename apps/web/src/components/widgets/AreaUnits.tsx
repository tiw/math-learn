"use client";

import { useEffect, useRef, useState } from "react";
import type { AreaUnitsConfig } from "@/lib/lesson-types";

const UNITS = [
  {
    id: "cm2" as const,
    name: "平方厘米",
    symbol: "cm²",
    cell: 28,
    example: "指甲盖大约 1 cm²",
  },
  {
    id: "dm2" as const,
    name: "平方分米",
    symbol: "dm²",
    cell: 14,
    example: "手掌大小大约 1 dm²",
  },
  {
    id: "m2" as const,
    name: "平方米",
    symbol: "m²",
    cell: 8,
    example: "课桌面、黑板面常用 m²",
  },
];

type AreaUnitsProps = {
  config: AreaUnitsConfig;
  cycle: number;
  onComplete?: () => void;
};

export function AreaUnits({ config, cycle, onComplete }: AreaUnitsProps) {
  const [unit, setUnit] = useState<(typeof UNITS)[number]["id"]>(
    config.defaultUnit ?? "cm2",
  );
  const completedRef = useRef(false);

  useEffect(() => {
    setUnit(config.defaultUnit ?? "cm2");
    completedRef.current = false;
  }, [config.defaultUnit, config.mode, cycle]);

  useEffect(() => {
    if (config.mode === "convert" && onComplete && !completedRef.current) {
      completedRef.current = true;
      onComplete();
    }
  }, [config.mode, onComplete]);

  function selectUnit(id: (typeof UNITS)[number]["id"]) {
    setUnit(id);
    if (onComplete && !completedRef.current) {
      completedRef.current = true;
      onComplete();
    }
  }

  const current = UNITS.find((u) => u.id === unit)!;

  if (config.mode === "convert") {
    return (
      <div className="flex w-full flex-col items-center gap-4">
        <p className="text-center text-sm text-ink-muted">
          1 平方分米 = 10×10 个 1 平方厘米 = 100 cm²
        </p>
        <svg
          viewBox="0 0 320 340"
          className="h-auto w-full max-w-sm"
          role="img"
          aria-label="1平方分米等于100平方厘米"
        >
          <rect
            x="40"
            y="40"
            width="240"
            height="240"
            fill="var(--surface)"
            stroke="var(--accent)"
            strokeWidth="2"
            rx="4"
          />
          {Array.from({ length: 100 }, (_, i) => {
            const row = Math.floor(i / 10);
            const col = i % 10;
            return (
              <rect
                key={i}
                x={40 + col * 24}
                y={40 + row * 24}
                width="22"
                height="22"
                fill="var(--accent)"
                fillOpacity={0.25}
                stroke="var(--border)"
                strokeWidth="0.5"
              />
            );
          })}
          <text x="160" y="24" textAnchor="middle" fill="var(--accent)" fontSize="14">
            1 dm²
          </text>
          <text x="160" y="310" textAnchor="middle" fill="var(--ink-muted)" fontSize="13">
            10 cm × 10 cm = 100 cm²
          </text>
        </svg>
        <p className="text-center text-base text-ink">
          <span className="font-semibold text-accent">1 dm² = 100 cm²</span>
        </p>
      </div>
    );
  }

  const displayCells = unit === "m2" ? 1 : unit === "dm2" ? 10 : 1;
  const cellSize = current.cell;
  const gridSize = displayCells * cellSize + (displayCells - 1) * 2 + 80;

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="选择面积单位">
        {UNITS.map((u) => (
          <button
            key={u.id}
            type="button"
            onClick={() => selectUnit(u.id)}
            className={`min-h-11 rounded-full px-4 py-2 text-sm transition ${
              unit === u.id
                ? "bg-accent text-white"
                : "border border-border bg-surface text-ink-muted hover:border-accent/40"
            }`}
          >
            {u.symbol}
          </button>
        ))}
      </div>

      <svg
        viewBox={`0 0 ${gridSize} ${gridSize}`}
        className="h-auto w-full max-w-xs"
        role="img"
        aria-label={`1${current.symbol} 正方形`}
      >
        {unit === "m2" ? (
          <>
            <rect
              x="40"
              y="40"
              width={gridSize - 80}
              height={gridSize - 80}
              fill="var(--accent)"
              fillOpacity={0.2}
              stroke="var(--accent)"
              strokeWidth="2"
              rx="4"
            />
            <text
              x={gridSize / 2}
              y={gridSize / 2}
              textAnchor="middle"
              fill="var(--ink)"
              fontSize="14"
            >
              1 m × 1 m
            </text>
          </>
        ) : (
          Array.from({ length: displayCells * displayCells }, (_, i) => {
            const row = Math.floor(i / displayCells);
            const col = i % displayCells;
            return (
              <rect
                key={i}
                x={40 + col * (cellSize + 2)}
                y={40 + row * (cellSize + 2)}
                width={cellSize}
                height={cellSize}
                fill="var(--accent)"
                fillOpacity={0.35}
                stroke="var(--accent-hover)"
                strokeWidth="1"
                rx="2"
              />
            );
          })
        )}
        <text
          x={gridSize / 2}
          y={gridSize - 16}
          textAnchor="middle"
          fill="var(--ink-muted)"
          fontSize="13"
        >
          1 {current.symbol}
        </text>
      </svg>

      <p className="text-center text-sm text-ink-muted">{current.example}</p>
    </div>
  );
}
