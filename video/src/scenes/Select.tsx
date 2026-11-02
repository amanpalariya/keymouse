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

export const Select: React.FC = () => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const amount = tween(t, 1.15, 2.75, 0, 1);
  const double = t > 4.25;
  return (
    <Backdrop>
      <Chrome chapter="SELECT" index="03" />
      <Headline
        eyebrow="FROM A WORD TO THE WHOLE THOUGHT."
        first="Make your"
        second="selection."
        desc="Hold a click key and move to select text. Tap twice to double-click."
      />
      <KeyHint
        label={
          double
            ? "Tap W twice → double-click a word"
            : "Hold Space + L → select text"
        }
      >
        <Key active={t > 1.1 && t < 3.2} wide>
          Space
        </Key>
        <span style={{ fontSize: 30, color: C.muted }}>+</span>
        <Key active={t > 1.15 && t < 2.75}>L</Key>
        <span style={{ width: 10 }} />
        <Key active={(t > 4.25 && t < 4.4) || (t > 4.5 && t < 4.65)}>W</Key>
      </KeyHint>
      <Panel title="Notes — The next big thing">
        <div
          style={{ padding: "34px 48px", height: "100%", background: "#fff" }}
        >
          <div
            style={{
              fontFamily: mono,
              fontSize: 13,
              color: "#9aa5b5",
              letterSpacing: 2,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>QUICK THOUGHTS / 08</span>
            <span>Edited just now</span>
          </div>
          <div
            style={{
              fontSize: 45,
              fontWeight: 750,
              letterSpacing: -2,
              marginTop: 34,
            }}
          >
            The next big thing.
          </div>
          <div
            style={{
              fontSize: 27,
              color: "#6d7c91",
              marginTop: 19,
              lineHeight: 1.7,
            }}
          >
            Good tools get out of your way.
            <br />
            Great tools keep up with your ideas.
          </div>
          <div
            style={{
              position: "relative",
              fontSize: 39,
              fontWeight: 650,
              letterSpacing: -1.5,
              marginTop: 34,
              height: 61,
              whiteSpace: "nowrap",
              lineHeight: "61px",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 4,
                height: 51,
                width: amount * 562,
                background: "#b4d1ff",
                opacity: double ? 0 : 1,
                borderRadius: 3,
              }}
            />
            <span style={{ position: "relative" }}>
              Keep your hands. Keep your flow.
            </span>
          </div>
          <div
            style={{
              position: "relative",
              fontSize: 31,
              color: "#8190a5",
              marginTop: 24,
            }}
          >
            Make every{" "}
            <span
              style={{
                background: double ? "#b4d1ff" : "transparent",
                color: double ? "#182235" : "inherit",
                padding: "3px 0",
              }}
            >
              move
            </span>{" "}
            count.
          </div>
          <div style={{ height: 1, background: "#e9edf4", marginTop: 43 }} />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 25,
            }}
          >
            <Pill>
              {double
                ? "WORD SELECTED"
                : amount === 1
                  ? "TEXT SELECTED"
                  : "READY TO SELECT"}
            </Pill>
            <span style={{ fontSize: 16, color: "#9aa5b5" }}>
              All changes saved ✓
            </span>
          </div>
        </div>
        <Cursor
          x={lerp(
            t,
            [0, 0.8, 1.15, 2.75, 3.4, 4.1],
            [600, 48, 48, 610, 610, 254],
          )}
          y={lerp(t, [0, 0.8, 3.4, 4.1], [415, 318, 318, 397])}
          press={
            (t > 1.1 && t < 1.26) ||
            (t > 4.25 && t < 4.4) ||
            (t > 4.5 && t < 4.65)
          }
          label={
            double
              ? "Double-click"
              : t > 1.1 && t < 3.2
                ? "Selecting"
                : undefined
          }
        />
      </Panel>
      <Footer text="03   /   SELECT TEXT. DOUBLE-CLICK WORDS." />
    </Backdrop>
  );
};
