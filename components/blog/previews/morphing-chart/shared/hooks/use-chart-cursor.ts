import { useTransform, type MotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import {
  getSmoothPoint,
  VIEWBOX_WIDTH,
  type ChartPoint,
} from "../chart-model";

function getPointerX(
  event: ReactPointerEvent<SVGRectElement>,
  svg: SVGSVGElement | null,
) {
  if (!svg) return 0;

  const rect = svg.getBoundingClientRect();
  const relativeX = Math.max(0, Math.min(rect.width, event.clientX - rect.left));

  return (relativeX / Math.max(1, rect.width)) * VIEWBOX_WIDTH;
}

export function useChartCursor({
  cursor,
  values,
  graphWidth,
  animatedGraphWidth,
  onCursorChange,
  onCursorEnd,
}: {
  cursor: ChartPoint | null;
  values: number[];
  graphWidth: number;
  animatedGraphWidth: MotionValue<number>;
  onCursorChange: (point: ChartPoint) => void;
  onCursorEnd: () => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [scrubbing, setScrubbing] = useState(false);
  const [displayCursor, setDisplayCursor] = useState<ChartPoint | null>(cursor);
  const [cursorActive, setCursorActive] = useState(Boolean(cursor));
  const lastCursorRef = useRef<ChartPoint | null>(cursor);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animatedCursorClipX = useTransform(animatedGraphWidth, (width) => {
    const cursorX = displayCursor?.x ?? width;

    return Math.max(0, Math.min(width, cursorX));
  });

  useEffect(() => {
    if (exitTimerRef.current) {
      clearTimeout(exitTimerRef.current);
      exitTimerRef.current = null;
    }

    if (cursor) {
      lastCursorRef.current = cursor;
      setDisplayCursor(cursor);
      setCursorActive(true);
      return;
    }

    if (lastCursorRef.current) {
      setCursorActive(false);
      exitTimerRef.current = setTimeout(() => {
        lastCursorRef.current = null;
        setDisplayCursor(null);
      }, 250);
    }
  }, [cursor]);

  useEffect(() => {
    return () => {
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!scrubbing) return;

    const preventPageScroll = (event: TouchEvent) => {
      event.preventDefault();
    };

    document.addEventListener("touchmove", preventPageScroll, {
      passive: false,
    });

    return () => {
      document.removeEventListener("touchmove", preventPageScroll);
    };
  }, [scrubbing]);

  const updateCursor = (event: ReactPointerEvent<SVGRectElement>) => {
    const point = getSmoothPoint(
      values,
      graphWidth,
      getPointerX(event, svgRef.current),
    );

    if (point) onCursorChange(point);
  };

  const handlePointerDown = (event: ReactPointerEvent<SVGRectElement>) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    setScrubbing(true);
    updateCursor(event);
  };

  const handlePointerUp = (event: ReactPointerEvent<SVGRectElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    setScrubbing(false);
    onCursorEnd();
  };

  return {
    svgRef,
    scrubbing,
    displayCursor,
    cursorActive,
    animatedCursorClipX,
    updateCursor,
    handlePointerDown,
    handlePointerUp,
  };
}
