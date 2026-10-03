export type CurveAnnotation = {
  id: string;
  label: string;
  at: number;
};

export type CurveVariant = {
  id: string;
  name: string;
  values: number[];
  annotations: CurveAnnotation[];
};

export const VARSE_HORIZON_CURVES: CurveVariant[] = [
  {
    id: "close-view",
    name: "Close view",
    values: [
      44, 49, 41, 52, 46, 55, 43, 58, 48, 51, 39, 54, 45, 50, 36, 47, 42,
      56, 44, 59, 47, 52, 40, 57, 45, 61, 49, 54, 43, 58, 46, 63, 50, 55,
      45, 60, 48, 57, 44, 62, 51, 56, 47, 64, 52, 58, 49, 66, 54, 60, 51,
    ],
    annotations: [
      { id: "initial-hypothesis", label: "Initial hypothesis", at: 0.08 },
      { id: "small-sample", label: "Small sample", at: 0.27 },
      { id: "conflicting-signals", label: "Conflicting signals", at: 0.49 },
      { id: "iteration", label: "Iteration", at: 0.7 },
      { id: "no-verdict", label: "No verdict yet", at: 0.92 },
    ],
  },
  {
    id: "long-view",
    name: "Long view",
    values: [
      20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 26, 26, 27, 28, 28, 30,
      30, 31, 32, 32, 35, 35, 36, 37, 37, 40, 40, 41, 42, 42, 46, 46, 47,
      48, 49, 54, 54, 55, 56, 57, 63, 63, 64, 66, 68, 75, 79, 85, 91, 96,
    ],
    annotations: [
      { id: "initial-hypothesis", label: "Initial hypothesis", at: 0.08 },
      { id: "accumulated-evidence", label: "Accumulated evidence", at: 0.3 },
      { id: "first-repeat", label: "First repeat", at: 0.52 },
      { id: "pattern-emerges", label: "Pattern emerges", at: 0.72 },
      { id: "compounding-behavior", label: "Compounding behavior", at: 0.9 },
    ],
  },
];
