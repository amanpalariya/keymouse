import React, { useEffect, useRef, useState } from "react";
import {
  CanvasImage,
  cancelRender,
  continueRender,
  delayRender,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Cursor, Key, lerp, tween, fontsReady, inputFeedback } from "../design";
import { Stage, InputDock } from "../stage";
import { BrowserFrame } from "../BrowserFrame";

// A minimal reading view based on the real Wikipedia article and photograph.
const Z = 1538 / 1280;
const X = (x: number) => 191 + x * Z;
const Y = (y: number) => 388 + y * Z;
const TahoePhoto: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const { fps } = useVideoConfig();
  return (
    <CanvasImage
      src={staticFile("tahoe-reference.jpg")}
      premountFor={fps}
      style={style}
    />
  );
};
const PhotoThumb: React.FC = () => (
  <TahoePhoto
    style={{ width: 63, height: 42, objectFit: "cover", borderRadius: 5 }}
  />
);
type Rect = { x: number; y: number; width: number; height: number };
type ArticleRefs = {
  factRef: React.RefObject<HTMLSpanElement | null>;
  linkRef: React.RefObject<HTMLSpanElement | null>;
  photoRef: React.RefObject<HTMLDivElement | null>;
  rootRef: React.RefObject<HTMLDivElement | null>;
};
const Article: React.FC<ArticleRefs> = ({
  factRef,
  linkRef,
  photoRef,
  rootRef,
}) => (
  <div
    style={{
      position: "absolute",
      left: 191,
      top: 388,
      width: 1538,
      height: 900,
      overflow: "hidden",
      background: "#171b21",
    }}
  >
    <div
      ref={rootRef}
      style={{
        position: "relative",
        width: 1280,
        height: 750,
        scale: Z,
        transformOrigin: "top left",
        color: "#dce1e8",
      }}
    >
      <div
        style={{
          height: 80,
          margin: "0 72px",
          display: "flex",
          alignItems: "center",
          gap: 40,
          borderBottom: "1px solid #414853",
        }}
      >
        <div
          style={{
            fontFamily: "Georgia,serif",
            fontSize: 24,
            lineHeight: 1,
            letterSpacing: 0.8,
          }}
        >
          WIKIPEDIA
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            fontSize: 16,
            lineHeight: "24px",
            color: "#8591a2",
          }}
        >
          <span style={{ color: "#c6d7ef" }}>Article</span>
          <span>Discussion</span>
        </div>
        <div
          style={{
            marginLeft: "auto",
            width: 270,
            height: 40,
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "0 12px",
            border: "1px solid #414853",
            borderRadius: 6,
            background: "#20252d",
            color: "#8793a3",
            fontSize: 16,
            lineHeight: "24px",
          }}
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 22 22"
            fill="none"
            stroke="#8793a3"
            strokeWidth="1.5"
          >
            <circle cx="9" cy="9" r="6" />
            <path d="M14 14L20 20" />
          </svg>
          Search Wikipedia
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0,1.25fr) minmax(0,1fr)",
          gap: 48,
          padding: "32px 72px",
          alignItems: "start",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "Georgia,serif",
              fontSize: 46,
              lineHeight: "56px",
              color: "#f0f2f6",
            }}
          >
            Lake Tahoe
          </div>
          <div
            style={{
              fontSize: 16,
              lineHeight: "24px",
              color: "#8e99a8",
              marginTop: 12,
            }}
          >
            From Wikipedia, the free encyclopedia
          </div>
          <div style={{ marginTop: 24, fontSize: 20, lineHeight: "32px" }}>
            Lake Tahoe is a freshwater lake in the{" "}
            <span style={{ color: "#a3bde8" }}>Sierra Nevada</span>, on the
            border of California and Nevada.
          </div>
          <div
            style={{
              marginTop: 14,
              fontSize: 20,
              lineHeight: "32px",
              color: "#b7c0cc",
            }}
          >
            It is known for clear water and surrounding mountains.
          </div>
          <div
            style={{
              marginTop: 28,
              padding: "8px 0",
              borderTop: "1px solid #414853",
              borderBottom: "1px solid #414853",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                alignItems: "baseline",
                height: 52,
                paddingTop: 12,
                lineHeight: "28px",
              }}
            >
              <span style={{ fontSize: 18, color: "#8e99a8" }}>
                Maximum depth
              </span>
              <span
                ref={factRef}
                style={{
                  fontSize: 20,
                  whiteSpace: "nowrap",
                  justifySelf: "start",
                }}
              >
                1,645 ft (501 m)
              </span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                alignItems: "baseline",
                height: 52,
                paddingTop: 12,
                lineHeight: "28px",
              }}
            >
              <span style={{ fontSize: 18, color: "#8e99a8" }}>
                Compare with
              </span>
              <span
                ref={linkRef}
                style={{ fontSize: 20, color: "#a3bde8", justifySelf: "start" }}
              >
                Crater Lake
              </span>
            </div>
          </div>
          <div
            style={{
              marginTop: 22,
              fontSize: 20,
              lineHeight: "32px",
              color: "#b7c0cc",
            }}
          >
            The lake formed about two million years ago, and its present extent
            was shaped during the ice ages. Forests and mountain slopes surround
            the shoreline.
          </div>
          <div style={{ marginTop: 18, fontSize: 20, lineHeight: "32px" }}>
            Lakeside communities offer access to hiking, winter sports, and
            recreation on the water throughout the year.
          </div>
        </div>
        <div>
          <div ref={photoRef}>
            <TahoePhoto
              style={{
                width: "100%",
                height: 420,
                objectFit: "cover",
                borderRadius: 8,
              }}
            />
          </div>
          <div
            style={{
              marginTop: 14,
              fontSize: 15,
              lineHeight: "24px",
              color: "#8e99a8",
            }}
          >
            Lake Tahoe, seen from the west shore
          </div>
        </div>
      </div>
    </div>
  </div>
);

