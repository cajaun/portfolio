import type { RangeType } from "../data/chart-data";
import { CHART_DATA_BY_SOURCE } from "../data/chart-data";

export { CHART_DATA_BY_SOURCE } from "../data/chart-data";
export type { RangeType } from "../data/chart-data";

export const RANGES: RangeType[] = ["1H", "1D", "1W", "1M", "1Y"];

export type ChartPaletteKey = "success" | "info" | "warning" | "error";

type PaletteProfile = {
  kind: ChartPaletteKey;
  texture: number;
  phase: number;
};

const PALETTE_PROFILES: PaletteProfile[] = [
  { kind: "success", texture: 0.12, phase: 0.2 },
  { kind: "info", texture: 0.1, phase: 1.4 },
  { kind: "warning", texture: 0.18, phase: 2.6 },
  { kind: "error", texture: 0.14, phase: 3.8 },
];

function clampChartValue(value: number) {
  return Math.max(4, Math.min(96, Number(value.toFixed(2))));
}

function gaussian(progress: number, center: number, width: number) {
  return Math.exp(-Math.pow((progress - center) / width, 2));
}

function sigmoid(progress: number, center: number, steepness: number) {
  return 1 / (1 + Math.exp(-(progress - center) * steepness));
}

/**
 * Each range deliberately has a different silhouette. The shared sample
 * count is what lets Framer Motion morph one range into the next without
 * changing the path command structure.
 */
const RANGE_SILHOUETTES: Record<RangeType, (progress: number) => number> = {
  "1H": (progress) =>
    76 -
    58 * Math.min(progress / 0.72, 1) +
    7 * Math.sin(progress * 24) +
    5 * gaussian(progress, 0.18, 0.08),
  "1D": (progress) =>
    24 +
    12 * Math.sin(progress * 20) +
    12 * progress +
    34 * sigmoid(progress, 0.55, 30) -
    6 * gaussian(progress, 0.82, 0.1),
  "1W": (progress) =>
    19 +
    64 * progress +
    10 * Math.sin(progress * 15) -
    16 * gaussian(progress, 0.28, 0.09) +
    8 * gaussian(progress, 0.72, 0.08),
  "1M": (progress) =>
    70 -
    22 * progress -
    34 * gaussian(progress, 0.38, 0.11) +
    13 * Math.sin(progress * 23) +
    11 * gaussian(progress, 0.78, 0.1),
  "1Y": (progress) =>
    34 +
    20 * progress -
    27 * gaussian(progress, 0.25, 0.16) +
    44 * sigmoid(progress, 0.8, 28) +
    8 * Math.sin(progress * 10),
};

function buildPaletteSeries(
  profile: PaletteProfile,
  range: RangeType,
): number[] {
  const reference = CHART_DATA_BY_SOURCE.Revenue.chartDataSets[range];
  const silhouette = RANGE_SILHOUETTES[range];

  return reference.map((sourceValue, index) => {
    const progress = index / Math.max(1, reference.length - 1);
    const sourceTexture = (sourceValue - 50) * profile.texture;

    return clampChartValue(
      silhouette(progress) +
        sourceTexture +
        2.5 * Math.sin(progress * 16 + profile.phase),
    );
  });
}

export const CHART_DATA_BY_PALETTE: Record<
  ChartPaletteKey,
  Record<RangeType, number[]>
> = Object.fromEntries(
  PALETTE_PROFILES.map((profile) => [
    profile.kind,
    Object.fromEntries(
      RANGES.map((range) => [range, buildPaletteSeries(profile, range)]),
    ),
  ]),
) as Record<ChartPaletteKey, Record<RangeType, number[]>>;

export const VIEWBOX_WIDTH = 520;
export const CHART_HEIGHT = 280;
export const CHART_TOP = CHART_HEIGHT * 0.08;
export const CHART_BOTTOM = CHART_HEIGHT * 0.92;
export const CHART_RANGE = CHART_BOTTOM - CHART_TOP;

