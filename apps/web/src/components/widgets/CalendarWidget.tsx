"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { StepperInput } from "@/components/StepperInput";

export type CalendarConfig = {
  mode:
    | "months-intro"
    | "months-sort"
    | "leap-year"
    | "24hour-dial"
    | "duration";
  /** months-sort 模式默认要分类的月份 */
  targetDays?: 31 | 30 | 28 | 29;
  /** leap-year 模式默认年份 */
  year?: number;
  /** 24hour-dial 模式默认小时（0-23） */
  hour?: number;
  /** duration 模式默认开始/结束时间（小时，0-23） */
  startHour?: number;
  endHour?: number;
};

type Props = {
  config: CalendarConfig;
  cycle: number;
  onComplete?: () => void;
};

const MONTHS = [
  { name: "1月", days: 31 },
  { name: "2月", days: 28 }, // 平年，闰年单独处理
  { name: "3月", days: 31 },
  { name: "4月", days: 30 },
  { name: "5月", days: 31 },
  { name: "6月", days: 30 },
  { name: "7月", days: 31 },
  { name: "8月", days: 31 },
  { name: "9月", days: 30 },
  { name: "10月", days: 31 },
  { name: "11月", days: 30 },
  { name: "12月", days: 31 },
];

const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];

function isLeapYear(year: number): boolean {
  if (year % 400 === 0) return true;
  if (year % 100 === 0) return false;
  return year % 4 === 0;
}

function getFebDays(year: number): 28 | 29 {
  return isLeapYear(year) ? 29 : 28;
}

function format12h(hour: number): string {
  if (hour === 0) return "午夜 12 时";
  if (hour === 12) return "正午 12 时";
  if (hour < 12) return `上午 ${hour} 时`;
  return `下午 ${hour - 12} 时`;
}

function format24h(hour: number): string {
  return `${hour.toString().padStart(2, "0")}:00`;
}

export function CalendarWidget({ config, cycle, onComplete }: Props) {
  const completedRef = useRef(false);

  useEffect(() => {
    completedRef.current = false;
  }, [config.mode, cycle]);

  const markComplete = () => {
    if (onComplete && !completedRef.current) {
      completedRef.current = true;
      onComplete();
    }
  };

  if (config.mode === "months-intro") {
    return (
      <MonthsIntro
        onInteract={markComplete}
      />
    );
  }

  if (config.mode === "months-sort") {
    return (
      <MonthsSort
        targetDays={config.targetDays ?? 31}
        onComplete={markComplete}
      />
    );
  }

  if (config.mode === "leap-year") {
    return (
      <LeapYear
        initialYear={config.year ?? 2024}
        onComplete={markComplete}
      />
    );
  }

  if (config.mode === "24hour-dial") {
    return (
      <Hour24Dial
        initialHour={config.hour ?? 17}
        onComplete={markComplete}
      />
    );
  }

  return (
    <Duration
      startHour={config.startHour ?? 9}
      endHour={config.endHour ?? 18}
      onComplete={markComplete}
    />
  );
}

function MonthsIntro({ onInteract }: { onInteract: () => void }) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <p className="text-center text-sm text-ink-muted">
        一年有 12 个月。凸起的是大月（31 天），凹下的是小月（30 天），2 月最特别。
      </p>
      <div className="grid w-full max-w-sm grid-cols-4 gap-2" role="group" aria-label="十二个月">
        {MONTHS.map((m, i) => {
          const isBig = m.days === 31;
          const isSmall = m.days === 30;
          const isFeb = i === 1;
          const active = hovered === i;
          return (
            <button
              key={m.name}
              type="button"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onClick={onInteract}
              className={`relative flex h-14 flex-col items-center justify-center rounded-lg border text-sm transition ${
                isBig
                  ? "border-accent bg-accent/10 text-ink"
                  : isSmall
                    ? "border-border bg-surface text-ink-soft"
                    : "border-wrong/40 bg-wrong/5 text-ink-soft"
              } ${active ? "ring-2 ring-accent/30" : ""}`}
            >
              <span className="font-medium">{m.name}</span>
              <span className={`text-xs ${isBig ? "text-accent" : "text-ink-muted"}`}>
                {isFeb ? "28/29 天" : `${m.days} 天`}
              </span>
            </button>
          );
        })}
      </div>
      <div className="flex flex-wrap justify-center gap-3 text-xs text-ink-muted">
        <span className="inline-flex items-center gap-1">
          <span className="h-3 w-3 rounded bg-accent/60" />
          大月 31 天
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-3 w-3 rounded bg-surface" />
          小月 30 天
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-3 w-3 rounded bg-wrong/20" />
          2 月特殊
        </span>
      </div>
    </div>
  );
}

