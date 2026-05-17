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
import { ReupNoFear01 } from "./ReupNoFear01";
import { ReupNoFear01Thumbnail } from "./ReupNoFear01Thumbnail";
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
import { TinhDaoFB01 } from "./TinhDaoFB01";
import { TinhDaoFB01Thumbnail } from "./TinhDaoFB01Thumbnail";
import { AlanVfxPoc } from "./AlanVfxPoc";
import { HumanVfxPoc } from "./HumanVfxPoc";
import { StickFighterPoc } from "./StickFighterPoc";
import { StickFighterUltra } from "./StickFighterUltra";
import { CartoonMemePoc } from "./CartoonMemePoc";
import { CoachellaCrowdPoc } from "./CoachellaCrowdPoc";
import { BieberCoachellaRemake } from "./BieberCoachellaRemake";
import { DanceVfxPoc } from "./DanceVfxPoc";
import { DanceVfxSideBySide } from "./DanceVfxSideBySide";
import { IsseiDanceCartoon } from "./IsseiDanceCartoon";
import { IsseiDanceSideBySide } from "./IsseiDanceSideBySide";
import { IsseiDance3D } from "./IsseiDance3D";
import { IsseiDance3DSmpl } from "./IsseiDance3DSmpl";
import { IsseiDance3DAim } from "./IsseiDance3DAim";
import { IsseiDance3DPolished } from "./IsseiDance3DPolished";
import { IsseiDanceProcedural } from "./IsseiDanceProcedural";
import { IsseiDanceProceduralV2 } from "./IsseiDanceProceduralV2";
import { CamiksRedraw } from "./CamiksRedraw";
import { GhibliDaoPilot } from "./GhibliDaoPilot";
import { TrailerXeOm } from "./TrailerXeOm";
import { MvMinhTao } from "./MvMinhTao";
import { DocGheDo } from "./DocGheDo";
import { TimelapseDoiNguoi } from "./TimelapseDoiNguoi";
import { TimelapseBenThanh } from "./TimelapseBenThanh";
import { TimelapseNghichThien } from "./TimelapseNghichThien";
import { TimelapseNghichThienThumb } from "./TimelapseNghichThienThumb";
import { MultiverseAoDai } from "./MultiverseAoDai";
import { AffLedLamp } from "./AffLedLamp";
import { AffLampImessage } from "./AffLampImessage";
import { AffLampMessenger } from "./AffLampMessenger";
import { PovBonCau } from "./PovBonCau";
import { PovBonCauV2 } from "./PovBonCauV2";
import { VibeEditingEp2Slides } from "./VibeEditingEp2Slides";
import { VibeEditingEp2Recap } from "./VibeEditingEp2Recap";
import { VibeEditingEp2 } from "./VibeEditingEp2";
import { AgiConspiracy } from "./AgiConspiracy";
import { AgiConspiracyThumbnail } from "./AgiConspiracyThumbnail";
import { NgheBiAIThayThe } from "./NgheBiAIThayThe";
import { NgheBiAIThayTheThumbnail } from "./NgheBiAIThayTheThumbnail";
import { Hook1300 } from "./Hook1300";
import { Hook1300Thumbnail } from "./Hook1300Thumbnail";
import { OpenCutReview } from "./OpenCutReview";
import { OpenCutReviewThumbnail } from "./OpenCutReviewThumbnail";
import { KhungHoangViecLam } from "./KhungHoangViecLam";
import { Skill5AI } from "./Skill5AI";
import { Skill5AIThumbnail } from "./Skill5AIThumbnail";
import { RanhGioiHuyetThongFull } from "./RanhGioiHuyetThongFull";
import { RanhGioiHuyetThongThumbnail } from "./RanhGioiHuyetThongThumbnail";
import { DoiDungMuaFull } from "./DoiDungMuaFull";
import { DoiDungMuaThumbnail } from "./DoiDungMuaThumbnail";
import { ClaudeX2Limit } from "./ClaudeX2Limit";
import { ClaudeX2LimitThumbnail } from "./ClaudeX2LimitThumbnail";
import { ComboFreeStack } from "./ComboFreeStack";
import { ComboFreeStackThumbnail } from "./ComboFreeStackThumbnail";
import { BanTinAI } from "./BanTinAI";
import { BanTinAIThumbnail } from "./BanTinAIThumbnail";
import { AgentControlFlow } from "./AgentControlFlow";
import { AgentControlFlowThumbnail } from "./AgentControlFlowThumbnail";
import { PenpotMcpDesign } from "./PenpotMcpDesign";
import { PenpotMcpDesignThumbnail } from "./PenpotMcpDesignThumbnail";
import { CloudflareLayoff } from "./CloudflareLayoff";
import { CloudflareLayoffThumbnail } from "./CloudflareLayoffThumbnail";
import { AppleIos27Swap } from "./AppleIos27Swap";
import { AppleIos27SwapThumbnail } from "./AppleIos27SwapThumbnail";
import { GoogleAiHackerOpenclaw } from "./GoogleAiHackerOpenclaw";
import { GoogleAiLabVnNews } from "./GoogleAiLabVnNews";
import { GoogleAiLabVnNewsThumbnail } from "./GoogleAiLabVnNewsThumbnail";
import { SlideCarouselMcp } from "./SlideCarouselMcp";
import { Top5McpVideo } from "./Top5McpVideo";
import { Top5McpVideoThumbnail } from "./Top5McpVideoThumbnail";
import { SlideCarouselSubagents } from "./SlideCarouselSubagents";
import { Top5SubagentsVideo } from "./Top5SubagentsVideo";
import { Top5SubagentsVideoThumbnail } from "./Top5SubagentsVideoThumbnail";
import { SlideCarouselTop10 } from "./SlideCarouselTop10";
import { Top10ClaudeCodeCommands } from "./Top10ClaudeCodeCommands";
import { Top10ClaudeCodeCommandsThumbnail } from "./Top10ClaudeCodeCommandsThumbnail";
import { SlideCarouselTop10UseCases } from "./SlideCarouselTop10UseCases";
import { Top10ClaudeCodeUseCases } from "./Top10ClaudeCodeUseCases";
import { Top10ClaudeCodeUseCasesThumbnail } from "./Top10ClaudeCodeUseCasesThumbnail";
import { SlideCarouselTop10Settings } from "./SlideCarouselTop10Settings";
import { Top10ClaudeCodeSettings } from "./Top10ClaudeCodeSettings";
import { Top10ClaudeCodeSettingsThumbnail } from "./Top10ClaudeCodeSettingsThumbnail";
import { SlideCarouselTop10Plugins } from "./SlideCarouselTop10Plugins";
import { Top10ClaudeCodePlugins } from "./Top10ClaudeCodePlugins";
import { Top10ClaudeCodePluginsThumbnail } from "./Top10ClaudeCodePluginsThumbnail";

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
        id="ReupNoFear01"
        component={ReupNoFear01}
        durationInFrames={1130}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ReupNoFear01Thumbnail"
        component={ReupNoFear01Thumbnail}
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
        id="NgheBiAIThayThe"
        component={NgheBiAIThayThe}
        durationInFrames={2155}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="NgheBiAIThayTheThumbnail"
        component={NgheBiAIThayTheThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Hook1300"
        component={Hook1300}
        durationInFrames={1957}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Hook1300Thumbnail"
        component={Hook1300Thumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="OpenCutReview"
        component={OpenCutReview}
        durationInFrames={3136}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="OpenCutReviewThumbnail"
        component={OpenCutReviewThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="KhungHoangViecLam"
        component={KhungHoangViecLam}
        durationInFrames={1870}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Skill5AI"
        component={Skill5AI}
        durationInFrames={2049}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Skill5AIThumbnail"
        component={Skill5AIThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="RanhGioiHuyetThongFull"
        component={RanhGioiHuyetThongFull}
        durationInFrames={5910}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="RanhGioiHuyetThongThumbnail"
        component={RanhGioiHuyetThongThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="DoiDungMuaFull"
        component={DoiDungMuaFull}
        durationInFrames={3540}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="DoiDungMuaThumbnail"
        component={DoiDungMuaThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ClaudeX2Limit"
        component={ClaudeX2Limit}
        durationInFrames={1380}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ClaudeX2LimitThumbnail"
        component={ClaudeX2LimitThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ComboFreeStack"
        component={ComboFreeStack}
        durationInFrames={1410}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ComboFreeStackThumbnail"
        component={ComboFreeStackThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="BanTinAI"
        component={BanTinAI}
        durationInFrames={2490}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="BanTinAIThumbnail"
        component={BanTinAIThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AgentControlFlow"
        component={AgentControlFlow}
        durationInFrames={2160}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AgentControlFlowThumbnail"
        component={AgentControlFlowThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="PenpotMcpDesign"
        component={PenpotMcpDesign}
        durationInFrames={1880}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="PenpotMcpDesignThumbnail"
        component={PenpotMcpDesignThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CloudflareLayoff"
        component={CloudflareLayoff}
        durationInFrames={1910}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AppleIos27Swap"
        component={AppleIos27Swap}
        durationInFrames={1880}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CloudflareLayoffThumbnail"
        component={CloudflareLayoffThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AppleIos27SwapThumbnail"
        component={AppleIos27SwapThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="GoogleAiHackerOpenclaw"
        component={GoogleAiHackerOpenclaw}
        durationInFrames={2700}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="GoogleAiLabVnNews"
        component={GoogleAiLabVnNews}
        durationInFrames={2520}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="GoogleAiLabVnNewsThumbnail"
        component={GoogleAiLabVnNewsThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SlideCarouselMcp"
        component={SlideCarouselMcp}
        durationInFrames={9}
        fps={1}
        width={1080}
        height={1920}
      />
      <Composition
        id="Top5McpVideo"
        component={Top5McpVideo}
        durationInFrames={2730}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Top5McpVideoThumbnail"
        component={Top5McpVideoThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SlideCarouselSubagents"
        component={SlideCarouselSubagents}
        durationInFrames={9}
        fps={1}
        width={1080}
        height={1920}
      />
      <Composition
        id="Top5SubagentsVideo"
        component={Top5SubagentsVideo}
        durationInFrames={2960}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Top5SubagentsVideoThumbnail"
        component={Top5SubagentsVideoThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SlideCarouselTop10"
        component={SlideCarouselTop10}
        durationInFrames={12}
        fps={1}
        width={1080}
        height={1920}
      />
      <Composition
        id="Top10ClaudeCodeCommands"
        component={Top10ClaudeCodeCommands}
        durationInFrames={3810}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Top10ClaudeCodeCommandsThumbnail"
        component={Top10ClaudeCodeCommandsThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SlideCarouselTop10UseCases"
        component={SlideCarouselTop10UseCases}
        durationInFrames={12}
        fps={1}
        width={1080}
        height={1920}
      />
      <Composition
        id="Top10ClaudeCodeUseCases"
        component={Top10ClaudeCodeUseCases}
        durationInFrames={4233}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Top10ClaudeCodeUseCasesThumbnail"
        component={Top10ClaudeCodeUseCasesThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SlideCarouselTop10Settings"
        component={SlideCarouselTop10Settings}
        durationInFrames={12}
        fps={1}
        width={1080}
        height={1920}
      />
      <Composition
        id="Top10ClaudeCodeSettings"
        component={Top10ClaudeCodeSettings}
        durationInFrames={4471}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Top10ClaudeCodeSettingsThumbnail"
        component={Top10ClaudeCodeSettingsThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SlideCarouselTop10Plugins"
        component={SlideCarouselTop10Plugins}
        durationInFrames={12}
        fps={1}
        width={1080}
        height={1920}
      />
      <Composition
        id="Top10ClaudeCodePlugins"
        component={Top10ClaudeCodePlugins}
        durationInFrames={4555}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Top10ClaudeCodePluginsThumbnail"
        component={Top10ClaudeCodePluginsThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TinhDaoFB01"
        component={TinhDaoFB01}
        durationInFrames={790}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TinhDaoFB01Thumbnail"
        component={TinhDaoFB01Thumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AlanVfxPoc"
        component={AlanVfxPoc}
        durationInFrames={303}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="HumanVfxPoc"
        component={HumanVfxPoc}
        durationInFrames={148}
        fps={25}
        width={1080}
        height={1920}
      />
      <Composition
        id="StickFighterPoc"
        component={StickFighterPoc}
        durationInFrames={148}
        fps={25}
        width={1080}
        height={1920}
      />
      <Composition
        id="StickFighterUltra"
        component={StickFighterUltra}
        durationInFrames={148}
        fps={25}
        width={1080}
        height={1920}
      />
      <Composition
        id="CartoonMemePoc"
        component={CartoonMemePoc}
        durationInFrames={243}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CoachellaCrowdPoc"
        component={CoachellaCrowdPoc}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="BieberCoachellaRemake"
        component={BieberCoachellaRemake}
        durationInFrames={1884}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="DanceVfxPoc"
        component={DanceVfxPoc}
        durationInFrames={261}
        fps={25}
        width={1080}
        height={1920}
      />
      <Composition
        id="DanceVfxSideBySide"
        component={DanceVfxSideBySide}
        durationInFrames={261}
        fps={25}
        width={2160}
        height={1920}
      />
      <Composition
        id="IsseiDanceCartoon"
        component={IsseiDanceCartoon}
        durationInFrames={427}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="IsseiDanceSideBySide"
        component={IsseiDanceSideBySide}
        durationInFrames={427}
        fps={30}
        width={2160}
        height={1920}
      />
      <Composition
        id="IsseiDance3D"
        component={IsseiDance3D}
        durationInFrames={427}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="IsseiDance3DSmpl"
        component={IsseiDance3DSmpl}
        durationInFrames={427}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="IsseiDance3DAim"
        component={IsseiDance3DAim}
        durationInFrames={427}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="IsseiDance3DPolished"
        component={IsseiDance3DPolished}
        durationInFrames={427}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="IsseiDanceProcedural"
        component={IsseiDanceProcedural}
        durationInFrames={427}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="IsseiDanceProceduralV2"
        component={IsseiDanceProceduralV2}
        durationInFrames={427}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CamiksRedraw"
        component={CamiksRedraw}
        durationInFrames={180}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="GhibliDaoPilot"
        component={GhibliDaoPilot}
        durationInFrames={630}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TrailerXeOm"
        component={TrailerXeOm}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="MvMinhTao"
        component={MvMinhTao}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="DocGheDo"
        component={DocGheDo}
        durationInFrames={1326}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TimelapseDoiNguoi"
        component={TimelapseDoiNguoi}
        durationInFrames={1860}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TimelapseBenThanh"
        component={TimelapseBenThanh}
        durationInFrames={1800}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TimelapseNghichThien"
        component={TimelapseNghichThien}
        durationInFrames={2490}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TimelapseNghichThienThumb"
        component={TimelapseNghichThienThumb}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="MultiverseAoDai"
        component={MultiverseAoDai}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AffLedLamp"
        component={AffLedLamp}
        durationInFrames={1020}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AffLampImessage"
        component={AffLampImessage}
        durationInFrames={1170}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AffLampMessenger"
        component={AffLampMessenger}
        durationInFrames={1380}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="PovBonCau"
        component={PovBonCau}
        durationInFrames={1860}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="PovBonCauV2"
        component={PovBonCauV2}
        durationInFrames={2550}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="VibeEditingEp2Slides"
        component={VibeEditingEp2Slides}
        durationInFrames={13}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="VibeEditingEp2Recap"
        component={VibeEditingEp2Recap}
        durationInFrames={2580}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="VibeEditingEp2"
        component={VibeEditingEp2}
        durationInFrames={7890}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AgiConspiracy"
        component={AgiConspiracy}
        durationInFrames={3000}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AgiConspiracyThumbnail"
        component={AgiConspiracyThumbnail}
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
