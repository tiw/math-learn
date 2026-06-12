"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useScrolly(
  stepCount: number,
  lessonId: string,
  maxActiveIndex?: number,
  promoteFromIndex?: number,
) {
  const [activeIndex, setActiveIndex] = useState(0);
  const stepRefs = useRef<(HTMLElement | null)[]>([]);
  const [refsVersion, setRefsVersion] = useState(0);

  const setStepRef = useCallback((index: number, node: HTMLElement | null) => {
    if (stepRefs.current[index] === node) return;
    stepRefs.current[index] = node;
    setRefsVersion((v) => v + 1);
  }, []);

  useEffect(() => {
    setActiveIndex(0);
    stepRefs.current = [];
    setRefsVersion(0);
  }, [lessonId]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;

        let bestIndex = -1;
        for (const entry of visible) {
          const index = stepRefs.current.findIndex(
            (node) => node === entry.target,
          );
          if (index > bestIndex) bestIndex = index;
        }
        if (bestIndex >= 0) {
          const capped =
            maxActiveIndex !== undefined
              ? Math.min(bestIndex, maxActiveIndex)
              : bestIndex;
          setActiveIndex(capped);
        }
      },
      {
        root: null,
        rootMargin: "-10% 0px -50% 0px",
        threshold: [0, 0.15, 0.35, 0.55, 0.75, 1],
      },
    );

    for (let i = 0; i < stepCount; i += 1) {
      const node = stepRefs.current[i];
      if (node) observer.observe(node);
    }

    return () => observer.disconnect();
  }, [stepCount, refsVersion, lessonId, maxActiveIndex]);

  // scroll-fill 长步骤：只要进入视口就至少激活该步（右侧 sticky 才能显示铺格动画）
  useEffect(() => {
    if (promoteFromIndex === undefined) return;
    const node = stepRefs.current[promoteFromIndex];
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        setActiveIndex((prev) => {
          const next = Math.max(prev, promoteFromIndex);
          return maxActiveIndex !== undefined
            ? Math.min(next, maxActiveIndex)
            : next;
        });
      },
      { threshold: 0, rootMargin: "0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [promoteFromIndex, maxActiveIndex, refsVersion, lessonId]);

  const scrollToStep = useCallback((index: number) => {
    stepRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    setActiveIndex(
      maxActiveIndex !== undefined ? Math.min(index, maxActiveIndex) : index,
    );
  }, [maxActiveIndex]);

  return { activeIndex, setStepRef, scrollToStep };
}
