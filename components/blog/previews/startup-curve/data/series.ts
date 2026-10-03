export type StartupCurvePhase = {
  id: string;
  shortLabel: string;
  at: number;
};

/**
 * A dense centerline for the familiar startup curve: a quiet beginning,
 * an early spike, the drop into experimentation, then a long climb into scale
 */
export const STARTUP_CURVE_VALUES = [
  49, 48, 47, 46, 46, 47, 48, 53, 64, 78, 91, 96, 94, 84, 67, 31, 28, 27,
  29, 26, 30, 27, 32, 29, 34, 31, 37, 35, 41, 44, 42, 47, 51, 53, 57, 61,
  64, 67, 69, 71, 75, 81, 88, 96,
];

export const STARTUP_CURVE_PHASES: StartupCurvePhase[] = [
  {
    id: "before-startup",
    shortLabel: "Before start-up",
    at: 0.08,
  },
  {
    id: "initial-enthusiasm",
    shortLabel: "Initial enthusiasm",
    at: 0.256,
  },
  {
    id: "reality-sets-in",
    shortLabel: "Reality sets in",
    at: 0.326,
  },
  {
    id: "trough-of-sorrow",
    shortLabel: "Trough of sorrow",
    at: 0.349,
  },
  {
    id: "experimenting",
    shortLabel: "Experimenting & pivoting",
    at: 0.465,
  },
  {
    id: "starts-working",
    shortLabel: "Starts working",
    at: 0.628,
  },
  {
    id: "product-market-fit",
    shortLabel: "Product / market fit",
    at: 0.744,
  },
  {
    id: "scale",
    shortLabel: "Scale",
    at: 0.86,
  },
];

export const STARTUP_CURVE_TROUGH_RANGE = {
  start: 0.348,
  end: 0.661,
} as const;

export const STARTUP_CURVE_TROUGH_CURSOR = 0.512;
