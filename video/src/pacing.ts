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
    [0, 1.4, 1.65, 3.4, 3.75, 4, 4.15, 4.4, 6.05, 6.35, 7],
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

export const photoTime = (s: number) =>
  interpolate(
    s,
    [
      0, 1.4, 3, 3.35, 4.35, 4.6, 5.7, 6, 6.6, 7.8, 8.1, 9.1, 9.4, 10.9, 11.3,
      11.7, 12.6, 12.9, 14.5, 14.8, 16.3, 16.7, 18,
    ],
    [
      0, 0.8, 2.5, 3.9, 4.9, 5.2, 6.3, 8, 8.6, 9.8, 10.1, 11.1, 11.5, 13, 13.55,
      14.6, 15.5, 15.8, 17.36, 17.7, 19.2, 19.75, 22,
    ],
    clamp,
  );
