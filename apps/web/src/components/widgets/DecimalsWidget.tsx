"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { StepperInput } from "@/components/StepperInput";

type DecimalsMode =
  | "intro"
  | "measure"
  | "money"
  | "compare"
  | "order";

type DecimalsConfig = {
  mode: DecimalsMode;
  values?: number[];
  pair?: [number, number];
  order?: "asc" | "desc";
};

type Props = {
  config: Record<string, unknown>;
  cycle: number;
  onComplete?: () => void;
};

const INTRO_CARDS = [
  { value: 3.45, label: "3.45", unit: "元/支", readAs: "三点四五" },
  { value: 0.85, label: "0.85", unit: "元/支", readAs: "零点八五" },
  { value: 2.6, label: "2.60", unit: "元/支", readAs: "二点六零" },
  { value: 36.6, label: "36.6", unit: "℃", readAs: "三十六点六" },
];

const DIGITS = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];

function readDecimal(n: number): string {
  const [intPart, fracPart = ""] = String(n).split(".");
  let result = "";
  const int = Number(intPart);
  if (int === 0) {
    result = "零";
  } else {
    result = String(int)
      .split("")
      .map((d) => DIGITS[Number(d)])
      .join("");
  }
  result += "点";
  if (fracPart) {
    result += fracPart
      .split("")
      .map((d) => DIGITS[Number(d)])
      .join("");
  } else {
    result += "零";
  }
  return result;
}

export function DecimalsWidget({ config, cycle, onComplete }: Props) {
  const cfg = (config ?? {}) as DecimalsConfig;
  const mode = cfg.mode ?? "intro";
  const completedRef = useRef(false);

  useEffect(() => {
    completedRef.current = false;
  }, [cycle, mode]);

  const markComplete = () => {
    if (!completedRef.current && onComplete) {
      completedRef.current = true;
      onComplete();
    }
  };

  switch (mode) {
    case "intro":
      return <IntroWidget onComplete={markComplete} />;
    case "measure":
      return <MeasureWidget onComplete={markComplete} />;
    case "money":
      return <MoneyWidget onComplete={markComplete} />;
    case "compare":
      return (
        <CompareWidget
          pair={cfg.pair ?? [0.8, 1.2]}
          onComplete={markComplete}
        />
      );
    case "order":
      return (
        <OrderWidget
          values={cfg.values ?? [0.8, 1.2, 1.1, 1.09]}
          order={cfg.order ?? "desc"}
          onComplete={markComplete}
        />
      );
    default:
      return <IntroWidget onComplete={markComplete} />;
  }
}

function IntroWidget({ onComplete }: { onComplete: () => void }) {
  const [revealed, setRevealed] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (revealed.size === INTRO_CARDS.length) {
      onComplete();
    }
  }, [revealed, onComplete]);

  function toggle(index: number) {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <p className="text-center text-sm text-ink-muted">
        点击卡片，看看这些小数怎么读。
      </p>
      <div className="grid w-full max-w-md grid-cols-2 gap-3">
        {INTRO_CARDS.map((card, index) => {
          const isRevealed = revealed.has(index);
          return (
            <button
              key={card.label}
              type="button"
              onClick={() => toggle(index)}
              className={`flex flex-col items-center justify-center rounded-xl border p-4 transition ${
                isRevealed
                  ? "border-accent bg-accent/10"
                  : "border-border bg-surface hover:border-accent/40"
              }`}
            >
              <span className="text-2xl font-medium text-ink">
                {card.label}
              </span>
              <span className="text-xs text-ink-muted">{card.unit}</span>
              <span
                className={`mt-2 text-sm font-medium transition-opacity ${
                  isRevealed ? "opacity-100 text-accent" : "opacity-0"
                }`}
              >
                {card.readAs}
              </span>
            </button>
          );
        })}
      </div>
      {revealed.size === INTRO_CARDS.length && (
        <p className="text-center text-sm font-medium text-success" role="status">
          ✓ 全部认识了！
        </p>
      )}
    </div>
  );
}

