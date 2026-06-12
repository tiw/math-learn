import type { WidgetConfig } from "@/lib/lesson-types";
import { AreaGrid } from "@/components/widgets/AreaGrid";
import { AreaUnits } from "@/components/widgets/AreaUnits";
import { CutMaxSquare } from "@/components/widgets/CutMaxSquare";
import { SquareArea } from "@/components/widgets/SquareArea";

import { useStepScrollProgress } from "@/hooks/useStepScrollProgress";

export type WidgetRenderProps = {
  config: WidgetConfig;
  cycle: number;
  stepKey?: string;
  scrollTrackNode?: HTMLElement | null;
  onComplete?: () => void;
};

export function WidgetRenderer({
  config,
  cycle,
  stepKey,
  scrollTrackNode,
  onComplete,
}: WidgetRenderProps) {
  switch (config.kind) {
    case "area-grid":
      return (
        <AreaGrid
          config={config.props}
          cycle={cycle}
          stepKey={stepKey}
          scrollTrackNode={scrollTrackNode}
          onComplete={onComplete}
        />
      );
    case "area-units":
      return (
        <AreaUnits
          config={config.props}
          cycle={cycle}
          onComplete={onComplete}
        />
      );
    case "square-area":
      return (
        <SquareArea
          config={config.props}
          cycle={cycle}
          onComplete={onComplete}
        />
      );
    case "cut-max-square":
      return (
        <CutMaxSquare
          config={config.props}
          cycle={cycle}
          onComplete={onComplete}
        />
      );
    default:
      return null;
  }
}
