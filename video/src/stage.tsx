import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop, BrandMark, C, font, tween } from "./design";

export const AppWindow: React.FC<{
  title: string;
  style?: React.CSSProperties;
}> = ({ title, style }) => {
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
        background: "#101b2b",
        boxShadow: "0 40px 90px #0005",
        border: "1px solid #5a759b55",
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
          background: "#1a283d",
          borderBottom: "1px solid #7193c322",
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
            color: "#a4b5cb",
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

// Feature shots use the former title area for larger application content.
export const Stage: React.FC<{ children: React.ReactNode; demo?: boolean }> = ({
  children,
  demo,
}) => (
  <Backdrop>
    <div
      style={{
        position: "absolute",
        right: 94,
        top: 32,
        display: "flex",
        alignItems: "center",
        gap: 12,
        fontSize: 21,
        fontWeight: 750,
        letterSpacing: -0.8,
        opacity: 0.65,
        zIndex: 70,
      }}
    >
      <BrandMark size={26} color={C.cyan} />
      KeyMouse
    </div>
    <div
      data-demo-canvas={demo}
      style={{
        position: "absolute",
        inset: 0,
        transform: demo ? "translateY(-100px) scale(1.08)" : undefined,
        transformOrigin: "center top",
      }}
    >
      {children}
    </div>
  </Backdrop>
);

export const InputDock: React.FC<{
  children: React.ReactNode;
  caption?: string;
}> = ({ children, caption }) => (
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
        background: "#101e30ed",
        border: "1px solid #819ec52e",
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
          color: C.muted,
        }}
      >
        {caption}
      </div>
    ) : null}
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
