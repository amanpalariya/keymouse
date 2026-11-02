import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Cursor, Key, lerp, tween } from "../design";
import { BrowserFrame } from "../BrowserFrame";
import { Stage, InputDock, Surface } from "../stage";

export const Scroll: React.FC = () => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const sy = lerp(t, [0, 0.8, 2.5, 2.9, 3.9], [0, 0, -430, -430, -220]);
  const sx = lerp(t, [0, 4.2, 5.2], [0, 0, -450]);
  return (
    <Stage demo>
      <BrowserFrame active="assets" assetsProgress={1} />
      <Surface
        style={{ left: 218, top: 410, width: 1484, height: 880 }}
        tilt={0}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "none",
            background: "#0c1627",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 32 + sx,
              top: 32 + sy,
              display: "grid",
              gridTemplateColumns: "repeat(4, 410px)",
              gap: 24,
            }}
          >
            {Array.from({ length: 12 }, (_, i) => {
              const palette = ["#213f64", "#214b50", "#514132", "#433953"];
              return (
                <div
                  key={i}
                  style={{
                    width: 410,
                    height: 340,
                    background: palette[i % 4],
                    borderRadius: 15,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      width: 235,
                      height: 235,
                      border: "42px solid #9acaff66",
                      borderRadius: i % 3 === 0 ? "50%" : 45,
                      rotate: `${i * 23 - 22}deg`,
                      left: 90,
                      top: 55,
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      width: 150,
                      height: 150,
                      background: "#b9d9ff12",
                      borderRadius: "50%",
                      left: -20,
                      top: 230,
                    }}
                  />
                </div>
              );
            })}
          </div>
          <div
            style={{
              position: "absolute",
              inset: 0,
              boxShadow: "inset 0 0 0 2px #8ab2e522",
              borderRadius: 12,
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: 9,
              top: 40 - sy * 0.55,
              width: 5,
              height: 125,
              borderRadius: 5,
              background: "#9bbbd288",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 36 - sx * 0.8,
              bottom: 9,
              width: 400,
              height: 5,
              borderRadius: 5,
              background: "#9bbbd288",
            }}
          />
        </div>
        <Cursor
          x={1040}
          y={280}
          light
          size={55}
          pressed={
            t > 0.8 && t < 2.5
              ? ["⇧", "↓"]
              : t > 2.9 && t < 3.9
                ? ["⇧", "↑"]
                : t > 4.2 && t < 5.3
                  ? ["⇧", "→"]
                  : []
          }
        />
      </Surface>
      <div
        style={{
          position: "absolute",
          right: 108,
          top: 440,
          fontSize: 83,
          color: "#3677ff",
          opacity: tween(t, 0.8, 1.2),
        }}
      >
        {t > 4.2 ? "↔" : "↕"}
      </div>
      <InputDock>
        <Key wide active={t > 0.8 && t < 5.3}>
          ⇧ Shift
        </Key>
        <Key active={t > 0.8 && t < 2.5}>↓</Key>
        <Key active={t > 2.9 && t < 3.9}>↑</Key>
        <Key active={t > 4.2 && t < 5.3}>→</Key>
      </InputDock>
    </Stage>
  );
};
