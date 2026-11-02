import { interpolate } from "remotion";
const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};
// Inputs keep their original speed; the completed results get extra reading time.
export const scrollTime = (s: number) =>
  interpolate(s, [0, 2.5, 3.5, 6.3, 7.3, 8], [0, 2.5, 2.5, 5.3, 5.3, 6], clamp);
export const dragTime = (s: number) =>
  interpolate(
    s,
    [0, 0.65, 0.9, 2.65, 3, 3.25, 3.4, 3.65, 5.3, 5.6, 7],
    [0, 0.85, 1.25, 3.6, 3.9, 4.4, 6.5, 6.9, 8.6, 8.9, 10],
    clamp,
  );
export const clickTime = (s: number) =>
  interpolate(
    s,
    [
      0, 3, 3.4, 4.6, 5.1, 6.2, 7.2, 8.8, 9.2, 10.5, 11, 12.4, 13, 14.1, 15.4,
      18,
    ],
    [
      0, 3.4, 5, 6.4, 7.7, 8.5, 10.5, 12.5, 13.7, 15.5, 18.8, 20, 21.5, 22.2,
      24, 26,
    ],
    clamp,
  );
export const keyboardTime = (s: number) =>
  interpolate(s, [0, 5.6, 7.5], [0, 7, 10.625], clamp);
