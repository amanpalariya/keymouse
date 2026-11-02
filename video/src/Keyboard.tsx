import React from "react";
import { font, mono, tween } from "./design";

type KeySpec = { key: string; units?: number };
const rows: KeySpec[][] = [
  [
    { key: "Tab", units: 1.4 },
    ..."QWERTYUIOP".split("").map((key) => ({ key })),
    { key: "[" },
    { key: "]" },
    { key: "\\", units: 1.4 },
  ],
  [
    { key: "Caps", units: 1.7 },
    ..."ASDFGHJKL".split("").map((key) => ({ key })),
    { key: ";" },
    { key: "'" },
    { key: "Return", units: 2.1 },
  ],
  [
    { key: "Shift", units: 2.25 },
    ..."ZXCVBNM".split("").map((key) => ({ key })),
    { key: "," },
    { key: "." },
    { key: "/" },
    { key: "Shift-R", units: 2.55 },
  ],
  [
    { key: "fn", units: 1.1 },
    { key: "Ctrl", units: 1.1 },
    { key: "Option", units: 1.25 },
    { key: "⌘", units: 1.4 },
    { key: "Space", units: 4.3 },
    { key: "⌘-R", units: 1.4 },
    { key: "Option-R", units: 1.25 },
    { key: "Arrows", units: 3 },
  ],
];
const labels: Record<string, string> = {
  Esc: "STOP",
  W: "LEFT",
  E: "MIDDLE",
  R: "RIGHT",
  H: "←",
  J: "↓",
  K: "↑",
  L: "→",
  D: "SLOW",
  F: "FAST",
  Shift: "SCROLL",
  Option: "START",
  Space: "LEFT CLICK",
};
const arrowKeys = ["←", "↓", "↑", "→"];

export const MouseButton: React.FC<{ button: number; size?: number }> = ({
  button,
  size = 35,
}) => (
  <svg width={size} height={size * 1.25} viewBox="0 0 48 60" fill="none">
    <path
      d="M7 25V19C7 8 14 3 24 3S41 8 41 19V25Z"
      fill={button === 0 ? "#86e8ff" : "#152237"}
      stroke="#86e8ff"
      strokeWidth="1.5"
    />
    <path
      d="M24 3C34 3 41 8 41 19V25H24Z"
      fill={button === 2 ? "#86e8ff" : "#152237"}
      stroke="#86e8ff"
      strokeWidth="1.5"
    />
    <rect
      x="20"
      y="11"
      width="8"
      height="17"
      rx="4"
      fill={button === 1 ? "#86e8ff" : "#152237"}
      stroke="#86e8ff"
      strokeWidth="1.5"
    />
    <path
      d="M7 25V37C7 50 13 57 24 57S41 50 41 37V25"
      stroke="#86e8ff"
      strokeWidth="1.5"
    />
  </svg>
);

