import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Cursor, lerp, tween, inputFeedback } from "../design";
import { Stage } from "../stage";
import { Keyboard } from "../Keyboard";
import { MouseVisual } from "../MouseVisual";

export const Move: React.FC = () => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  // Stable overview: pointer movement and three clicks, then time to read.
  const cursorX = lerp(
    t,
    [0, 1.2, 1.55, 2.7, 3.05, 3.6],
    [1370, 1370, 1250, 1250, 1370, 560],
  );
  const cursorY = lerp(
    t,
    [0, 1.7, 2.05, 2.2, 2.55, 3.6],
    [480, 480, 570, 570, 480, 514],
  );
  const pressed =
    t > 1.2 && t < 1.55
      ? ["←"]
      : t > 1.7 && t < 2.05
        ? ["↓"]
        : t > 2.2 && t < 2.55
          ? ["↑"]
          : t > 2.7 && t < 3.05
            ? ["→"]
            : t > 3.7 && t < 4.45
              ? ["W"]
              : t > 4.65 && t < 5.4
                ? ["E"]
                : t > 5.6 && t < 6.35
                  ? ["R"]
                  : [];
  const equivalents: Record<string, string[]> = {
    "←": ["←", "H"],
    "↓": ["↓", "J"],
    "↑": ["↑", "K"],
    "→": ["→", "L"],
    Space: ["Space", "W"],
    W: ["W", "Space"],
  };
  const active = pressed.flatMap((key) => equivalents[key] ?? [key]);
  const feedback = inputFeedback(t, [
    { start: 1.2, end: 1.55, keys: ["←"] },
    { start: 1.7, end: 2.05, keys: ["↓"] },
    { start: 2.2, end: 2.55, keys: ["↑"] },
    { start: 2.7, end: 3.05, keys: ["→"] },
    { start: 3.7, end: 4.45, keys: ["W"] },
    { start: 4.65, end: 5.4, keys: ["E"] },
    { start: 5.6, end: 6.35, keys: ["R"] },
  ]);
  const mouseX = lerp(t, [1.2, 1.55, 2.7, 3.05], [0, -55, -55, 0]);
  const mouseY = lerp(t, [1.7, 2.05, 2.2, 2.55], [0, 28, 28, 0]);
  return (
    <Stage demo>
      <div
        style={{
          position: "absolute",
          left: 1020,
          top: 227,
          display: "flex",
          gap: 26,
          opacity: tween(t, 0.25, 0.7),
        }}
      >
        {["←", "↓", "↑", "→"].map((arrow) => (
          <div
            key={arrow}
            style={{
              width: 76,
              textAlign: "center",
              color: "#93afd8",
              fontSize: 53,
              lineHeight: 1,
            }}
          >
            {arrow}
          </div>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: 190,
          top: 339,
          width: 1540,
          zIndex: 2,
          perspective: 2200,
          opacity: tween(t, 0, 0.4),
        }}
      >
        <div
          style={{
            transform: `rotateX(${tween(t, 0, 1, 38, 17)}deg) rotateY(${tween(t, 0, 1, -10, -2)}deg) rotateZ(-3deg) translateY(${tween(t, 0, 0.8, 120, 0)}px)`,
            transformOrigin: "center top",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 280 + mouseX,
              top: -199 + mouseY,
              scale: 1.15,
              transformOrigin: "top center",
              zIndex: 0,
            }}
          >
            <MouseVisual
              left={pressed.includes("W")}
              middle={pressed.includes("E")}
              right={pressed.includes("R")}
            />
          </div>
          <Keyboard t={t} active={active} style={{ zIndex: 2 }} />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: tween(t, 0.75, 1.1),
          zIndex: 5,
          pointerEvents: "none",
        }}
      >
        <Cursor
          x={cursorX}
          y={cursorY}
          size={43}
          light
          pressed={feedback.keys}
          hintOpacity={feedback.opacity}
          press={
            (t > 3.7 && t < 3.88) ||
            (t > 4.65 && t < 4.83) ||
            (t > 5.6 && t < 5.78)
          }
        />
      </div>
    </Stage>
  );
};
