import React from "react";
import { AbsoluteFill, Easing, useVideoConfig, staticFile } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
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
    <AbsoluteFill style={{ background: "#080c16" }}>
      <TransitionSeries>
        <TransitionSeries.Sequence
          name="01 — Stay on the keys / 3D fly-in"
          durationInFrames={4 * fps + Math.round(0.5 * fps)}
          premountFor={fps}
        >
          <Opening />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({
            durationInFrames: Math.round(0.5 * fps),
            easing: Easing.inOut(Easing.cubic),
          })}
        />
        <TransitionSeries.Sequence
          name="02 — Keyboard map / arrows + Space"
          durationInFrames={7 * fps + Math.round(0.5 * fps)}
          premountFor={fps}
        >
          <Move />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })}
          timing={linearTiming({
            durationInFrames: Math.round(0.5 * fps),
            easing: Easing.inOut(Easing.cubic),
          })}
        />
        <TransitionSeries.Sequence
          name="03 — Research a lake / copy, save, compare"
          durationInFrames={15 * fps + Math.round(0.5 * fps)}
          premountFor={fps}
        >
          <Clicks />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({
            durationInFrames: Math.round(0.5 * fps),
            easing: Easing.inOut(Easing.cubic),
          })}
        />
        <TransitionSeries.Sequence
          name="04 — Scroll and retouch / one continuous canvas"
          durationInFrames={18 * fps + Math.round(0.5 * fps)}
          premountFor={fps}
        >
          <PhotoWorkflow />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })}
          timing={linearTiming({
            durationInFrames: Math.round(0.5 * fps),
            easing: Easing.inOut(Easing.cubic),
          })}
        />
        <TransitionSeries.Sequence
          name="05 — Drag across, then reorder down"
          durationInFrames={7 * fps + Math.round(0.5 * fps)}
          premountFor={fps}
        >
          <Drag />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-left" })}
          timing={linearTiming({
            durationInFrames: Math.round(0.5 * fps),
            easing: Easing.inOut(Easing.cubic),
          })}
        />
        <TransitionSeries.Sequence
          name="06 — KeyMouse / app icon and flying keys"
          durationInFrames={4 * fps}
          premountFor={fps}
        >
          <Closing />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <Audio
        name="In Full Control — original music, rustle removed"
        src={staticFile("audio/in-full-control-original-clean-v10.wav")}
        premountFor={fps}
        volume={0.8}
      />
      <Audio
        name="Designed sound — soft tine accents / no swipes"
        src={staticFile("audio/workflow-accents-v10.wav")}
        premountFor={fps}
        volume={0.35}
      />
    </AbsoluteFill>
  );
};
