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
  showFill?: boolean;
};
