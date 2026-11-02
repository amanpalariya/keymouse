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
    </Stage>
  );
};
