import { interpolate } from "remotion";
const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};
// Inputs keep their original speed; the completed results get extra reading time.
export const clickTime = (s: number) =>
  interpolate(
    s,
    [0, 1.7, 2.7, 5.5, 6.5, 10.5, 11.5, 21, 22, 26],
    [0, 1.7, 1.7, 4.5, 4.5, 8.5, 8.5, 18, 18, 22],
    clamp,
  );
export const scrollTime = (s: number) =>
  interpolate(s, [0, 2.5, 3.5, 6.3, 7.3, 8], [0, 2.5, 2.5, 5.3, 5.3, 6], clamp);
export const dragTime = (s: number) =>
  interpolate(
    s,
    [0, 1.15, 2.15, 5.4, 6.4, 8, 12],
    [0, 1.15, 1.15, 4.4, 4.4, 6, 10],
    clamp,
  );
