import { it, expect } from "@jest/globals";
import { mergeIntervals } from "./56.MergeIntervals";

it.each([
  {
    interval: [
      [1, 3],
      [2, 6],
      [8, 10],
      [15, 18],
    ],
    merged: [
      [1, 6],
      [8, 10],
      [15, 18],
    ],
  },
  {
    interval: [
      [2, 3],
      [4, 5],
      [6, 7],
      [8, 9],
      [1, 10],
    ],
    merged: [[1, 10]],
  },
  {
    interval: [
      [1, 4],
      [2, 3],
    ],
    merged: [[1, 4]],
  },
  {
    interval: [
      [1, 4],
      [4, 5],
    ],
    merged: [[1, 5]],
  },
])("Intervals", ({ interval, merged }) => {
  const resp = mergeIntervals(interval);
  expect(merged).toEqual(resp);
});
