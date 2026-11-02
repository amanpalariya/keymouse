import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { BrowserFrame } from "../BrowserFrame";
import { Cursor, Key, lerp, tween } from "../design";
import { InputDock, Stage } from "../stage";

// Two everyday targets, with a result hold after each accurate approach.
export const Precision: React.FC = () => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const fast = (t > 0.6 && t < 1.8) || (t > 5.1 && t < 6.3);
  const slow = (t > 2.2 && t < 3.8) || (t > 6.7 && t < 8.3);
  const direction = t < 5.1 ? "→" : "←";
  const x = lerp(
    t,
    [0.6, 1.8, 2.2, 3.8, 5.1, 6.3, 6.7, 8.3],
    [400, 1390, 1390, 1500, 1500, 654, 654, 560],
  );
  const preview = t >= 3.65 && t < 5.1,
    details = t >= 8.15;
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
          border: `1px solid ${preview ? "#a4edff" : "#85aac977"}`,
          background: preview ? "#4597c966" : "#17314b",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: preview ? "0 0 30px #8de8ff2b" : undefined,
        }}
      >
        <svg width="19" height="22" viewBox="0 0 19 22">
          <path d="M2 1L18 11L2 21Z" fill="#b0d8f0" />
        </svg>
      </div>
      <div
        style={{
          position: "absolute",
          left: 530,
          top: 500,
          width: 60,
          height: 60,
          borderRadius: "50%",
          border: `1px solid ${details ? "#a4edff" : "#85aac977"}`,
          background: details ? "#4597c966" : "#17314b",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 31,
          fontWeight: 650,
          color: "#b0d8f0",
          fontFamily: "serif",
        }}
      >
        i
      </div>
      {t >= 3.65 && t < 5.3 ? (
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
            opacity: tween(t, 3.65, 3.9) * (1 - tween(t, 5.1, 5.3)),
            translate: `0 ${tween(t, 3.65, 3.9, 5, 0)}px`,
          }}
        >
          Preview
        </div>
      ) : null}
      {t >= 8.15 ? (
        <div
          style={{
            position: "absolute",
            left: 531,
            top: 572,
            padding: "7px 12px",
            borderRadius: 7,
            background: "#0b182b",
            color: "#b4cee5",
            fontSize: 17,
            opacity: tween(t, 8.15, 8.4),
            translate: `0 ${tween(t, 8.15, 8.4, 5, 0)}px`,
          }}
        >
          Details
        </div>
      ) : null}
      <Cursor
        x={x}
        y={530}
        light
        size={49}
        pressed={fast ? ["F", direction] : slow ? ["D", direction] : []}
      />
      <InputDock>
        <Key active={fast}>F</Key>
        <Key active={slow}>D</Key>
        <Key active={fast || slow}>{direction}</Key>
      </InputDock>
    </Stage>
  );
};