const measure = (element: HTMLElement, root: HTMLElement): Rect => {
  let x = 0,
    y = 0,
    node: HTMLElement | null = element;
  while (node && node !== root) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x, y, width: element.offsetWidth, height: element.offsetHeight };
};

export const Clicks: React.FC<{ offset?: number }> = ({ offset = 0 }) => {
  const t = useCurrentFrame() / useVideoConfig().fps + offset;
  const factRef = useRef<HTMLSpanElement>(null);
  const linkRef = useRef<HTMLSpanElement>(null),
    photoRef = useRef<HTMLDivElement>(null),
    rootRef = useRef<HTMLDivElement>(null);
  const [targets, setTargets] = useState<{
    fact: Rect;
    link: Rect;
    photo: Rect;
  }>({
    fact: { x: 374, y: 418, width: 150, height: 28 },
    link: { x: 374, y: 470, width: 100, height: 28 },
    photo: { x: 724, y: 112, width: 484, height: 420 },
  });
  const fact = targets.fact,
    link = targets.link,
    photo = targets.photo;
  const copyMenu = { x: X(fact.x + fact.width - 10), y: Y(fact.y - 128) };
  const imagePoint = {
    x: X(photo.x + photo.width * 0.5),
    y: Y(photo.y + photo.height * 0.65),
  };
  const imageMenu = { x: imagePoint.x - 90, y: imagePoint.y - 190 };
  const [handle] = useState(() => delayRender("Measure the selected fact"));
  useEffect(() => {
    let live = true;
    fontsReady
      .then(() => {
        if (!live) return;
        if (
          !factRef.current ||
          !linkRef.current ||
          !photoRef.current ||
          !rootRef.current
        )
          throw new Error("Article targets not mounted");
        setTargets({
          fact: measure(factRef.current, rootRef.current),
          link: measure(linkRef.current, rootRef.current),
          photo: measure(photoRef.current, rootRef.current),
        });
        continueRender(handle);
      })
      .catch(cancelRender);
    return () => {
      live = false;
    };
  }, [handle]);
  const feedback = inputFeedback(t, [
    { start: 2, end: 3.4, keys: ["Space"] },
    { start: 5, end: 5.6, keys: ["R"] },
    { start: 7.4, end: 7.7, keys: ["Space"] },
    { start: 10.5, end: 11.1, keys: ["R"] },
    { start: 13.4, end: 13.7, keys: ["Space"] },
    { start: 15.2, end: 15.5, keys: ["Space"] },
    { start: 20, end: 20.6, keys: ["E"] },
  ]);
  const selecting = t > 2 && t < 3.4;
  const space =
    selecting ||
    (t > 7.4 && t < 7.7) ||
    (t > 13.4 && t < 13.7) ||
    (t > 15.2 && t < 15.5);
  const right = (t > 5 && t < 5.6) || (t > 10.5 && t < 11.1);
  const middle = t > 20 && t < 20.6;
  const selection = lerp(t, [2, 3.4], [0, 1]);
  const menuText = t >= 5 && t < 7.4;
  const menuImage = t >= 10.5 && t < 13.4;
  const dialog = t >= 13.4 && t < 15.45;
  const flight = tween(t, 20, 21.5);
  const xs = [
    X(900),
    X(fact.x),
    X(fact.x),
    X(fact.x + fact.width),
    X(fact.x + fact.width),
    copyMenu.x + 60,
    copyMenu.x + 60,
    imagePoint.x,
    imagePoint.x,
    imageMenu.x + 65,
    imageMenu.x + 65,
    1270,
    1270,
    X(link.x + link.width / 2),
  ];
  const ys = [
    Y(520),
    Y(fact.y + fact.height / 2),
    Y(fact.y + fact.height / 2),
    Y(fact.y + fact.height / 2),
    Y(fact.y + fact.height / 2),
    copyMenu.y + 35,
    copyMenu.y + 35,
    imagePoint.y,
    imagePoint.y,
    imageMenu.y + 86,
    imageMenu.y + 86,
    828,
    828,
    Y(link.y + link.height / 2),
  ];
  const times = [
    0, 1.3, 2, 3.4, 6.4, 7.1, 8.5, 9.8, 12.5, 13.1, 14, 14.8, 18.8, 19.5,
  ];
  return (
    <Stage demo>
      <BrowserFrame
        assetsProgress={tween(t, 20.85, 21.6)}
        loading={tween(t, 21.2, 22.2)}
      />
      <Article
        factRef={factRef}
        linkRef={linkRef}
        photoRef={photoRef}
        rootRef={rootRef}
      />
      {t >= 2 && t < 9.5 ? (
        <div
          style={{
            position: "absolute",
            left: X(fact.x),
            top: Y(fact.y),
            width: fact.width * Z * selection,
            height: fact.height * Z,
            background: "#3c639d77",
            opacity: 1 - tween(t, 9.25, 9.5),
            pointerEvents: "none",
          }}
        />
      ) : null}
      {menuText || menuImage ? (
        <div
          style={{
            position: "absolute",
            left: menuText ? copyMenu.x : imageMenu.x,
            top: menuText ? copyMenu.y : imageMenu.y,
            width: 390,
            padding: 8,
            borderRadius: 10,
            background: "#292b30f7",
            border: "1px solid #797d8580",
            boxShadow: "0 17px 40px #0008",
            zIndex: 30,
            opacity: menuText ? tween(t, 5, 5.18) : tween(t, 10.5, 10.68),
          }}
        >
          {(menuText
            ? ["Copy", "Search Google for selection", "Print…"]
            : ["Open Image in New Tab", "Save Image As…", "Copy Image"]
          ).map((label, i) => (
            <div
              key={label}
              style={{
                height: 52,
                padding: "13px 15px",
                fontSize: 20,
                borderRadius: 5,
                color: "#eceef2",
                background:
                  (menuText && i === 0 && t > 6.8) ||
                  (menuImage && i === 1 && t > 12.8)
                    ? "#3567bb"
                    : "transparent",
                borderTop: i === 2 ? "1px solid #ffffff1a" : undefined,
              }}
            >
              {label}
              {menuText && i === 0 ? (
                <span style={{ float: "right", color: "#b4becd" }}>⌘C</span>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
      {dialog ? (
        <div
          style={{
            position: "absolute",
            left: 580,
            top: 560,
            width: 760,
            height: 320,
            padding: "30px 35px",
            borderRadius: 15,
            background: "#303238",
            border: "1px solid #84868e88",
            boxShadow: "0 25px 90px #000a",
            zIndex: 35,
            opacity: tween(t, 13.4, 13.6) * (1 - tween(t, 15.2, 15.45)),
            translate: `0 ${tween(t, 13.4, 13.6, 14, 0)}px`,
          }}
        >
          <div style={{ fontSize: 23, fontWeight: 650, marginBottom: 30 }}>
            Save Image
          </div>
          <div
            style={{
              display: "flex",
              gap: 22,
              alignItems: "center",
              fontSize: 20,
            }}
          >
            <span style={{ width: 100, color: "#b2b7c1" }}>Save As:</span>
            <div
              style={{
                flex: 1,
                padding: "11px 15px",
                border: "2px solid #5a8ccc",
                borderRadius: 6,
                background: "#23252b",
              }}
            >
              lake-tahoe.jpg
            </div>
          </div>
          <div
            style={{ display: "flex", gap: 22, marginTop: 23, fontSize: 20 }}
          >
            <span style={{ width: 100, color: "#b2b7c1" }}>Where:</span>
            <span>Downloads</span>
          </div>
          <div
            style={{
              position: "absolute",
              right: 35,
              bottom: 28,
              display: "flex",
              gap: 15,
              fontSize: 20,
            }}
          >
            <span
              style={{
                padding: "10px 26px",
                background: "#4a4d54",
                borderRadius: 7,
              }}
            >
              Cancel
            </span>
            <span
              style={{
                padding: "10px 33px",
                background: "#396fc2",
                borderRadius: 7,
              }}
            >
              Save
            </span>
          </div>
        </div>
      ) : null}
      {t >= 15.2 && t < 19.2 ? (
        <div
          style={{
            position: "absolute",
            left: 1250,
            top: 367,
            width: 430,
            padding: 22,
            display: "flex",
            gap: 18,
            alignItems: "center",
            background: "#292b31",
            border: "1px solid #73777f88",
            borderRadius: 12,
            zIndex: 32,
            boxShadow: "0 12px 40px #0007",
            opacity: tween(t, 15.2, 15.5) * (1 - tween(t, 18.8, 19.2)),
            translate: `0 ${tween(t, 15.2, 15.5, -10, 0)}px`,
          }}
        >
          <PhotoThumb />
          <div style={{ fontSize: 20 }}>
            lake-tahoe.jpg
            <div style={{ fontSize: 16, color: "#a2b6aa", marginTop: 7 }}>
              Download complete
            </div>
          </div>
          <span style={{ marginLeft: "auto", color: "#a3d8b5" }}>✓</span>
        </div>
      ) : null}
      {t >= 20 && t < 21.8 ? (
        <div
          style={{
            position: "absolute",
            left:
              X(link.x) +
              (538 - X(link.x)) * flight +
              Math.sin(Math.PI * flight) * 85,
            top:
              Y(link.y) +
              (276 - Y(link.y)) * flight -
              Math.sin(Math.PI * flight) * 100,
            width: 100 + 240 * flight,
            height: 28 + 23 * flight,
            borderRadius: 5 + 8 * flight,
            background: "#30343c",
            border: "1px solid #a4b4cf",
            display: "flex",
            alignItems: "center",
            paddingLeft: 8 + 20 * flight,
            fontSize: 19 + 3 * flight,
            color: "#bed1f5",
            boxShadow: "0 15px 40px #0007",
            zIndex: 60,
            opacity: 1 - tween(t, 21.45, 21.8),
          }}
        >
          Crater Lake
        </div>
      ) : null}
      <Cursor
        x={lerp(t, times, xs)}
        y={lerp(t, times, ys)}
        size={49}
        light
        pressed={feedback.keys}
        hintOpacity={feedback.opacity}
        press={space || right || middle}
      />
      <InputDock
        caption={
          t >= 7.4 && t < 9.5
            ? "Depth copied"
            : t >= 15.2 && t < 18.8
              ? "Photo saved"
              : undefined
        }
      >
        {[
          { label: "Left", key: "Space", active: space },
          { label: "Middle", key: "E", active: middle },
          { label: "Right", key: "R", active: right },
        ].map((action) => (
          <div
            key={action.key}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              color: action.active ? "#a2e5ff" : "#9ca8b9",
              fontSize: 22,
            }}
          >
            <span>{action.label}</span>
            <Key wide={action.key === "Space"} active={action.active}>
              {action.key}
            </Key>
          </div>
        ))}
      </InputDock>
    </Stage>
  );
};
