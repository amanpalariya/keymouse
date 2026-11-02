import React from "react";
import {
  CanvasImage,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  Backdrop,
  Chrome,
  C,
  Cursor,
  Footer,
  Headline,
  Key,
  KeyHint,
  mono,
  tween,
  lerp,
} from "../design";

export const Tune: React.FC = () => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  return (
    <Backdrop>
      <Chrome chapter="YOUR MOTION" index="06" />
      <Headline
        eyebrow="DIAL IN YOUR OWN FEEL."
        first="Fast. Fine."
        second="All yours."
        desc="F for speed. D for precision. Tune speed, acceleration, and deceleration in Settings."
      />
      <KeyHint label={t < 1.8 ? "Hold F → 3× speed" : "Hold D → ¼× speed"}>
        <Key active={t > 0.4 && t < 1.7}>F</Key>
        <Key active={t > 1.8 && t < 3.5}>D</Key>
        <span style={{ fontSize: 23, color: C.muted, marginLeft: 20 }}>
          {t < 1.8 ? "Cover ground." : "Find the pixel."}
        </span>
      </KeyHint>
      <div
        style={{
          position: "absolute",
          left: 1060,
          top: 162,
          width: 569,
          height: 767,
          perspective: 1400,
          opacity: tween(t, 0, 0.4),
          transform: `rotateY(${tween(t, 0, 0.8, -14, -4)}deg) rotateZ(2deg) translateY(${tween(t, 0, 0.8, 70, 0)}px)`,
          boxShadow: "0 35px 90px #0005",
          borderRadius: 20,
          overflow: "hidden",
        }}
      >
        <CanvasImage
          src={staticFile("motion.png")}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 812,
          top: 363,
          fontFamily: mono,
          fontSize: 13,
          color: C.cyan,
          letterSpacing: 1.3,
          opacity: tween(t, 0.5, 0.9),
        }}
      >
        REAL APP.
        <br />
        YOUR SETTINGS.
        <div
          style={{
            marginTop: 15,
            width: 202,
            height: 1,
            background: "linear-gradient(90deg,#8de8ff55,#8de8ff)",
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 1660,
          top: 370,
          fontFamily: mono,
          fontSize: 15,
          color: C.muted,
          lineHeight: 2,
        }}
      >
        650 pt/s
        <br />
        0.45s ramp
        <br />
        3× fast
      </div>
      <div
        style={{
          position: "absolute",
          left: 870,
          top: 915,
          width: 800,
          height: 2,
          background: "#27416a",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: lerp(t, [0.3, 1.6, 1.8, 3.4], [0, 610, 610, 675]),
            top: -5,
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: C.cyan,
            boxShadow: "0 0 22px #8de8ff",
          }}
        />
        <Cursor
          x={lerp(t, [0.3, 1.6, 1.8, 3.4], [0, 610, 610, 675])}
          y={-4}
          size={26}
          light
        />
      </div>
      <Footer text="06   /   SPEED. ACCELERATION. CONTROL." />
    </Backdrop>
  );
};
