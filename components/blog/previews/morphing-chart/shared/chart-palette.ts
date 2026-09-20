import type { ChartPaletteKey } from "./chart-model";

export type ChartPalette = {
  line: string;
  future: string;
  darkLine: string;
  darkFuture: string;
  fadeFutureWithOpacity?: boolean;
};

export const DEFAULT_CHART_PALETTE: ChartPalette = {
  line: "#111318",
  future: "#F5F5F5",
  darkLine: "#FFFFFF",
  darkFuture: "#454545",
  fadeFutureWithOpacity: false,
};

export const CHART_PALETTES: Record<ChartPaletteKey, ChartPalette> = {
  success: {
    line: "hsl(140, 100%, 27%)",
    future: "rgb(179 217 191)",
    darkLine: "hsl(140, 100%, 27%)",
    darkFuture: "rgb(6 44 19)",
    fadeFutureWithOpacity: true,
  },
  info: {
    line: "hsl(210, 92%, 45%)",
    future: "rgb(181 211 240)",
    darkLine: "hsl(210, 92%, 45%)",
    darkFuture: "rgb(8 38 67)",
    fadeFutureWithOpacity: true,
  },
  warning: {
    line: "hsl(31, 92%, 45%)",
    future: "rgb(240 212 181)",
    darkLine: "hsl(31, 92%, 45%)",
    darkFuture: "rgb(67 39 8)",
    fadeFutureWithOpacity: true,
  },
  error: {
    line: "hsl(360, 100%, 45%)",
    future: "rgb(243 179 179)",
    darkLine: "hsl(360, 100%, 45%)",
    darkFuture: "rgb(70 6 6)",
    fadeFutureWithOpacity: true,
  },
};
