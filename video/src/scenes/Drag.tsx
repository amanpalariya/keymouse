import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { C, Cursor, Key, lerp, mono, tween } from "../design";
import { AppWindow, Stage, InputDock, Plus } from "../stage";

export const Drag: React.FC = () => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const dx = lerp(t, [1.25, 3.6], [0, 920]);
  const lifted = t > 0.85 && t < 3.9;
  const done = t >= 3.9;
  const lift = tween(t, 0.85, 1.15) * 35 * (1 - tween(t, 3.9, 4.15));
  return (
    <Stage title={done ? "Dropped." : "Drag."} light>
      <AppWindow title="Launch board" light />
      <svg
        width="1920"
        height="1080"
        style={{ position: "absolute", opacity: 0.5 }}
      >
        <path
          d="M490 520C820 260 1090 260 1410 520"
          stroke="#a9bbd2"
          strokeWidth="2"
          strokeDasharray="5 16"
          fill="none"
        />
      </svg>
      <div
        style={{
          position: "absolute",
          left: 280,
          top: 300,
          width: 430,
          height: 450,
          border: "2px solid #c9d4e3",
          borderRadius: 35,
          background: "#f6f9ff55",
          padding: 32,
        }}
      >
        <div style={{ fontSize: 30, fontWeight: 650, color: "#8091a8" }}>
          Ideas
        </div>
        <div
          style={{
            position: "absolute",
            left: 40,
            right: 40,
            top: 200,
            height: 180,
            border: "2px dashed #c9d4e3",
            borderRadius: 20,
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 1200,
          top: 300,
          width: 430,
          height: 450,
          border: done
            ? "2px solid #65bda3"
            : lifted
              ? "2px dashed #5e9cf5"
              : "2px solid #c9d4e3",
          borderRadius: 35,
          background: done ? "#dcf2e9" : lifted ? "#e3edff" : "#f6f9ff55",
          padding: 32,
          boxShadow: done ? "0 0 70px #89d4ba44" : undefined,
        }}
      >
        <div
          style={{
            fontSize: 30,
            fontWeight: 650,
            color: done ? "#329276" : "#8091a8",
          }}
        >
          Done {done ? "✓" : ""}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 320 + dx,
          top: 414 - lift,
          width: 350,
          height: 230,
          borderRadius: 24,
          background: done ? "#f4fffb" : "white",
          border: `1px solid ${done ? "#a5d6c7" : "#c4d5ed"}`,
          padding: 32,
          boxShadow: lifted
            ? "0 50px 65px #1b467638,0 15px 0 #d2def0"
            : "0 15px 30px #25476d12",
          transform: `perspective(1500px) rotateY(${lifted ? -9 : 0}deg) rotateZ(${lifted ? -5 : 0}deg) scale(${lifted ? 1.08 : 1})`,
          zIndex: 20,
        }}
      >
        <div style={{ fontFamily: mono, fontSize: 15, color: "#8aa0be" }}>
          KEYMOUSE
        </div>
        <div
          style={{
            fontSize: 38,
            fontWeight: 750,
            letterSpacing: -1.5,
            marginTop: 27,
          }}
        >
          Launch video
        </div>
        <div style={{ marginTop: 35, display: "flex", gap: 9 }}>
          {["#85b7f6", "#adc7ee", "#dbe5f4"].map((c) => (
            <span
              key={c}
              style={{ height: 9, width: 47, background: c, borderRadius: 10 }}
            />
          ))}
          <span
            style={{
              marginLeft: "auto",
              color: done ? "#46a58a" : C.blue,
              fontSize: 27,
            }}
          >
            {done ? "✓" : "↗"}
          </span>
        </div>
      </div>
      <Cursor
        x={lerp(t, [0, 0.7, 1.25, 3.6], [920, 520, 520, 1440])}
        y={lerp(
          t,
          [0, 0.7, 1.25, 2.5, 3.6, 3.95, 4.5],
          [750, 515, 515, 480, 515, 515, 670],
        )}
        pressed={
          t > 0.05 && t < 0.7
            ? ["←", "↑"]
            : t > 3.95 && t < 4.5
              ? ["↓"]
              : lifted
                ? t > 1.25 && t < 3.6
                  ? ["Space", "→"]
                  : ["Space"]
                : []
        }
        size={59}
        press={t > 0.85 && t < 1.02}
      />
      <InputDock light caption={done ? "Release" : undefined}>
        <Key light wide active={lifted}>
          Space
        </Key>
        <Plus />
        <Key light active={t > 1.25 && t < 3.6}>
          →
        </Key>
      </InputDock>
    </Stage>
  );
};
