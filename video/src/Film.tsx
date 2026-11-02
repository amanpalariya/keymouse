import React from "react";
import { AbsoluteFill, useVideoConfig, staticFile } from "remotion";
import { TransitionSeries } from "@remotion/transitions";
import { Audio } from "@remotion/media";
import { Opening } from "./scenes/Opening";
import { Move } from "./scenes/Move";
import { Scroll } from "./scenes/Scroll";
import { Clicks } from "./scenes/Clicks";
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
          name="02 — Keyboard map / arrows + Space"
          durationInFrames={10 * fps}
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
          name="04 — All clicks / selection to context menu to browser tab"
          durationInFrames={14 * fps}
          premountFor={fps}
        >
          <Clicks />
        </TransitionSeries.Sequence>
        <TransitionSeries.Sequence
          name="06 — Drag and drop"
          durationInFrames={6 * fps}
          premountFor={fps}
        >
          <Drag />
        </TransitionSeries.Sequence>
        <TransitionSeries.Sequence
          name="07 — Speed and precision"
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
        src={staticFile("audio/in-full-control.wav")}
        premountFor={fps}
        volume={0.8}
      />
      <Audio
        name="Designed sound — soft tine accents / no swipes"
        src={staticFile("audio/sound-design.wav")}
        premountFor={fps}
        volume={0.45}
      />
    </AbsoluteFill>
  );
};
