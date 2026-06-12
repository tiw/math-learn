"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CutMaxSquareConfig } from "@/lib/lesson-types";
import { StepperInput } from "@/components/StepperInput";

const SCALE = 6;
const PADDING = 20;

type CutMaxSquareProps = {
  config: CutMaxSquareConfig;
  cycle: number;
  onComplete?: () => void;
};

export function CutMaxSquare({ config, cycle, onComplete }: CutMaxSquareProps) {
  const { length, width } = config;
  const maxSide = Math.min(length, width);
  const maxArea = maxSide * maxSide;

  const [selectedSide, setSelectedSide] = useState(maxSide);
  const completedRef = useRef(false);

  useEffect(() => {
    setSelectedSide(maxSide);
    completedRef.current = false;
  }, [cycle, maxSide]);

  const isCorrect = selectedSide === maxSide;

  useEffect(() => {
    if (isCorrect && onComplete && !completedRef.current) {
      completedRef.current = true;
      onComplete();
    }
  }, [isCorrect, onComplete]);

  const selectedArea = selectedSide * selectedSide;

  const svgWidth = length * SCALE + PADDING * 2 + 60;
  const svgHeight = width * SCALE + PADDING * 2 + 50;

  const feedback = useMemo(() => {
    if (selectedSide > maxSide) {
      return "正方形不能超出长方形哦，再小一点。";
    }
    if (selectedSide < maxSide) {
      return "还能再放大一点，试试更大的正方形。";
    }
    return `✓ 对了！最大正方形边长 ${maxSide} cm，面积 ${maxArea} cm²。`;
  }, [selectedSide, maxSide, maxArea]);

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <p className="text-center text-sm text-ink-muted">
        长方形纸长 {length} cm、宽 {width} cm。调整边长，找出能剪下的
        <span className="font-medium text-ink">最大</span>正方形。
      </p>

      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="h-auto w-full max-w-md"
        role="img"
        aria-label="从长方形中剪最大正方形"
      >
        <rect
          x={PADDING}
          y={PADDING}
          width={length * SCALE}
          height={width * SCALE}
          fill="var(--surface)"
          stroke="var(--border)"
          strokeWidth="2"
          rx="4"
        />
        <rect
          x={PADDING}
          y={PADDING}
          width={selectedSide * SCALE}
          height={selectedSide * SCALE}
          fill="var(--accent)"
          fillOpacity={0.35}
          stroke="var(--accent)"
          strokeWidth="2"
          strokeDasharray={isCorrect ? undefined : "6 3"}
          rx="2"
        />
        {selectedSide < length && (
          <rect
            x={PADDING + selectedSide * SCALE}
            y={PADDING}
            width={(length - selectedSide) * SCALE}
            height={width * SCALE}
            fill="var(--paper)"
            stroke="var(--border)"
            strokeDasharray="4 3"
            opacity={0.6}
          />
        )}
        {selectedSide < width && (
          <rect
            x={PADDING}
            y={PADDING + selectedSide * SCALE}
            width={selectedSide * SCALE}
            height={(width - selectedSide) * SCALE}
            fill="var(--paper)"
            stroke="var(--border)"
            strokeDasharray="4 3"
            opacity={0.6}
          />
        )}
        <text
          x={PADDING + (length * SCALE) / 2}
          y={svgHeight - 8}
          textAnchor="middle"
          fill="var(--ink-muted)"
          fontSize="12"
        >
          长 {length} cm
        </text>
        <text
          x={12}
          y={PADDING + (width * SCALE) / 2}
          textAnchor="middle"
          transform={`rotate(-90, 12, ${PADDING + (width * SCALE) / 2})`}
          fill="var(--ink-muted)"
          fontSize="12"
        >
          宽 {width} cm
        </text>
      </svg>

      <div className="w-full max-w-md space-y-3 rounded-xl border border-border bg-surface/80 p-4">
        <StepperInput
          label="正方形边长"
          value={selectedSide}
          min={1}
          max={Math.max(length, width)}
          unit="cm"
          onChange={setSelectedSide}
        />
        <p className="text-center text-sm">
          面积 = {selectedSide} × {selectedSide} ={" "}
          <span
            className={
              isCorrect ? "font-semibold text-success" : "text-ink"
            }
          >
            {selectedArea} cm²
          </span>
        </p>
        <p
          className={`text-center text-sm ${
            isCorrect ? "font-medium text-success" : "text-ink-muted"
          }`}
          role="status"
          aria-live="polite"
        >
          {feedback}
        </p>
      </div>
    </div>
  );
}
