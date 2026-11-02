import React from "react";
import { C } from "./design";
import { AppWindow } from "./stage";

export const BrowserFrame: React.FC<{
  active?: "draft" | "assets";
  assetsProgress?: number;
  loading?: number;
}> = ({ active = "draft", assetsProgress = 0, loading = 1 }) => (
  <>
    <AppWindow
      title="Lake Tahoe — Wikipedia"
      chrome="#292b31"
      style={{ background: "#191b20", borderColor: "#55575c" }}
    />
    <div
      style={{
        position: "absolute",
        left: 191,
        top: 265,
        width: 1538,
        height: 62,
        background: "#222429",
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
          background: active === "draft" ? "#34363c" : "#282a30",
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "0 19px",
          fontSize: 22,
          fontWeight: 650,
          color: "#d7e5f7",
        }}
      >
        <span
          style={{
            width: 24,
            height: 24,
            borderRadius: 6,
            background: "#eceef0",
            color: "#111111",
            textAlign: "center",
            fontSize: 16,
            paddingTop: 2,
          }}
        >
          W
        </span>
        Lake Tahoe<span style={{ marginLeft: "auto", opacity: 0.4 }}>×</span>
      </div>
      {assetsProgress > 0 ? (
        <div
          data-new-tab
          style={{
            height: 51,
            width: assetsProgress * 340,
            borderRadius: "13px 13px 0 0",
            background: active === "assets" ? "#34363c" : "#292d34",
            border: "1px solid #8dc9ff80",
            borderBottom: "none",
            overflow: "hidden",
            position: "relative",
            opacity: Math.min(assetsProgress * 4, 1),
            translate: `0 ${15 * (1 - assetsProgress)}px`,
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
                background: "#eceef0",
                color: "#111111",
                textAlign: "center",
                fontSize: 17,
              }}
            >
              W
            </span>
            Crater Lake
            <span style={{ marginLeft: "auto", opacity: 0.4 }}>×</span>
          </div>
          <div
            style={{
              position: "absolute",
              left: 0,
              bottom: 0,
              height: 3,
              width: `${loading * 100}%`,
              background: C.cyan,
            }}
          />
        </div>
      ) : null}
    </div>
    <div
      style={{
        position: "absolute",
        left: 191,
        top: 327,
        width: 1538,
        height: 61,
        background: "#34363c",
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
          background: "#202228",
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          fontSize: 18,
        }}
      >
        ◇{" "}
        <span style={{ marginLeft: 14 }}>
          en.wikipedia.org/wiki/
          {active === "assets" ? "Crater_Lake" : "Lake_Tahoe"}
        </span>
      </div>
      <span style={{ fontSize: 25 }}>⋯</span>
    </div>
  </>
);
