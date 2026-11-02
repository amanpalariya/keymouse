import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { BrowserFrame } from "../BrowserFrame";
import { Cursor, Key, lerp, tween } from "../design";
import { InputDock, Stage } from "../stage";

// A pointer-only use case: cross the asset preview, then find its small play control.
export const Precision: React.FC = () => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const fast = t > 0.4 && t < 1.6,
    slow = t > 1.9 && t < 3.5;
  const x = lerp(t, [0.4, 1.6, 1.9, 3.5], [400, 1390, 1390, 1500]);
  return (
    <Stage demo>
      <BrowserFrame active="assets" assetsProgress={1} />
      <div
        style={{
          position: "absolute",
          left: 310,
          top: 430,
          width: 1240,
          height: 510,
          borderRadius: 22,
          background: "linear-gradient(135deg,#142e49,#223b56)",
          border: "1px solid #577da24d",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "27px 30px",
            fontSize: 25,
            fontWeight: 650,
            color: "#b3cce7",
          }}
        >
          Launch animation
        </div>
        <div
          style={{
            position: "absolute",
            width: 300,
            height: 300,
            border: "58px solid #8ab5d74d",
            borderRadius: 68,
            rotate: "-18deg",
            left: 440,
            top: 120,
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 230,
            height: 230,
            border: "42px solid #8ca9c52b",
            borderRadius: "50%",
            left: 690,
            top: 250,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 40,
            right: 40,
            bottom: 30,
            height: 3,
            borderRadius: 4,
            background: "#708aa03a",
          }}
        >
          <div style={{ width: "28%", height: 3, background: "#8de8ff66" }} />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 1470,
          top: 500,
          width: 60,
          height: 60,
          borderRadius: "50%",
          border: `1px solid ${t > 3.35 ? "#a4edff" : "#85aac977"}`,
          background: t > 3.35 ? "#4597c966" : "#17314b",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: t > 3.35 ? "0 0 30px #8de8ff2b" : undefined,
        }}
      >
        <svg width="19" height="22" viewBox="0 0 19 22">
          <path d="M2 1L18 11L2 21Z" fill="#b0d8f0" />
        </svg>
      </div>
      {t > 3.35 ? (
        <div
          style={{
            position: "absolute",
            left: 1454,
            top: 572,
            padding: "7px 12px",
            borderRadius: 7,
            background: "#0b182b",
            color: "#b4cee5",
            fontSize: 17,
            opacity: tween(t, 3.35, 3.55),
          }}
        >
          Preview
        </div>
      ) : null}
      <Cursor
        x={x}
        y={530}
        light
        size={49}
        pressed={fast ? ["F"] : slow ? ["D"] : []}
      />
      <InputDock>
        <Key active={fast}>F</Key>
        <Key active={slow}>D</Key>
      </InputDock>
    </Stage>
  );
};
