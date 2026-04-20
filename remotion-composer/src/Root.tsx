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
import { AffProductTemplate, affProductDemoFixture } from "./AffProductTemplate";
import { TuDuyMoTap01 } from "./TuDuyMoTap01";
import { TuDuyMoStick } from "./TuDuyMoStick";
import { TuDuyMoSigma } from "./TuDuyMoSigma";
import { SigmaWalkDemo } from "./SigmaWalkDemo";
import { HaiNhamPilot } from "./HaiNhamPilot";
import { CoupleCharSheet } from "./CoupleChars";
import { CauHoiTuThan } from "./CauHoiTuThan";
import { StickThemeA, StickThemeB, StickThemeC } from "./StickThemes";
import { FigStyleHooded, FigStyleNoodle, FigStyleReader, FigStyleHero, FigStyleHeroFace, FigStyleDerp, FigStyleDerpFace, FigStyleSigma, FigStyleSigmaFace } from "./FigureStyles";
import { XhsFarmer } from "./XhsFarmer";
import { ReupDemo } from "./ReupDemo";
import { CoDocFull } from "./CoDocFull";
import { ReupTT01 } from "./ReupTT01";
import { ReupTT01Thumbnail } from "./ReupTT01Thumbnail";
import { ReupTTDiscipline01 } from "./ReupTTDiscipline01";
import { ReupTTDiscipline01Thumbnail } from "./ReupTTDiscipline01Thumbnail";
import { HonThuaTapTrung } from "./HonThuaTapTrung";
import { GiaiThichLuoiCharSheet, GiaiThichLuoiPropCompare, GiaiThichLuoiEnsemble } from "./GiaiThichLuoiChars";
import { GtlTap01 } from "./GtlTap01";
import { GtlTap01Thumbnail } from "./GtlTap01Thumbnail";
import { GtlTap02 } from "./GtlTap02";
import { GtlTap02Thumbnail } from "./GtlTap02Thumbnail";
import { BlueprintScenePrototype } from "./BlueprintScenePrototype";
import { QuyTacFull } from "./QuyTacFull";
import { VibeEditingLayout } from "./VibeEditingLayout";
import { VibeEditingIntro } from "./VibeEditingIntro";
import { BaoHieuFull } from "./BaoHieuFull";
import { BaoHieuThumbnail } from "./BaoHieuThumbnail";
import { VibeEditingEp1 } from "./VibeEditingEp1";
import { VibeEditingEp1Thumbnail } from "./VibeEditingEp1Thumbnail";

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
        id="AffProductTemplate"
        component={AffProductTemplate}
        durationInFrames={30 * 30}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={affProductDemoFixture}
      />
      <Composition
        id="TuDuyMoTap01"
        component={TuDuyMoTap01}
        durationInFrames={960}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TuDuyMoStick"
        component={TuDuyMoStick}
        durationInFrames={960}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TuDuyMoSigma"
        component={TuDuyMoSigma}
        durationInFrames={960}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SigmaWalkDemo"
        component={SigmaWalkDemo}
        durationInFrames={180}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="HaiNhamPilot"
        component={HaiNhamPilot}
        durationInFrames={780}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CoupleCharSheet"
        component={CoupleCharSheet}
        durationInFrames={90}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CauHoiTuThan"
        component={CauHoiTuThan}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition id="StickThemeA" component={StickThemeA} durationInFrames={90} fps={30} width={1080} height={1920} />
      <Composition id="StickThemeB" component={StickThemeB} durationInFrames={90} fps={30} width={1080} height={1920} />
      <Composition id="StickThemeC" component={StickThemeC} durationInFrames={90} fps={30} width={1080} height={1920} />
      <Composition id="FigStyleHooded" component={FigStyleHooded} durationInFrames={90} fps={30} width={1080} height={1920} />
      <Composition id="FigStyleNoodle" component={FigStyleNoodle} durationInFrames={90} fps={30} width={1080} height={1920} />
      <Composition id="FigStyleReader" component={FigStyleReader} durationInFrames={90} fps={30} width={1080} height={1920} />
      <Composition id="FigStyleHero" component={FigStyleHero} durationInFrames={90} fps={30} width={1080} height={1920} />
      <Composition id="FigStyleHeroFace" component={FigStyleHeroFace} durationInFrames={90} fps={30} width={1080} height={1920} />
      <Composition id="FigStyleDerp" component={FigStyleDerp} durationInFrames={90} fps={30} width={1080} height={1920} />
      <Composition id="FigStyleDerpFace" component={FigStyleDerpFace} durationInFrames={90} fps={30} width={1080} height={1920} />
      <Composition id="FigStyleSigma" component={FigStyleSigma} durationInFrames={90} fps={30} width={1080} height={1920} />
      <Composition id="FigStyleSigmaFace" component={FigStyleSigmaFace} durationInFrames={90} fps={30} width={1080} height={1920} />
      <Composition
        id="CoDocFull"
        component={CoDocFull}
        durationInFrames={4380}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ReupTT01"
        component={ReupTT01}
        durationInFrames={1035}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ReupTT01Thumbnail"
        component={ReupTT01Thumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ReupTTDiscipline01"
        component={ReupTTDiscipline01}
        durationInFrames={780}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ReupTTDiscipline01Thumbnail"
        component={ReupTTDiscipline01Thumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="HonThuaTapTrung"
        component={HonThuaTapTrung}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="GiaiThichLuoiCharSheet"
        component={GiaiThichLuoiCharSheet}
        durationInFrames={90}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="GiaiThichLuoiPropCompare"
        component={GiaiThichLuoiPropCompare}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="GiaiThichLuoiEnsemble"
        component={GiaiThichLuoiEnsemble}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="GtlTap01"
        component={GtlTap01}
        durationInFrames={4050}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="GtlTap01Thumbnail"
        component={GtlTap01Thumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="GtlTap02"
        component={GtlTap02}
        durationInFrames={1980}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="GtlTap02Thumbnail"
        component={GtlTap02Thumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="BlueprintScenePrototype"
        component={BlueprintScenePrototype}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
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
        id="QuyTacFull"
        component={QuyTacFull}
        durationInFrames={4416}
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
        id="XhsFarmer"
        component={XhsFarmer}
        durationInFrames={307}
        fps={30}
        width={720}
        height={1280}
      />
      <Composition
        id="ReupDemo"
        component={ReupDemo}
        durationInFrames={316}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="VibeEditingLayout"
        component={VibeEditingLayout}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="VibeEditingIntro"
        component={VibeEditingIntro}
        durationInFrames={1540}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="BaoHieuFull"
        component={BaoHieuFull}
        durationInFrames={1860}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="BaoHieuThumbnail"
        component={BaoHieuThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="VibeEditingEp1"
        component={VibeEditingEp1}
        durationInFrames={5253}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="VibeEditingEp1Thumbnail"
        component={VibeEditingEp1Thumbnail}
        durationInFrames={1}
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
