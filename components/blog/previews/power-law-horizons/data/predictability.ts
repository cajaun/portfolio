import type { CurveVariant } from "./curve-types";

export const PREDICTABILITY_CURVES: CurveVariant[] = [
  {
    id: "short-horizon",
    name: "Short horizon",
    values: [
      28, 29, 27, 31, 30, 32, 29, 34, 31, 33, 36, 34, 37, 35, 38, 34, 37,
      36, 39, 37, 40, 38, 41, 39, 38, 36, 34, 31, 28, 25, 24, 26, 27, 25,
      24, 26, 25, 24, 23, 24, 22, 23, 21, 22, 20, 21, 19, 20, 18, 19,
    ],
    annotations: [
      { id: "early-noise", label: "Early noise", at: 0.08 },
      { id: "quit-here", label: "People quit here", at: 0.48 },
      { id: "before-return", label: "Before the return", at: 0.76 },
    ],
  },
  {
    id: "long-horizon",
    name: "Long horizon",
    values: [
      16, 17, 18, 17, 20, 22, 21, 24, 28, 27, 31, 34, 38, 36, 41, 45, 42,
      47, 52, 49, 54, 58, 55, 61, 66, 62, 68, 73, 67, 43, 37, 45, 49, 46,
      53, 50, 56, 62, 59, 66, 70, 68, 75, 79, 77, 83, 86, 90, 88, 94,
    ],
    annotations: [
      { id: "early-noise", label: "Early noise", at: 0.08 },
      { id: "stay-through-dip", label: "Stay through the dip", at: 0.58 },
      { id: "return-arrives", label: "The return arrives", at: 0.78 },
    ],
  },
];
