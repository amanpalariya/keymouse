import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Cursor, Key, lerp, tween, inputFeedback } from "../design";
import { scrollTime, photoTime } from "../pacing";
import { PhotoEditor, LakePhoto } from "../PhotoEditor";
import { InputDock, Stage } from "../stage";

export const PhotoWorkflow: React.FC<{ offset?: number }> = ({
  offset = 0,
}) => {
  const elapsed = photoTime(useCurrentFrame() / useVideoConfig().fps) + offset;
  const s = scrollTime(Math.min(elapsed, 8));
  const t = elapsed - 8;
  const sy = lerp(s, [0.8, 2.5, 2.9, 3.9], [0, -330, -330, -130]);
  const sx = lerp(s, [4.2, 5.3], [0, -340]);
  const scroll =
    s > 0.8 && s < 2.5
      ? "↓"
      : s > 2.9 && s < 3.9
        ? "↑"
        : s > 4.2 && s < 5.3
          ? "→"
          : null;
  const normal = (t > 0.6 && t < 1.8) || (t > 6.6 && t < 7.5);
  const fast = (t > 2.1 && t < 3.1) || (t > 7.8 && t < 9.36);
  const slow = (t > 3.5 && t < 5) || (t > 9.7 && t < 11.2);
  const click = (t > 5.2 && t < 5.55) || (t > 11.4 && t < 11.75);
  const direction = t < 2.1 ? "↑" : t < 6.6 ? "←" : t < 7.8 ? "↓" : "→";
  const x = lerp(
    t,
    [2.1, 3.1, 3.5, 5, 7.8, 9.36, 9.7, 11.2],
    [980, 420, 420, 350, 350, 1100, 1100, 1170],
  );
  const y = lerp(t, [0.6, 1.8, 6.6, 7.5], [660, 445, 445, 589]);
  const feedback = inputFeedback(elapsed, [
    { start: 0.8, end: 2.5, keys: ["⇧", "↓"] },
    { start: 3.9, end: 4.9, keys: ["⇧", "↑"] },
    { start: 5.2, end: 6.3, keys: ["⇧", "→"] },
    { start: 8.6, end: 9.8, keys: ["↑"] },
    { start: 10.1, end: 11.1, keys: ["F", "←"] },
    { start: 11.5, end: 13, keys: ["D", "←"] },
    { start: 13.2, end: 13.55, keys: ["Space"] },
    { start: 14.6, end: 15.5, keys: ["↓"] },
    { start: 15.8, end: 17.36, keys: ["F", "→"] },
    { start: 17.7, end: 19.2, keys: ["D", "→"] },
    { start: 19.4, end: 19.75, keys: ["Space"] },
  ]);
  return (
    <Stage demo>
      <PhotoEditor
        healing
        edits={t >= 11.4 ? 2 : t >= 5.2 ? 1 : 0}
        zoom={150}
        navigator={{
          left: (80 - sx) / 7.5,
          top: (50 - sy) / 7.5,
          width: 157,
          height: 91,
        }}
      >
        <LakePhoto
          style={{
            position: "absolute",
            width: 1800,
            maxWidth: "none",
            left: -80 + sx,
            top: -50 + sy,
          }}
        />
        {[
          { x: 505, y: 250, at: 5.2 },
          { x: 1325, y: 394, at: 11.4 },
        ].map((spot, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: spot.x - 80 + sx - 7,
              top: spot.y - 50 + sy - 7,
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: "#263241b5",
              boxShadow: "0 0 3px 2px #32425645",
              opacity: 1 - tween(t, spot.at, spot.at + 0.25),
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            right: 5,
            top: 50 - sy * 0.7,
            width: 5,
            height: 200,
            borderRadius: 4,
            background: "#f2f5f58c",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 5,
            left: 80 - sx * 0.8,
            width: 440,
            height: 5,
            borderRadius: 4,
            background: "#f2f5f58c",
          }}
        />
      </PhotoEditor>
      <Cursor
        x={x}
        y={y}
        shape="brush"
        light
        size={46}
        pressed={feedback.keys}
        hintOpacity={feedback.opacity}
        press={click}
      />
      <div style={{ opacity: 1 - tween(elapsed, 7.8, 8.2) }}>
        <InputDock>
          <Key wide active={Boolean(scroll)}>
            ⇧ Shift
          </Key>
          <Key active={scroll === "↓"}>↓</Key>
          <Key active={scroll === "↑"}>↑</Key>
          <Key active={scroll === "→"}>→</Key>
        </InputDock>
      </div>
      <div style={{ opacity: tween(elapsed, 7.8, 8.2) }}>
        <InputDock>
          <Key active={fast}>F</Key>
          <Key active={slow}>D</Key>
          <Key active={normal || fast || slow}>{direction}</Key>
          <Key wide active={click}>
            Space
          </Key>
        </InputDock>
      </div>
    </Stage>
  );
};
