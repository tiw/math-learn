"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { AreaGridConfig } from "@/lib/lesson-types";
import { StepperInput } from "@/components/StepperInput";
import { useStepScrollProgress } from "@/hooks/useStepScrollProgress";

const CELL = 44;
const GAP = 3;
const PADDING = 24;

type AreaGridProps = {
  config: AreaGridConfig;
  cycle: number;
  stepKey?: string;
  scrollTrackNode?: HTMLElement | null;
  onComplete?: () => void;
};

function cellKey(row: number, col: number) {
  return `${row}-${col}`;
}

function scrollFillHint(progress: number, length: number, width: number) {
  const total = length * width;
  const count = Math.floor(progress * total);
  if (count === 0) return "继续向下滚动，方块会慢慢铺起来……";
  if (count < length) return `第一行正在铺：${count}/${length} 个`;
  if (count < total) return `已铺 ${count}/${total} 个，快完成了！`;
  return `全部铺满了！一共 ${total} 个小方块 = ${total} cm²`;
}

export function AreaGrid({
  config,
  cycle,
  stepKey,
  scrollTrackNode,
  onComplete,
}: AreaGridProps) {
  const {
    length,
    width,
    mode,
    placePhase,
    showFormula,
    showLabels,
  } = config;
  const isExplore = mode === "explore";
  const isPlace = mode === "place";
  const isScrollFill = mode === "scroll-fill";
  const trackedProgress = useStepScrollProgress(
    isScrollFill ? scrollTrackNode ?? null : null,
  );
  const scrollProgress = isScrollFill ? trackedProgress : 0;

  const [exploreLength, setExploreLength] = useState(length);
  const [exploreWidth, setExploreWidth] = useState(width);
  const [placed, setPlaced] = useState<Set<string>>(new Set());
  const [flashMsg, setFlashMsg] = useState<string | null>(null);
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const resetKey =
    stepKey ??
    `${mode}-${placePhase ?? "none"}-${length}x${width}`;

  const displayLength = isExplore ? exploreLength : length;
  const displayWidth = isExplore ? exploreWidth : width;
  const area = displayLength * displayWidth;

  const prefilled = useMemo(() => {
    const set = new Set<string>();
    if (isPlace && placePhase === "complete-grid") {
      for (let col = 0; col < length; col += 1) {
        set.add(cellKey(0, col));
      }
    }
    return set;
  }, [isPlace, placePhase, length]);

  useEffect(() => {
    if (isExplore) {
      setExploreLength(length);
      setExploreWidth(width);
    }
  }, [isExplore, length, width]);

  useEffect(() => {
    setPlaced(new Set());
    setFlashMsg(null);
    completedRef.current = false;
  }, [resetKey]);

  const scrollFillDone = isScrollFill && scrollProgress >= 0.95;

  const filledCells = useMemo(() => {
    if (isScrollFill) {
      const total = length * width;
      const count = Math.floor(scrollProgress * total);
      const set = new Set<string>();
      for (let i = 0; i < count; i += 1) {
        set.add(cellKey(Math.floor(i / length), i % length));
      }
      return set;
    }
    if (isExplore || mode === "formula") {
      return new Set(
        Array.from({ length: displayWidth * displayLength }, (_, i) =>
          cellKey(Math.floor(i / displayLength), i % displayLength),
        ),
      );
    }
    if (isPlace) {
      return new Set([...prefilled, ...placed]);
    }
    return new Set<string>();
  }, [
    isExplore,
    mode,
    isPlace,
    prefilled,
    placed,
    displayLength,
    displayWidth,
    isScrollFill,
    scrollProgress,
    length,
    width,
  ]);

  const canClickCell = useCallback(
    (row: number, col: number) => {
      if (!isPlace || filledCells.has(cellKey(row, col))) return false;
      if (placePhase === "first-row") return row === 0;
      if (placePhase === "complete-grid") return row > 0;
      return true;
    },
    [isPlace, placePhase, filledCells],
  );

  function handleCellClick(row: number, col: number) {
    if (!canClickCell(row, col)) {
      if (isPlace && placePhase === "first-row" && row !== 0) {
        setFlashMsg("先铺第一行哦，点击上面那一排格子。");
      } else if (isPlace && placePhase === "complete-grid" && row === 0) {
        setFlashMsg("第一行已经铺好啦，铺下面两行。");
      }
      return;
    }

    const key = cellKey(row, col);
    setPlaced((prev) => new Set([...prev, key]));
    setFlashMsg(null);
  }

  function undoLast() {
    if (!isPlace || placed.size === 0) return;
    const keys = [...placed];
    keys.pop();
    setPlaced(new Set(keys));
    setFlashMsg(null);
  }

  const placedCount = filledCells.size;
  const targetCount = length * width;
  const row0Count = Array.from({ length: length }, (_, col) =>
    filledCells.has(cellKey(0, col)),
  ).filter(Boolean).length;

  const placeComplete =
    isPlace &&
    ((placePhase === "first-row" && row0Count >= length) ||
      (placePhase === "complete-grid" && placedCount >= targetCount));

  useEffect(() => {
    const done = scrollFillDone || placeComplete;
    if (done && onCompleteRef.current && !completedRef.current) {
      completedRef.current = true;
      onCompleteRef.current();
    }
  }, [scrollFillDone, placeComplete]);

  const cells = useMemo(() => {
    const result: {
      row: number;
      col: number;
      filled: boolean;
      clickable: boolean;
    }[] = [];
    for (let row = 0; row < displayWidth; row += 1) {
      for (let col = 0; col < displayLength; col += 1) {
        const key = cellKey(row, col);
        const filled = filledCells.has(key);
        result.push({
          row,
          col,
          filled,
          clickable: canClickCell(row, col),
        });
      }
    }
    return result;
  }, [displayLength, displayWidth, filledCells, canClickCell]);

  const svgWidth =
    PADDING * 2 + displayLength * CELL + (displayLength - 1) * GAP + 48;
  const svgHeight =
    PADDING * 2 + displayWidth * CELL + (displayWidth - 1) * GAP + 48;

  return (
    <div className="flex w-full flex-col items-center gap-4">
      {isScrollFill && (
        <p className="text-center text-sm font-medium text-accent">
          {scrollFillHint(scrollProgress, length, width)}
        </p>
      )}

      {isPlace && (
        <div className="flex flex-col items-center gap-2">
          <p className="text-center text-sm text-ink-muted">
            {placePhase === "first-row" && (
              <>
                点击格子，在第一行铺满{" "}
                <span className="font-semibold text-accent">{length}</span>{" "}
                个小方块（已铺 {row0Count}/{length}）
              </>
            )}
            {placePhase === "complete-grid" && (
              <>
                继续点击，铺完整个长方形（已铺 {placedCount}/{targetCount}）
              </>
            )}
          </p>
          {placed.size > 0 && (
            <button
              type="button"
              onClick={undoLast}
              className="text-sm text-ink-muted underline-offset-2 hover:text-accent hover:underline"
            >
              撤销上一格
            </button>
          )}
        </div>
      )}

      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="h-auto w-full max-w-md touch-manipulation select-none"
        role="img"
        aria-label={`${displayLength} 厘米乘 ${displayWidth} 厘米的长方形网格`}
      >
        <rect
          x={PADDING - 8}
          y={PADDING - 8}
          width={
            displayLength * CELL + (displayLength - 1) * GAP + 16
          }
          height={displayWidth * CELL + (displayWidth - 1) * GAP + 16}
          fill="var(--paper)"
          stroke="var(--border)"
          strokeWidth="1"
          rx="6"
        />

        {cells.map(({ row, col, filled, clickable }) => {
          const x = PADDING + col * (CELL + GAP);
          const y = PADDING + row * (CELL + GAP);
          const delay = (row * displayLength + col) * 30;
          return (
            <g key={`${row}-${col}-${resetKey}`}>
              <rect
                x={x}
                y={y}
                width={CELL}
                height={CELL}
                rx="3"
                fill={
                  filled
                    ? "var(--accent)"
                    : clickable
                      ? "var(--surface)"
                      : "transparent"
                }
                stroke={
                  filled
                    ? "var(--accent-hover)"
                    : mode === "intro" ||
                        clickable ||
                        isScrollFill
                      ? "var(--border)"
                      : "transparent"
                }
                strokeWidth={clickable ? 2 : 1.5}
                strokeDasharray={clickable && !filled ? "4 2" : undefined}
                opacity={mode === "intro" && !filled ? 0.55 : 1}
                className={
                  filled && !isScrollFill ? "area-cell-fill" : undefined
                }
                style={
                  filled
                    ? { animationDelay: `${delay}ms` }
                    : clickable
                      ? { cursor: "pointer" }
                      : undefined
                }
                onPointerDown={(e) => {
                  if (!clickable) return;
                  e.preventDefault();
                  handleCellClick(row, col);
                }}
                tabIndex={clickable ? 0 : -1}
                role={clickable ? "button" : undefined}
                aria-label={
                  clickable
                    ? `铺第 ${row + 1} 行第 ${col + 1} 列`
                    : undefined
                }
              />
              {clickable && !filled && (
                <text
                  x={x + CELL / 2}
                  y={y + CELL / 2 + 4}
                  textAnchor="middle"
                  fill="var(--ink-faint)"
                  fontSize="18"
                  pointerEvents="none"
                >
                  +
                </text>
              )}
            </g>
          );
        })}

        {showLabels && (
          <>
            <text
              x={PADDING + (displayLength * (CELL + GAP) - GAP) / 2}
              y={svgHeight - 12}
              textAnchor="middle"
              fill="var(--ink-muted)"
              fontSize="13"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              长 {displayLength} cm
            </text>
            <text
              x={16}
              y={PADDING + (displayWidth * (CELL + GAP) - GAP) / 2}
              textAnchor="middle"
              transform={`rotate(-90, 16, ${
                PADDING + (displayWidth * (CELL + GAP) - GAP) / 2
              })`}
              fill="var(--ink-muted)"
              fontSize="13"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              宽 {displayWidth} cm
            </text>
          </>
        )}

        {(showFormula || isExplore || mode === "formula") && (
          <text
            x={svgWidth / 2}
            y={20}
            textAnchor="middle"
            fill="var(--accent)"
            fontSize="15"
            fontWeight="500"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {displayLength} × {displayWidth} = {area} cm²
          </text>
        )}
      </svg>

      {flashMsg && (
        <p className="text-center text-sm text-wrong">{flashMsg}</p>
      )}

      {scrollFillDone && (
        <p className="text-center text-sm font-medium text-success" role="status">
          ✓ 滚动铺格完成！
        </p>
      )}

      {placeComplete && (
        <p className="text-center text-sm font-medium text-success" role="status">
          {placePhase === "first-row"
            ? "✓ 第一行铺满了！"
            : `✓ 全部铺满了！一共 ${targetCount} cm²`}
        </p>
      )}

      {isExplore && (
        <div className="w-full max-w-md space-y-4 rounded-xl border border-border bg-surface/80 p-4">
          <StepperInput
            label="长"
            value={exploreLength}
            min={2}
            max={10}
            unit="cm"
            onChange={(v) => {
              setExploreLength(v);
              onCompleteRef.current?.();
            }}
          />
          <StepperInput
            label="宽"
            value={exploreWidth}
            min={2}
            max={8}
            unit="cm"
            onChange={(v) => {
              setExploreWidth(v);
              onCompleteRef.current?.();
            }}
          />
          <p className="text-center text-lg font-medium text-ink">
            面积 = {exploreLength} × {exploreWidth} ={" "}
            <span className="text-accent">
              {exploreLength * exploreWidth} cm²
            </span>
          </p>
        </div>
      )}

      {mode === "formula" && (
        <p className="text-center text-sm text-ink-muted">
          长方形面积 = 长 × 宽 = {length} × {width} ={" "}
          <span className="font-semibold text-accent">{area} cm²</span>
        </p>
      )}

      {mode === "intro" && (
        <p className="text-center text-sm text-ink-muted">
          每个小格子代表 1 cm²，接下来请你亲手把它们铺满。
        </p>
      )}
    </div>
  );
}