function MonthsSort({
  targetDays,
  onComplete,
}: {
  targetDays: 31 | 30 | 28 | 29;
  onComplete: () => void;
}) {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const completedRef = useRef(false);

  const targetLabel =
    targetDays === 31 ? "31 天" : targetDays === 30 ? "30 天" : "28 或 29 天";

  const expected = useMemo(() => {
    if (targetDays === 31) {
      return new Set([0, 2, 4, 6, 7, 9, 11]);
    }
    if (targetDays === 30) {
      return new Set([3, 5, 8, 10]);
    }
    return new Set([1]);
  }, [targetDays]);

  const toggle = (index: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const isCorrect =
    expected.size === selected.size &&
    [...expected].every((i) => selected.has(i));

  useEffect(() => {
    if (isCorrect && onComplete && !completedRef.current) {
      completedRef.current = true;
      onComplete();
    }
  }, [isCorrect, onComplete]);

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <p className="text-center text-sm text-ink-muted">
        点击所有有 <span className="font-semibold text-accent">{targetLabel}</span> 的月份。
      </p>
      <div className="grid w-full max-w-sm grid-cols-4 gap-2" role="group" aria-label="选择月份">
        {MONTHS.map((m, i) => {
          const sel = selected.has(i);
          return (
            <button
              key={m.name}
              type="button"
              onClick={() => toggle(i)}
              className={`flex h-12 items-center justify-center rounded-lg border text-sm transition ${
                sel
                  ? "border-accent bg-accent text-white"
                  : "border-border bg-surface text-ink hover:border-accent/40"
              }`}
              aria-pressed={sel}
            >
              {m.name}
            </button>
          );
        })}
      </div>
      {isCorrect ? (
        <p className="text-center text-sm font-medium text-success" role="status">
          ✓ 找对了！
        </p>
      ) : (
        <p className="text-center text-xs text-ink-faint">
          已选 {selected.size}/{expected.size} 个
        </p>
      )}
    </div>
  );
}

function LeapYear({
  initialYear,
  onComplete,
}: {
  initialYear: number;
  onComplete: () => void;
}) {
  const [year, setYear] = useState(initialYear);
  const [guess, setGuess] = useState<"leap" | "common" | null>(null);
  const completedRef = useRef(false);

  const leap = isLeapYear(year);
  const febDays = getFebDays(year);
  const firstDay = new Date(year, 1, 1).getDay();

  const revealed = guess !== null;
  const correct =
    (guess === "leap" && leap) || (guess === "common" && !leap);

  function handleYearChange(v: number) {
    setYear(v);
    setGuess(null);
    completedRef.current = false;
  }

  useEffect(() => {
    if (revealed && correct && onComplete && !completedRef.current) {
      completedRef.current = true;
      onComplete();
    }
  }, [revealed, correct, onComplete]);

  const cells = useMemo(() => {
    const total = firstDay + febDays;
    const rows = Math.ceil(total / 7);
    return Array.from({ length: rows * 7 }, (_, i) => {
      const day = i - firstDay + 1;
      return day >= 1 && day <= febDays ? day : null;
    });
  }, [firstDay, febDays]);

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="w-full max-w-xs">
        <StepperInput
          label="年份"
          value={year}
          min={1900}
          max={2100}
          unit="年"
          onChange={handleYearChange}
        />
      </div>

      <p className="text-center text-sm text-ink-muted">
        {year} 年的 2 月有几天？它是平年还是闰年？
      </p>

      <div className="grid w-full max-w-xs grid-cols-7 gap-1 text-center text-xs text-ink-muted">
        {WEEKDAYS.map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
        {cells.map((day, i) => (
          <div
            key={i}
            className={`flex h-8 items-center justify-center rounded ${
              day ? "bg-surface text-ink" : ""
            }`}
          >
            {day ?? ""}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setGuess("common")}
          disabled={revealed}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            guess === "common"
              ? "bg-accent text-white"
              : "border border-border bg-surface text-ink hover:border-accent/40"
          } disabled:opacity-60`}
        >
          平年（28 天）
        </button>
        <button
          type="button"
          onClick={() => setGuess("leap")}
          disabled={revealed}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            guess === "leap"
              ? "bg-accent text-white"
              : "border border-border bg-surface text-ink hover:border-accent/40"
          } disabled:opacity-60`}
        >
          闰年（29 天）
        </button>
      </div>

      {revealed && (
        <p
          className={`text-center text-sm font-medium ${
            correct ? "text-success" : "text-wrong"
          }`}
          role="status"
        >
          {correct
            ? `✓ 正确！${year} 年 2 月有 ${febDays} 天，是${leap ? "闰" : "平"}年。`
            : `✗ 不对。${year} 年 2 月有 ${febDays} 天，是${leap ? "闰" : "平"}年。`}
        </p>
      )}

      <p className="text-center text-xs text-ink-faint">
        提示：公历年份是 4 的倍数一般是闰年；但整百年份必须是 400 的倍数才是闰年。
      </p>
    </div>
  );
}

