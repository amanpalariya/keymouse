import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { C, Cursor, Key, lerp, tween } from "../design";
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
      background: "linear-gradient(145deg,#22354d,#17273c)",
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
  const t = useCurrentFrame() / useVideoConfig().fps;
  const dx = lerp(t, [1.25, 3.6], [0, 952]);
  const lifted = t > 0.85 && t < 3.9;
  const done = t >= 3.9;
  const lift = tween(t, 0.85, 1.15) * 35 * (1 - tween(t, 3.9, 4.2));
  return (
    <Stage demo>
      <AppWindow title="Release board" />
      {[
        { x: 260, title: "Ideas", count: done ? "02" : "03", color: "#82aff1" },
        { x: 736, title: "In progress", count: "03", color: "#baabeb" },
        { x: 1212, title: "Done", count: done ? "03" : "02", color: "#83d5bd" },
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
            background: i === 2 && lifted ? "#18324a" : "#121f32",
            border:
              i === 2 && lifted ? "1px solid #6ba6f5" : "1px solid #3a526f66",
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
        style={{ left: 290, top: 715 }}
      />
      <TaskCard
        title="Launch notes"
        tag="Content"
        accent="#9bb2cc"
        style={{ left: 290, top: 950 }}
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
        style={{ left: 1242, top: 715 }}
      />
      <TaskCard
        title="Keyboard bindings"
        tag="Shipped"
        accent="#89d7bd"
        style={{ left: 1242, top: 950 }}
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
          }}
        />
      ) : null}
      <div
        style={{
          position: "absolute",
          left: 290 + dx,
          top: 440 - lift,
          width: 360,
          height: 218,
          borderRadius: 21,
          padding: 28,
          background: done
            ? "linear-gradient(145deg,#25574d,#193d38)"
            : "linear-gradient(145deg,#305779,#203d60)",
          border: `1px solid ${done ? "#89d7bd" : "#93caff"}`,
          boxShadow: lifted
            ? "0 45px 60px #0006,0 10px 0 #102238"
            : "0 12px 28px #0003",
          transform: `perspective(1500px) rotateY(${lifted ? -9 : 0}deg) rotateZ(${lifted ? -4 : 0}deg) scale(${lifted ? 1.04 : 1})`,
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
          <span style={{ float: "right", color: done ? "#91dec6" : "#a7dcff" }}>
            {done ? "✓" : "↗"}
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
        x={lerp(t, [0, 0.7, 1.25, 3.6], [920, 470, 470, 1422])}
        y={lerp(
          t,
          [0, 0.7, 1.25, 2.5, 3.6, 3.95, 4.5],
          [780, 540, 540, 480, 540, 540, 670],
        )}
        size={55}
        light
        pressed={lifted ? ["Space"] : []}
        press={t > 0.85 && t < 1.02}
      />
      <InputDock caption={done ? "Placed" : undefined}>
        <Key wide active={lifted}>
          Space
        </Key>
        <Key active={t > 1.25 && t < 3.6}>→</Key>
      </InputDock>
    </Stage>
  );
};
