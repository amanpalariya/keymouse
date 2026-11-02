import React from "react";
import { AbsoluteFill, useVideoConfig, staticFile } from "remotion";
import { TransitionSeries } from "@remotion/transitions";
import { Audio } from "@remotion/media";
import { Opening } from "./scenes/Opening";
import { Move } from "./scenes/Move";
import { Scroll } from "./scenes/Scroll";
import { Select } from "./scenes/Select";
import { Context } from "./scenes/Context";
import { Drag } from "./scenes/Drag";
import { Tune } from "./scenes/Tune";
import { Closing } from "./scenes/Closing";

export const Film: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      <TransitionSeries>
        <TransitionSeries.Sequence
          name="01 — Stay on the keys / 3D fly-in"
          durationInFrames={4 * fps}
          premountFor={fps}
        >
          <Opening />
        </TransitionSeries.Sequence>
        <TransitionSeries.Sequence
          name="02 — Activate, move, click"
          durationInFrames={6 * fps}
          premountFor={fps}
        >
          <Move />
        </TransitionSeries.Sequence>
        <TransitionSeries.Sequence
          name="03 — Scroll in both directions"
          durationInFrames={6 * fps}
          premountFor={fps}
        >
          <Scroll />
        </TransitionSeries.Sequence>
        <TransitionSeries.Sequence
          name="04 — Select text, double-click"
          durationInFrames={6 * fps}
          premountFor={fps}
        >
          <Select />
        </TransitionSeries.Sequence>
        <TransitionSeries.Sequence
          name="05 — Context menu, middle click"
          durationInFrames={4 * fps}
          premountFor={fps}
        >
          <Context />
        </TransitionSeries.Sequence>
        <TransitionSeries.Sequence
          name="06 — Drag and drop"
          durationInFrames={6 * fps}
          premountFor={fps}
        >
          <Drag />
        </TransitionSeries.Sequence>
        <TransitionSeries.Sequence
          name="07 — Speed and precision / real settings"
          durationInFrames={4 * fps}
          premountFor={fps}
        >
          <Tune />
        </TransitionSeries.Sequence>
        <TransitionSeries.Sequence
          name="08 — Every move, yours / 3D fly-out"
          durationInFrames={4 * fps}
          premountFor={fps}
        >
          <Closing />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <Audio
        name="Original score — In Full Control / 120 BPM"
        src={staticFile("audio/v1/in-full-control.wav")}
        premountFor={fps}
        volume={0.8}
      />
      <Audio
        name="Designed sound — air, glass, sub accents"
        src={staticFile("audio/v1/sound-design.wav")}
        premountFor={fps}
        volume={0.85}
      />
    </AbsoluteFill>
  );
};
