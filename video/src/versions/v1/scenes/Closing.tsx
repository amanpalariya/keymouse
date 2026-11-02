import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import {
  Backdrop,
  Chrome,
  C,
  Footer,
  Key,
  Reveal,
  mono,
  tween,
} from "../design";
import { Cursor3D } from "../Cursor3D";

export const Closing: React.FC = () => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  return (
    <Backdrop>
      <Chrome chapter="STAY IN FLOW" index="07" />
      <div style={{ position: "absolute", left: 108, top: 223 }}>
        <Reveal>
          <div
            style={{
              fontFamily: mono,
              fontSize: 17,
              letterSpacing: 3,
              color: C.cyan,
              marginBottom: 32,
            }}
          >
            MOVE. CLICK. SCROLL. SELECT. DRAG.
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <div
            style={{
              fontSize: 153,
              fontWeight: 750,
              letterSpacing: -9,
              lineHeight: 1.08,
            }}
          >
            Every move.
          </div>
        </Reveal>
        <Reveal delay={0.2}>
          <div
            style={{
              fontSize: 153,
              fontWeight: 750,
              letterSpacing: -9,
              lineHeight: 1.08,
              color: C.cyan,
            }}
          >
            Yours.
          </div>
        </Reveal>
        <Reveal delay={0.4}>
          <div style={{ marginTop: 38, fontSize: 31, color: C.muted }}>
            Your keyboard. In full control.
          </div>
        </Reveal>
      </div>
      <div
        style={{
          position: "absolute",
          left: 108,
          top: 756,
          display: "flex",
          alignItems: "center",
          gap: 20,
          opacity: tween(t, 0.6, 1),
        }}
      >
        <Key wide active={t > 1.25 && t < 1.5}>
          ⌥ Option
        </Key>
        <span style={{ fontSize: 23, color: C.muted }}>to start</span>
        <div
          style={{ height: 35, width: 1, background: C.line, margin: "0 15px" }}
        />
        <Key>Esc</Key>
        <span style={{ fontSize: 23, color: C.muted }}>to stop</span>
      </div>
      <div
        style={{
          position: "absolute",
          left: 1030,
          top: 300,
          width: 720,
          height: 550,
          background: "radial-gradient(ellipse,#2b75e938,transparent 65%)",
          filter: "blur(40px)",
        }}
      />
      <Cursor3D outro />
      <Footer text="KEYMOUSE   /   amanpalariya.github.io/keymouse" />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: C.bg,
          opacity: tween(t, 3.8, 4, 0, 1),
          pointerEvents: "none",
        }}
      />
    </Backdrop>
  );
};
