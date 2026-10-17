import type { CurveVariant } from "./curve-types";

export const FAIL_FAST_CURVES: CurveVariant[] = [
  {
    id: "fail-fast",
    name: "Fail fast",
    values: [
      16, 17, 18, 20, 24, 31, 40, 52, 65, 76, 84, 88, 86, 80, 72, 63, 54,
      46, 40, 35, 31, 28, 26, 25, 24, 23, 23, 22, 22, 22, 21, 21, 22, 22,
      23, 23, 24, 24, 24, 25, 25, 25, 26, 26, 26, 27, 27, 27, 28, 28,
    ],
    annotations: [
      { id: "prototype", label: "Prototype", at: 0.08 },
      { id: "fail-cheaply", label: "Fail cheaply", at: 0.3 },
      { id: "lower-cost", label: "Lower cost later", at: 0.62 },
    ],
  },
  {
    id: "late-failure",
    name: "Late failure",
    values: [
      10, 10, 11, 11, 12, 13, 14, 15, 17, 19, 22, 25, 29, 34, 40, 48, 57,
      66, 74, 80, 84, 87, 88, 87, 86, 85, 84, 83, 82, 81, 80, 79, 78, 77,
      76, 75, 74, 73, 72, 71, 70, 69, 68, 67, 66, 65, 64, 63, 62, 61,
    ],
    annotations: [
      { id: "skip-test", label: "Skip the test", at: 0.08 },
      { id: "failure-expensive", label: "Failure gets expensive", at: 0.4 },
      { id: "late-discovery", label: "Late discovery", at: 0.72 },
    ],
  },
];
