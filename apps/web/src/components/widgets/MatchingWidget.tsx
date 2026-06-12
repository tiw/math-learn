"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type DigitConfig = { mode: "digits"; digits?: number[] };
type OutfitConfig = { mode: "outfit"; tops?: string[]; bottoms?: string[] };
type HandshakeConfig = { mode: "handshake"; items?: string[] };
type IntroConfig = { mode: "intro" };
type SummaryConfig = { mode: "summary" };

type MatchingConfig =
  | DigitConfig
  | OutfitConfig
  | HandshakeConfig
  | IntroConfig
  | SummaryConfig;

type Props = {
  config: Record<string, unknown>;
  cycle: number;
  onComplete?: () => void;
};

function useMatchingConfig(config: Record<string, unknown>): MatchingConfig {
  return config as unknown as MatchingConfig;
}

export function MatchingWidget({ config, cycle, onComplete }: Props) {
  const cfg = useMatchingConfig(config);

  switch (cfg.mode) {
    case "digits":
      return (
        <DigitMatching
          digits={cfg.digits ?? [0, 1, 3, 5]}
          cycle={cycle}
          onComplete={onComplete}
        />
      );
    case "outfit":
      return (
        <OutfitMatching
          tops={cfg.tops ?? ["上装 A", "上装 B"]}
          bottoms={cfg.bottoms ?? ["下装 1", "下装 2", "下装 3"]}
          cycle={cycle}
          onComplete={onComplete}
        />
      );
    case "handshake":
      return (
        <HandshakeMatching
          items={cfg.items ?? ["1 班", "2 班", "3 班", "4 班"]}
          cycle={cycle}
          onComplete={onComplete}
        />
      );
    case "summary":
      return <SummaryPanel onComplete={onComplete} />;
    case "intro":
    default:
      return <IntroPanel onComplete={onComplete} />;
  }
}

// ---------- Intro ----------

function IntroPanel({ onComplete }: { onComplete?: () => void }) {
  useEffect(() => {
    onComplete?.();
  }, [onComplete]);

  return (
    <div className="flex w-full flex-col items-center gap-5 rounded-xl border border-border bg-surface/80 p-6">
      <p className="text-center text-base text-ink-soft">
        生活中的搭配问题有很多，比如：
      </p>
      <div className="grid w-full max-w-md grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { icon: "🍞", label: "早餐搭配" },
          { icon: "👕", label: "穿衣搭配" },
          { icon: "⚽", label: "比赛安排" },
        ].map((item) => (
          <div
            key={item.label}
            className="flex flex-col items-center gap-2 rounded-lg border border-border bg-paper p-4"
          >
            <span className="text-3xl">{item.icon}</span>
            <span className="text-sm text-ink-muted">{item.label}</span>
          </div>
        ))}
      </div>
      <p className="text-center text-sm text-ink-muted">
        只要按顺序思考，就能不重不漏地找出所有方案。
      </p>
    </div>
  );
}

// ---------- Digits ----------

type DigitState = {
  cycle: number;
  formed: Set<number>;
  tens: number | null;
  units: number | null;
  message: string | null;
};

