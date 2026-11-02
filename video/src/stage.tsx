import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop, BrandMark, C, font, Key, mono, tween } from "./design";

export const AppWindow: React.FC<{
  title: string;
  light?: boolean;
  style?: React.CSSProperties;
}> = ({ title, light, style }) => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  return (
    <div
      style={{
        position: "absolute",
        left: 190,
        top: 210,
        width: 1540,
        height: 1000,
        borderRadius: 25,
        background: light ? "#f8fbff" : "#101b2b",
        boxShadow: light ? "0 40px 90px #1c426b2c" : "0 40px 90px #0005",
        border: `1px solid ${light ? "#c8d6e7" : "#5a759b55"}`,
        opacity: tween(t, 0, 0.25),
        translate: `0 ${tween(t, 0, 0.5, 35, 0)}px`,
        overflow: "hidden",
        ...style,
      }}
    >
      <div
        style={{
          height: 55,
          display: "flex",
          alignItems: "center",
          gap: 11,
          padding: "0 25px",
          background: light ? "#eaf0f8" : "#1a283d",
          borderBottom: `1px solid ${light ? "#cbd6e580" : "#7193c322"}`,
        }}
      >
        {["#fd746e", "#f7c857", "#65ca8a"].map((c) => (
          <span
            key={c}
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: c,
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            left: 150,
            right: 150,
            textAlign: "center",
            color: light ? "#6c7f98" : "#a4b5cb",
            fontSize: 19,
            fontWeight: 600,
          }}
        >
          {title}
        </div>
      </div>
    </div>
  );
};

// Film framing: one action, one stage. No persistent navigation or body copy.
export const Stage: React.FC<{
  children: React.ReactNode;
  title?: string;
  light?: boolean;
}> = ({ children, title, light }) => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  return (
    <Backdrop light={light}>
      {title ? (
        <div
          style={{
            position: "absolute",
            left: 96,
            top: 66,
            fontSize: 92,
            fontWeight: 750,
            lineHeight: 1,
            letterSpacing: -5,
            opacity: tween(t, 0, 0.2),
            translate: `0 ${tween(t, 0, 0.5, 30, 0)}px`,
            zIndex: 10,
          }}
        >
          {title}
        </div>
      ) : null}
      <div
        style={{
          position: "absolute",
          right: 94,
          top: 78,
          display: "flex",
          alignItems: "center",
          gap: 13,
          fontSize: 23,
          fontWeight: 750,
          letterSpacing: -1,
          opacity: 0.7,
        }}
      >
        <BrandMark size={29} color={light ? C.blue : C.cyan} />
        KeyMouse
      </div>
      {children}
    </Backdrop>
  );
};

export const InputDock: React.FC<{
  children: React.ReactNode;
  caption?: string;
  light?: boolean;
}> = ({ children, caption, light }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 32,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 14,
      zIndex: 50,
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 15,
        padding: "17px 22px 21px",
        borderRadius: 25,
        background: light ? "#eef5fff0" : "#101e30ed",
        border: light ? "1px solid #c3d2e780" : "1px solid #819ec52e",
        boxShadow: "0 12px 45px #0003",
        backdropFilter: "blur(16px)",
      }}
    >
      {children}
    </div>
    {caption ? (
      <div
        style={{
          fontSize: 22,
          fontFamily: font,
          fontWeight: 600,
          color: light ? "#607087" : C.muted,
        }}
      >
        {caption}
      </div>
    ) : null}
  </div>
);

export const Plus: React.FC = () => (
  <span style={{ fontSize: 27, opacity: 0.45, margin: "0 8px" }}>+</span>
);

export const Shortcut: React.FC<{
  keys: string[];
  active?: boolean;
  light?: boolean;
}> = ({ keys, active, light }) => (
  <>
    {keys.map((key, i) => (
      <React.Fragment key={key}>
        {i ? <Plus /> : null}
        <Key active={active} wide={key.length > 2} light={light}>
          {key}
        </Key>
      </React.Fragment>
    ))}
  </>
);

export const ActionTag: React.FC<{
  children: React.ReactNode;
  color?: string;
  style?: React.CSSProperties;
}> = ({ children, color = C.cyan, style }) => (
  <div
    style={{
      fontFamily: mono,
      fontSize: 19,
      letterSpacing: 2,
      color,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Surface: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  tilt?: number;
}> = ({ children, style, tilt = 0 }) => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  return (
    <div
      style={{
        position: "absolute",
        left: 270,
        top: 222,
        width: 1380,
        height: 570,
        perspective: 2200,
        ...style,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transform: `rotateX(${tween(t, 0, 0.6, 12, tilt)}deg) rotateY(${tween(t, 0, 0.6, -6, 0)}deg) translateY(${tween(t, 0, 0.6, 65, 0)}px)`,
          opacity: tween(t, 0, 0.25),
          transformOrigin: "center center",
        }}
      >
        {children}
      </div>
    </div>
  );
};
