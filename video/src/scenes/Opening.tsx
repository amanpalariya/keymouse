import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { C, Key, Reveal, tween } from "../design";
import { Stage } from "../stage";
import { Cursor3D } from "../Cursor3D";

export const Opening: React.FC = () => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  return (
    <Stage>
      <div
        style={{
          position: "absolute",
          inset: 0,
          translate: `0 ${tween(t, 3.5, 4.15, 0, -1000)}px`,
          opacity: 1 - tween(t, 3.8, 4.2),
        }}
      >
        {[
          { k: "W", x: 240, y: 130, r: -18 },
          { k: "E", x: 650, y: 80, r: 12 },
          { k: "R", x: 1100, y: 145, r: -12 },
          { k: "↑", x: 1660, y: 150, r: 22 },
          { k: "⌥", x: 430, y: 880, r: -15 },
          { k: "Esc", x: 1760, y: 730, r: 14 },
          { k: "Space", x: 1480, y: 960, r: -9 },
        ].map((cap, i) => (
          <div
            key={cap.k}
            style={{
              position: "absolute",
              left: cap.x,
              top: cap.y,
              opacity: 0.38 * tween(t, 0.1 + i * 0.05, 0.8 + i * 0.05),
              transform: `perspective(800px) rotateX(${30 + Math.sin(t * 0.8 + i) * 8}deg) rotateZ(${cap.r + Math.sin(t * 0.6 + i) * 5}deg) translateY(${tween(t, 0, 1, 150, 0) + Math.sin(t * 0.9 + i) * 18}px)`,
              scale: 0.8 + (i % 3) * 0.13,
            }}
          >
            <Key>{cap.k}</Key>
          </div>
        ))}
        <div
          style={{
            position: "absolute",
            left: 960,
            top: 320,
            width: 850,
            height: 520,
            background: "radial-gradient(ellipse,#3d97ff36,transparent 67%)",
            filter: "blur(30px)",
          }}
        />
        <svg
          width="1920"
          height="1080"
          style={{ position: "absolute", opacity: 0.45 }}
        >
          <defs>
            <linearGradient id="orbit">
              <stop stopColor="#356ed900" />
              <stop offset=".6" stopColor="#75c8ff" />
              <stop offset="1" stopColor="#356ed900" />
            </linearGradient>
          </defs>
          <ellipse
            cx="1390"
            cy="605"
            rx="390"
            ry="155"
            fill="none"
            stroke="url(#orbit)"
            strokeWidth="1"
            transform={`rotate(${-25 + t * 3} 1390 605)`}
          />
        </svg>
        <div style={{ position: "absolute", left: 108, top: 330 }}>
          <Reveal delay={0.18}>
            <div
              style={{
                fontSize: 169,
                fontWeight: 750,
                letterSpacing: -10,
                lineHeight: 1.05,
              }}
            >
              Stay on
            </div>
          </Reveal>
          <Reveal delay={0.34}>
            <div
              style={{
                fontSize: 169,
                fontWeight: 750,
                letterSpacing: -10,
                lineHeight: 1.05,
                color: C.cyan,
              }}
            >
              the keys.
            </div>
          </Reveal>
        </div>
        <div
          style={{
            position: "absolute",
            left: 1110,
            top: 800,
            display: "flex",
            gap: 12,
            perspective: 800,
            transform: `rotateX(35deg) rotateZ(-12deg) translateY(${tween(t, 0.4, 1.3, 100, 0)}px)`,
            opacity: tween(t, 0.4, 1),
          }}
        >
          {["H", "J", "K", "L"].map((k, i) => (
            <div
              key={k}
              style={{
                translate: `0 ${Math.sin(t * 2 + i) * 4}px`,
              }}
            >
              <Key active={t > 1.5 + i * 0.23 && t < 1.72 + i * 0.23}>{k}</Key>
            </div>
          ))}
        </div>
        <Cursor3D />
      </div>
    </Stage>
  );
};
