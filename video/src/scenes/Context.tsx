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
  tween,
  lerp,
  mono,
} from "../design";

export const Context: React.FC = () => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const menu = t > 0.65 && t < 2.05;
  const copied = t >= 2.05;
  const tab = t >= 3;
  return (
    <Backdrop>
      <Chrome chapter="CONTEXT + MIDDLE CLICK" index="04" />
      <Headline
        eyebrow="ALL THE CLICKS YOU COUNT ON."
        first="More than"
        second="a click."
        desc="Open a context menu with R. Middle-click with E to open a new tab."
      />
      <KeyHint
        label={
          t < 2.35 ? "R → right click   ·   Space → choose" : "E → middle click"
        }
      >
        <Key active={t > 0.65 && t < 0.85}>R</Key>
        <Key wide active={t > 1.98 && t < 2.12}>
          Space
        </Key>
        <span style={{ width: 12 }} />
        <Key active={t > 2.98 && t < 3.15}>E</Key>
      </KeyHint>
      <Panel title="Resources — your next starting point">
        <div
          style={{
            height: 49,
            background: "#e5ebf4",
            display: "flex",
            alignItems: "end",
            padding: "0 18px",
            gap: 5,
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "10px 10px 0 0",
              width: 260,
              padding: "12px 18px",
              fontSize: 16,
              fontWeight: 650,
            }}
          >
            ◇ Resources{" "}
            <span style={{ float: "right", color: "#92a0b4" }}>×</span>
          </div>
          {tab ? (
            <div
              style={{
                background: "#f5f8fd",
                borderRadius: "10px 10px 0 0",
                width: 280,
                padding: "12px 18px",
                fontSize: 16,
                fontWeight: 650,
                opacity: tween(t, 3, 3.2),
              }}
            >
              ↗ Interface kit{" "}
              <span style={{ float: "right", color: "#92a0b4" }}>×</span>
            </div>
          ) : null}
        </div>
        <div style={{ padding: "35px 43px", background: "white", height: 540 }}>
          <div
            style={{
              fontFamily: mono,
              fontSize: 13,
              color: "#8b98aa",
              letterSpacing: 2,
            }}
          >
            THE GOOD STUFF, IN ONE PLACE.
          </div>
          <div
            style={{
              fontSize: 41,
              fontWeight: 750,
              letterSpacing: -2,
              marginTop: 19,
            }}
          >
            Ready for your next idea.
          </div>
          <div style={{ display: "flex", marginTop: 29, gap: 24 }}>
            <div
              style={{
                width: 460,
                height: 220,
                padding: 28,
                borderRadius: 15,
                background: "linear-gradient(130deg,#d9e7ff,#b9d4fc)",
                position: "relative",
              }}
            >
              <div style={{ fontSize: 14, color: "#5380b5", fontFamily: mono }}>
                OPEN RESOURCE
              </div>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 750,
                  marginTop: 17,
                  color: "#244f91",
                }}
              >
                Interface kit ↗
              </div>
              <div style={{ fontSize: 18, color: "#6383b0", marginTop: 12 }}>
                The building blocks of a good idea.
              </div>
              <div
                style={{
                  width: 90,
                  height: 90,
                  border: "15px solid #ffffff90",
                  borderRadius: 24,
                  position: "absolute",
                  right: 25,
                  bottom: 20,
                  rotate: "-15deg",
                }}
              />
            </div>
            <div
              style={{
                flex: 1,
                padding: 28,
                borderRadius: 15,
                border: "1px solid #e4eaf3",
              }}
            >
              <div style={{ fontSize: 25, fontWeight: 750 }}>
                Make it yours.
              </div>
              <div
                style={{
                  fontSize: 19,
                  lineHeight: 1.6,
                  marginTop: 16,
                  color: "#8b98aa",
                }}
              >
                Good references.
                <br />
                Fresh perspectives.
                <br />
                Your next starting point.
              </div>
            </div>
          </div>
        </div>
        {menu ? (
          <div
            style={{
              position: "absolute",
              left: 290,
              top: 258,
              width: 370,
              padding: 9,
              borderRadius: 14,
              background: "#f8fafff5",
              boxShadow: "0 18px 50px #233b6040,0 0 0 1px #92a1b54d",
              scale: tween(t, 0.65, 0.85, 0.92, 1),
              transformOrigin: "top left",
              opacity: tween(t, 0.65, 0.8),
              zIndex: 10,
            }}
          >
            {[
              "Open Link in New Tab",
              "Open Link in New Window",
              "Copy Link",
              "Download Linked File",
            ].map((s, i) => (
              <div
                key={s}
                style={{
                  fontSize: 19,
                  padding: "12px 14px",
                  borderRadius: 7,
                  background: t > 1.45 && i === 2 ? C.blue : "transparent",
                  color: t > 1.45 && i === 2 ? "white" : "#394b66",
                  borderTop: i === 2 ? "1px solid #dbe3ee" : "none",
                }}
              >
                {s}
                <span style={{ float: "right", opacity: 0.45 }}>
                  {["↗", "□", "⌘C", "↓"][i]}
                </span>
              </div>
            ))}
          </div>
        ) : null}
        {copied ? (
          <div
            style={{
              position: "absolute",
              left: 43,
              bottom: 35,
              opacity: tween(t, 2.05, 2.2),
            }}
          >
            <Pill>✓ Link copied</Pill>
          </div>
        ) : null}
        <Cursor
          x={lerp(
            t,
            [0, 0.5, 1, 1.5, 2.1, 2.65],
            [600, 290, 315, 380, 380, 290],
          )}
          y={lerp(
            t,
            [0, 0.5, 1, 1.5, 2.1, 2.65],
            [420, 258, 275, 391, 391, 258],
          )}
          press={
            (t > 0.65 && t < 0.8) || (t > 2 && t < 2.13) || (t > 3 && t < 3.14)
          }
          label={tab ? "New tab opened" : undefined}
        />
      </Panel>
      <Footer text="04   /   RIGHT CLICK. MIDDLE CLICK. ALL WITH KEYS." />
    </Backdrop>
  );
};
