import { dragTime } from "../pacing";
import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { C, Cursor, Key, lerp, tween, inputFeedback } from "../design";
import { AppWindow, Stage, InputDock } from "../stage";

const TaskCard: React.FC<{
  title: string;
  tag: string;
  accent: string;
  style?: React.CSSProperties;
}> = ({ title, tag, accent, style }) => (
  <div
    style={{
      position: "absolute",
      width: 360,
      height: 210,
      padding: 27,
      borderRadius: 19,
      background: "linear-gradient(145deg,#30343c,#272a31)",
      border: "1px solid #59789c4d",
      boxShadow: "0 10px 25px #0002",
      ...style,
    }}
  >
    <div
      style={{
        width: 38,
        height: 5,
        borderRadius: 5,
        background: accent,
        marginBottom: 23,
      }}
    />
    <div
      style={{
        fontSize: 27,
        fontWeight: 650,
        letterSpacing: -0.7,
        color: "#e4eefb",
      }}
    >
      {title}
    </div>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 28,
      }}
    >
      <span
        style={{
          fontSize: 15,
          color: accent,
          borderRadius: 6,
          padding: "6px 9px",
          background: accent + "16",
        }}
      >
        {tag}
      </span>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 13,
          color: "#7e97b8",
          fontSize: 17,
        }}
      >
        <span>☷ 3</span>
        <span
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "#314d6c",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            color: "#b6d1ec",
          }}
        >
          K
        </span>
      </div>
    </div>
  </div>
);

