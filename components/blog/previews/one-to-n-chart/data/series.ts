export type StartupCurvePhase = {
  id: string;
  label: string;
  shortLabel: string;
  at: number;
  left: number;
  top: number;
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
    label: "Before\nStart-up",
    shortLabel: "Before start-up",
    at: 0.06,
    left: 8,
    top: 42,
  },
  {
    id: "initial-enthusiasm",
    label: "Initial\nEnthusiasm",
    shortLabel: "Initial enthusiasm",
    at: 0.22,
    left: 27,
    top: 22,
  },
  {
    id: "reality-sets-in",
    label: "Reality\nsets in",
    shortLabel: "Reality sets in",
    at: 0.34,
    left: 43,
    top: 40,
  },
  {
    id: "experimenting",
    label: "Experimenting\n& Pivoting",
    shortLabel: "Experimenting & pivoting",
    at: 0.46,
    left: 35,
    top: 82,
  },
  {
    id: "starts-working",
    label: "Starts\nWorking",
    shortLabel: "Starts working",
    at: 0.62,
    left: 56,
    top: 82,
  },
  {
    id: "product-market-fit",
    label: "Product/\nMarket Fit",
    shortLabel: "Product / market fit",
    at: 0.73,
    left: 73,
    top: 61,
  },
  {
    id: "scale",
    label: "Scale",
    shortLabel: "Scale",
    at: 0.88,
    left: 89,
    top: 22,
  },
];
