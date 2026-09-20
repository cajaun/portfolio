import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import {
  CHART_HEIGHT,
  getRangeLabel,
  GRAPH_EXTENT,
  type ChartPoint,
  type RangeType,
  VIEWBOX_WIDTH,
} from "../chart-model";
import {
  DEFAULT_CHART_PALETTE,
  type ChartPalette,
} from "../chart-palette";
import { useChartCursor } from "../hooks/use-chart-cursor";
import { useChartMorph } from "../hooks/use-chart-morph";
import { useChartTheme } from "../hooks/use-chart-theme";
import { useFutureFade } from "../hooks/use-future-fade";

const CURSOR_LABEL_EDGE_GAP = 8;
const CURSOR_LABEL_TOP = 6;

export function ChartPlot({
  values,
  range,
  cursor,
  onCursorChange,
  onCursorEnd,
  showFill,
  palette = DEFAULT_CHART_PALETTE,
}: {
  values: number[];
  range: RangeType;
  cursor: ChartPoint | null;
  onCursorChange: (point: ChartPoint) => void;
  onCursorEnd: () => void;
  showFill: boolean;
  palette?: ChartPalette;
}) {
  const clipId = useId().replace(/:/g, "");
  const isDark = useChartTheme();
  const cursorLabelRef = useRef<HTMLDivElement>(null);
  const [cursorLabelLeft, setCursorLabelLeft] = useState(0);
  const [cursorGuideStart, setCursorGuideStart] = useState(26);
  const graphWidth = VIEWBOX_WIDTH * GRAPH_EXTENT[range];
  const {
    animatedPath,
    animatedFillPath,
    animatedGraphWidth,
    animatedLiveClipWidth,
    animatedEndpointY,
    endpointRadius,
  } = useChartMorph(values, graphWidth);
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
    values,
    graphWidth,
    animatedGraphWidth,
    onCursorChange,
    onCursorEnd,
  });

  const lineColor = isDark ? palette.darkLine : palette.line;
  const futureColor = isDark ? palette.darkFuture : palette.future;
  const futureUsesOpacity = palette.fadeFutureWithOpacity === true;
  const {
    futureFade,
    futureEndpointColor,
    futureFillOpacity,
    futureMarkColor,
    futureStrokeColor,
    futureStrokeOpacity,
    outerBorderOpacity,
    guideOpacity,
  } = useFutureFade({
    cursorActive,
    lineColor,
    futureColor,
    futureUsesOpacity,
  });
  const fillOpacity = useMotionValue(showFill ? 1 : 0);
  const futureFillOpacityWithToggle = useTransform(
    [fillOpacity, futureFillOpacity],
    ([fill, future]) => Number(fill) * Number(future),
  );

  useEffect(() => {
    const fillAnimation = animate(fillOpacity, showFill ? 1 : 0, {
      duration: 0.25,
      ease: showFill ? "easeIn" : "easeOut",
    });

    return () => fillAnimation.stop();
  }, [fillOpacity, showFill]);

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
      const nextLabelLeft = Math.min(
        maxLabelLeft,
        Math.max(minLabelLeft, cursorPixel - labelWidth / 2),
      );
      const nextGuideStart =
        ((label.offsetTop + label.offsetHeight) / chartBounds.height) *
        CHART_HEIGHT;

      setCursorLabelLeft((current) =>
        Math.abs(current - nextLabelLeft) < 0.1 ? current : nextLabelLeft,
      );
      setCursorGuideStart((current) =>
        Math.abs(current - nextGuideStart) < 0.1 ? current : nextGuideStart,
      );
    };

    measureLabel();
    const resizeObserver = new ResizeObserver(measureLabel);
    resizeObserver.observe(svg);

    return () => resizeObserver.disconnect();
  }, [displayCursor, range, svgRef]);

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
        aria-label={`${range} chart with an interactive cursor`}
        onDragStart={(event) => event.preventDefault()}
        style={{
          overscrollBehavior: "contain",
          touchAction: "none",
          userSelect: "none",
        }}
      >
        <defs>
          <linearGradient id={`${clipId}-fill`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor={lineColor} stopOpacity="0.14" />
            <stop offset="1" stopColor={lineColor} stopOpacity="0" />
          </linearGradient>
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
            id={`${clipId}-live-endpoint`}
            markerWidth="12"
            markerHeight="12"
            markerUnits="userSpaceOnUse"
            refX="6"
            refY="6"
            orient="auto"
          >
            <motion.circle
              cx="6"
              cy="6"
              r={endpointRadius}
              fill={lineColor}
            />
          </marker>
        </defs>

        <motion.path
          d={animatedFillPath}
          fill={`url(#${clipId}-fill)`}
          clipPath={`url(#${clipId}-live)`}
          style={{ opacity: fillOpacity }}
        />

        <motion.path
          d={animatedPath}
          fill="none"
          stroke={lineColor}
          clipPath={`url(#${clipId}-live)`}
          markerEnd={`url(#${clipId}-live-endpoint)`}
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
            <motion.path
              d={animatedFillPath}
              fill={`url(#${clipId}-fill)`}
              clipPath={`url(#${clipId}-future)`}
              style={{ opacity: futureFillOpacityWithToggle }}
            />
            <motion.circle
              cx={animatedGraphWidth}
              cy={animatedEndpointY}
              r={endpointRadius}
              fill={futureEndpointColor}
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
          width={graphWidth}
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

      <AnimatePresence initial={false}>
        {displayCursor ? (
          <motion.div
            key="cursor-label"
            initial={{ opacity: 0, y: 4, scale: 0.96 }}
            animate={{
              opacity: cursorActive ? 1 : 0,
              y: 0,
              scale: 1,
            }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            ref={cursorLabelRef}
            className="pointer-events-none absolute rounded-full px-2 py-1 text-[12px] font-medium leading-none whitespace-nowrap"
            style={{
              left: cursorLabelLeft,
              top: CURSOR_LABEL_TOP,
              color: isDark
                ? `color-mix(in srgb, ${futureMarkColor} 32%, white)`
                : "#999999",
            }}
          >
            <motion.span
              aria-hidden="true"
              className="absolute inset-0 rounded-full"
              style={{
                backgroundColor: isDark ? futureMarkColor : "#F6F7F7",
                opacity: isDark ? guideOpacity : 1,
              }}
            />
            <span className="relative z-10">
              {getRangeLabel(range, displayCursor.x / graphWidth)}
            </span>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
