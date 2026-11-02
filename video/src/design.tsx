import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/fonts";

export const fontsReady = Promise.all([
  loadFont({
    family: "Manrope",
    url: staticFile("fonts/Manrope.ttf"),
    weight: "200 800",
  }),
  loadFont({
    family: "Plex",
    url: staticFile("fonts/IBMPlexMono.ttf"),
    weight: "400",
  }),
]);

export const C = {
  bg: "#080c16",
  ink: "#f5f7fb",
  muted: "#8d9bb1",
  blue: "#3677ff",
  cyan: "#8de8ff",
  line: "#ffffff1c",
  paper: "#f5f7fb",
  dark: "#182235",
};
export const font = "Manrope, -apple-system, sans-serif";
export const mono = "Plex, monospace";
export const ease = Easing.bezier(0.16, 1, 0.3, 1);
export const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};
export const tween = (t: number, a: number, b: number, x = 0, y = 1) =>
  interpolate(t, [a, b], [x, y], { ...clamp, easing: ease });
export const lerp = (t: number, times: number[], values: number[]) =>
  interpolate(t, times, values, {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });

// Keep released input badges readable, independently of the actual press state.
export const inputFeedback = (
  t: number,
  events: { start: number; end: number; keys: string[] }[],
) => {
  const event = [...events].reverse().find((item) => item.start <= t);
  if (!event) return { keys: [], opacity: 0 };
  const opacity =
    1 -
    interpolate(t, [event.end + 0.18, event.end + 0.68], [0, 1], {
      ...clamp,
      easing: Easing.inOut(Easing.quad),
    });
  return { keys: opacity > 0 ? event.keys : [], opacity };
};

export const Backdrop: React.FC<{
  light?: boolean;
  children?: React.ReactNode;
}> = ({ light, children }) => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  return (
    <AbsoluteFill
      style={{
        background: light ? "#eaf0f8" : C.bg,
        color: light ? C.dark : C.ink,
        fontFamily: font,
        overflow: "hidden",
      }}
    >
      <AbsoluteFill
        style={{
          background: light
            ? "radial-gradient(ellipse at 65% 40%, #fff 0%, transparent 65%)"
            : "radial-gradient(ellipse at 78% 52%, #183b663b 0%, transparent 62%), radial-gradient(ellipse at 25% 120%, #123e662c 0%, transparent 50%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1050,
          height: 1050,
          right: -180,
          top: -100,
          border: `1px solid ${light ? "#163c6710" : "#9bcbff09"}`,
          borderRadius: "50%",
          scale: 1 + t * 0.006,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1500,
          height: 1500,
          right: -405,
          top: -325,
          border: `1px solid ${light ? "#163c670b" : "#9bcbff08"}`,
          borderRadius: "50%",
        }}
      />
      {children}
    </AbsoluteFill>
  );
};

export const Chrome: React.FC<{
  chapter: string;
  index: string;
  light?: boolean;
}> = ({ chapter, index, light }) => (
  <>
    <div
      style={{
        position: "absolute",
        left: 108,
        top: 62,
        display: "flex",
        alignItems: "center",
        gap: 18,
        fontSize: 26,
        fontWeight: 750,
        letterSpacing: -1,
      }}
    >
      <BrandMark size={32} color={light ? C.blue : C.cyan} />
      KeyMouse
      <span
        style={{
          width: 1,
          height: 25,
          background: light ? "#18223533" : C.line,
          marginLeft: 16,
          marginRight: 16,
        }}
      />
      <span
        style={{
          fontFamily: mono,
          fontSize: 15,
          letterSpacing: 2,
          fontWeight: 400,
          color: light ? "#607087" : C.muted,
        }}
      >
        KEYBOARD → CURSOR
      </span>
    </div>
    <div
      style={{
        position: "absolute",
        right: 108,
        top: 70,
        fontFamily: mono,
        fontSize: 16,
        letterSpacing: 2,
        color: light ? "#607087" : C.muted,
      }}
    >
      {index} <span style={{ margin: "0 15px", opacity: 0.4 }}>/</span>{" "}
      {chapter}
    </div>
  </>
);

export const BrandMark: React.FC<{ size?: number; color?: string }> = ({
  size = 36,
  color = C.cyan,
}) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect
      x="2"
      y="2"
      width="28"
      height="28"
      rx="7"
      stroke={color}
      strokeWidth="2"
    />
    <path d="M11 8L23 17L17 18L20 24L16 26L13 20L9 24V8Z" fill={color} />
  </svg>
);

