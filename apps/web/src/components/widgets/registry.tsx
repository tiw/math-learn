import type { WidgetConfig } from "@/lib/lesson-types";
import { AreaGrid } from "@/components/widgets/AreaGrid";
import { AreaUnits } from "@/components/widgets/AreaUnits";
import { CutMaxSquare } from "@/components/widgets/CutMaxSquare";
import { SquareArea } from "@/components/widgets/SquareArea";
import { PositionMapWidget } from "@/components/widgets/PositionMapWidget";
import { DivisionGroupWidget } from "@/components/widgets/DivisionGroupWidget";
import { CompoundTableWidget } from "@/components/widgets/CompoundTableWidget";
import { MultiplicationAreaWidget } from "@/components/widgets/MultiplicationAreaWidget";
import { CalendarWidget } from "@/components/widgets/CalendarWidget";
import { DecimalsWidget } from "@/components/widgets/DecimalsWidget";
import { MatchingWidget } from "@/components/widgets/MatchingWidget";

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
    case "position-map":
      return (
        <PositionMapWidget
          config={config.props}
          cycle={cycle}
          onComplete={onComplete}
        />
      );
    case "division-group":
      return (
        <DivisionGroupWidget
          config={config.props}
          cycle={cycle}
          stepKey={stepKey}
          onComplete={onComplete}
        />
      );
    case "compound-table":
      return (
        <CompoundTableWidget
          config={config.props}
          cycle={cycle}
          onComplete={onComplete}
        />
      );
    case "multiplication-area":
      return (
        <MultiplicationAreaWidget
          config={config.props}
          cycle={cycle}
          onComplete={onComplete}
        />
      );
    case "calendar":
      return (
        <CalendarWidget
          config={config.props}
          cycle={cycle}
          onComplete={onComplete}
        />
      );
    case "decimals":
      return (
        <DecimalsWidget
          config={config.props}
          cycle={cycle}
          onComplete={onComplete}
        />
      );
    case "matching":
      return (
        <MatchingWidget
          config={config.props}
          cycle={cycle}
          onComplete={onComplete}
        />
      );
    default:
      return null;
  }
}
