import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import {
  Backdrop,
  Chrome,
  Cursor,
  Footer,
  Headline,
  Key,
  KeyHint,
  Panel,
  Pill,
  lerp,
  mono,
} from "../design";

export const Scroll: React.FC = () => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const sy = lerp(
    t,
    [0, 0.8, 2.5, 2.9, 3.9, 4.3, 5.3],
    [0, 0, -375, -375, -210, -210, -210],
  );
  const sx = lerp(t, [0, 4.2, 5.2], [0, 0, -195]);
  return (
    <Backdrop light>
      <Chrome chapter="SCROLL" index="02" light />
      <Headline
        eyebrow="A LITTLE SHIFT. A LOT OF FLOW."
        first="Go with"
        second="the scroll."
        desc="Vertical. Horizontal. Effortlessly through pages and canvases."
        light
      />
      <KeyHint label="Hold Shift + movement keys → scroll" light>
        <Key wide light active={t > 0.8 && t < 5.3}>
          ⇧ Shift
        </Key>
        <span style={{ fontSize: 30, color: "#8190a6", margin: "0 5px" }}>
          +
        </span>
        <Key light active={t > 0.8 && t < 2.5}>
          J
        </Key>
        <Key light active={t > 2.9 && t < 3.9}>
          K
        </Key>
        <Key light active={t > 4.2 && t < 5.3}>
          L
        </Key>
      </KeyHint>
      <Panel title="Field Notes — a little room to explore">
        <div
          style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            background: "#fff",
          }}
        >
          <div
            style={{
              width: 1230,
              position: "absolute",
              left: 0,
              top: sy,
              translate: `${sx}px 0`,
              padding: "35px 44px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                borderBottom: "1px solid #e6eaf0",
                paddingBottom: 22,
              }}
            >
              <span
                style={{ fontSize: 21, fontWeight: 800, letterSpacing: -1 }}
              >
                FIELD NOTES<span style={{ color: "#3677ff" }}>®</span>
              </span>
              <span
                style={{
                  fontFamily: mono,
                  color: "#8190a6",
                  fontSize: 13,
                  letterSpacing: 2,
                }}
              >
                DESIGN / MOTION / IDEAS
              </span>
            </div>
            <div
              style={{
                fontFamily: mono,
                fontSize: 13,
                color: "#3677ff",
                marginTop: 37,
                letterSpacing: 2,
              }}
            >
              ISSUE 008 — FIND YOUR RHYTHM
            </div>
            <div
              style={{
                fontSize: 65,
                lineHeight: 1.05,
                fontWeight: 750,
                letterSpacing: -3,
                marginTop: 17,
              }}
            >
              Ideas move.
              <br />
              Move with them.
            </div>
            <div style={{ display: "flex", gap: 22, marginTop: 31 }}>
              {["#acc7f6", "#a4d9dc", "#e6bf96"].map((c, i) => (
                <div key={c} style={{ width: 365, flexShrink: 0 }}>
                  <div
                    style={{
                      height: 218,
                      background: c,
                      borderRadius: 13,
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        width: 180,
                        height: 180,
                        border: "31px solid #ffffff75",
                        borderRadius: i === 1 ? "50%" : 40,
                        left: 80,
                        top: 28,
                        rotate: `${i * 35 - 20}deg`,
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        width: 110,
                        height: 110,
                        background: "#ffffff33",
                        borderRadius: "50%",
                        left: 190,
                        top: 110,
                      }}
                    />
                  </div>
                  <div style={{ fontSize: 25, fontWeight: 750, marginTop: 20 }}>
                    {
                      [
                        "A different perspective",
                        "Less friction. More flow.",
                        "The shape of an idea",
                      ][i]
                    }
                  </div>
                  <div
                    style={{
                      fontSize: 18,
                      color: "#8290a3",
                      lineHeight: 1.6,
                      marginTop: 12,
                    }}
                  >
                    Leave room to explore. The next good idea is always a little
                    further along.
                  </div>
                  <div
                    style={{
                      marginTop: 28,
                      height: 8,
                      background: "#edf0f5",
                      borderRadius: 10,
                    }}
                  />
                  <div
                    style={{
                      marginTop: 13,
                      height: 8,
                      width: "78%",
                      background: "#edf0f5",
                      borderRadius: 10,
                    }}
                  />
                  <div
                    style={{
                      marginTop: 13,
                      height: 8,
                      width: "88%",
                      background: "#edf0f5",
                      borderRadius: 10,
                    }}
                  />
                  <div
                    style={{
                      marginTop: 45,
                      height: 180,
                      borderRadius: 13,
                      background: c,
                      opacity: 0.3,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              right: 8,
              top: 90 - sy * 0.45,
              width: 5,
              height: 115,
              borderRadius: 5,
              background: "#b8c5d7",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 60 - sx * 1.4,
              bottom: 8,
              width: 630,
              height: 5,
              borderRadius: 5,
              background: "#b8c5d7",
            }}
          />
        </div>
        <Cursor
          x={685}
          y={300}
          label={t > 4.2 ? "Horizontal scroll" : "Scroll"}
        />
        <div style={{ position: "absolute", right: 35, top: 23 }}>
          <Pill>{t > 4.2 ? "↔ HORIZONTAL" : "↕ VERTICAL"}</Pill>
        </div>
      </Panel>
      <Footer text="02   /   KEEP YOUR PLACE. EXPLORE EVERY DIRECTION." light />
    </Backdrop>
  );
};
