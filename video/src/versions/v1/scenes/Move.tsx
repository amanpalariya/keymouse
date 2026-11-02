import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import {
  Backdrop,
  Chrome,
  C,
  Cursor,
  Footer,
  Headline,
  Key,
  KeyHint,
  Panel,
  Pill,
  mono,
  tween,
  lerp,
} from "../design";

export const Move: React.FC = () => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const times = [0, 0.5, 1.2, 1.35, 2.25, 2.4, 2.9, 3.1, 3.6, 3.8, 4.2];
  const x = lerp(
    t,
    times,
    [180, 180, 180, 180, 730, 730, 730, 730, 510, 510, 730],
  );
  const y = lerp(
    t,
    times,
    [420, 420, 200, 200, 200, 200, 397, 397, 397, 397, 397],
  );
  const clicked = t > 4.5;
  const key =
    t < 0.5
      ? "⌥"
      : t < 1.3
        ? "K"
        : t < 2.4
          ? "L"
          : t < 3.1
            ? "J"
            : t < 3.8
              ? "H"
              : t < 4.35
                ? "L"
                : "Space";
  return (
    <Backdrop>
      <Chrome chapter="MOVE + CLICK" index="01" />
      <Headline
        eyebrow="TAP OPTION. TAKE CONTROL."
        first="Point."
        second="With keys."
        desc="Move in any direction. Land exactly where you want."
      />
      <KeyHint
        label={
          t < 0.5
            ? "Tap Option to activate"
            : clicked
              ? "Space or W → left click"
              : "H J K L or arrow keys → move"
        }
      >
        <Key active={key === "⌥"}>⌥</Key>
        <span style={{ width: 12 }} />
        {["H", "J", "K", "L"].map((k) => (
          <Key key={k} active={key === k}>
            {k}
          </Key>
        ))}
        {clicked ? (
          <Key active wide>
            Space
          </Key>
        ) : null}
      </KeyHint>
      <Panel title="Workspace">
        <div style={{ padding: "37px 42px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ fontSize: 33, fontWeight: 750, letterSpacing: -1 }}>
              Make room for great work.
            </div>
            <Pill>⌥ Active</Pill>
          </div>
          <div style={{ fontSize: 18, color: "#8591a3", marginTop: 8 }}>
            One keyboard. Every part of your desktop.
          </div>
          <div style={{ display: "flex", gap: 23, marginTop: 43 }}>
            {[
              ["01", "Discover", "#dfe8ff"],
              ["02", "Create", "#ddf0ed"],
              ["03", "Launch", "#e9e3ff"],
            ].map(([n, title, bg], i) => (
              <div
                key={n}
                style={{
                  width: 293,
                  height: 350,
                  padding: 25,
                  borderRadius: 18,
                  background: clicked && i === 2 ? "#e7efff" : "white",
                  border:
                    clicked && i === 2
                      ? "2px solid #3677ff"
                      : "2px solid #e5eaf2",
                  boxShadow:
                    clicked && i === 2 ? "0 15px 40px #3677ff20" : "none",
                }}
              >
                <div
                  style={{
                    background: bg,
                    borderRadius: 12,
                    height: 151,
                    padding: 22,
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      width: 76,
                      height: 76,
                      border: "12px solid #ffffffaa",
                      borderRadius: i === 0 ? "50%" : 17,
                      rotate: `${i * 23}deg`,
                      position: "absolute",
                      left: 75,
                      top: 36,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: mono,
                      fontSize: 14,
                      color: "#293a5a77",
                    }}
                  >
                    {n}
                  </span>
                </div>
                <div style={{ fontSize: 25, fontWeight: 750, marginTop: 24 }}>
                  {title}
                </div>
                <div
                  style={{
                    height: 7,
                    background: "#e9edf3",
                    width: "85%",
                    marginTop: 19,
                    borderRadius: 8,
                  }}
                />
                <div
                  style={{
                    height: 7,
                    background: "#e9edf3",
                    width: "60%",
                    marginTop: 10,
                    borderRadius: 8,
                  }}
                />
                <div
                  style={{
                    fontSize: 14,
                    color: clicked && i === 2 ? C.blue : "#8995a8",
                    marginTop: 25,
                    fontFamily: mono,
                  }}
                >
                  {clicked && i === 2 ? "✓ SELECTED" : "OPEN PROJECT ↗"}
                </div>
              </div>
            ))}
          </div>
        </div>
        <Cursor
          x={x}
          y={y}
          press={t > 4.5 && t < 4.66}
          label={clicked ? "Left click" : undefined}
        />
        {t < 0.5 ? (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "#eff3fa88",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: 1 - tween(t, 0.25, 0.5),
            }}
          >
            <Pill
              style={{
                background: C.dark,
                color: "white",
                padding: "18px 28px",
                fontSize: 24,
              }}
            >
              ⌥ Tap to activate
            </Pill>
          </div>
        ) : null}
      </Panel>
      <Footer text="01   /   MOVE FREELY. CLICK INSTANTLY." />
    </Backdrop>
  );
};