const Cap: React.FC<{
  name: string;
  active: boolean;
  t: number;
  small?: boolean;
  style?: React.CSSProperties;
}> = ({ name, active, t, small, style }) => {
  const label = labels[name];
  const arrow = arrowKeys.includes(name);
  const mapped = Boolean(label) || arrow;
  const clicks = ["W", "E", "R"].includes(name);
  const direction = ["H", "J", "K", "L"].includes(name);
  const glow = active
    ? "#9cefff"
    : clicks
      ? "#3c8fc7"
      : direction || arrow
        ? "#7c9cff"
        : mapped
          ? "#8698b7"
          : "#425068";
  return (
    <div
      data-key={name}
      data-active={active}
      style={{
        height: small ? 52 : 100,
        background: active
          ? "linear-gradient(145deg,#b0efff,#5badfa)"
          : clicks
            ? "linear-gradient(145deg,#1e3f55,#102136)"
            : direction || arrow
              ? "linear-gradient(145deg,#283e69,#16213b)"
              : "linear-gradient(145deg,#263143,#141c2b)",
        borderRadius: small ? 9 : 13,
        border: `1px solid ${active ? "#beefff" : mapped ? glow + "70" : "#ffffff0b"}`,
        boxShadow: active
          ? "0 2px 0 #123e6b,0 0 45px #62c7ff55"
          : "0 7px 0 #070b14,0 9px 8px #0005,0 1px 0 #ffffff12 inset",
        position: "relative",
        translate: `0 ${active ? 4 : 0}px`,
        color: active ? "#102d4c" : mapped ? "#f4f8ff" : "#718098",
        opacity: mapped ? 1 : 0.4,
        ...style,
      }}
    >
      <span
        style={{
          position: "absolute",
          left: small ? 12 : 18,
          top: small ? 9 : 14,
          fontSize: arrow ? 26 : small ? 20 : name.length > 2 ? 19 : 30,
          fontWeight: 650,
        }}
      >
        {name.replace("-R", "")}
      </span>
      {label ? (
        <span
          style={{
            position: "absolute",
            bottom: small ? 9 : 10,
            right: small ? 9 : 14,
            fontFamily: mono,
            fontSize: direction
              ? 31
              : name === "D" || name === "F"
                ? 18
                : clicks
                  ? 15
                  : small
                    ? 11
                    : 14,
            letterSpacing: direction ? 0 : 1,
            color: active
              ? "#153753"
              : name === "D" || name === "F"
                ? "#c2d5f1"
                : glow,
            opacity: tween(t, 0.12, 0.6),
          }}
        >
          {label}
        </span>
      ) : null}
    </div>
  );
};

export const Keyboard: React.FC<{
  active?: string[];
  t: number;
  style?: React.CSSProperties;
}> = ({ active = [], t, style }) => (
  <div
    style={{
      position: "relative",
      width: 1540,
      padding: "23px 26px 29px",
      borderRadius: 31,
      background: "linear-gradient(150deg,#263246,#0c1321 60%)",
      border: "1px solid #98b9ef35",
      boxShadow: "0 19px 0 #050912,0 20px 0 1px #6e97ce26,0 80px 100px #0008",
      fontFamily: font,
      ...style,
    }}
  >
    <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
      <Cap
        name="Esc"
        active={active.includes("Esc")}
        t={t}
        small
        style={{ flex: 1.4 }}
      />
      {Array.from({ length: 12 }, (_, i) => (
        <Cap
          key={i}
          name={`F${i + 1}`}
          active={false}
          t={t}
          small
          style={{ flex: 1 }}
        />
      ))}
      <Cap name="◉" active={false} t={t} small style={{ flex: 1.4 }} />
    </div>
    {rows.map((row, r) => (
      <div key={r} style={{ display: "flex", gap: 10, marginTop: r ? 13 : 0 }}>
        {row.map(({ key, units = 1 }) =>
          key === "Arrows" ? (
            <div
              key={key}
              style={{
                flex: units,
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gridTemplateRows: "47px 47px",
                gap: 6,
              }}
            >
              <Cap
                name="↑"
                active={active.includes("↑")}
                t={t}
                small
                style={{ height: 47, gridColumn: 2, gridRow: 1 }}
              />
              <Cap
                name="←"
                active={active.includes("←")}
                t={t}
                small
                style={{ height: 47, gridColumn: 1, gridRow: 2 }}
              />
              <Cap
                name="↓"
                active={active.includes("↓")}
                t={t}
                small
                style={{ height: 47, gridColumn: 2, gridRow: 2 }}
              />
              <Cap
                name="→"
                active={active.includes("→")}
                t={t}
                small
                style={{ height: 47, gridColumn: 3, gridRow: 2 }}
              />
            </div>
          ) : (
            <Cap
              key={key}
              name={key}
              active={active.includes(key)}
              t={t}
              style={{ flex: units }}
            />
          ),
        )}
      </div>
    ))}
  </div>
);
