"use client";

import {
  AnimatePresence,
  motion,
  useTransform,
} from "framer-motion";
import { useId, useLayoutEffect, useRef, useState } from "react";
import {
  CHART_HEIGHT,
  VIEWBOX_WIDTH,
  type ChartPoint,
} from "@/components/blog/previews/morphing-chart/shared/chart-model";
import { useChartCursor } from "@/components/blog/previews/morphing-chart/shared/hooks/use-chart-cursor";
import { useChartMorph } from "@/components/blog/previews/morphing-chart/shared/hooks/use-chart-morph";
import { useChartTheme } from "@/components/blog/previews/morphing-chart/shared/hooks/use-chart-theme";
import { useFutureFade } from "@/components/blog/previews/morphing-chart/shared/hooks/use-future-fade";
import {
  STARTUP_CURVE_PHASES,
  STARTUP_CURVE_VALUES,
  type StartupCurvePhase,
} from "../data/series";

const CURSOR_LABEL_EDGE_GAP = 8;
const CURSOR_LABEL_TOP = 6;

function getPhaseIndex(progress: number) {
  return STARTUP_CURVE_PHASES.reduce(
    (currentIndex, phase, index) =>
      progress >= phase.at ? index : currentIndex,
    0,
  );
}

function getPhaseForCursor(cursor: ChartPoint | null): StartupCurvePhase {
  if (!cursor) {
    return STARTUP_CURVE_PHASES[STARTUP_CURVE_PHASES.length - 1];
  }

  return STARTUP_CURVE_PHASES[getPhaseIndex(cursor.x / VIEWBOX_WIDTH)];
}