function DigitMatching({
  digits,
  cycle,
  onComplete,
}: {
  digits: number[];
  cycle: number;
  onComplete?: () => void;
}) {
  const uniqueDigits = useMemo(
    () => Array.from(new Set(digits)).sort((a, b) => a - b),
    [digits],
  );

  const target = useMemo(() => {
    const nonZeroTens = uniqueDigits.filter((d) => d !== 0).length;
    return nonZeroTens * (uniqueDigits.length - 1);
  }, [uniqueDigits]);

  const [state, setState] = useState<DigitState>({
    cycle,
    formed: new Set(),
    tens: null,
    units: null,
    message: null,
  });

  if (state.cycle !== cycle) {
    setState({
      cycle,
      formed: new Set(),
      tens: null,
      units: null,
      message: null,
    });
  }

  const completedRef = useRef(false);
  useEffect(() => {
    if (state.formed.size >= target) {
      if (!completedRef.current) {
        completedRef.current = true;
        onComplete?.();
      }
    } else {
      completedRef.current = false;
    }
  }, [state.formed.size, target, onComplete]);

  const canBeTens = (d: number) => d !== 0;
  const canBeUnits = (d: number) => state.tens !== null && d !== state.tens;

  function addNumber() {
    if (state.tens === null || state.units === null) {
      setState((s) => ({ ...s, message: "先选好十位和个位哦。" }));
      return;
    }
    if (state.tens === 0) {
      setState((s) => ({
        ...s,
        message: "十位不能是 0，这样就不是两位数了。",
      }));
      return;
    }
    const num = state.tens * 10 + state.units;
    if (state.formed.has(num)) {
      setState((s) => ({
        ...s,
        message: `${num} 已经写过了，换个组合吧。`,
      }));
      return;
    }
    setState((s) => ({
      ...s,
      formed: new Set([...s.formed, num]),
      message: null,
      units: null,
    }));
  }

  const sorted = useMemo(
    () => Array.from(state.formed).sort((a, b) => a - b),
    [state.formed],
  );

  return (
    <div className="flex w-full flex-col items-center gap-4 rounded-xl border border-border bg-surface/80 p-5">
      <p className="text-center text-sm text-ink-muted">
        用 {uniqueDigits.join("、")} 组成没有重复数字的两位数
      </p>

      <div className="w-full max-w-md space-y-3">
        <div>
          <span className="mb-2 block text-sm text-ink-soft">
            选十位（不能是 0）
          </span>
          <div className="flex flex-wrap gap-2">
            {uniqueDigits.map((d) => (
              <button
                key={`t-${d}`}
                type="button"
                disabled={!canBeTens(d)}
                onClick={() =>
                  setState((s) => ({
                    ...s,
                    tens: d,
                    units: null,
                    message: null,
                  }))
                }
                className={`flex h-11 w-11 items-center justify-center rounded-lg border text-base font-medium transition ${
                  state.tens === d
                    ? "border-accent bg-accent text-white"
                    : canBeTens(d)
                      ? "border-border bg-surface text-ink hover:border-accent"
                      : "border-border bg-paper text-ink-faint"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="mb-2 block text-sm text-ink-soft">
            选个位（与十位不同）
          </span>
          <div className="flex flex-wrap gap-2">
            {uniqueDigits.map((d) => (
              <button
                key={`u-${d}`}
                type="button"
                disabled={!canBeUnits(d)}
                onClick={() =>
                  canBeUnits(d) &&
                  setState((s) => ({ ...s, units: d, message: null }))
                }
                className={`flex h-11 w-11 items-center justify-center rounded-lg border text-base font-medium transition ${
                  state.units === d
                    ? "border-accent bg-accent text-white"
                    : canBeUnits(d)
                      ? "border-border bg-surface text-ink hover:border-accent"
                      : "border-border bg-paper text-ink-faint"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={addNumber}
        disabled={state.tens === null || state.units === null}
        className="rounded-lg bg-accent px-5 py-2 text-sm font-medium text-white transition hover:bg-accent-hover disabled:opacity-40"
      >
        {state.tens !== null && state.units !== null
          ? `添加 ${state.tens}${state.units}`
          : "添加两位数"}
      </button>

      {state.message && (
        <p className="text-center text-sm text-wrong">{state.message}</p>
      )}

      <div className="w-full max-w-md">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-ink-muted">已写出</span>
          <span className="font-medium text-accent">
            {state.formed.size} / {target}
          </span>
        </div>
        <div className="flex min-h-[3rem] flex-wrap gap-2 rounded-lg border border-border bg-paper p-3">
          {sorted.length === 0 ? (
            <span className="text-sm text-ink-faint">还没有数字</span>
          ) : (
            sorted.map((n) => (
              <span
                key={n}
                className="rounded-md bg-accent/10 px-2 py-1 text-sm font-medium text-accent"
              >
                {n}
              </span>
            ))
          )}
        </div>
      </div>

      {state.formed.size >= target && (
        <p
          className="text-center text-sm font-medium text-success"
          role="status"
        >
          ✓ 找全了 {target} 个两位数！
        </p>
      )}
    </div>
  );
}

// ---------- Outfit ----------

type OutfitState = {
  cycle: number;
  selectedTop: string | null;
  selectedBottom: string | null;
  pairs: string[];
};

function OutfitMatching({
  tops,
  bottoms,
  cycle,
  onComplete,
}: {
  tops: string[];
  bottoms: string[];
  cycle: number;
  onComplete?: () => void;
}) {
  const target = tops.length * bottoms.length;

  const [state, setState] = useState<OutfitState>({
    cycle,
    selectedTop: null,
    selectedBottom: null,
    pairs: [],
  });

  if (state.cycle !== cycle) {
    setState({
      cycle,
      selectedTop: null,
      selectedBottom: null,
      pairs: [],
    });
  }

  const completedRef = useRef(false);
  useEffect(() => {
    if (state.pairs.length >= target) {
      if (!completedRef.current) {
        completedRef.current = true;
        onComplete?.();
      }
    } else {
      completedRef.current = false;
    }
  }, [state.pairs.length, target, onComplete]);

  function addPair() {
    if (!state.selectedTop || !state.selectedBottom) return;
    const key = `${state.selectedTop} + ${state.selectedBottom}`;
    if (state.pairs.includes(key)) return;
    setState((s) => ({ ...s, pairs: [...s.pairs, key] }));
  }

  return (
    <div className="flex w-full flex-col items-center gap-4 rounded-xl border border-border bg-surface/80 p-5">
      <p className="text-center text-sm text-ink-muted">
        每次上装和下装各选 1 件
      </p>

      <div className="w-full max-w-md space-y-4">
        <div>
          <span className="mb-2 block text-sm text-ink-soft">上装</span>
          <div className="flex flex-wrap gap-2">
            {tops.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() =>
                  setState((s) => ({ ...s, selectedTop: t }))
                }
                className={`rounded-lg border px-4 py-2 text-sm transition ${
                  state.selectedTop === t
                    ? "border-accent bg-accent text-white"
                    : "border-border bg-paper text-ink hover:border-accent"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="mb-2 block text-sm text-ink-soft">下装</span>
          <div className="flex flex-wrap gap-2">
            {bottoms.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() =>
                  setState((s) => ({ ...s, selectedBottom: b }))
                }
                className={`rounded-lg border px-4 py-2 text-sm transition ${
                  state.selectedBottom === b
                    ? "border-accent bg-accent text-white"
                    : "border-border bg-paper text-ink hover:border-accent"
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={addPair}
        disabled={!state.selectedTop || !state.selectedBottom}
        className="rounded-lg bg-accent px-5 py-2 text-sm font-medium text-white transition hover:bg-accent-hover disabled:opacity-40"
      >
        {state.selectedTop && state.selectedBottom
          ? `记录搭配：${state.selectedTop} + ${state.selectedBottom}`
          : "选择一件上装和一件下装"}
      </button>

      <div className="w-full max-w-md">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-ink-muted">已记录</span>
          <span className="font-medium text-accent">
            {state.pairs.length} / {target}
          </span>
        </div>
        <div className="flex min-h-[3rem] flex-wrap gap-2 rounded-lg border border-border bg-paper p-3">
          {state.pairs.length === 0 ? (
            <span className="text-sm text-ink-faint">还没有搭配</span>
          ) : (
            state.pairs.map((pair, idx) => (
              <span
                key={`${pair}-${idx}`}
                className="rounded-md bg-accent/10 px-2 py-1 text-sm font-medium text-accent"
              >
                {pair}
              </span>
            ))
          )}
        </div>
      </div>

      {state.pairs.length >= target && (
        <p
          className="text-center text-sm font-medium text-success"
          role="status"
        >
          ✓ 一共有 {tops.length} × {bottoms.length} = {target} 种搭配！
        </p>
      )}
    </div>
  );
}

// ---------- Handshake / tournament ----------

type HandshakeState = {
  cycle: number;
  first: string | null;
  pairs: [string, string][];
};

function HandshakeMatching({
  items,
  cycle,
  onComplete,
}: {
  items: string[];
  cycle: number;
  onComplete?: () => void;
}) {
  const target = (items.length * (items.length - 1)) / 2;

  const [state, setState] = useState<HandshakeState>({
    cycle,
    first: null,
    pairs: [],
  });

  if (state.cycle !== cycle) {
    setState({ cycle, first: null, pairs: [] });
  }

  const completedRef = useRef(false);
  useEffect(() => {
    if (state.pairs.length >= target) {
      if (!completedRef.current) {
        completedRef.current = true;
        onComplete?.();
      }
    } else {
      completedRef.current = false;
    }
  }, [state.pairs.length, target, onComplete]);

  function handleItemClick(name: string) {
    if (state.first === null) {
      setState((s) => ({ ...s, first: name }));
      return;
    }
    if (state.first === name) {
      setState((s) => ({ ...s, first: null }));
      return;
    }
    const newPair: [string, string] =
      state.first < name ? [state.first, name] : [name, state.first];
    const exists = state.pairs.some(
      ([a, b]) => a === newPair[0] && b === newPair[1],
    );
    setState((s) => ({
      ...s,
      first: null,
      pairs: exists ? s.pairs : [...s.pairs, newPair],
    }));
  }

  return (
    <div className="flex w-full flex-col items-center gap-4 rounded-xl border border-border bg-surface/80 p-5">
      <p className="text-center text-sm text-ink-muted">
        每 2 个班踢一场，把所有不同的两队连起来
      </p>

      <div className="flex w-full max-w-md flex-wrap justify-center gap-3">
        {items.map((item) => {
          const isSelected = state.first === item;
          return (
            <button
              key={item}
              type="button"
              onClick={() => handleItemClick(item)}
              className={`flex h-14 w-14 items-center justify-center rounded-full border text-sm font-medium transition ${
                isSelected
                  ? "border-accent bg-accent text-white"
                  : "border-border bg-paper text-ink hover:border-accent"
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>

      <p className="text-center text-xs text-ink-muted">
        {state.first === null
          ? "先点击第一个班"
          : `再点击另一个班，与 ${state.first} 组成一场比赛`}
      </p>

      <div className="w-full max-w-md">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-ink-muted">已安排</span>
          <span className="font-medium text-accent">
            {state.pairs.length} / {target}
          </span>
        </div>
        <div className="flex min-h-[3rem] flex-wrap gap-2 rounded-lg border border-border bg-paper p-3">
          {state.pairs.length === 0 ? (
            <span className="text-sm text-ink-faint">还没有比赛</span>
          ) : (
            state.pairs.map(([a, b], idx) => (
              <span
                key={`${a}-${b}-${idx}`}
                className="rounded-md bg-accent/10 px-2 py-1 text-sm font-medium text-accent"
              >
                {a} — {b}
              </span>
            ))
          )}
        </div>
      </div>

      {state.pairs.length >= target && (
        <p
          className="text-center text-sm font-medium text-success"
          role="status"
        >
          ✓ 一共要踢 {target} 场！
        </p>
      )}
    </div>
  );
}

// ---------- Summary ----------

function SummaryPanel({ onComplete }: { onComplete?: () => void }) {
  return (
    <div className="flex w-full flex-col items-center gap-5 rounded-xl border border-border bg-surface/80 p-6">
      <h3 className="text-lg font-medium text-ink">搭配小妙招</h3>
      <ul className="w-full max-w-md space-y-3 text-sm text-ink-soft">
        <li className="flex gap-3">
          <span className="text-accent">1.</span>
          <span>先固定一个，再依次搭配另一个，按顺序就不会漏。</span>
        </li>
        <li className="flex gap-3">
          <span className="text-accent">2.</span>
          <span>两类事物搭配，可以用乘法算总数。</span>
        </li>
        <li className="flex gap-3">
          <span className="text-accent">3.</span>
          <span>每两人/两队只算一次时，要除掉重复。</span>
        </li>
      </ul>
      <button
        type="button"
        onClick={onComplete}
        className="rounded-lg bg-accent px-5 py-2 text-sm font-medium text-white transition hover:bg-accent-hover"
      >
        我学会了
      </button>
    </div>
  );
}
