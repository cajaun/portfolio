import { run, type RowSpec } from "../shared/shelf-model";

export const SHELF_W = 70;

// two shelves with a little of everything: spines, a face-out book and a stack
export const anatomySpec: RowSpec[] = [
  [{ stack: ["b0", "b1"] }, { space: 4 }, ...run(2, 3), { space: 6 }, ...run(5, 2)],
  [...run(9, 3), { space: 5 }, { face: "b13" }, { space: 5 }, ...run(14, 2)],
];

export const gapsSpec: RowSpec[] = [
  [...run(20, 4), { space: 3 }, { stack: ["b29", "b30"] }, { space: 3 }, ...run(26, 3)],
];

// groups with room between them, and room at the end so the naive shift never runs past the shelf
export const pushSpec: RowSpec[] = [
  [...run(32, 2), { space: 6 }, ...run(34, 3), { space: 6 }, ...run(37, 3)],
];

export const anchorSpec: RowSpec[] = [
  [{ space: 6 }, ...run(45, 3), { space: 8 }, "b48", { space: 8 }, ...run(49, 3)],
];

export const turnSpec: RowSpec[] = [
  [{ space: 5 }, ...run(52, 3), { space: 8 }, "b56", { space: 8 }, ...run(57, 3)],
];

// a two-book stack and a flat book of its own, so the flat book can go beside the stack or onto it
export const stackSpec: RowSpec[] = [
  [{ space: 3 }, "b44", { space: 3 }, { stack: ["b47", "b48"] }, { space: 6 }, { stack: ["b51"] }],
];

// one shelf with a wide gap, so a book can be carried from one end to the other
export const springsSpec: RowSpec[] = [[{ space: 2 }, ...run(22, 4), { space: 26 }, ...run(26, 3)]];
