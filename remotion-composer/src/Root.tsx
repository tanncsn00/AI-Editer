import { Composition, CalculateMetadataFunction } from "remotion";
import { Explainer, ExplainerProps } from "./Explainer";
import {
  CinematicRenderer,
  calculateCinematicMetadata,
} from "./CinematicRenderer";
import { signalFromTomorrowWithMusicFixture } from "./cinematic/fixtures";
import { TalkingHead, TalkingHeadProps } from "./TalkingHead";
import { BayCuuHook } from "./BayCuuHook";
import { BayCuuFull } from "./BayCuuFull";
import { BayCuuThumbnail } from "./BayCuuThumbnail";
import { DanOngFull } from "./DanOngFull";
import { DanOngThumbnail } from "./DanOngThumbnail";
import { GiaTocFull } from "./GiaTocFull";
import { GiaTocThumbnail } from "./GiaTocThumbnail";
import { ImLangFull } from "./ImLangFull";
import { ImLangThumbnail } from "./ImLangThumbnail";

const calculateMetadata: CalculateMetadataFunction<ExplainerProps> = async ({
  props,
}) => {
  const cuts = props.cuts || [];
  if (cuts.length === 0) {
    return { durationInFrames: 30 * 60 };
  }
  const lastEnd = Math.max(...cuts.map((c) => c.out_seconds || 0));
  // Add 1 second padding for final fade
  return { durationInFrames: Math.ceil((lastEnd + 1) * 30) };
};

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="Explainer"
        component={Explainer}
        durationInFrames={30 * 60}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          cuts: [],
          overlays: [],
          captions: [],
          audio: {},
        }}
        calculateMetadata={calculateMetadata}
      />
      <Composition
        id="CinematicRenderer"
        component={CinematicRenderer}
        durationInFrames={30 * 30}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          scenes: [],
          titleFontSize: 78,
          titleWidth: 1320,
          signalLineCount: 18,
        }}
        calculateMetadata={calculateCinematicMetadata}
      />
      <Composition
        id="SignalFromTomorrowWithMusic"
        component={CinematicRenderer}
        durationInFrames={30 * 30}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={signalFromTomorrowWithMusicFixture}
        calculateMetadata={calculateCinematicMetadata}
      />
      <Composition
        id="TikTok"
        component={Explainer}
        durationInFrames={30 * 90}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          cuts: [],
          overlays: [],
          captions: [],
          audio: {},
        }}
        calculateMetadata={calculateMetadata}
      />
      <Composition
        id="ImLangFull"
        component={ImLangFull}
        durationInFrames={4410}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ImLangThumbnail"
        component={ImLangThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="GiaTocFull"
        component={GiaTocFull}
        durationInFrames={3420}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="GiaTocThumbnail"
        component={GiaTocThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="DanOngFull"
        component={DanOngFull}
        durationInFrames={3510}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="DanOngThumbnail"
        component={DanOngThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="BayCuuThumbnail"
        component={BayCuuThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="BayCuuFull"
        component={BayCuuFull}
        durationInFrames={3210}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="BayCuuHook"
        component={BayCuuHook}
        durationInFrames={240}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TalkingHead"
        component={TalkingHead}
        durationInFrames={30 * 300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          videoSrc: "",
          captions: [],
          overlays: [],
          wordsPerPage: 4,
          fontSize: 52,
          highlightColor: "#22D3EE",
        }}
      />
    </>
  );
};