export const Drag: React.FC = () => {
  const t = dragTime(
    (useCurrentFrame() / useVideoConfig().fps) * 1.3333333333333333,
  );
  const dx = lerp(t, [1.25, 3.6], [0, 952]);
  const lifted = t > 0.85 && t < 3.9;
  const done = t >= 3.9;
  const pickup = tween(t, 0.85, 1.15) * (1 - tween(t, 3.9, 4.2));
  const lift = pickup * 35;
  const secondHeld = t > 6.5 && t < 8.9;
  const secondDone = t >= 8.9;
  const secondY = lerp(t, [6.9, 8.6], [440, 715]);
  const secondLift = tween(t, 6.5, 6.8) * (1 - tween(t, 8.9, 9.2));
  const feedback = inputFeedback(t, [
    { start: 0.85, end: 1.25, keys: ["Space"] },
    { start: 1.25, end: 3.6, keys: ["Space", "→"] },
    { start: 3.6, end: 3.9, keys: ["Space"] },
    { start: 6.5, end: 6.9, keys: ["Space"] },
    { start: 6.9, end: 8.6, keys: ["Space", "↓"] },
    { start: 8.6, end: 8.9, keys: ["Space"] },
  ]);
  return (
    <Stage demo>
      <AppWindow
        title="Launch planning — Trello"
        chrome="#292b31"
        style={{ background: "#191b20", borderColor: "#55575c" }}
      />
      <div
        style={{
          position: "absolute",
          left: 210,
          top: 285,
          width: 195,
          height: 900,
          borderRight: "1px solid #ffffff15",
          paddingRight: 20,
          color: "#a6afbc",
          fontSize: 18,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            fontSize: 27,
            fontWeight: 750,
            color: "#e8edf4",
            marginBottom: 38,
          }}
        >
          <svg width="26" height="26" viewBox="0 0 26 26">
            <rect width="26" height="26" rx="5" fill="#5794e8" />
            <rect x="5" y="5" width="6" height="16" rx="1" fill="white" />
            <rect x="15" y="5" width="6" height="11" rx="1" fill="white" />
          </svg>
          Trello
        </div>
        {["Workspace", "Boards", "Members", "Settings"].map((label) => (
          <div
            key={label}
            style={{
              padding: "13px 12px",
              borderRadius: 6,
              marginBottom: 5,
              background: label === "Boards" ? "#354459" : "transparent",
              color: label === "Boards" ? "#d1e3fd" : undefined,
            }}
          >
            {label}
          </div>
        ))}
        <div
          style={{
            marginTop: 40,
            fontSize: 14,
            color: "#717f92",
            marginBottom: 18,
          }}
        >
          YOUR BOARDS
        </div>
        {["Launch planning", "App website", "Roadmap"].map((label) => (
          <div
            key={label}
            style={{
              padding: "12px 0",
              color: label === "Launch planning" ? "#d3dce8" : "#8996a8",
              fontSize: 17,
            }}
          >
            {label}
          </div>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: 445,
          top: 280,
          right: 230,
          display: "flex",
          alignItems: "center",
          gap: 26,
          fontSize: 18,
          color: "#8e9bad",
        }}
      >
        <span style={{ fontSize: 26, color: "#e0e7f1", fontWeight: 700 }}>
          Launch planning
        </span>
        <span
          style={{
            color: "#bed7fa",
            borderBottom: "2px solid #73a5e7",
            padding: "14px 0",
          }}
        >
          Board
        </span>
        <span>Timeline</span>
        <span>Calendar</span>
        <span style={{ marginLeft: "auto" }}>Filter</span>
        <span
          style={{
            background: "#5c537e",
            borderRadius: "50%",
            width: 33,
            height: 33,
            display: "grid",
            placeItems: "center",
            fontSize: 13,
            color: "white",
          }}
        >
          AK
        </span>
        <span>⋯</span>
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: "translate(200px,95px) scale(.88)",
          transformOrigin: "top left",
        }}
      >
        {[
          {
            x: 260,
            title: "Ideas",
            count: done ? "02" : "03",
            color: "#82aff1",
          },
          {
            x: 736,
            title: "In progress",
            count: "03",
            color: "#baabeb",
          },
          {
            x: 1212,
            title: "Done",
            count: done ? "02" : "01",
            color: "#83d5bd",
          },
        ].map((column, i) => (
          <div
            key={column.title}
            style={{
              position: "absolute",
              left: column.x,
              top: 300,
              width: 420,
              height: 840,
              padding: 28,
              borderRadius: 24,
              background:
                i === 2 && (lifted || secondHeld) ? "#293b3d" : "#22252b",
              border:
                i === 2 && (lifted || secondHeld)
                  ? "1px solid #6ba6f5"
                  : "1px solid #4a4d555e",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: 25,
                fontWeight: 650,
                color: "#b9cbe0",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span
                  style={{
                    height: 9,
                    width: 9,
                    borderRadius: "50%",
                    background: column.color,
                  }}
                />
                {column.title}
              </span>
              <span
                style={{
                  fontSize: 17,
                  color: column.color,
                  borderRadius: 7,
                  background: column.color + "15",
                  padding: "5px 9px",
                }}
              >
                {column.count}
              </span>
            </div>
          </div>
        ))}
        <TaskCard
          title="Keyboard guide"
          tag="Design"
          accent="#8ab7f2"
          style={{ left: 290, top: tween(t, 3.9, 4.25, 715, 440) }}
        />
        <TaskCard
          title="Launch notes"
          tag="Content"
          accent="#9bb2cc"
          style={{ left: 290, top: tween(t, 3.9, 4.25, 950, 715) }}
        />
        <TaskCard
          title="Motion polish"
          tag="In review"
          accent="#c4b5f3"
          style={{ left: 766, top: 440 }}
        />
        <TaskCard
          title="Preview build"
          tag="Development"
          accent="#8ab7f2"
          style={{ left: 766, top: 715 }}
        />
        <TaskCard
          title="Review controls"
          tag="Testing"
          accent="#c5b080"
          style={{ left: 766, top: 950 }}
        />
        <TaskCard
          title="App icon"
          tag="Approved"
          accent="#89d7bd"
          style={{
            left: 1242,
            top:
              t < 6
                ? tween(t, 3, 3.3, 440, 715)
                : tween(t, 7.65, 7.97, 715, 440),
          }}
        />
        {lifted ? (
          <div
            style={{
              position: "absolute",
              left: 1242,
              top: 440,
              width: 360,
              height: 218,
              border: "2px dashed #71aaf09c",
              borderRadius: 19,
              background: "#4c8ada0b",
              opacity: tween(t, 0.85, 1.15) * (1 - tween(t, 3.7, 3.9)),
            }}
          />
        ) : null}
        {secondHeld ? (
          <div
            style={{
              position: "absolute",
              left: 1242,
              top: 715,
              width: 360,
              height: 218,
              border: "2px dashed #71aaf09c",
              borderRadius: 19,
              opacity: tween(t, 6.5, 6.8) * (1 - tween(t, 8.7, 8.9)),
            }}
          />
        ) : null}
        <div
          style={{
            position: "absolute",
            left: 290 + dx,
            top: (t < 6 ? 440 : secondY) - lift - secondLift * 24,
            width: 360,
            height: 218,
            borderRadius: 21,
            padding: 28,
            background: done
              ? "linear-gradient(145deg,#35564c,#293f38)"
              : "linear-gradient(145deg,#3d4957,#303944)",
            border: `1px solid ${done ? "#89d7bd" : "#93caff"}`,
            boxShadow:
              lifted || secondHeld
                ? "0 45px 60px #0006,0 10px 0 #102238"
                : "0 12px 28px #0003",
            transform: `perspective(1500px) rotateY(${-9 * (pickup + secondLift)}deg) rotateZ(${-4 * (pickup + secondLift)}deg) scale(${1 + 0.04 * (pickup + secondLift)})`,
            zIndex: 20,
          }}
        >
          <div
            style={{
              width: 40,
              height: 5,
              borderRadius: 5,
              background: done ? "#91dec6" : C.cyan,
              marginBottom: 25,
            }}
          />
          <div
            style={{
              fontSize: 33,
              fontWeight: 750,
              letterSpacing: -1,
              color: "#f0f8ff",
            }}
          >
            Launch video{" "}
            <span
              style={{ float: "right", color: done ? "#91dec6" : "#a7dcff" }}
            >
              {done ? "✓" : ""}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 30,
            }}
          >
            <span
              style={{
                padding: "7px 10px",
                borderRadius: 7,
                background: done ? "#8ad6bf1a" : "#a2ceff18",
                fontSize: 15,
                color: done ? "#a8ead6" : "#b5dbff",
              }}
            >
              {done ? "Shipped" : "Design"}
            </span>
            <span style={{ color: "#a4bfde", fontSize: 17 }}>☷ 4</span>
          </div>
        </div>
        <Cursor
          x={lerp(
            t,
            [0, 0.7, 1.25, 3.6, 6, 6.4, 6.9, 8.6],
            [920, 470, 470, 1422, 1422, 1422, 1422, 1422],
          )}
          y={
            t < 4.2
              ? lerp(t, [0, 0.7], [780, 540]) - lift
              : t < 6.4
                ? 540
                : t < 9.2
                  ? secondY + 100 - 24 * secondLift
                  : 815
          }
          size={55}
          light
          pressed={feedback.keys}
          hintOpacity={feedback.opacity}
          press={(t > 0.85 && t < 1.02) || (t > 6.5 && t < 6.67)}
        />
      </div>
      <InputDock caption={secondDone || (done && t < 6) ? "Placed" : undefined}>
        <Key wide active={lifted || secondHeld}>
          Space
        </Key>
        <Key active={t > 1.25 && t < 3.6}>→</Key>
        <Key active={t > 6.9 && t < 8.6}>↓</Key>
      </InputDock>
    </Stage>
  );
};