export const GRAPH_EXTENT: Record<RangeType, number> = {
  "1H": 1040 / 1170,
  "1D": 992 / 1170,
  "1W": 1,
  "1M": 1,
  "1Y": 1,
};

export type ChartPoint = {
  x: number;
  y: number;
  value: number;
};

function getPointY(value: number) {
  return CHART_BOTTOM - (value / 100) * CHART_RANGE;
}

export function buildChartPoints(
  values: number[],
  graphWidth: number,
): ChartPoint[] {
  return values.map((value, index) => ({
    x: (index / Math.max(1, values.length - 1)) * graphWidth,
    y: getPointY(value),
    value,
  }));
}

function number(value: number) {
  return Number(value.toFixed(2));
}

export function buildSmoothPath(values: number[], graphWidth: number) {
  const points = buildChartPoints(values, graphWidth);
  if (points.length === 0) return "";

  let path = `M ${number(points[0].x)} ${number(points[0].y)}`;

  for (let index = 1; index < points.length; index += 1) {
    const start = points[index - 1];
    const end = points[index];
    const previous = points[Math.max(0, index - 2)];
    const following = points[Math.min(points.length - 1, index + 1)];
    const stepX = end.x - start.x;
    const firstControlY = start.y + (end.y - previous.y) / 6;
    const secondControlY = end.y - (following.y - start.y) / 6;

    path += ` C ${number(start.x + stepX / 3)} ${number(firstControlY)} ${number(end.x - stepX / 3)} ${number(secondControlY)} ${number(end.x)} ${number(end.y)}`;
  }

  return path;
}

function cubicAt(
  start: number,
  controlOne: number,
  controlTwo: number,
  end: number,
  progress: number,
) {
  const inverse = 1 - progress;

  return (
    inverse ** 3 * start +
    3 * inverse ** 2 * progress * controlOne +
    3 * inverse * progress ** 2 * controlTwo +
    progress ** 3 * end
  );
}

export function getSmoothPoint(
  values: number[],
  graphWidth: number,
  x: number,
): ChartPoint | null {
  const points = buildChartPoints(values, graphWidth);
  if (points.length === 0) return null;
  if (points.length === 1 || graphWidth <= 0) return points[0];

  const clampedX = Math.max(0, Math.min(graphWidth, x));
  const segmentCount = points.length - 1;
  const segmentPosition = (clampedX / graphWidth) * segmentCount;
  const segmentIndex = Math.min(segmentCount - 1, Math.floor(segmentPosition));
  const left = points[segmentIndex];
  const right = points[segmentIndex + 1];
  const previous = points[Math.max(0, segmentIndex - 1)];
  const following = points[Math.min(points.length - 1, segmentIndex + 2)];
  const segmentWidth = right.x - left.x;
  const localProgress = segmentWidth
    ? Math.max(0, Math.min(1, (clampedX - left.x) / segmentWidth))
    : 0;

  return {
    x: clampedX,
    y: cubicAt(
      left.y,
      left.y + (right.y - previous.y) / 6,
      right.y - (following.y - left.y) / 6,
      right.y,
      localProgress,
    ),
    value: cubicAt(
      left.value,
      left.value + (right.value - previous.value) / 6,
      right.value - (following.value - left.value) / 6,
      right.value,
      localProgress,
    ),
  };
}

export function getRangeLabel(range: RangeType, progress: number) {
  const clamped = Math.max(0, Math.min(1, progress));

  if (range === "1H") {
    const totalMinutes = 185 + Math.round(clamped * 60);
    return `${String(Math.floor(totalMinutes / 60) % 24).padStart(2, "0")}:${String(totalMinutes % 60).padStart(2, "0")}`;
  }

  if (range === "1D") {
    const hour = Math.round(13 * clamped);
    return `${String(hour).padStart(2, "0")}:00`;
  }

  if (range === "1W") {
    return `${Math.max(1, Math.round(7 * clamped))} days ago`;
  }

  if (range === "1M") {
    return `Aug ${Math.max(1, Math.round(31 * clamped))}`;
  }

  return `${Math.max(1, Math.round(12 * clamped))} months ago`;
}
