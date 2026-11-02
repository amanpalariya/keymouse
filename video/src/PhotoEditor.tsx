import React from "react";
import { CanvasImage, staticFile, useVideoConfig } from "remotion";
import { AppWindow } from "./stage";

export const LakePhoto: React.FC<{ style?: React.CSSProperties }> = ({
  style,
}) => {
  const { fps } = useVideoConfig();
  return (
    <CanvasImage
      src={staticFile("alpine-lake.png")}
      premountFor={fps}
      style={{ display: "block", ...style }}
    />
  );
};

export const PhotoEditor: React.FC<{
  children: React.ReactNode;
  healing?: boolean;
  edits?: number;
  zoom?: number;
  navigator?: React.CSSProperties;
}> = ({ children, healing = false, edits = 0, zoom = 150, navigator }) => (
  <>
    <AppWindow
      title="Alpine lake.psd — Photo Studio"
      chrome="#292b31"
      style={{ background: "#1e2025", borderColor: "#55575c" }}
    />
    <div
      style={{
        position: "absolute",
        left: 210,
        top: 275,
        right: 210,
        height: 49,
        display: "flex",
        alignItems: "center",
        gap: 30,
        color: "#a6b0bf",
        fontSize: 18,
      }}
    >
      <span style={{ color: "#e1e7ef" }}>File</span>
      <span>Edit</span>
      <span>Image</span>
      <span>Layer</span>
      <span>Select</span>
      <span>Filter</span>
      <span>View</span>
      <span style={{ marginLeft: "auto", color: "#8ce0c1" }}>Saved</span>
    </div>
    <div
      style={{
        position: "absolute",
        left: 210,
        top: 326,
        width: 1500,
        height: 38,
        borderTop: "1px solid #ffffff12",
        display: "flex",
        alignItems: "center",
        gap: 28,
        color: "#9aa9be",
        fontSize: 16,
      }}
    >
      <span style={{ color: "#d2e2f4" }}>
        {healing ? "Spot Healing Brush" : "Alpine lake.psd @ 150%"}
      </span>
      {healing ? (
        <>
          <span>Size: 24 px</span>
          <span>Mode: Normal</span>
          <span>Content-aware</span>
        </>
      ) : (
        <>
          <span>RGB / 8</span>
          <span>Background</span>
        </>
      )}
    </div>
    <div
      style={{
        position: "absolute",
        left: 210,
        top: 380,
        width: 47,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      {[
        "M3 2L20 16L12 17L9 24Z",
        "M3 4H23V23H3Z",
        "M3 7Q13 -1 23 8Q26 20 10 23Q0 23 3 7Z",
        "M6 1V20H25M1 6H20V26",
        "M6 19L18 7M3 17L9 23M15 3L23 11M9 12L15 18",
        "M6 20L18 5Q21 2 24 5L11 21L3 24Z",
        "M3 4H23M13 4V25M8 25H18",
        "M3 4H23V24H3ZM3 4L23 24",
        "M8 14V7Q8 3 11 5V13V3Q14 0 15 4V13V5Q18 2 19 6V14V9Q22 6 23 10V19Q22 27 15 27H12Q8 26 5 20L2 15Q3 11 6 14L8 17",
      ].map((path, i) => (
        <div
          key={i}
          style={{
            width: 38,
            height: 39,
            borderRadius: 6,
            background: i === (healing ? 4 : 8) ? "#4a4f58" : "transparent",
            display: "grid",
            placeItems: "center",
          }}
        >
          <svg
            width="24"
            height="26"
            viewBox="0 0 28 30"
            fill="none"
            stroke={i === (healing ? 4 : 8) ? "#e3e9ef" : "#95a1b0"}
            strokeWidth="1.6"
            strokeLinejoin="round"
          >
            <path d={path} />
          </svg>
        </div>
      ))}
    </div>
    <div
      style={{
        position: "absolute",
        left: 265,
        top: 375,
        width: 1180,
        height: 680,
        overflow: "hidden",
        background: "#222831",
        border: "1px solid #050a11",
      }}
    >
      {children}
    </div>
    <div
      style={{
        position: "absolute",
        left: 1464,
        top: 380,
        width: 242,
        color: "#a0afc2",
        fontSize: 17,
      }}
    >
      <div
        style={{
          paddingBottom: 18,
          borderBottom: "1px solid #ffffff19",
          fontWeight: 650,
        }}
      >
        Navigator
      </div>
      <div style={{ margin: "18px 0", position: "relative" }}>
        <LakePhoto style={{ width: 240 }} />
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 240,
            height: 138,
            border: "1px solid #f5e9de",
            ...navigator,
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 30,
        }}
      >
        <span>{zoom}%</span>
        <span>◁ ━━━━━ ▷</span>
      </div>
      <div
        style={{
          borderBottom: "1px solid #ffffff19",
          paddingBottom: 15,
          fontWeight: 650,
        }}
      >
        Layers
      </div>
      {["Retouch", "Background"].map((name, i) => (
        <div
          key={name}
          style={{
            marginTop: 10,
            background: i === 0 ? "#3b4049" : "#292c32",
            borderRadius: 5,
            padding: "13px 10px",
            display: "flex",
            gap: 10,
            alignItems: "center",
          }}
        >
          <span>◉</span>
          <LakePhoto style={{ width: 39, height: 31, objectFit: "cover" }} />
          <span>{name}</span>
        </div>
      ))}
      <div
        style={{
          borderBottom: "1px solid #ffffff19",
          marginTop: 35,
          paddingBottom: 15,
          fontWeight: 650,
        }}
      >
        History
      </div>
      <div style={{ padding: "16px 10px", color: "#75879e" }}>Open image</div>
      {Array.from({ length: edits }, (_, i) => (
        <div
          key={i}
          style={{
            padding: "12px 10px",
            borderRadius: 5,
            color: "#b6d9f4",
            background: i === edits - 1 ? "#38434b" : "transparent",
          }}
        >
          Spot Healing Brush
        </div>
      ))}
    </div>
  </>
);
