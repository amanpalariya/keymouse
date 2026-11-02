import React, { useEffect, useRef, useState } from "react";
import {
  cancelRender,
  continueRender,
  delayRender,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, Cursor, fontsReady, Key, lerp, tween } from "../design";
import { Stage } from "../stage";
import { BrowserFrame } from "../BrowserFrame";
import { MouseVisual } from "../MouseVisual";

const TEXT_LEFT = 310;
const AssetCard: React.FC<{
  title: string;
  color: string;
  style?: React.CSSProperties;
}> = ({ title, color, style }) => (
  <div
    style={{
      position: "absolute",
      width: 420,
      height: 210,
      borderRadius: 22,
      border: "1px solid #679bd655",
      background: `linear-gradient(135deg,${color},#162a40)`,
      padding: 27,
      ...style,
    }}
  >
    <div
      style={{
        width: 76,
        height: 76,
        border: "14px solid #a6d8ff77",
        borderRadius: 19,
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
        fontSize: 27,
        fontWeight: 650,
        color: "#b6d9ff",
      }}
    >
      {title}
    </div>
  </div>
);

export const Clicks: React.FC<{ offset?: number }> = ({ offset = 0 }) => {
  const t = useCurrentFrame() / useVideoConfig().fps + offset;
  const wordRef = useRef<HTMLSpanElement>(null);
  const [handle] = useState(() => delayRender("Measure the selected word"));
  const [wordX, setWordX] = useState(730);
  useEffect(() => {
    let live = true;
    fontsReady
      .then(() => {
        if (!live) return;
        const word = wordRef.current;
        if (!word) throw new Error("Selection word not mounted");
        setWordX(TEXT_LEFT + word.offsetLeft + word.offsetWidth * 0.55);
        continueRender(handle);
      })
      .catch(cancelRender);
    return () => {
      live = false;
    };
  }, [handle]);
  const space =
    (t > 1.1 && t < 1.45) || (t > 3.4 && t < 3.65) || (t > 3.8 && t < 4.05);
  const right = (t > 7.1 && t < 7.9) || (t > 11.2 && t < 12);
  const middle = t > 15.4 && t < 15.8;
  const wordSelected = t >= 3.8;
  const menuWord = t >= 7.1 && t < 9.5;
  const menuAsset = t >= 11.2 && t < 13.8;
  let x: number, y: number;
  if (t < 2.7) {
    x = lerp(t, [0, 0.8], [1450, 265]);
    y = lerp(t, [0, 0.8], [800, 503]);
  } else if (t < 9.5) {
    x = lerp(t, [2.7, 3.2], [265, wordX]);
    y = lerp(t, [2.7, 3.2], [503, 535]);
  } else if (t < 13.8) {
    x = lerp(t, [9.5, 10.5], [wordX, 620]);
    y = lerp(t, [9.5, 10.5], [535, 720]);
  } else {
    x = lerp(t, [13.8, 14.8], [620, 430]);
    y = lerp(t, [13.8, 14.8], [720, 810]);
  }
  const mouseWord = tween(t, 6.7, 7.1) * (1 - tween(t, 9.3, 9.6));
  const mouseAsset = tween(t, 10.8, 11.2) * (1 - tween(t, 13.6, 14));
  const normalX = x + 205,
    normalY = 630 + (y - 535) * (-10 / 275);
  const mouseX =
    normalX * (1 - mouseWord - mouseAsset) +
    (wordX - 190) * mouseWord +
    430 * mouseAsset;
  const mouseY =
    normalY * (1 - mouseWord - mouseAsset) + 570 * mouseWord + 680 * mouseAsset;
  const flight = lerp(t, [15.4, 16.65], [0, 1]);
  return (
    <Stage demo>
      <BrowserFrame
        assetsProgress={tween(t, 16.25, 16.9)}
        loading={tween(t, 16.6, 17.5)}
      />
      <div
        style={{
          position: "absolute",
          left: 240,
          top: 478,
          width: 50,
          height: 50,
          borderRadius: 12,
          border: t >= 1.1 ? "2px solid #85d9bd" : "2px solid #6488b1",
          background: t >= 1.1 ? "#285d51" : "#162b43",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 34,
          color: "#b3f5dd",
        }}
      >
        {t >= 1.1 ? "✓" : ""}
      </div>
      <div
        style={{
          position: "absolute",
          left: TEXT_LEFT,
          top: 450,
          fontSize: 86,
          fontWeight: 650,
          letterSpacing: -4.2,
          lineHeight: "112px",
          whiteSpace: "nowrap",
        }}
      >
        Ready to{" "}
        <span
          ref={wordRef}
          style={{
            position: "relative",
            display: "inline-block",
            background: wordSelected ? "#8ac2ff" : "transparent",
            color: wordSelected ? "#112845" : C.ink,
            borderRadius: 4,
          }}
        >
          ship.
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          left: TEXT_LEFT,
          top: 588,
          fontSize: 22,
          color: "#7893b4",
        }}
      >
        Release checklist{" "}
        <span
          style={{ marginLeft: 24, color: t >= 1.1 ? "#8fd7be" : "#617e9f" }}
        >
          {t >= 1.1 ? "3 of 3 ready" : "2 of 3 ready"}
        </span>
      </div>
      <AssetCard
        title="Launch assets ↗"
        color="#234879"
        style={{
          left: 310,
          top: 655,
          border: t > 13.8 ? "1px solid #a1d3ff" : "1px solid #679bd655",
        }}
      />
      <AssetCard
        title="Keyboard guide"
        color="#243b50"
        style={{ left: 780, top: 655, opacity: 0.6 }}
      />
      <AssetCard
        title="Preview build"
        color="#343454"
        style={{ left: 1250, top: 655, opacity: 0.6 }}
      />
      <div
        style={{
          position: "absolute",
          left: 310,
          top: 915,
          width: 1360,
          borderTop: "1px solid #39516e66",
          paddingTop: 22,
          display: "flex",
          justifyContent: "space-between",
          fontSize: 19,
          color: "#6f88a7",
        }}
      >
        <span>Release v1.0</span>
        <span>Guide ready · Assets reviewed · Preview built</span>
        <span>Updated just now</span>
      </div>
      {menuWord || menuAsset ? (
        <div
          style={{
            position: "absolute",
            left: menuWord ? wordX : 620,
            top: menuWord ? 535 : 705,
            width: 440,
            padding: 11,
            borderRadius: 17,
            background: "#1b2d44",
            color: "#d5e6fa",
            border: "1px solid #7093b359",
            boxShadow: "0 22px 65px #0007",
            opacity: menuWord
              ? 1 - tween(t, 9.3, 9.5)
              : 1 - tween(t, 13.6, 13.8),
            zIndex: 20,
          }}
        >
          {(menuWord
            ? ["Copy", "Look Up", "Search the Web"]
            : ["Open Link in New Tab", "Copy Link", "Save Link"]
          ).map((label, i) => (
            <div
              key={label}
              style={{
                padding: "16px 18px",
                height: 59,
                borderRadius: 8,
                fontSize: 23,
                borderTop: i === 1 ? "1px solid #6684a325" : undefined,
              }}
            >
              {label}
              <span style={{ float: "right", opacity: 0.35 }}>
                {i === 0 ? (menuWord ? "⌘C" : "↗") : "⋯"}
              </span>
            </div>
          ))}
        </div>
      ) : null}
      <div
        style={{
          position: "absolute",
          left: mouseX,
          top: mouseY,
          scale: 0.65,
          transformOrigin: "top left",
          rotate: "-9deg",
          zIndex: 25,
        }}
      >
        <MouseVisual
          left={space}
          middle={middle || (t >= 15.8 && t < 16.65)}
          right={right}
        />
      </div>
      {t >= 15.4 && t < 16.9 ? (
        <div
          style={{
            position: "absolute",
            left: 310 + 228 * flight + Math.sin(flight * Math.PI) * 80,
            top: 655 - 379 * flight - Math.sin(flight * Math.PI) * 110,
            width: 420 - 80 * flight,
            height: 210 - 159 * flight,
            borderRadius: 22 - 9 * flight,
            background: "linear-gradient(135deg,#2c527c,#1b314b)",
            border: "1px solid #9bd8ff",
            boxShadow: "0 25px 45px #0006",
            rotate: `${-8 * (1 - flight)}deg`,
            opacity: 1 - tween(t, 16.55, 16.9),
            zIndex: 60,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 38,
              top: 30,
              width: 76,
              height: 76,
              border: "14px solid #a6d8ff",
              borderRadius: 19,
              opacity: 1 - flight,
              rotate: "-14deg",
            }}
          />
          <span
            style={{
              position: "absolute",
              left: 27 + 28 * flight,
              bottom: 25 - 10 * flight,
              fontSize: 29 - 7 * flight,
              fontWeight: 650,
              color: "#d5e9ff",
              whiteSpace: "nowrap",
            }}
          >
            Launch assets
          </span>
        </div>
      ) : null}
      <Cursor
        x={x}
        y={y}
        size={53}
        light
        pressed={space ? ["Space"] : right ? ["R"] : middle ? ["E"] : []}
        press={space || right || middle}
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
            background: "#0b182bef",
            backdropFilter: "blur(18px)",
            border: "1px solid #7198c543",
            boxShadow: "0 12px 50px #0005",
            borderRadius: 27,
          }}
        >
          {[
            { label: "Left", key: "Space", active: space },
            { label: "Middle", key: "E", active: middle },
            { label: "Right", key: "R", active: right },
          ].map((button) => (
            <div
              key={button.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 17,
                opacity: button.active ? 1 : 0.65,
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