function MeasureWidget({ onComplete }: { onComplete: () => void }) {
  const [dm, setDm] = useState(1);

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <Ruler value={dm} max={10} unit="分米" />
      <div className="w-full max-w-xs">
        <StepperInput
          label="分米数"
          value={dm}
          min={0}
          max={9}
          unit="分米"
          onChange={(v) => {
            setDm(v);
            onComplete();
          }}
        />
      </div>
      <p className="text-center text-lg text-ink">
        {dm} 分米 ={" "}
        <span className="font-serif font-medium text-accent">
          {dm}/10
        </span>{" "}
        米 ={" "}
        <span className="font-serif font-medium text-accent">
          0.{dm} 米
        </span>
      </p>
      <p className="text-center text-sm text-ink-muted">
        {readDecimal(dm / 10)} 米
      </p>
    </div>
  );
}

function MoneyWidget({ onComplete }: { onComplete: () => void }) {
  const [jiao, setJiao] = useState(1);

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="flex items-center gap-1">
        {Array.from({ length: jiao }, (_, i) => (
          <Coin key={i} />
        ))}
        {jiao === 0 && (
          <span className="text-sm text-ink-muted">没有角币</span>
        )}
      </div>
      <div className="w-full max-w-xs">
        <StepperInput
          label="角币数"
          value={jiao}
          min={0}
          max={9}
          unit="角"
          onChange={(v) => {
            setJiao(v);
            onComplete();
          }}
        />
      </div>
      <p className="text-center text-lg text-ink">
        {jiao} 角 ={" "}
        <span className="font-serif font-medium text-accent">
          {jiao}/10
        </span>{" "}
        元 ={" "}
        <span className="font-serif font-medium text-accent">
          0.{jiao} 元
        </span>
      </p>
      <p className="text-center text-sm text-ink-muted">
        {readDecimal(jiao / 10)} 元
      </p>
    </div>
  );
}

function Coin() {
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-accent bg-accent/10 text-xs font-medium text-accent">
      1角
    </div>
  );
}

function Ruler({ value, max, unit }: { value: number; max: number; unit: string }) {
  const width = 360;
  const height = 90;
  const padding = 24;
  const trackStart = padding;
  const trackEnd = width - padding;
  const trackY = 50;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-auto w-full max-w-md"
      role="img"
      aria-label={`${max}${unit} 尺子，当前指到 ${value}${unit}`}
    >
      <line
        x1={trackStart}
        y1={trackY}
        x2={trackEnd}
        y2={trackY}
        stroke="var(--border)"
        strokeWidth="2"
      />
      {Array.from({ length: max + 1 }, (_, i) => {
        const x = trackStart + (i / max) * (trackEnd - trackStart);
        const isMajor = i % 5 === 0;
        return (
          <g key={i}>
            <line
              x1={x}
              y1={trackY - (isMajor ? 12 : 6)}
              x2={x}
              y2={trackY}
              stroke="var(--ink-muted)"
              strokeWidth="1.5"
            />
            {isMajor && (
              <text
                x={x}
                y={trackY + 22}
                textAnchor="middle"
                fill="var(--ink-muted)"
                fontSize="12"
              >
                {i}
              </text>
            )}
          </g>
        );
      })}
      <polygon
        points={`
          ${trackStart + (value / max) * (trackEnd - trackStart) - 6},${trackY - 24}
          ${trackStart + (value / max) * (trackEnd - trackStart) + 6},${trackY - 24}
          ${trackStart + (value / max) * (trackEnd - trackStart)},${trackY - 12}
        `}
        fill="var(--accent)"
      />
      <text
        x={trackStart + (value / max) * (trackEnd - trackStart)}
        y={trackY - 32}
        textAnchor="middle"
        fill="var(--accent)"
        fontSize="13"
        fontWeight="500"
      >
        {value} {unit}
      </text>
    </svg>
  );
}

function CompareWidget({
  pair,
  onComplete,
}: {
  pair: [number, number];
  onComplete: () => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");

  const [a, b] = pair;
  const larger = a > b ? a : b;

  function choose(value: number) {
    setSelected(value);
    if (value === larger) {
      setStatus("correct");
      onComplete();
    } else {
      setStatus("wrong");
    }
  }

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <NumberLine values={[a, b]} min={0} max={2} />
      <p className="text-center text-sm text-ink-muted">
        点击两个数中较大的一个。
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        {[a, b].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => choose(value)}
            className={`min-h-12 min-w-[5rem] rounded-lg border px-5 py-2 text-lg font-medium transition ${
              selected === value && status === "correct"
                ? "border-success bg-success/10 text-success"
                : selected === value && status === "wrong"
                  ? "border-wrong bg-wrong/10 text-wrong"
                  : "border-border bg-surface text-ink hover:border-accent/40"
            }`}
          >
            {value}
          </button>
        ))}
      </div>
      {status === "correct" && (
        <p className="text-center text-sm font-medium text-success" role="status">
          ✓ {larger} 更大！
        </p>
      )}
      {status === "wrong" && (
        <p className="text-center text-sm text-wrong" role="status">
          ✗ 再想想看，数轴上更靠右的数更大。
        </p>
      )}
    </div>
  );
}