function Hour24Dial({
  initialHour,
  onComplete,
}: {
  initialHour: number;
  onComplete: () => void;
}) {
  const [hour, setHour] = useState(initialHour);
  const [mode, setMode] = useState<"12to24" | "24to12">("12to24");
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const completedRef = useRef(false);

  const display12 = format12h(hour);
  const display24 = format24h(hour);

  const expected = mode === "12to24" ? display24 : display12;
  const isCorrect = answer.trim() === expected;

  function resetAnswer() {
    setAnswer("");
    setChecked(false);
    completedRef.current = false;
  }

  function handleHourChange(v: number) {
    setHour(v);
    resetAnswer();
  }

  function handleModeChange(next: "12to24" | "24to12") {
    setMode(next);
    resetAnswer();
  }

  useEffect(() => {
    if (checked && isCorrect && onComplete && !completedRef.current) {
      completedRef.current = true;
      onComplete();
    }
  }, [checked, isCorrect, onComplete]);

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => handleModeChange("12to24")}
          className={`rounded-full px-3 py-1 text-xs transition ${
            mode === "12to24"
              ? "bg-accent text-white"
              : "border border-border bg-surface text-ink-muted"
          }`}
        >
          12 时计时法 → 24 时计时法
        </button>
        <button
          type="button"
          onClick={() => handleModeChange("24to12")}
          className={`rounded-full px-3 py-1 text-xs transition ${
            mode === "24to12"
              ? "bg-accent text-white"
              : "border border-border bg-surface text-ink-muted"
          }`}
        >
          24 时计时法 → 12 时计时法
        </button>
      </div>

      <div className="relative h-40 w-40">
        <svg viewBox="0 0 160 160" className="h-full w-full" role="img" aria-label="24 小时计时盘">
          <circle cx="80" cy="80" r="75" fill="var(--surface)" stroke="var(--border)" />
          {Array.from({ length: 24 }, (_, i) => {
            const angle = (i * 15 - 90) * (Math.PI / 180);
            const x1 = 80 + 60 * Math.cos(angle);
            const y1 = 80 + 60 * Math.sin(angle);
            const x2 = 80 + 70 * Math.cos(angle);
            const y2 = 80 + 70 * Math.sin(angle);
            const tx = 80 + 52 * Math.cos(angle);
            const ty = 80 + 52 * Math.sin(angle);
            return (
              <g key={i}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="var(--border)"
                  strokeWidth={i % 6 === 0 ? 2 : 1}
                />
                <text
                  x={tx}
                  y={ty}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={i === hour ? "var(--accent)" : "var(--ink-muted)"}
                  fontSize="8"
                  fontWeight={i === hour ? "700" : "400"}
                >
                  {i}
                </text>
              </g>
            );
          })}
          <line
            x1="80"
            y1="80"
            x2={80 + 55 * Math.cos(((hour * 15 - 90) * Math.PI) / 180)}
            y2={80 + 55 * Math.sin(((hour * 15 - 90) * Math.PI) / 180)}
            stroke="var(--accent)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="80" cy="80" r="4" fill="var(--accent)" />
        </svg>
      </div>

      <StepperInput
        label="时间"
        value={hour}
        min={0}
        max={23}
        unit="时"
        onChange={handleHourChange}
      />

      <div className="w-full max-w-sm rounded-xl border border-border bg-surface/80 p-4">
        <p className="mb-2 text-center text-sm text-ink">
          {mode === "12to24" ? (
            <>
              <span className="font-semibold text-accent">{display12}</span> 用 24 时计时法表示是？
            </>
          ) : (
            <>
              <span className="font-semibold text-accent">{display24}</span> 用 12 时计时法表示是？
            </>
          )}
        </p>
        <div className="flex items-center justify-center gap-2">
          <input
            type="text"
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value);
              setChecked(false);
            }}
            onKeyDown={(e) => e.key === "Enter" && setChecked(true)}
            placeholder={mode === "12to24" ? "如 17:00" : "如 下午 5 时"}
            className="w-40 rounded-lg border border-border bg-paper px-3 py-2 text-center text-lg outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            aria-label="你的答案"
          />
          <button
            type="button"
            onClick={() => setChecked(true)}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-hover"
          >
            检查
          </button>
        </div>
        {checked && (
          <p
            className={`mt-2 text-center text-sm font-medium ${
              isCorrect ? "text-success" : "text-wrong"
            }`}
            role="status"
          >
            {isCorrect
              ? "✓ 答对了！"
              : `✗ 正确答案是 ${expected}`}
          </p>
        )}
      </div>
    </div>
  );
}

