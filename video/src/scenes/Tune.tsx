import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { C, Cursor, Key, lerp, mono, tween } from "../design";
import { AppWindow, Stage, InputDock } from "../stage";

export const Tune: React.FC = () => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const fine = t > 1.8;
  const x = lerp(t, [0.3, 1.6, 1.8, 3.4], [320, 1400, 1400, 1480]);
  return (
    <Stage title={fine ? "Precise." : "Fast."}>
      <AppWindow title="Motion" />
      <div
        style={{
          position: "absolute",
          left: 330,
          top: 315,
          fontSize: 150,
          fontWeight: 650,
          letterSpacing: -8,
          color: C.cyan,
          opacity: tween(t, 0, 0.4),
        }}
      >
        {fine ? "¼×" : "3×"}
      </div>
      <div
        style={{
          position: "absolute",
          left: 320,
          top: 565,
          width: 1160,
          height: 2,
          background: "#29496c",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 1440,
          top: 525,
          width: 80,
          height: 80,
          border: `2px solid ${t > 3.35 ? C.cyan : "#4f7caf"}`,
          borderRadius: "50%",
          boxShadow: t > 3.35 ? "0 0 80px #8de8ff44" : undefined,
        }}
      />
      {Array.from({ length: 7 }, (_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 320 + i * 180,
            top: 551,
            width: 1,
            height: 30,
            background: "#3b638c",
          }}
        />
      ))}
      <Cursor
        x={x}
        y={550}
        light
        size={60}
        pressed={
          t > 0.3 && t < 1.7 ? ["F", "→"] : fine && t < 3.5 ? ["D", "→"] : []
        }
      />
      <div
        style={{
          position: "absolute",
          left: 320,
          top: 700,
          display: "flex",
          gap: 96,
          fontFamily: mono,
          color: C.muted,
          fontSize: 19,
        }}
      >
        {["SPEED", "ACCELERATION", "DECELERATION"].map((s, i) => (
          <div key={s}>
            <div>{s}</div>
            <div
              style={{
                marginTop: 20,
                width: i ? 260 : 200,
                height: 3,
                background: "#2b3a52",
              }}
            >
              <div
                style={{
                  height: 3,
                  width: i === 1 ? "70%" : i === 2 ? "35%" : "55%",
                  background: "#8de8ff88",
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <InputDock>
        <Key active={t > 0.3 && t < 1.7}>F</Key>
        <Key active={fine && t < 3.5}>D</Key>
        <Key active={(t > 0.3 && t < 1.7) || (fine && t < 3.5)}>→</Key>
      </InputDock>
    </Stage>
  );
};
