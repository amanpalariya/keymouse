import React, { useEffect, useRef, useState } from "react";
import {
  cancelRender,
  continueRender,
  delayRender,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, Cursor, fontsReady, Key, lerp, tween } from "../design";
import { AppWindow, Stage } from "../stage";
import { MouseVisual } from "../MouseVisual";

const TEXT_LEFT = 310;
const TEXT_TOP = 450;

export const Clicks: React.FC<{ offset?: number }> = ({ offset = 0 }) => {
  const t = (useCurrentFrame() / useVideoConfig().fps) * (5 / 7) + offset;
  const sentenceRef = useRef<HTMLSpanElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const [handle] = useState(() => delayRender("Measure selection geometry"));
  const [metrics, setMetrics] = useState({ width: 1100, wordX: 730 });
  useEffect(() => {
    let live = true;
    fontsReady
      .then(() => {
        if (!live) return;
        const sentence = sentenceRef.current;
        const word = wordRef.current;
        if (!sentence || !word) throw new Error("Selection text did not mount");
        setMetrics({
          width: sentence.offsetWidth,
          wordX: TEXT_LEFT + word.offsetLeft + word.offsetWidth * 0.55,
        });
        continueRender(handle);
      })
      .catch(cancelRender);
    return () => {
      live = false;
    };
  }, [handle]);

  const progress = lerp(t, [1.15, 2.75], [0, 1]);
  // The highlight and cursor share the exact same eased position, including the hotspot.
  const selectionX = TEXT_LEFT + metrics.width * progress;
  const selectionWidth = selectionX - TEXT_LEFT;
  const double = t >= 4.5;
  const menu = t >= 6.65 && t < 8.05;
  const tabOpen = t >= 9;
  const space =
    (t > 1.1 && t < 3.2) ||
    (t > 4.25 && t < 4.4) ||
    (t > 4.5 && t < 4.65) ||
    (t > 8.0 && t < 8.16);
  const right = t > 6.65 && t < 6.9;
  const middle = t > 9 && t < 9.22;
  const title =
    t < 0.8
      ? "Click."
      : t < 3.7
        ? "Select."
        : t < 6
          ? "Double-click."
          : t < 8.5
            ? "Right-click."
            : "Middle-click.";
  let x: number;
  let y: number;
  let pressed: string[] = [];
  if (t < 1.15) {
    x = lerp(t, [0, 0.8], [1450, TEXT_LEFT]);
    y = lerp(t, [0, 0.8], [800, 535]);
    if (t > 0.05 && t < 0.8) pressed = ["←", "↑"];
  } else if (t < 3.4) {
    x = selectionX;
    y = 535;
    if (t < 3.2) pressed = t < 2.75 ? ["Space", "→"] : ["Space"];
  } else if (t < 6.65) {
    x = lerp(t, [3.4, 4.1], [TEXT_LEFT + metrics.width, metrics.wordX]);
    y = lerp(t, [3.4, 4.1], [535, 535]);
    if (t < 4.1) pressed = ["←"];
    else if (space) pressed = ["Space"];
  } else if (t < 8.15) {
    x = lerp(t, [6.9, 7.35], [metrics.wordX, metrics.wordX + 140]);
    y = lerp(t, [6.9, 7.35], [535, 575]);
    if (right) pressed = ["R"];
    else if (t < 7.35) pressed = ["→", "↓"];
    else if (space) pressed = ["Space"];
  } else {
    x = lerp(t, [8.15, 8.75], [metrics.wordX + 140, 430]);
    y = lerp(t, [8.15, 8.75], [575, 810]);
    if (t < 8.75) pressed = ["←", "↓"];
    else if (middle) pressed = ["E"];
  }

  return (
    <Stage title={title}>
      <AppWindow title="Browser" />
      <div
        style={{
          position: "absolute",
          left: 191,
          top: 265,
          width: 1538,
          height: 62,
          background: "#152239",
          display: "flex",
          alignItems: "end",
          gap: 8,
          padding: "0 29px",
        }}
      >
        <div
          style={{
            height: 51,
            width: 310,
            borderRadius: "13px 13px 0 0",
            background: "#23354e",
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "0 19px",
            fontSize: 22,
            fontWeight: 650,
          }}
        >
          <span
            style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              background: "#6cabf5",
              color: "#142d4b",
              textAlign: "center",
              fontSize: 16,
              paddingTop: 2,
            }}
          >
            N
          </span>
          Notes<span style={{ marginLeft: "auto", opacity: 0.4 }}>×</span>
        </div>
        {tabOpen ? (
          <div
            data-new-tab
            style={{
              height: 51,
              width: tween(t, 9, 9.45, 0, 340),
              borderRadius: "13px 13px 0 0",
              background: "#1c304a",
              border: "1px solid #8dc9ff80",
              borderBottom: "none",
              overflow: "hidden",
              position: "relative",
              opacity: tween(t, 9, 9.12),
              translate: `0 ${tween(t, 9, 9.4, 15, 0)}px`,
            }}
          >
            <div
              style={{
                width: 338,
                height: 50,
                display: "flex",
                alignItems: "center",
                gap: 13,
                padding: "0 19px",
                fontSize: 22,
                color: "#d5e9ff",
                fontWeight: 650,
              }}
            >
              <span
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  background: "#b3a8ec",
                  color: "#282f5a",
                  textAlign: "center",
                  fontSize: 17,
                }}
              >
                ↗
              </span>
              Interface kit
              <span style={{ marginLeft: "auto", opacity: 0.4 }}>×</span>
            </div>
            <div
              style={{
                position: "absolute",
                left: 0,
                bottom: 0,
                height: 3,
                width: `${tween(t, 9, 9.7, 0, 100)}%`,
                background: C.cyan,
              }}
            />
          </div>
        ) : null}
        <div
          style={{
            padding: "0 17px 13px",
            fontSize: 30,
            color: "#8ba2c1",
            opacity: 0.65,
          }}
        >
          +
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 191,
          top: 327,
          width: 1538,
          height: 61,
          background: "#23354e",
          display: "flex",
          alignItems: "center",
          padding: "0 30px",
          gap: 24,
          color: "#849ab7",
        }}
      >
        <span style={{ fontSize: 27 }}>←</span>
        <span style={{ fontSize: 27, opacity: 0.35 }}>→</span>
        <span style={{ fontSize: 25 }}>↻</span>
        <div
          style={{
            height: 36,
            flex: 1,
            borderRadius: 10,
            background: "#142238",
            display: "flex",
            alignItems: "center",
            padding: "0 20px",
            fontSize: 18,
          }}
        >
          ◇ <span style={{ marginLeft: 14 }}>workspace.local/notes</span>
        </div>
        <span style={{ fontSize: 25 }}>⋯</span>
      </div>
      <div
        style={{
          position: "absolute",
          left: TEXT_LEFT,
          top: TEXT_TOP,
          fontSize: 86,
          fontWeight: 650,
          letterSpacing: -4.2,
          lineHeight: "112px",
        }}
      >
        <div
          data-selection
          style={{
            position: "absolute",
            left: 0,
            top: 8,
            height: 102,
            width: selectionWidth,
            background: "#8ac2ff",
            opacity: double ? 0 : 1,
            borderRadius: 5,
          }}
        />
        <span
          ref={sentenceRef}
          style={{
            position: "relative",
            display: "inline-block",
            whiteSpace: "nowrap",
            color: C.ink,
          }}
        >
          Make it{" "}
          <span
            ref={wordRef}
            style={{
              position: "relative",
              display: "inline-block",
              background: double ? "#8ac2ff" : "transparent",
              color: double ? "#112845" : undefined,
              borderRadius: 4,
            }}
          >
            move.
          </span>
        </span>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            whiteSpace: "nowrap",
            color: "#112845",
            clipPath: `inset(0 ${100 - progress * 100}% 0 0)`,
            opacity: double ? 0 : 1,
          }}
        >
          Make it move.
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: TEXT_LEFT,
          top: 655,
          width: 420,
          height: 210,
          borderRadius: 22,
          border: "1px solid #679bd677",
          background: "linear-gradient(135deg,#234879,#17304c)",
          padding: 27,
          boxShadow: "0 16px 35px #0003",
        }}
      >
        <div
          style={{
            width: 86,
            height: 86,
            border: "16px solid #a6d8ff",
            borderRadius: 20,
            rotate: "-14deg",
            marginLeft: 12,
            marginTop: 4,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 27,
            bottom: 25,
            fontSize: 29,
            fontWeight: 650,
            color: "#b6d9ff",
            textDecoration: t >= 8.6 ? "underline" : undefined,
          }}
        >
          Interface kit ↗
        </div>
      </div>
      <div
        style={{ position: "absolute", left: 1400, top: 465, rotate: "-9deg" }}
      >
        <MouseVisual left={space} middle={middle} right={right} />
      </div>
      {menu ? (
        <div
          style={{
            position: "absolute",
            left: metrics.wordX,
            top: 535,
            width: 420,
            padding: 10,
            borderRadius: 17,
            background: "#f2f6ff",
            color: "#273d5a",
            boxShadow: "0 22px 65px #0006",
            opacity: tween(t, 6.65, 6.8),
            scale: tween(t, 6.65, 6.85, 0.94, 1),
            transformOrigin: "top left",
            zIndex: 20,
          }}
        >
          {["Copy", "Look Up", "Search the Web"].map((label, i) => (
            <div
              key={label}
              style={{
                padding: "16px 19px",
                height: 59,
                borderRadius: 8,
                fontSize: 24,
                background: i === 0 && t >= 7.35 ? C.blue : undefined,
                color: i === 0 && t >= 7.35 ? "white" : undefined,
              }}
            >
              {label}
              <span style={{ float: "right", opacity: 0.4 }}>
                {i === 0 ? "⌘C" : "↗"}
              </span>
            </div>
          ))}
        </div>
      ) : null}
      {t >= 8.05 && t < 8.6 ? (
        <div
          style={{
            position: "absolute",
            left: metrics.wordX + 80,
            top: 615,
            fontSize: 25,
            color: C.cyan,
            opacity: 1 - tween(t, 8.35, 8.6),
          }}
        >
          Copied ✓
        </div>
      ) : null}
      <Cursor
        x={x}
        y={y}
        size={53}
        light={!menu}
        pressed={pressed}
        press={(space && !(t > 1.27 && t < 3.2)) || right || middle}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 30,
          display: "flex",
          justifyContent: "center",
          zIndex: 50,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 42,
            padding: "18px 30px 24px",
            background: "#0b182beF",
            backdropFilter: "blur(18px)",
            border: "1px solid #7198c543",
            boxShadow: "0 12px 50px #0005",
            borderRadius: 27,
          }}
        >
          {[
            { label: "Left", key: "Space", active: space, button: 0 },
            { label: "Middle", key: "E", active: middle, button: 1 },
            { label: "Right", key: "R", active: right, button: 2 },
          ].map((button) => (
            <div
              key={button.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 17,
                opacity: button.active ? 1 : 0.72,
              }}
            >
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 650,
                  minWidth: 63,
                  color: button.active ? C.cyan : C.ink,
                }}
              >
                {button.label}
              </div>
              <Key active={button.active} wide={button.key === "Space"}>
                {button.key}
              </Key>
            </div>
          ))}
        </div>
      </div>
    </Stage>
  );
};
