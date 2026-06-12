"use client";

type StepperInputProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  unit?: string;
  onChange: (value: number) => void;
};

export function StepperInput({
  label,
  value,
  min,
  max,
  unit,
  onChange,
}: StepperInputProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm text-ink-muted">{label}</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label={`减少${label}`}
            disabled={value <= min}
            onClick={() => onChange(Math.max(min, value - 1))}
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-surface text-lg font-medium text-ink transition hover:border-accent disabled:opacity-40"
          >
            −
          </button>
          <span className="min-w-[4rem] text-center text-lg font-medium tabular-nums text-ink">
            {value}
            {unit && (
              <span className="ml-0.5 text-sm font-normal text-ink-muted">
                {unit}
              </span>
            )}
          </span>
          <button
            type="button"
            aria-label={`增加${label}`}
            disabled={value >= max}
            onClick={() => onChange(Math.min(max, value + 1))}
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-surface text-lg font-medium text-ink transition hover:border-accent disabled:opacity-40"
          >
            +
          </button>
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-3 w-full accent-accent"
        aria-label={label}
      />
    </div>
  );
}
