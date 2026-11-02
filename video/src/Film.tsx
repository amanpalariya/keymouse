import React from "react";
import { AbsoluteFill, useVideoConfig, staticFile } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Audio } from "@remotion/media";
import { Opening } from "./scenes/Opening";
import { Move } from "./scenes/Move";
import { PhotoWorkflow } from "./scenes/PhotoWorkflow";
import { Clicks } from "./scenes/Clicks";
import { Drag } from "./scenes/Drag";
import { Closing } from "./scenes/Closing";

export const Film: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      <TransitionSeries>
        <TransitionSeries.Sequence
          name="01 — Stay on the keys / 3D fly-in"
          durationInFrames={4 * fps + Math.round(0.3 * fps)}
          premountFor={fps}
        >
          <Opening />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: Math.round(0.3 * fps) })}
        />
        <TransitionSeries.Sequence
          name="02 — Keyboard map / arrows + Space"
          durationInFrames={10 * fps + Math.round(0.3 * fps)}
          premountFor={fps}
        >
          <Move />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: Math.round(0.3 * fps) })}
        />
        <TransitionSeries.Sequence
          name="03 — Research a lake / copy, save, compare"
          durationInFrames={26 * fps + Math.round(0.3 * fps)}
          premountFor={fps}
        >
          <Clicks />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: Math.round(0.3 * fps) })}
        />
        <TransitionSeries.Sequence
          name="04 — Scroll and retouch / one continuous canvas"
          durationInFrames={22 * fps + Math.round(0.3 * fps)}
          premountFor={fps}
        >
          <PhotoWorkflow />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: Math.round(0.3 * fps) })}
        />
        <TransitionSeries.Sequence
          name="05 — Drag across, then reorder down"
          durationInFrames={12 * fps + Math.round(0.3 * fps)}
          premountFor={fps}
        >
          <Drag />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: Math.round(0.3 * fps) })}
        />
        <TransitionSeries.Sequence
          name="06 — Every move, yours / 3D fly-out"
          durationInFrames={4 * fps}
          premountFor={fps}
        >
          <Closing />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <Audio
        name="In Full Control — original music, rustle removed"
        src={staticFile("audio/in-full-control-original-clean-v5.wav")}
        premountFor={fps}
        volume={0.8}
      />
      <Audio
        name="Designed sound — soft tine accents / no swipes"
        src={staticFile("audio/workflow-accents-v5-final.wav")}
        premountFor={fps}
        volume={0.35}
      />
    </AbsoluteFill>
  );
};
