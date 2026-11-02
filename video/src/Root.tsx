import { Composition, Folder } from "remotion";
import { Film } from "./Film";
import { Opening } from "./scenes/Opening";
import { Move } from "./scenes/Move";
import { Scroll } from "./scenes/Scroll";
import { Select } from "./scenes/Select";
import { Context } from "./scenes/Context";
import { Drag } from "./scenes/Drag";
import { Tune } from "./scenes/Tune";
import { Clicks } from "./scenes/Clicks";
import { Closing } from "./scenes/Closing";
import { Film as SavedV1 } from "./versions/v1/Film";
import "./style.css";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="KeyMouse"
        component={Film}
        width={1920}
        height={1080}
        fps={60}
        durationInFrames={2880}
      />
      <Folder name="Scenes">
        <Composition
          id="Clicks"
          component={Clicks}
          width={1920}
          height={1080}
          fps={60}
          durationInFrames={840}
        />
        <Composition
          id="Opening"
          component={Opening}
          width={1920}
          height={1080}
          fps={60}
          durationInFrames={240}
        />
        <Composition
          id="Keyboard-map"
          component={Move}
          width={1920}
          height={1080}
          fps={60}
          durationInFrames={600}
        />
        <Composition
          id="Scroll"
          component={Scroll}
          width={1920}
          height={1080}
          fps={60}
          durationInFrames={360}
        />
        <Composition
          id="Select"
          component={Select}
          width={1920}
          height={1080}
          fps={60}
          durationInFrames={504}
        />
        <Composition
          id="Context-and-middle-click"
          component={Context}
          width={1920}
          height={1080}
          fps={60}
          durationInFrames={336}
        />
        <Composition
          id="Drag-and-drop"
          component={Drag}
          width={1920}
          height={1080}
          fps={60}
          durationInFrames={360}
        />
        <Composition
          id="Tune"
          component={Tune}
          width={1920}
          height={1080}
          fps={60}
          durationInFrames={240}
        />
        <Composition
          id="Closing"
          component={Closing}
          width={1920}
          height={1080}
          fps={60}
          durationInFrames={240}
        />
      </Folder>
      <Folder name="Saved">
        <Composition
          id="KeyMouse-v1"
          component={SavedV1}
          width={1920}
          height={1080}
          fps={60}
          durationInFrames={2400}
        />
      </Folder>
    </>
  );
};
