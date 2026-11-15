import { run, type RowSpec } from "../shared/shelf-model";

export const SHELF_W = 90;

// two shelves with a little of everything: spines, a face-out book and a stack
export const anatomySpec: RowSpec[] = [
  [{ stack: ["b0", "b1"] }, { space: 6 }, ...run(2, 5), { space: 8 }, ...run(7, 2)],
  [...run(9, 4), { space: 7 }, { face: "b13" }, { space: 7 }, ...run(14, 4)],
];

export const gapsSpec: RowSpec[] = [
  [...run(20, 6), { space: 3 }, { stack: ["b29", "b30"] }, { space: 3 }, ...run(26, 3)],
];

// groups with room between them, and room at the end so the naive shift never runs past the shelf
export const pushSpec: RowSpec[] = [
  [...run(32, 3), { space: 7 }, ...run(35, 3), { space: 8 }, ...run(38, 4)],
];

export const anchorSpec: RowSpec[] = [
  [{ space: 12 }, ...run(45, 3), { space: 10 }, "b48", { space: 10 }, ...run(49, 3)],
];

export const turnSpec: RowSpec[] = [
  [{ space: 8 }, ...run(52, 4), { space: 9 }, "b56", { space: 9 }, ...run(57, 4)],
];

// a two-book stack and a flat book of its own, so the flat book can go beside the stack or onto it
export const stackSpec: RowSpec[] = [
  [{ space: 2 }, ...run(44, 2), { space: 4 }, { stack: ["b47", "b48"] }, { space: 12 }, { stack: ["b51"] }],
];

// one shelf with a wide gap, so a book can be carried from one end to the other
export const springsSpec: RowSpec[] = [[{ space: 3 }, ...run(22, 4), { space: 42 }, ...run(26, 3)]];