function Duration({
  startHour,
  endHour,
  onComplete,
}: {
  startHour: number;
  endHour: number;
  onComplete: () => void;
}) {
  const [start, setStart] = useState(startHour);
  const [end, setEnd] = useState(endHour);
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const completedRef = useRef(false);

  const duration = end >= start ? end - start : 24 - start + end;
  const isCorrect = Number(answer.trim()) === duration;

  function resetAnswer() {
    setAnswer("");
    setChecked(false);
    completedRef.current = false;
  }

  function handleStartChange(v: number) {
    setStart(v);
    resetAnswer();
  }

  function handleEndChange(v: number) {
    setEnd(v);
    resetAnswer();
  }

  useEffect(() => {
    if (checked && isCorrect && onComplete && !completedRef.current) {
      completedRef.current = true;
      onComplete();
    }
  }, [checked, isCorrect, onComplete]);

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <p className="text-center text-sm text-ink-muted">
        小红上午 9 时出发，下午 6 时到达，一共坐了多久的火车？
      </p>

      <div className="w-full max-w-sm space-y-4 rounded-xl border border-border bg-surface/80 p-4">
        <StepperInput
          label="开始"
          value={start}
          min={0}
          max={23}
          unit="时"
          onChange={handleStartChange}
        />
        <StepperInput
          label="结束"
          value={end}
          min={0}
          max={23}
          unit="时"
          onChange={handleEndChange}
        />
        <div className="flex items-center justify-between rounded-lg bg-paper px-3 py-2 text-sm">
          <span className="text-ink-muted">即</span>
          <span className="text-ink">
            {format24h(start)} → {format24h(end)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-ink">经过时间：</span>
        <input
          type="number"
          inputMode="numeric"
          value={answer}
          onChange={(e) => {
            setAnswer(e.target.value);
            setChecked(false);
          }}
          onKeyDown={(e) => e.key === "Enter" && setChecked(true)}
          className="w-24 rounded-lg border border-border bg-paper px-3 py-2 text-center text-lg outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          aria-label="经过时间"
        />
        <span className="text-sm text-ink-muted">小时</span>
        <button
          type="button"
          onClick={() => setChecked(true)}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-hover"
        >
          检查
        </button>
      </div>

      {checked && (
        <p
          className={`text-center text-sm font-medium ${
            isCorrect ? "text-success" : "text-wrong"
          }`}
          role="status"
        >
          {isCorrect
            ? "✓ 算对了！"
            : `✗ 再想想。可以先把下午 6 时化成 18 时，再算 18 − 9。`}
        </p>
      )}
    </div>
  );
}