export function StartupCurvePlot({
  cursor,
  onCursorChange,
  onCursorEnd,
}: {
  cursor: ChartPoint | null;
  onCursorChange: (point: ChartPoint) => void;
  onCursorEnd: () => void;
}) {
  const clipId = useId().replace(/:/g, "");
  const isDark = useChartTheme();
  const cursorLabelRef = useRef<HTMLDivElement>(null);
  const [cursorLabelLeft, setCursorLabelLeft] = useState(0);
  const [cursorGuideStart, setCursorGuideStart] = useState(28);
  const lineColor = isDark ? "#FFFFFF" : "#111318";
  const graphWidth = VIEWBOX_WIDTH;
  const {
    animatedPath,
    animatedGraphWidth,
    animatedLiveClipWidth,
    animatedEndpointY,
    endpointRadius,
  } = useChartMorph(STARTUP_CURVE_VALUES, graphWidth);
  const {
    svgRef,
    scrubbing,
    displayCursor,
    cursorActive,
    animatedCursorClipX,
    updateCursor,
    handlePointerDown,
    handlePointerUp,
  } = useChartCursor({
    cursor,
    values: STARTUP_CURVE_VALUES,
    graphWidth,
    animatedGraphWidth,
    onCursorChange,
    onCursorEnd,
  });
  const {
    futureFade,
    futureEndpointColor,
    futureMarkColor,
    futureStrokeColor,
    futureStrokeOpacity,
    outerBorderOpacity,
    guideOpacity,
  } = useFutureFade({
    cursorActive,
    lineColor,
    futureColor: lineColor,
    futureUsesOpacity: true,
  });
  const activePhase = getPhaseForCursor(displayCursor);
  const activePhaseIndex = displayCursor
    ? getPhaseIndex(displayCursor.x / VIEWBOX_WIDTH)
    : STARTUP_CURVE_PHASES.length - 1;
  const futurePathOpacity = useTransform(futureFade, [0, 1], [1, 0.28]);

  useLayoutEffect(() => {
    if (!displayCursor || !cursorLabelRef.current || !svgRef.current) return;

    const label = cursorLabelRef.current;
    const svg = svgRef.current;

    const measureLabel = () => {
      const chartBounds = svg.getBoundingClientRect();
      const labelWidth = label.offsetWidth;
      const cursorPixel =
        (displayCursor.x / VIEWBOX_WIDTH) * chartBounds.width;
      const minLabelLeft = Math.min(
        CURSOR_LABEL_EDGE_GAP,
        Math.max(0, chartBounds.width - labelWidth),
      );
      const maxLabelLeft = Math.max(
        minLabelLeft,
        chartBounds.width - labelWidth - CURSOR_LABEL_EDGE_GAP,
      );

      setCursorLabelLeft(
        Math.min(
          maxLabelLeft,
          Math.max(minLabelLeft, cursorPixel - labelWidth / 2),
        ),
      );
      setCursorGuideStart(
        ((label.offsetTop + label.offsetHeight) / chartBounds.height) *
          CHART_HEIGHT,
      );
    };

    measureLabel();
    const resizeObserver = new ResizeObserver(measureLabel);
    resizeObserver.observe(svg);

    return () => resizeObserver.disconnect();
  }, [activePhase.id, displayCursor, svgRef]);

  return (
    <div
      className="relative w-full select-none"
      style={{
        aspectRatio: `${VIEWBOX_WIDTH}/${CHART_HEIGHT}`,
        overscrollBehavior: "contain",
        touchAction: "none",
        userSelect: "none",
      }}
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${CHART_HEIGHT}`}
        className="absolute inset-0 h-full w-full select-none overflow-visible"
        role="img"
        aria-label="Interactive 1 to n progress curve"
        onDragStart={(event) => event.preventDefault()}
        style={{ touchAction: "none", userSelect: "none" }}
      >
        <defs>
          <clipPath id={`${clipId}-live`}>
            <motion.rect
              x="0"
              y="0"
              width={displayCursor ? animatedCursorClipX : animatedLiveClipWidth}
              height={CHART_HEIGHT}
            />
          </clipPath>
          <clipPath id={`${clipId}-future`}>
            <motion.rect
              x={displayCursor ? animatedCursorClipX : animatedGraphWidth}
              y="0"
              width={VIEWBOX_WIDTH}
              height={CHART_HEIGHT}
            />
          </clipPath>
          <marker
            id={`${clipId}-endpoint`}
            markerWidth="12"
            markerHeight="12"
            markerUnits="userSpaceOnUse"
            refX="6"
            refY="6"
            orient="auto"
          >
            <motion.circle cx="6" cy="6" r={endpointRadius} fill={lineColor} />
          </marker>
        </defs>

        <motion.path
          d={animatedPath}
          fill="none"
          stroke={lineColor}
          clipPath={`url(#${clipId}-live)`}
          markerEnd={`url(#${clipId}-endpoint)`}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3.5"
        />

        {displayCursor ? (
          <motion.path
            d={animatedPath}
            fill="none"
            stroke={futureStrokeColor}
            clipPath={`url(#${clipId}-future)`}
            style={{ opacity: futureStrokeOpacity }}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3.5"
          />
        ) : null}

        {displayCursor ? (
          <>
            <motion.circle
              cx={animatedGraphWidth}
              cy={animatedEndpointY}
              r={endpointRadius}
              fill={futureEndpointColor}
              style={{ opacity: futurePathOpacity }}
            />
            <motion.line
              x1={displayCursor.x}
              x2={displayCursor.x}
              y1={cursorGuideStart}
              y2={CHART_HEIGHT}
              stroke={futureMarkColor}
              strokeWidth="1.25"
              style={{ opacity: guideOpacity }}
            />
            <motion.circle
              cx={displayCursor.x}
              cy={displayCursor.y}
              fill="#FFFFFF"
              initial={{ r: 0, opacity: 0 }}
              animate={{ r: cursorActive ? 8 : 0 }}
              style={{ opacity: futureFade }}
              transition={{
                type: "spring",
                stiffness: 1500,
                damping: 80,
                mass: 1.2,
              }}
            />
            <motion.circle
              cx={displayCursor.x}
              cy={displayCursor.y}
              fill="none"
              stroke={futureMarkColor}
              initial={{ r: 0, strokeWidth: 0 }}
              animate={{
                r: cursorActive ? 8 : 0,
                strokeWidth: cursorActive ? 0.75 : 0,
              }}
              style={{ opacity: outerBorderOpacity }}
              transition={{
                type: "spring",
                stiffness: 1500,
                damping: 80,
                mass: 1.2,
              }}
            />
            <motion.circle
              cx={displayCursor.x}
              cy={displayCursor.y}
              fill={lineColor}
              stroke="#FFFFFF"
              initial={{ r: 0, strokeWidth: 0 }}
              animate={{
                r: cursorActive ? 6 : 0,
                strokeWidth: cursorActive ? 2 : 0,
              }}
              style={{ opacity: futureFade }}
              transition={{
                type: "spring",
                stiffness: 1500,
                damping: 80,
                mass: 1.2,
              }}
            />
          </>
        ) : null}

        <rect
          x="0"
          y="0"
          width={VIEWBOX_WIDTH}
          height={CHART_HEIGHT}
          fill="transparent"
          className="cursor-ew-resize select-none"
          style={{ touchAction: "none", userSelect: "none" }}
          onPointerDown={handlePointerDown}
          onPointerMove={(event) => {
            event.preventDefault();
            if (scrubbing) updateCursor(event);
          }}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        />
      </svg>

      {STARTUP_CURVE_PHASES.map((phase, index) => (
        <motion.div
          key={phase.id}
          className="pointer-events-none absolute -translate-x-1/2 text-center text-[10px] font-medium leading-[1.05] tracking-[-0.02em] text-preview-text-muted sm:text-[12px] dark:text-preview-dark-text-muted"
          style={{ left: `${phase.left}%`, top: `${phase.top}%` }}
          initial={false}
          animate={{
            opacity:
              displayCursor && index > activePhaseIndex
                ? 0.28
                : displayCursor && index === activePhaseIndex
                  ? 1
                  : 0.82,
            y: displayCursor && index === activePhaseIndex ? -2 : 0,
          }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <span className="whitespace-pre-line">{phase.label}</span>
          <span
            className="mx-auto mt-1 block h-3 w-px opacity-40"
            style={{ backgroundColor: lineColor }}
          />
        </motion.div>
      ))}

      <AnimatePresence initial={false}>
        {displayCursor ? (
          <motion.div
            key="startup-curve-phase-label"
            ref={cursorLabelRef}
            initial={{ opacity: 0, y: 4, scale: 0.96 }}
            animate={{ opacity: cursorActive ? 1 : 0, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="pointer-events-none absolute rounded-full px-2 py-1 text-[11px] font-medium leading-none whitespace-nowrap"
            style={{
              left: cursorLabelLeft,
              top: CURSOR_LABEL_TOP,
              color: isDark ? "#FFFFFF" : "#666666",
            }}
          >
            <span
              className="absolute inset-0 rounded-full"
              style={{
                backgroundColor: isDark ? "#2B2B2B" : "#F6F7F7",
              }}
            />
            <AnimatePresence initial={false} mode="wait">
              <motion.span
                key={activePhase.id}
                className="relative z-10 block"
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.12, ease: "easeOut" }}
              >
                {activePhase.shortLabel}
              </motion.span>
            </AnimatePresence>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
