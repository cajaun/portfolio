import type { CurveVariant } from "./curve-types";

const sharedAnnotations = [
  { id: "same-start", label: "Same initial conditions", at: 0.04 },
  { id: "small-error", label: "A small difference enters", at: 0.14 },
  { id: "separate", label: "Forecasts separate", at: 0.34 },
];

export const LORENZ_CURVES: CurveVariant[] = [
  {
    id: "first-run",
    name: "First run",
    values: [
      54, 48, 57, 49, 53, 45, 55, 47, 52, 44, 50, 42, 54, 40, 48, 38, 50,
      36, 47, 34, 44, 32, 42, 30, 40, 28, 38, 27, 35, 25, 32, 24, 30, 22,
      27, 21, 25, 19, 23, 18, 21, 17, 19, 16, 18, 15, 17, 14, 16, 13,
    ],
    annotations: sharedAnnotations,
  },
  {
    id: "second-run",
    name: "Second run",
    values: [
      54, 49, 58, 46, 60, 42, 57, 39, 62, 44, 58, 35, 66, 40, 70, 33, 74,
      45, 78, 38, 82, 52, 76, 44, 88, 56, 83, 48, 92, 61, 86, 53, 95, 68,
      89, 58, 97, 72, 91, 64, 96, 78, 92, 69, 98, 84, 94, 77, 99, 89,
    ],
    annotations: sharedAnnotations,
  },
];
