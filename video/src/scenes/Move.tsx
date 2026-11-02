import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { C, Cursor, lerp, mono, tween } from "../design";
import { Stage } from "../stage";
import { Keyboard, MouseButton } from "../Keyboard";

export const Move: React.FC = () => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  // Stable overview: pointer movement and three clicks, then time to read.
  const cursorX = lerp(
    t,
    [0, 1.2, 1.55, 2.7, 3.05],
    [1370, 1370, 1250, 1250, 1370],
  );
  const cursorY = lerp(t, [0, 1.7, 2.05, 2.2, 2.55], [480, 480, 570, 570, 480]);
  const pressed =
    t > 1.2 && t < 1.55
      ? ["←"]
      : t > 1.7 && t < 2.05
        ? ["↓"]
        : t > 2.2 && t < 2.55
          ? ["↑"]
          : t > 2.7 && t < 3.05
            ? ["→"]
            : t > 3.35 && t < 3.7
              ? ["Space"]
              : t > 3.9 && t < 4.25
                ? ["E"]
                : t > 4.45 && t < 4.8
                  ? ["R"]
                  : [];
  const equivalents: Record<string, string[]> = {
    "←": ["←", "H"],
    "↓": ["↓", "J"],
    "↑": ["↑", "K"],
    "→": ["→", "L"],
    Space: ["Space", "W"],
  };
  const active = pressed.flatMap((key) => equivalents[key] ?? [key]);
  return (
    <Stage title="Mapped.">
      <div
        style={{
          position: "absolute",
          left: 450,
          top: 209,
          display: "flex",
          gap: 14,
          opacity: tween(t, 0.15, 0.65),
        }}
      >
        {["LEFT", "MIDDLE", "RIGHT"].map((label, i) => (
          <div
            key={label}
            style={{ width: 96, textAlign: "center", color: C.muted }}
          >
            <MouseButton button={i} size={41} />
            <div style={{ fontFamily: mono, fontSize: 17, marginTop: 10 }}>
              {label}
            </div>
          </div>
        ))}
      </div>
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
          perspective: 2200,
          opacity: tween(t, 0, 0.4),
        }}
      >
        <Keyboard
          t={t}
          active={active}
          style={{
            transform: `rotateX(${tween(t, 0, 1, 38, 17)}deg) rotateY(${tween(t, 0, 1, -10, -2)}deg) rotateZ(-3deg) translateY(${tween(t, 0, 0.8, 120, 0)}px)`,
            transformOrigin: "center top",
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: tween(t, 0.75, 1.1),
          pointerEvents: "none",
        }}
      >
        <Cursor
          x={cursorX}
          y={cursorY}
          size={43}
          light
          pressed={pressed}
          press={
            (t > 3.35 && t < 3.5) ||
            (t > 3.9 && t < 4.05) ||
            (t > 4.45 && t < 4.6)
          }
        />
      </div>
    </Stage>
  );
};