export const Reveal: React.FC<{
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}> = ({ children, delay = 0, style }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        opacity: interpolate(f, [delay * fps, (delay + 0.42) * fps], [0, 1], {
          ...clamp,
          easing: ease,
        }),
        translate: `0 ${interpolate(f, [delay * fps, (delay + 0.6) * fps], [56, 0], { ...clamp, easing: ease })}px`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Headline: React.FC<{
  eyebrow: string;
  first: string;
  second: string;
  desc: string;
  light?: boolean;
}> = ({ eyebrow, first, second, desc, light }) => (
  <div style={{ position: "absolute", left: 108, top: 219, width: 620 }}>
    <Reveal>
      <div
        style={{
          fontFamily: mono,
          fontSize: 16,
          letterSpacing: 3,
          color: light ? C.blue : C.cyan,
          marginBottom: 36,
        }}
      >
        {eyebrow}
      </div>
    </Reveal>
    <Reveal delay={0.06}>
      <div
        style={{
          fontSize: 112,
          lineHeight: 1.04,
          fontWeight: 750,
          letterSpacing: -6.5,
        }}
      >
        {first}
      </div>
    </Reveal>
    <Reveal delay={0.16}>
      <div
        style={{
          fontSize: 112,
          lineHeight: 1.04,
          fontWeight: 750,
          letterSpacing: -6.5,
          color: light ? C.blue : C.cyan,
        }}
      >
        {second}
      </div>
    </Reveal>
    <Reveal delay={0.3}>
      <div
        style={{
          fontSize: 27,
          lineHeight: 1.65,
          letterSpacing: -0.4,
          color: light ? "#607087" : C.muted,
          marginTop: 34,
          maxWidth: 520,
        }}
      >
        {desc}
      </div>
    </Reveal>
  </div>
);

export const Key: React.FC<{
  children: React.ReactNode;
  active?: boolean;
  wide?: boolean;
  light?: boolean;
  small?: boolean;
}> = ({ children, active, wide, light, small }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: small ? 51 : 76,
      minWidth: wide ? 148 : small ? 51 : 76,
      padding: "0 21px",
      borderRadius: small ? 11 : 17,
      background: active
        ? "linear-gradient(140deg, #98eaff, #4f9bff)"
        : light
          ? "linear-gradient(#fff,#e8edf5)"
          : "linear-gradient(150deg,#273347,#111a2a)",
      color: active ? "#0c2744" : light ? C.dark : "#ebf0fa",
      boxShadow: active
        ? "0 4px 0 #215c9d, 0 0 48px #5cbcff45"
        : light
          ? "0 5px 0 #cad1df,0 12px 18px #13233d15"
          : "0 5px 0 #050911, 0 0 0 1px #ffffff19 inset, 0 16px 25px #0005",
      fontFamily: font,
      fontSize: small ? 21 : 29,
      fontWeight: 650,
      translate: `0 ${active ? 4 : 0}px`,
    }}
  >
    {children}
  </div>
);

export const KeyHint: React.FC<{
  children: React.ReactNode;
  label: string;
  light?: boolean;
}> = ({ children, label, light }) => (
  <div style={{ position: "absolute", left: 108, bottom: 160 }}>
    <div style={{ display: "flex", gap: 12, alignItems: "center", height: 84 }}>
      {children}
    </div>
    <div
      style={{
        fontFamily: mono,
        fontSize: 17,
        color: light ? "#607087" : C.muted,
        marginTop: 24,
      }}
    >
      {label}
    </div>
  </div>
);

