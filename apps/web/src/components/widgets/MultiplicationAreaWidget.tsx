"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { StepperInput } from "@/components/StepperInput";

const CELL = 14;
const GAP = 2;
const PAD = 36;

type Mode = "intro" | "explore" | "fill";

type MultiplicationAreaConfig = {
  a: number;
  b: number;
  mode: Mode;
};

type Props = {
  config: Record<string, unknown>;
  cycle: number;
  onComplete?: () => void;
};

function clamp(num: number, min: number, max: number) {
  return Math.max(min, Math.min(max, num));
}

function sizePx(count: number) {
  if (count <= 0) return 0;
  return count * CELL + (count - 1) * GAP;
}

const COLORS = {
  tl: { fill: "var(--accent)", opacity: 0.35 },
  bl: { fill: "var(--accent)", opacity: 0.55 },
  tr: { fill: "var(--success)", opacity: 0.3 },
  br: { fill: "var(--success)", opacity: 0.5 },
} as const;

export function MultiplicationAreaWidget({
  config,
  cycle,
  onComplete,
}: Props) {
  const cfg = config as MultiplicationAreaConfig;
  const mode = cfg.mode ?? "intro";
  const initialA = clamp(Number(cfg.a) || 14, 2, 30);
  const initialB = clamp(Number(cfg.b) || 12, 2, 30);

  const [a, setA] = useState(initialA);
  const [b, setB] = useState(initialB);
  const [inputs, setInputs] = useState<number[]>([0, 0, 0, 0]);
  const [showResult, setShowResult] = useState(false);
  const completedRef = useRef(false);

  useEffect(() => {
    setA(initialA);
    setB(initialB);
    setInputs([0, 0, 0, 0]);
    setShowResult(false);
    completedRef.current = false;
  }, [initialA, initialB, mode, cycle]);

  const a1 = Math.min(a, 10);
  const a2 = Math.max(0, a - 10);
  const b1 = Math.min(b, 10);
  const b2 = Math.max(0, b - 10);

  const parts = useMemo(
    () => [
      { key: "tl" as const, w: b1, h: a1, area: a1 * b1, label: `${a1}×${b1}` },
      { key: "bl" as const, w: b1, h: a2, area: a2 * b1, label: `${a2}×${b1}` },
      { key: "tr" as const, w: b2, h: a1, area: a1 * b2, label: `${a1}×${b2}` },
      { key: "br" as const, w: b2, h: a2, area: a2 * b2, label: `${a2}×${b2}` },
    ],
    [a1, a2, b1, b2],
  );

  const total = a * b;
  const activeParts = parts.filter((p) => p.w > 0 && p.h > 0);

  useEffect(() => {
    if (mode !== "fill" && onComplete && !completedRef.current) {
      completedRef.current = true;
      onComplete();
    }
  }, [mode, onComplete]);

  const totalW = sizePx(a);
  const totalH = sizePx(b);
  const svgW = PAD * 2 + totalW;
  const svgH = PAD * 2 + totalH + 28;

  function regionRect(index: number) {
    const p = parts[index];
    if (p.w <= 0 || p.h <= 0) return null;
    const xBefore =
      index === 0 || index === 1 ? 0 : sizePx(b1) + GAP;
    const yBefore =
      index === 0 || index === 2 ? 0 : sizePx(a1) + GAP;
    return {
      x: PAD + xBefore,
      y: PAD + yBefore,
      width: sizePx(p.w),
      height: sizePx(p.h),
      cx: PAD + xBefore + sizePx(p.w) / 2,
      cy: PAD + yBefore + sizePx(p.h) / 2,
      ...p,
    };
  }

  function handleInput(index: number, value: string) {
    const num = value === "" ? 0 : clamp(Number(value), 0, 999);
    setInputs((prev) => {
      const next = [...prev];
      next[index] = num;
      return next;
    });
    setShowResult(false);
  }

  function checkFill() {
    const allCorrect = activeParts.every(
      (p, i) => inputs[i] === p.area,
    );
    setShowResult(true);
    if (allCorrect && onComplete && !completedRef.current) {
      completedRef.current = true;
      onComplete();
    }
  }

  const isFillComplete =
    showResult && activeParts.every((p, i) => inputs[i] === p.area);

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <p className="text-center text-base font-medium text-ink">
        {a} × {b} ={" "}
        <span className="text-accent">
          {mode === "fill" && !showResult ? "?" : total}
        </span>
      </p>

      <svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        className="h-auto w-full max-w-md touch-manipulation select-none"
        role="img"
        aria-label={`${a} 乘 ${b} 的面积模型`}
      >
        <rect
          x={PAD - 8}
          y={PAD - 8}
          width={totalW + 16}
          height={totalH + 16}
          fill="var(--paper)"
          stroke="var(--border)"
          strokeWidth="1"
          rx="6"
        />

        {parts.map((_, index) => {
          const r = regionRect(index);
          if (!r) return null;
          const style = COLORS[parts[index].key];
          return (
            <g key={parts[index].key}>
              <rect
                x={r.x}
                y={r.y}
                width={r.width}
                height={r.height}
                rx="3"
                fill={style.fill}
                fillOpacity={style.opacity}
                stroke="var(--border)"
                strokeWidth="1"
                className="area-cell-fill"
              />
              {mode === "fill" ? (
                <text
                  x={r.cx}
                  y={r.cy + 5}
                  textAnchor="middle"
                  fill="var(--ink)"
                  fontSize="16"
                  fontWeight="500"
                >
                  {showResult
                    ? inputs[index] === r.area
                      ? "✓"
                      : "×"
                    : "?"}
                </text>
              ) : (
                <text
                  x={r.cx}
                  y={r.cy - 6}
                  textAnchor="middle"
                  fill="var(--ink-soft)"
                  fontSize="13"
                  fontWeight="500"
                >
                  {r.label}
                </text>
              )}
              {mode !== "fill" && (
                <text
                  x={r.cx}
                  y={r.cy + 12}
                  textAnchor="middle"
                  fill="var(--accent)"
                  fontSize="13"
                  fontWeight="600"
                >
                  = {r.area}
                </text>
              )}
            </g>
          );
        })}

        <text
          x={PAD + totalW / 2}
          y={svgH - 8}
          textAnchor="middle"
          fill="var(--ink-muted)"
          fontSize="13"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {b}
        </text>
        <text
          x={16}
          y={PAD + totalH / 2}
          textAnchor="middle"
          transform={`rotate(-90, 16, ${PAD + totalH / 2})`}
          fill="var(--ink-muted)"
          fontSize="13"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {a}
        </text>
      </svg>

      {mode === "fill" && (
        <div className="w-full max-w-md space-y-3 rounded-xl border border-border bg-surface/80 p-4">
          <p className="text-center text-sm text-ink-muted">
            把大长方形分成几块，分别算出每块有多少个小格子。
          </p>
          <div className="grid grid-cols-2 gap-3">
            {activeParts.map((p, i) => (
              <label
                key={p.key}
                className="flex items-center gap-2 rounded-lg border border-border bg-paper px-3 py-2"
              >
                <span className="text-sm text-ink-soft">{p.label}</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={999}
                  value={inputs[i] || ""}
                  onChange={(e) => handleInput(i, e.target.value)}
                  className="w-full rounded-md border border-border bg-surface px-2 py-1 text-right text-ink outline-none focus:border-accent"
                  aria-label={`${p.label} 等于多少`}
                />
              </label>
            ))}
          </div>
          <button
            type="button"
            onClick={checkFill}
            className="w-full rounded-lg bg-accent py-2 text-sm font-medium text-white transition hover:bg-accent-hover"
          >
            检查答案
          </button>
          {showResult && (
            <p
              className={`text-center text-sm font-medium ${
                isFillComplete ? "text-success" : "text-wrong"
              }`}
              role="status"
            >
              {isFillComplete
                ? "✓ 全对啦！把四块合起来就是总面积。"
                : "还有不对的地方，再算一算每块的小格子数。"}
            </p>
          )}
        </div>
      )}

      {mode === "explore" && (
        <div className="w-full max-w-md space-y-4 rounded-xl border border-border bg-surface/80 p-4">
          <StepperInput
            label="第一个乘数"
            value={a}
            min={2}
            max={30}
            unit=""
            onChange={(v) => {
              setA(v);
              if (onComplete && !completedRef.current) {
                completedRef.current = true;
                onComplete();
              }
            }}
          />
          <StepperInput
            label="第二个乘数"
            value={b}
            min={2}
            max={30}
            unit=""
            onChange={(v) => {
              setB(v);
              if (onComplete && !completedRef.current) {
                completedRef.current = true;
                onComplete();
              }
            }}
          />
          <p className="text-center text-sm text-ink-muted">
            把乘数拆成“整十数 + 一位数”，四块面积相加就是答案。
          </p>
        </div>
      )}

      {mode === "intro" && (
        <p className="text-center text-sm text-ink-muted">
          {a2 > 0 && b2 > 0
            ? `把 ${a} 拆成 ${a1} + ${a2}，把 ${b} 拆成 ${b1} + ${b2}，四块合起来就是 ${total}。`
            : a2 > 0
              ? `把 ${a} 拆成 ${a1} + ${a2}，两块合起来就是 ${total}。`
              : b2 > 0
                ? `把 ${b} 拆成 ${b1} + ${b2}，两块合起来就是 ${total}。`
                : `这一整块就是 ${a} × ${b} = ${total}。`}
        </p>
      )}
    </div>
  );
}
