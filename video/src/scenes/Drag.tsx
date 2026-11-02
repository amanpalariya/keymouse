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
  mono,
  tween,
  lerp,
} from "../design";

export const Drag: React.FC = () => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const dx = lerp(t, [1.25, 3.6], [0, 640]);
  const lifted = t > 0.85 && t < 3.9;
  const done = t >= 3.9;
  return (
    <Backdrop light>
      <Chrome chapter="DRAG + DROP" index="05" light />
      <Headline
        eyebrow="PICK IT UP. PUT IT ANYWHERE."
        first="Hold."
        second="Move. Drop."
        desc="Drag files, move windows, or take a task from idea to done."
        light
      />
      <KeyHint
        label={
          done ? "Release Space → drop" : "Hold Space + movement keys → drag"
        }
        light
      >
        <Key active={lifted} wide light>
          Space
        </Key>
        <span style={{ fontSize: 30, color: "#8190a6" }}>+</span>
        <Key active={t > 1.25 && t < 3.6} light>
          L
        </Key>
        <Key active={t > 1.25 && t < 2.35} light>
          F
        </Key>
      </KeyHint>
      <Panel title="Launch board">
        <div
          style={{ padding: "29px 30px", height: "100%", background: "#fff" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 24,
            }}
          >
            <div style={{ fontSize: 30, fontWeight: 750, letterSpacing: -1 }}>
              Good work, in motion.
            </div>
            <Pill>PRODUCT LAUNCH</Pill>
          </div>
          <div style={{ display: "flex", gap: 25 }}>
            {["Ideas", "In progress", "Done"].map((s, i) => (
              <div
                key={s}
                style={{
                  width: 300,
                  height: 417,
                  borderRadius: 15,
                  background: i === 2 && lifted ? "#e8f0ff" : "#f1f4f9",
                  border:
                    i === 2 && lifted
                      ? "2px dashed #77a9ff"
                      : "2px solid transparent",
                  padding: "20px 17px",
                }}
              >
                <div
                  style={{
                    fontSize: 17,
                    fontWeight: 750,
                    color: "#7a89a0",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>
                    <span
                      style={{
                        display: "inline-block",
                        height: 9,
                        width: 9,
                        borderRadius: "50%",
                        background: ["#acb6c7", "#e4b85c", "#58cbaa"][i],
                        marginRight: 10,
                      }}
                    />
                    {s}
                  </span>
                  <span>
                    {i === 0
                      ? done
                        ? "01"
                        : "02"
                      : i === 2
                        ? done
                          ? "02"
                          : "01"
                        : "01"}
                  </span>
                </div>
                <div
                  style={{
                    marginTop: i === 0 ? 155 : 22,
                    padding: 20,
                    background: "#fff",
                    borderRadius: 11,
                    border: "1px solid #e4eaf2",
                  }}
                >
                  <div
                    style={{
                      height: 7,
                      background: "#dfe6ef",
                      width: "85%",
                      borderRadius: 4,
                    }}
                  />
                  <div
                    style={{
                      height: 7,
                      background: "#e9edf4",
                      width: "60%",
                      borderRadius: 4,
                      marginTop: 12,
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: 25,
                    }}
                  >
                    <span
                      style={{
                        height: 17,
                        width: 53,
                        background: ["#e4eaff", "#fff0d9", "#dcf1e8"][i],
                        borderRadius: 5,
                      }}
                    />
                    <span
                      style={{
                        width: 21,
                        height: 21,
                        borderRadius: "50%",
                        background: "#d5dfed",
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              position: "absolute",
              left: 49 + dx,
              top:
                160 -
                (lifted
                  ? 18 * Math.sin((tween(t, 0.85, 1.15) * Math.PI) / 2)
                  : 0),
              width: 263,
              height: 139,
              borderRadius: 12,
              background: done ? "#eff9f4" : "white",
              border: `1px solid ${done ? "#85d1b0" : lifted ? "#7eacfa" : "#dfe6f0"}`,
              padding: 20,
              boxShadow: lifted
                ? "0 22px 35px #17315d30"
                : "0 3px 8px #1b35560a",
              rotate: lifted ? `${-3 + Math.sin(t * 3) * 1.3}deg` : "0deg",
              zIndex: 20,
            }}
          >
            <div style={{ fontSize: 22, fontWeight: 750, letterSpacing: -0.6 }}>
              Launch video{" "}
              <span
                style={{ float: "right", color: done ? "#41a77c" : "#9ba9bc" }}
              >
                {done ? "✓" : "↗"}
              </span>
            </div>
            <div
              style={{
                fontFamily: mono,
                fontSize: 12,
                color: "#8b98aa",
                marginTop: 12,
              }}
            >
              MAKE SOMETHING MOVE.
            </div>
            <div style={{ marginTop: 16, display: "flex", gap: 7 }}>
              <Pill
                style={{
                  fontSize: 11,
                  padding: "5px 9px",
                  background: done ? "#daf0e5" : undefined,
                  color: done ? "#2f9168" : undefined,
                }}
              >
                {done ? "SHIPPED" : "DESIGN"}
              </Pill>
              <span
                style={{
                  marginLeft: "auto",
                  width: 23,
                  height: 23,
                  borderRadius: "50%",
                  background: "#c1d7f5",
                  fontSize: 11,
                  textAlign: "center",
                  paddingTop: 4,
                }}
              >
                K
              </span>
            </div>
          </div>
        </div>
        <Cursor
          x={lerp(t, [0, 0.7, 1.25, 3.6], [600, 185, 185, 825])}
          y={lerp(t, [0, 0.7, 1.25, 2.5, 3.6], [450, 215, 215, 177, 215])}
          press={t > 0.85 && t < 1.02}
          label={done ? "Dropped ✓" : lifted ? "Dragging" : undefined}
        />
        {done ? (
          <div
            style={{
              position: "absolute",
              right: 40,
              bottom: 27,
              opacity: tween(t, 3.9, 4.2),
            }}
          >
            <Pill style={{ background: "#daf0e5", color: "#2f9168" }}>
              ✓ Idea → Done
            </Pill>
          </div>
        ) : null}
      </Panel>
      <Footer text="05   /   A CLEAN PICKUP. A PRECISE LANDING." light />
    </Backdrop>
  );
};
