import React from "react";
import {
  CanvasImage,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Backdrop, Key, tween, C } from "../design";

export const Closing: React.FC = () => {
  const { fps } = useVideoConfig();
  const t = useCurrentFrame() / fps;
  return (
    <Backdrop>
      {[
        { k: "H", x: 220, y: 190, r: -20 },
        { k: "J", x: 600, y: 100, r: 12 },
        { k: "K", x: 1250, y: 130, r: -12 },
        { k: "L", x: 1650, y: 220, r: 20 },
        { k: "⌥", x: 230, y: 780, r: 15 },
        { k: "Esc", x: 1600, y: 790, r: -16 },
        { k: "Space", x: 1190, y: 980, r: 9 },
      ].map((cap, i) => (
        <div
          key={cap.k}
          style={{
            position: "absolute",
            left: cap.x,
            top: cap.y,
            opacity: 0.38 * tween(t, 0.1 + i * 0.04, 0.7 + i * 0.04),
            transform: `perspective(800px) rotateX(${30 + Math.sin(t * 0.8 + i) * 8}deg) rotateZ(${cap.r + Math.sin(t * 0.6 + i) * 5}deg) translateY(${tween(t, 0, 0.9, 120, 0) + Math.sin(t * 0.9 + i) * 18}px)`,
            scale: 0.8 + (i % 3) * 0.13,
          }}
        >
          <Key>{cap.k}</Key>
        </div>
      ))}
      <div
        style={{
          position: "absolute",
          left: 560,
          top: 130,
          width: 800,
          height: 650,
          background: "radial-gradient(ellipse,#2679ed2b,transparent 65%)",
          filter: "blur(25px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 190,
          opacity: tween(t, 0.1, 0.65),
          transform: `perspective(1800px) translateY(${tween(t, 0, 1, 90, 0)}px) rotateX(${tween(t, 0, 1, 12, 0)}deg)`,
        }}
      >
        <CanvasImage
          src={staticFile("icon.png")}
          premountFor={fps}
          style={{
            width: 360,
            height: 360,
            objectFit: "contain",
            filter: "drop-shadow(0 30px 45px #0007)",
          }}
        />
        <div
          style={{
            fontSize: 108,
            lineHeight: 1.1,
            fontWeight: 750,
            letterSpacing: -5,
            marginTop: 32,
            color: C.ink,
          }}
        >
          KeyMouse
        </div>
        <div
          style={{
            marginTop: 44,
            fontSize: 25,
            color: C.muted,
            opacity: tween(t, 0.65, 1.1),
          }}
        >
          amanpalariya.github.io/keymouse
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: C.bg,
          opacity: tween(t, 3.8, 4),
          pointerEvents: "none",
        }}
      />
    </Backdrop>
  );
};
