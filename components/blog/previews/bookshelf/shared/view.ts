import { CASE, caseHeight } from "./shelf-model";

// cm of stage around the case, the case runs to the edges so the shelf is as wide as the footer
export const PAD = { x: 0.2, top: 3, bottom: 2 };

// the stage around the case in cm, kept free of three.js so the page can reserve the space before the engine loads
export function viewSize(shelves: number, W: number) {
  return {
    w: W + CASE.side * 2 + PAD.x * 2,
    h: caseHeight(shelves) + CASE.board * 2 + PAD.top + PAD.bottom,
  };
}