export const Panel: React.FC<{
  children: React.ReactNode;
  title: string;
  style?: React.CSSProperties;
}> = ({ children, title, style }) => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  return (
    <div
      style={{
        position: "absolute",
        left: 800,
        top: 215,
        width: 1010,
        height: 647,
        perspective: 1800,
        ...style,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 23,
          background: C.paper,
          boxShadow: "0 45px 100px #0004, 0 0 0 1px #ffffff20",
          overflow: "hidden",
          transform: `rotateY(${tween(t, 0, 0.8, -10, 0)}deg) rotateX(${tween(t, 0, 0.8, 5, 0)}deg) translateY(${tween(t, 0, 0.8, 70, 0)}px)`,
          opacity: tween(t, 0, 0.3),
        }}
      >
        <div
          style={{
            height: 58,
            display: "flex",
            alignItems: "center",
            borderBottom: "1px solid #15243913",
            padding: "0 24px",
            gap: 9,
            background: "#edf1f7",
            position: "relative",
            zIndex: 3,
          }}
        >
          {["#fc6b64", "#f7c34c", "#50c67a"].map((c) => (
            <span
              key={c}
              style={{ width: 13, height: 13, borderRadius: 9, background: c }}
            />
          ))}
          <span
            style={{
              position: "absolute",
              left: 130,
              right: 130,
              textAlign: "center",
              fontSize: 17,
              fontWeight: 650,
              color: "#788498",
            }}
          >
            {title}
          </span>
        </div>
        <div
          style={{
            position: "relative",
            height: "calc(100% - 58px)",
            color: C.dark,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export const Cursor: React.FC<{
  x: number;
  y: number;
  size?: number;
  press?: boolean;
  light?: boolean;
  label?: string;
  pressed?: string[];
  shape?: "arrow" | "brush";
  hintOpacity?: number;
}> = ({
  x,
  y,
  size = 43,
  press,
  light,
  label,
  pressed = [],
  shape = "arrow",
  hintOpacity = 1,
}) => (
  <div
    style={{
      position: "absolute",
      left: x - (size * 2) / 35,
      top: y - (size * 2) / 35,
      zIndex: 40,
      scale: press ? 0.88 : 1,
      transformOrigin: `${(size * 2) / 35}px ${(size * 2) / 35}px`,
      filter: "drop-shadow(0 5px 5px #12254455)",
    }}
  >
    {press ? (
      <div
        style={{
          position: "absolute",
          left: (size * 2) / 35 - 29,
          top: (size * 2) / 35 - 29,
          width: 58,
          height: 58,
          border: "2px solid #4a8eff77",
          borderRadius: "50%",
          background: "#4a8eff18",
        }}
      />
    ) : null}
    <svg
      width={size}
      height={(size * 46) / 35}
      viewBox="0 0 35 46"
      style={{ overflow: "visible" }}
    >
      {shape === "brush" ? (
        <>
          <circle
            cx="2"
            cy="2"
            r="12"
            fill="none"
            stroke="#172434"
            strokeWidth="2.2"
          />
          <circle
            cx="2"
            cy="2"
            r="12"
            fill="none"
            stroke="#f6fbff"
            strokeWidth="1"
          />
        </>
      ) : (
        <path
          d="M2 2L30 26L18 28L25 41L18 45L11 31L2 39Z"
          fill={light ? "#f7fbff" : "#17273f"}
          stroke={light ? "#23354b" : "white"}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      )}
    </svg>
    {pressed.length ? (
      <div
        style={{
          position: "absolute",
          left: size * 0.6,
          top: size * 0.95,
          display: "flex",
          gap: 6,
          padding: 7,
          borderRadius: 12,
          background: "#0c172de8",
          border: "1px solid #8bc6ff44",
          whiteSpace: "nowrap",
          opacity: hintOpacity,
        }}
      >
        {pressed.map((key) => (
          <div
            key={key}
            style={{
              padding: "7px 12px",
              borderRadius: 6,
              background: "#a2e5ff",
              color: "#15314d",
              fontSize: 22,
              fontWeight: 700,
              fontFamily: font,
            }}
          >
            {key}
          </div>
        ))}
      </div>
    ) : null}
    {label ? (
      <div
        style={{
          position: "absolute",
          left: 35,
          top: 52,
          background: C.blue,
          color: "white",
          borderRadius: 9,
          padding: "8px 14px",
          fontSize: 15,
          fontWeight: 700,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </div>
    ) : null}
  </div>
);

export const Pill: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <div
    style={{
      borderRadius: 100,
      background: "#3677ff12",
      color: C.blue,
      padding: "9px 16px",
      fontFamily: mono,
      fontSize: 14,
      display: "inline-flex",
      ...style,
    }}
  >
    {children}
  </div>
);

export const Footer: React.FC<{ text: string; light?: boolean }> = ({
  text,
  light,
}) => (
  <div
    style={{
      position: "absolute",
      bottom: 66,
      left: 108,
      right: 108,
      display: "flex",
      justifyContent: "space-between",
      fontFamily: mono,
      fontSize: 14,
      letterSpacing: 1.5,
      color: light ? "#73829a" : "#6c7d96",
      borderTop: `1px solid ${light ? "#18223518" : C.line}`,
      paddingTop: 22,
    }}
  >
    <span>{text}</span>
    <span>STAY IN FLOW ↗</span>
  </div>
);