function NumberLine({
  values,
  min,
  max,
}: {
  values: number[];
  min: number;
  max: number;
}) {
  const width = 360;
  const height = 80;
  const padding = 28;
  const trackY = 48;
  const range = max - min;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-auto w-full max-w-md"
      role="img"
      aria-label="数轴"
    >
      <line
        x1={padding}
        y1={trackY}
        x2={width - padding}
        y2={trackY}
        stroke="var(--border)"
        strokeWidth="2"
      />
      {Array.from({ length: range * 10 + 1 }, (_, i) => {
        const value = min + i / 10;
        const x = padding + ((value - min) / range) * (width - padding * 2);
        const isWhole = Math.round(value * 10) % 10 === 0;
        return (
          <g key={i}>
            <line
              x1={x}
              y1={trackY - (isWhole ? 8 : 4)}
              x2={x}
              y2={trackY}
              stroke="var(--ink-muted)"
              strokeWidth="1"
            />
            {isWhole && (
              <text
                x={x}
                y={trackY + 20}
                textAnchor="middle"
                fill="var(--ink-muted)"
                fontSize="11"
              >
                {value.toFixed(0)}
              </text>
            )}
          </g>
        );
      })}
      {values.map((value, index) => {
        const x = padding + ((value - min) / range) * (width - padding * 2);
        return (
          <g key={index}>
            <circle cx={x} cy={trackY} r="5" fill="var(--accent)" />
            <text
              x={x}
              y={trackY - 16}
              textAnchor="middle"
              fill="var(--accent)"
              fontSize="12"
              fontWeight="500"
            >
              {value}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function OrderWidget({
  values,
  order,
  onComplete,
}: {
  values: number[];
  order: "asc" | "desc";
  onComplete: () => void;
}) {
  const expected = useMemo(
    () =>
      [...values].sort((a, b) =>
        order === "asc" ? a - b : b - a,
      ),
    [values, order],
  );

  const [clicked, setClicked] = useState<number[]>([]);
  const [flash, setFlash] = useState<string | null>(null);

  function handleClick(value: number) {
    const nextIndex = clicked.length;
    if (value === expected[nextIndex]) {
      const next = [...clicked, value];
      setClicked(next);
      setFlash(null);
      if (next.length === expected.length) {
        onComplete();
      }
    } else {
      setClicked([]);
      setFlash(
        order === "asc"
          ? `应该从最小的开始点，第一个是最小值 ${expected[0]}。`
          : `应该从最大的开始点，第一个是最大值 ${expected[0]}。`,
      );
    }
  }

  const label = order === "asc" ? "从小到大" : "从大到小";

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <p className="text-center text-sm text-ink-muted">
        请按{label}的顺序依次点击数字。
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        {values.map((value) => {
          const isUsed = clicked.includes(value);
          return (
            <button
              key={value}
              type="button"
              disabled={isUsed}
              onClick={() => handleClick(value)}
              className={`min-h-12 min-w-[5rem] rounded-lg border px-5 py-2 text-lg font-medium transition ${
                isUsed
                  ? "border-success/40 bg-success/10 text-success"
                  : "border-border bg-surface text-ink hover:border-accent/40"
              }`}
            >
              {value}
            </button>
          );
        })}
      </div>
      <p className="text-sm text-ink-muted">
        已排好 {clicked.length}/{values.length} 个
      </p>
      {flash && <p className="text-center text-sm text-wrong">{flash}</p>}
      {clicked.length === expected.length && (
        <p className="text-center text-sm font-medium text-success" role="status">
          ✓ 排序完成！
        </p>
      )}
    </div>
  );
}
