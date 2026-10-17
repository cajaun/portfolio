import type { CurveVariant } from "./curve-types";

export const POWER_LAW_CURVES: CurveVariant[] = [
  {
    id: "normal-distribution",
    name: "Normal distribution",
    showFill: true,
    values: [
      7, 7, 8, 8, 9, 10, 12, 14, 16, 19, 23, 27, 32, 37, 43, 49, 56,
      63, 69, 75, 81, 86, 90, 92, 94, 94, 92, 90, 86, 81, 75, 69, 63,
      56, 49, 43, 37, 32, 27, 23, 19, 16, 14, 12, 10, 9, 8, 8, 7, 7,
    ],
    annotations: [
      { id: "cluster", label: "Most results cluster", at: 0.2 },
      { id: "extremes", label: "Few extreme results", at: 0.78 },
    ],
  },
  {
    id: "power-law",
    name: "Power law",
    showFill: true,
    values: [
      97, 94, 91, 88, 85, 83, 80, 78, 75, 73, 71, 68, 66, 64, 62, 60, 59,
      57, 55, 53, 52, 50, 49, 47, 46, 44, 43, 42, 40, 39, 38, 37, 36, 35,
      34, 33, 32, 31, 30, 29, 28, 27, 27, 26, 25, 24, 24, 23, 22, 22,
    ],
    annotations: [
      { id: "few-lead", label: "A few results lead", at: 0.08 },
      { id: "small-returns", label: "Many small returns", at: 0.58 },
    ],
  },
];
