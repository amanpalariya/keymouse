import { Composition, Folder } from "remotion";
import { Film } from "./Film";
import { Opening } from "./scenes/Opening";
import { Move } from "./scenes/Move";
import { Scroll } from "./scenes/Scroll";
import { Select } from "./scenes/Select";
import { Context } from "./scenes/Context";
import { Precision } from "./scenes/Precision";
import { PhotoWorkflow } from "./scenes/PhotoWorkflow";
import { Drag } from "./scenes/Drag";
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
        durationInFrames={3300}
      />
      <Folder name="Scenes">
        <Composition
          id="Photo-workflow"
          component={PhotoWorkflow}
          width={1920}
          height={1080}
          fps={60}
          durationInFrames={1080}
        />
        <Composition
          id="Precision"
          component={Precision}
          width={1920}
          height={1080}
          fps={60}
          durationInFrames={726}
        />
        <Composition
          id="Clicks"
          component={Clicks}
          width={1920}
          height={1080}
          fps={60}
          durationInFrames={900}
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
          durationInFrames={420}
        />
        <Composition
          id="Scroll"
          component={Scroll}
          width={1920}
          height={1080}
          fps={60}
          durationInFrames={415}
        />
        <Composition
          id="Select"
          component={Select}
          width={1920}
          height={1080}
          fps={60}
          durationInFrames={372}
        />
        <Composition
          id="Context-and-middle-click"
          component={Context}
          width={1920}
          height={1080}
          fps={60}
          durationInFrames={652}
        />
        <Composition
          id="Drag-and-drop"
          component={Drag}
          width={1920}
          height={1080}
          fps={60}
          durationInFrames={420}
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
