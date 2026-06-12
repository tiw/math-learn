"use client";

import { useCallback, useEffect, useState } from "react";
import type { ScrollyStep } from "@/lib/lesson-types";
import {
  isClickInteractiveStep,
  isScrollFillStep,
  stepRequiresCompletion,
} from "@/lib/step-completion";
import { FigureFrame } from "@/components/FigureFrame";
import { MobileFigure, ScrollyStepBlock } from "@/components/ScrollyLayout";
import { WidgetRenderer } from "@/components/widgets/registry";

type ScrollyStepItemProps = {
  step: ScrollyStep;
  index: number;
  total: number;
  isActive: boolean;
  isComplete: boolean;
  setStepRef: (index: number, node: HTMLElement | null) => void;
  setScrollTrackRef?: (index: number, node: HTMLElement | null) => void;
  onStepComplete: (stepId: string) => void;
};

export function ScrollyStepItem({
  step,
  index,
  total,
  isActive,
  isComplete,
  setStepRef,
  setScrollTrackRef,
  onStepComplete,
}: ScrollyStepItemProps) {
  const [scrollTrackNode, setScrollTrackNode] = useState<HTMLElement | null>(
    null,
  );
  const scrollFill = isScrollFillStep(step);

  const handleComplete = useCallback(() => {
    onStepComplete(step.id);
  }, [onStepComplete, step.id]);

  useEffect(() => {
    if (!isActive || stepRequiresCompletion(step)) return;
    const timer = window.setTimeout(() => handleComplete(), 800);
    return () => window.clearTimeout(timer);
  }, [isActive, step, handleComplete]);

  const handleRef = useCallback(
    (el: HTMLElement | null) => {
      setStepRef(index, el);
    },
    [index, setStepRef],
  );

  const handleScrollTrackRef = useCallback(
    (el: HTMLElement | null) => {
      setScrollTrackNode(el);
      setScrollTrackRef?.(index, el);
    },
    [index, setScrollTrackRef],
  );

  const clickInteractive = isClickInteractiveStep(step);

  const figureBlock = (
    <FigureFrame caption={step.caption} cycle={index + 1}>
      <WidgetRenderer
        config={step.widget}
        cycle={index + 1}
        stepKey={step.id}
        scrollTrackNode={scrollFill ? scrollTrackNode : undefined}
        onComplete={stepRequiresCompletion(step) ? handleComplete : undefined}
      />
    </FigureFrame>
  );

  return (
    <ScrollyStepBlock
      index={index}
      total={total}
      title={step.title}
      narration={step.narration}
      setRef={handleRef}
      setScrollTrackRef={scrollFill ? handleScrollTrackRef : undefined}
      tall={step.tall}
      scrollFill={scrollFill}
      isComplete={isComplete}
      needsAction={stepRequiresCompletion(step) && !isComplete && isActive}
      inlineFigure={
        clickInteractive ? (
          <div className="my-6">{figureBlock}</div>
        ) : undefined
      }
      mobileFigure={
        scrollFill ? (
          <div className="sticky top-[4.5rem] z-10 my-6 lg:hidden">
            {figureBlock}
          </div>
        ) : !clickInteractive ? (
          <MobileFigure>{figureBlock}</MobileFigure>
        ) : undefined
      }
    />
  );
}

export { isScrollFillStep };
