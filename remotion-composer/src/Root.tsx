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
import { BlockyCharSheet } from "./BlockyCharSheet";
import { PovNoFlush, POV_NOFLUSH_DURATION } from "./PovNoFlush";
import { PovNoFlushThumbnail } from "./PovNoFlushThumbnail";
import { BlockyStageTest, BLOCKY_STAGE_TEST_DURATION } from "./BlockyStageTest";
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
import { SlideCarouselTop10AgentPatterns } from "./SlideCarouselTop10AgentPatterns";
import { Top10AgentPatterns } from "./Top10AgentPatterns";
import { Top10AgentPatternsThumbnail } from "./Top10AgentPatternsThumbnail";
import { SlideCarouselTop10NotGood } from "./SlideCarouselTop10NotGood";
import { Top10ClaudeNotGood } from "./Top10ClaudeNotGood";
import { Top10ClaudeNotGoodThumbnail } from "./Top10ClaudeNotGoodThumbnail";
import { SlideCarouselTop10SkillLost } from "./SlideCarouselTop10SkillLost";
import { Top10SkillLost } from "./Top10SkillLost";
import { Top10SkillLostThumbnail } from "./Top10SkillLostThumbnail";
import { SlideCarouselTop10Cowork } from "./SlideCarouselTop10Cowork";
import { Top10ClaudeCowork } from "./Top10ClaudeCowork";
import { Top10ClaudeCoworkThumbnail } from "./Top10ClaudeCoworkThumbnail";
import { SlideCarouselTop5McpAuto } from "./SlideCarouselTop5McpAuto";
import { Top5McpAutomation } from "./Top5McpAutomation";
import { Top5McpAutomationThumbnail } from "./Top5McpAutomationThumbnail";
import { SlideCarouselTop10SkillAi } from "./SlideCarouselTop10SkillAi";
import { Top10SkillAiEra } from "./Top10SkillAiEra";
import { Top10SkillAiEraThumbnail } from "./Top10SkillAiEraThumbnail";
import { SlideCarouselTop10SkillKeep } from "./SlideCarouselTop10SkillKeep";
import { Top10SkillKeep } from "./Top10SkillKeep";
import { Top10SkillKeepThumbnail } from "./Top10SkillKeepThumbnail";
import { SlideCarouselAgi } from "./SlideCarouselAgi";
import { AgiExplained } from "./AgiExplained";
import { AgiExplainedThumbnail } from "./AgiExplainedThumbnail";
import { SlideCarouselGoogleIO } from "./SlideCarouselGoogleIO";
import { GoogleIO2026 } from "./GoogleIO2026";
import { GoogleIO2026Thumbnail } from "./GoogleIO2026Thumbnail";
import { SlideCarouselSepKhongBietAI } from "./SlideCarouselSepKhongBietAI";
import { SepKhongBietAI } from "./SepKhongBietAI";
import { SepKhongBietAIThumbnail } from "./SepKhongBietAIThumbnail";
import { SlideCarouselTop10Shortcut } from "./SlideCarouselTop10Shortcut";
import { Top10ClaudeShortcut } from "./Top10ClaudeShortcut";
import { Top10ClaudeShortcutThumbnail } from "./Top10ClaudeShortcutThumbnail";
import { SlideCarouselGeminiSpark } from "./SlideCarouselGeminiSpark";
import { GeminiSpark } from "./GeminiSpark";
import { GeminiSparkThumbnail } from "./GeminiSparkThumbnail";
import { SlideCarouselCoworkMeeting } from "./SlideCarouselCoworkMeeting";
import { CoworkMeetingNotion } from "./CoworkMeetingNotion";
import { CoworkMeetingNotionThumbnail } from "./CoworkMeetingNotionThumbnail";
import { SlideCarouselCanhGioiAi } from "./SlideCarouselCanhGioiAi";
import { CanhGioiAi } from "./CanhGioiAi";
import { CanhGioiAiThumbnail } from "./CanhGioiAiThumbnail";
import { SlideCarouselKarpathyStory } from "./SlideCarouselKarpathyStory";
import { KarpathyTruyenKy } from "./KarpathyTruyenKy";
import { KarpathyTruyenKyThumbnail } from "./KarpathyTruyenKyThumbnail";
import { SlideCarouselSamAltmanStory } from "./SlideCarouselSamAltmanStory";
import { SamAltmanTruyenKy } from "./SamAltmanTruyenKy";
import { SamAltmanTruyenKyThumbnail } from "./SamAltmanTruyenKyThumbnail";
import { SlideCarouselClaudeOpus48 } from "./SlideCarouselClaudeOpus48";
import { ClaudeOpus48TruyenKy } from "./ClaudeOpus48TruyenKy";
import { ClaudeOpus48TruyenKyThumbnail } from "./ClaudeOpus48TruyenKyThumbnail";
import { ClaudeOpus48Blueprint } from "./ClaudeOpus48Blueprint";
import { ClaudeOpus48BlueprintThumbnail } from "./ClaudeOpus48BlueprintThumbnail";
import { CommitTaCong } from "./CommitTaCong";
import { CommitTaCongThumbnail } from "./CommitTaCongThumbnail";
import { ThanChuDanTech } from "./ThanChuDanTech";
import { ThanChuDanTechThumbnail } from "./ThanChuDanTechThumbnail";
import { Top7FixBug } from "./Top7FixBug";
import { Top7FixBugThumbnail } from "./Top7FixBugThumbnail";
import { DauHieuAiXamNhap } from "./DauHieuAiXamNhap";
import { DauHieuAiXamNhapThumbnail } from "./DauHieuAiXamNhapThumbnail";
import { Top7TesterQuotes } from "./Top7TesterQuotes";
import { Top7TesterQuotesThumbnail } from "./Top7TesterQuotesThumbnail";
import { SeniorDevXuyenKhong } from "./SeniorDevXuyenKhong";
import { SeniorDevXuyenKhongThumbnail } from "./SeniorDevXuyenKhongThumbnail";
import { DieuKhongAiThuaNhan } from "./DieuKhongAiThuaNhan";
import { DieuKhongAiThuaNhanThumbnail } from "./DieuKhongAiThuaNhanThumbnail";
import { DauHieuSenior } from "./DauHieuSenior";
import { DauHieuSeniorThumbnail } from "./DauHieuSeniorThumbnail";
import { GpuThanKhi } from "./GpuThanKhi";
import { GpuThanKhiThumbnail } from "./GpuThanKhiThumbnail";
import { HeThongTauHoa } from "./HeThongTauHoa";
import { HeThongTauHoaThumbnail } from "./HeThongTauHoaThumbnail";
import { ToiLoiGitDao } from "./ToiLoiGitDao";
import { ToiLoiGitDaoThumbnail } from "./ToiLoiGitDaoThumbnail";
import { DaoToXuyenKhong } from "./DaoToXuyenKhong";
import { DaoToXuyenKhongThumbnail } from "./DaoToXuyenKhongThumbnail";
import { KubernetesTamGioi } from "./KubernetesTamGioi";
import { KubernetesTamGioiThumbnail } from "./KubernetesTamGioiThumbnail";
import { CudaTruyenKy } from "./CudaTruyenKy";
import { CudaTruyenKyThumbnail } from "./CudaTruyenKyThumbnail";
import { GitDaoTruyenThuyet } from "./GitDaoTruyenThuyet";
import { GitDaoTruyenThuyetThumbnail } from "./GitDaoTruyenThuyetThumbnail";
import { FrontendVsDesigner } from "./FrontendVsDesigner";
import { FrontendVsDesignerThumbnail } from "./FrontendVsDesignerThumbnail";
import { SalesVsEngineering } from "./SalesVsEngineering";
import { SalesVsEngineeringThumbnail } from "./SalesVsEngineeringThumbnail";
import { DongMonNguyHiem } from "./DongMonNguyHiem";
import { DongMonNguyHiemThumbnail } from "./DongMonNguyHiemThumbnail";
import { CacheThanKhi } from "./CacheThanKhi";
import { CacheThanKhiThumbnail } from "./CacheThanKhiThumbnail";
import { BackendTamMa } from "./BackendTamMa";
import { BackendTamMaThumbnail } from "./BackendTamMaThumbnail";
import { CommentChanDong } from "./CommentChanDong";
import { CommentChanDongThumbnail } from "./CommentChanDongThumbnail";
import { MicroserviceDaiTran } from "./MicroserviceDaiTran";
import { MicroserviceDaiTranThumbnail } from "./MicroserviceDaiTranThumbnail";
import { GioiHanKiemTu } from "./GioiHanKiemTu";
import { GioiHanKiemTuThumbnail } from "./GioiHanKiemTuThumbnail";
import { NetworkTruyenAm } from "./NetworkTruyenAm";
import { NetworkTruyenAmThumbnail } from "./NetworkTruyenAmThumbnail";
import { PmVsDevHieuLam } from "./PmVsDevHieuLam";
import { PmVsDevHieuLamThumbnail } from "./PmVsDevHieuLamThumbnail";
import { IndexThanThu } from "./IndexThanThu";
import { IndexThanThuThumbnail } from "./IndexThanThuThumbnail";
import { DesignPatternTruyenThua } from "./DesignPatternTruyenThua";
import { DesignPatternTruyenThuaThumbnail } from "./DesignPatternTruyenThuaThumbnail";
import { TruyenThuyetCoThat } from "./TruyenThuyetCoThat";
import { TruyenThuyetCoThatThumbnail } from "./TruyenThuyetCoThatThumbnail";
import { WebhookDao } from "./WebhookDao";
import { WebhookDaoThumbnail } from "./WebhookDaoThumbnail";
import { SinhVatThanBi } from "./SinhVatThanBi";
import { SinhVatThanBiThumbnail } from "./SinhVatThanBiThumbnail";
import { TodoThuongCo } from "./TodoThuongCo";
import { TodoThuongCoThumbnail } from "./TodoThuongCoThumbnail";
import { RabbitmqDao } from "./RabbitmqDao";
import { RabbitmqDaoThumbnail } from "./RabbitmqDaoThumbnail";
import { CodeDaoNhapMon } from "./CodeDaoNhapMon";
import { CodeDaoNhapMonThumbnail } from "./CodeDaoNhapMonThumbnail";
import { TienTeDao } from "./TienTeDao";
import { TienTeDaoThumbnail } from "./TienTeDaoThumbnail";
import { PovTester } from "./PovTester";
import { PovTesterThumbnail } from "./PovTesterThumbnail";
import { PovBa } from "./PovBa";
import { PovBaThumbnail } from "./PovBaThumbnail";
import { PovPo } from "./PovPo";
import { PovPoThumbnail } from "./PovPoThumbnail";
import { GroupChatDongMon } from "./GroupChatDongMon";
import { GroupChatDongMonThumbnail } from "./GroupChatDongMonThumbnail";
import { PovPm } from "./PovPm";
import { PovPmThumbnail } from "./PovPmThumbnail";
import { QaDao } from "./QaDao";
import { QaDaoThumbnail } from "./QaDaoThumbnail";
import { TcpDao } from "./TcpDao";
import { TcpDaoThumbnail } from "./TcpDaoThumbnail";
import { TuSiCuoiThang } from "./TuSiCuoiThang";
import { TuSiCuoiThangThumbnail } from "./TuSiCuoiThangThumbnail";
import { GrpcDao } from "./GrpcDao";
import { GrpcDaoThumbnail } from "./GrpcDaoThumbnail";
import { PovDevops } from "./PovDevops";
import { PovDevopsThumbnail } from "./PovDevopsThumbnail";
import { PovKetoan } from "./PovKetoan";
import { PovKetoanThumbnail } from "./PovKetoanThumbnail";
import { SeniorJunior } from "./SeniorJunior";
import { SeniorJuniorThumbnail } from "./SeniorJuniorThumbnail";
import { HttpSessionJwt } from "./HttpSessionJwt";
import { HttpSessionJwtThumbnail } from "./HttpSessionJwtThumbnail";
import { PovKtv } from "./PovKtv";
import { PovKtvThumbnail } from "./PovKtvThumbnail";
import { ThienCoSu } from "./ThienCoSu";
import { ThienCoSuThumbnail } from "./ThienCoSuThumbnail";
import { CleanArch } from "./CleanArch";
import { CleanArchThumbnail } from "./CleanArchThumbnail";
import { PovCreator } from "./PovCreator";
import { PovCreatorThumbnail } from "./PovCreatorThumbnail";
import { HoaTuKiemTu } from "./HoaTuKiemTu";
import { HoaTuKiemTuThumbnail } from "./HoaTuKiemTuThumbnail";
import { SalesDao } from "./SalesDao";
import { SalesDaoThumbnail } from "./SalesDaoThumbnail";
import { MeetingDao } from "./MeetingDao";
import { MeetingDaoThumbnail } from "./MeetingDaoThumbnail";
import { MoiGioiDao } from "./MoiGioiDao";
import { MoiGioiDaoThumbnail } from "./MoiGioiDaoThumbnail";
import { QaVsDev } from "./QaVsDev";
import { QaVsDevThumbnail } from "./QaVsDevThumbnail";
import { RaceCondition } from "./RaceCondition";
import { RaceConditionThumbnail } from "./RaceConditionThumbnail";
import { ThuongKhach } from "./ThuongKhach";
import { ThuongKhachThumbnail } from "./ThuongKhachThumbnail";
import { HoaTu } from "./HoaTu";
import { HoaTuThumbnail } from "./HoaTuThumbnail";
import { NhanSu } from "./NhanSu";
import { NhanSuThumbnail } from "./NhanSuThumbnail";
import { CodeReview } from "./CodeReview";
import { CodeReviewThumbnail } from "./CodeReviewThumbnail";
import { HoDao } from "./HoDao";
import { HoDaoThumbnail } from "./HoDaoThumbnail";
import { Helpdesk } from "./Helpdesk";
import { HelpdeskThumbnail } from "./HelpdeskThumbnail";
import { TruMa } from "./TruMa";
import { TruMaThumbnail } from "./TruMaThumbnail";
import { TanTuSi } from "./TanTuSi";
import { TanTuSiThumbnail } from "./TanTuSiThumbnail";
import { XKiro } from "./XKiro";
import { TuCode } from "./TuCode";
import { HoaNgon } from "./HoaNgon";
import { HoaNgonThumbnail } from "./HoaNgonThumbnail";
import { ThienCoMatNgon } from "./ThienCoMatNgon";
import { ThienCoMatNgonThumbnail } from "./ThienCoMatNgonThumbnail";
import { MatNgonBangHuu } from "./MatNgonBangHuu";
import { MatNgonBangHuuThumbnail } from "./MatNgonBangHuuThumbnail";
import { MatNgonKiemTu } from "./MatNgonKiemTu";
import { MatNgonKiemTuThumbnail } from "./MatNgonKiemTuThumbnail";
import { RbacDao } from "./RbacDao";
import { RbacDaoThumbnail } from "./RbacDaoThumbnail";
import { MatNgonChieuMo } from "./MatNgonChieuMo";
import { MatNgonChieuMoThumbnail } from "./MatNgonChieuMoThumbnail";
import { OfficeBattleRoyale, OBR_DURATION } from "./OfficeBattleRoyale";
import { TuCodeCliff } from "./TuCodeCliff";
import { TuCodeFootage } from "./TuCodeFootage";
import { TuCodeThumbnail } from "./TuCodeThumbnail";
import { XKiroThumbnail } from "./XKiroThumbnail";
import { CloudflareDdos } from "./CloudflareDdos";
import { CloudflareDdosThumbnail } from "./CloudflareDdosThumbnail";
import { SlideCarouselItFaCanhGioi } from "./SlideCarouselItFaCanhGioi";
import { ItFaCanhGioi } from "./ItFaCanhGioi";
import { ItFaCanhGioiThumbnail } from "./ItFaCanhGioiThumbnail";
import { SlideCarouselTop7DaoHuu } from "./SlideCarouselTop7DaoHuu";
import { Top7DaoHuu } from "./Top7DaoHuu";
import { Top7DaoHuuThumbnail } from "./Top7DaoHuuThumbnail";
import { SlideCarouselNguoiKhongHop } from "./SlideCarouselNguoiKhongHop";
import { NguoiKhongHopNhanGian } from "./NguoiKhongHopNhanGian";
import { NguoiKhongHopNhanGianThumbnail } from "./NguoiKhongHopNhanGianThumbnail";
import { SlideCarouselTop7Manager } from "./SlideCarouselTop7Manager";
import { Top7Manager } from "./Top7Manager";
import { Top7ManagerThumbnail } from "./Top7ManagerThumbnail";
import { SlideCarouselDonGianDaiDao } from "./SlideCarouselDonGianDaiDao";
import { DonGianDaiDao } from "./DonGianDaiDao";
import { DonGianDaiDaoThumbnail } from "./DonGianDaiDaoThumbnail";
import { DonGianDaiDaoAnimated } from "./DonGianDaiDaoAnimated";
import { CodingTangThapNhat } from "./CodingTangThapNhat";
import { CodingTangThapNhatThumbnail } from "./CodingTangThapNhatThumbnail";
import { EngineerSongSotAi } from "./EngineerSongSotAi";
import { EngineerSongSotAiThumbnail } from "./EngineerSongSotAiThumbnail";

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
        durationInFrames={2075}
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
        id="SlideCarouselTop10AgentPatterns"
        component={SlideCarouselTop10AgentPatterns}
        durationInFrames={12}
        fps={1}
        width={1080}
        height={1920}
      />
      <Composition
        id="Top10AgentPatterns"
        component={Top10AgentPatterns}
        durationInFrames={4711}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Top10AgentPatternsThumbnail"
        component={Top10AgentPatternsThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SlideCarouselTop10NotGood"
        component={SlideCarouselTop10NotGood}
        durationInFrames={12}
        fps={1}
        width={1080}
        height={1920}
      />
      <Composition
        id="Top10ClaudeNotGood"
        component={Top10ClaudeNotGood}
        durationInFrames={4801}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Top10ClaudeNotGoodThumbnail"
        component={Top10ClaudeNotGoodThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SlideCarouselTop10SkillLost"
        component={SlideCarouselTop10SkillLost}
        durationInFrames={12}
        fps={1}
        width={1080}
        height={1920}
      />
      <Composition
        id="Top10SkillLost"
        component={Top10SkillLost}
        durationInFrames={4524}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Top10SkillLostThumbnail"
        component={Top10SkillLostThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SlideCarouselTop10Cowork"
        component={SlideCarouselTop10Cowork}
        durationInFrames={12}
        fps={1}
        width={1080}
        height={1920}
      />
      <Composition
        id="Top10ClaudeCowork"
        component={Top10ClaudeCowork}
        durationInFrames={4883}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Top10ClaudeCoworkThumbnail"
        component={Top10ClaudeCoworkThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SlideCarouselTop5McpAuto"
        component={SlideCarouselTop5McpAuto}
        durationInFrames={8}
        fps={1}
        width={1080}
        height={1920}
      />
      <Composition
        id="Top5McpAutomation"
        component={Top5McpAutomation}
        durationInFrames={3467}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Top5McpAutomationThumbnail"
        component={Top5McpAutomationThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SlideCarouselTop10SkillAi"
        component={SlideCarouselTop10SkillAi}
        durationInFrames={12}
        fps={1}
        width={1080}
        height={1920}
      />
      <Composition
        id="Top10SkillAiEra"
        component={Top10SkillAiEra}
        durationInFrames={3971}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Top10SkillAiEraThumbnail"
        component={Top10SkillAiEraThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SlideCarouselTop10SkillKeep"
        component={SlideCarouselTop10SkillKeep}
        durationInFrames={12}
        fps={1}
        width={1080}
        height={1920}
      />
      <Composition
        id="Top10SkillKeep"
        component={Top10SkillKeep}
        durationInFrames={4313}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Top10SkillKeepThumbnail"
        component={Top10SkillKeepThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SlideCarouselAgi"
        component={SlideCarouselAgi}
        durationInFrames={8}
        fps={1}
        width={1080}
        height={1920}
      />
      <Composition
        id="AgiExplained"
        component={AgiExplained}
        durationInFrames={3776}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AgiExplainedThumbnail"
        component={AgiExplainedThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SlideCarouselGoogleIO"
        component={SlideCarouselGoogleIO}
        durationInFrames={8}
        fps={1}
        width={1080}
        height={1920}
      />
      <Composition
        id="GoogleIO2026"
        component={GoogleIO2026}
        durationInFrames={3856}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="GoogleIO2026Thumbnail"
        component={GoogleIO2026Thumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SlideCarouselSepKhongBietAI"
        component={SlideCarouselSepKhongBietAI}
        durationInFrames={8}
        fps={1}
        width={1080}
        height={1920}
      />
      <Composition
        id="SepKhongBietAI"
        component={SepKhongBietAI}
        durationInFrames={3108}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SepKhongBietAIThumbnail"
        component={SepKhongBietAIThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SlideCarouselTop10Shortcut"
        component={SlideCarouselTop10Shortcut}
        durationInFrames={12}
        fps={1}
        width={1080}
        height={1920}
      />
      <Composition
        id="Top10ClaudeShortcut"
        component={Top10ClaudeShortcut}
        durationInFrames={3354}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Top10ClaudeShortcutThumbnail"
        component={Top10ClaudeShortcutThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SlideCarouselGeminiSpark"
        component={SlideCarouselGeminiSpark}
        durationInFrames={8}
        fps={1}
        width={1080}
        height={1920}
      />
      <Composition
        id="GeminiSpark"
        component={GeminiSpark}
        durationInFrames={2855}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="GeminiSparkThumbnail"
        component={GeminiSparkThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SlideCarouselCoworkMeeting"
        component={SlideCarouselCoworkMeeting}
        durationInFrames={8}
        fps={1}
        width={1080}
        height={1920}
      />
      <Composition
        id="CoworkMeetingNotion"
        component={CoworkMeetingNotion}
        durationInFrames={2487}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CoworkMeetingNotionThumbnail"
        component={CoworkMeetingNotionThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SlideCarouselCanhGioiAi"
        component={SlideCarouselCanhGioiAi}
        durationInFrames={10}
        fps={1}
        width={1080}
        height={1920}
      />
      <Composition
        id="CanhGioiAi"
        component={CanhGioiAi}
        durationInFrames={5871}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CanhGioiAiThumbnail"
        component={CanhGioiAiThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SlideCarouselKarpathyStory"
        component={SlideCarouselKarpathyStory}
        durationInFrames={8}
        fps={1}
        width={1080}
        height={1920}
      />
      <Composition
        id="KarpathyTruyenKy"
        component={KarpathyTruyenKy}
        durationInFrames={5049}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="KarpathyTruyenKyThumbnail"
        component={KarpathyTruyenKyThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SlideCarouselSamAltmanStory"
        component={SlideCarouselSamAltmanStory}
        durationInFrames={8}
        fps={1}
        width={1080}
        height={1920}
      />
      <Composition
        id="SamAltmanTruyenKy"
        component={SamAltmanTruyenKy}
        durationInFrames={4800}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SamAltmanTruyenKyThumbnail"
        component={SamAltmanTruyenKyThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SlideCarouselClaudeOpus48"
        component={SlideCarouselClaudeOpus48}
        durationInFrames={8}
        fps={1}
        width={1080}
        height={1920}
      />
      <Composition
        id="ClaudeOpus48TruyenKy"
        component={ClaudeOpus48TruyenKy}
        durationInFrames={5000}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ClaudeOpus48TruyenKyThumbnail"
        component={ClaudeOpus48TruyenKyThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ClaudeOpus48Blueprint"
        component={ClaudeOpus48Blueprint}
        durationInFrames={5000}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ClaudeOpus48BlueprintThumbnail"
        component={ClaudeOpus48BlueprintThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CommitTaCong"
        component={CommitTaCong}
        durationInFrames={3980}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CommitTaCongThumbnail"
        component={CommitTaCongThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ThanChuDanTech"
        component={ThanChuDanTech}
        durationInFrames={3376}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ThanChuDanTechThumbnail"
        component={ThanChuDanTechThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Top7FixBug"
        component={Top7FixBug}
        durationInFrames={2894}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Top7FixBugThumbnail"
        component={Top7FixBugThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="DauHieuAiXamNhap"
        component={DauHieuAiXamNhap}
        durationInFrames={3498}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="DauHieuAiXamNhapThumbnail"
        component={DauHieuAiXamNhapThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Top7TesterQuotes"
        component={Top7TesterQuotes}
        durationInFrames={2540}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Top7TesterQuotesThumbnail"
        component={Top7TesterQuotesThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SeniorDevXuyenKhong"
        component={SeniorDevXuyenKhong}
        durationInFrames={3045}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SeniorDevXuyenKhongThumbnail"
        component={SeniorDevXuyenKhongThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="DieuKhongAiThuaNhan"
        component={DieuKhongAiThuaNhan}
        durationInFrames={2813}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="DieuKhongAiThuaNhanThumbnail"
        component={DieuKhongAiThuaNhanThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="DauHieuSenior"
        component={DauHieuSenior}
        durationInFrames={3572}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="DauHieuSeniorThumbnail"
        component={DauHieuSeniorThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="GpuThanKhi"
        component={GpuThanKhi}
        durationInFrames={3528}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="GpuThanKhiThumbnail"
        component={GpuThanKhiThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="HeThongTauHoa"
        component={HeThongTauHoa}
        durationInFrames={3969}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="HeThongTauHoaThumbnail"
        component={HeThongTauHoaThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ToiLoiGitDao"
        component={ToiLoiGitDao}
        durationInFrames={3734}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ToiLoiGitDaoThumbnail"
        component={ToiLoiGitDaoThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="DaoToXuyenKhong"
        component={DaoToXuyenKhong}
        durationInFrames={4254}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="DaoToXuyenKhongThumbnail"
        component={DaoToXuyenKhongThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="KubernetesTamGioi"
        component={KubernetesTamGioi}
        durationInFrames={2816}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="KubernetesTamGioiThumbnail"
        component={KubernetesTamGioiThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CudaTruyenKy"
        component={CudaTruyenKy}
        durationInFrames={4409}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CudaTruyenKyThumbnail"
        component={CudaTruyenKyThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="GitDaoTruyenThuyet"
        component={GitDaoTruyenThuyet}
        durationInFrames={3076}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="GitDaoTruyenThuyetThumbnail"
        component={GitDaoTruyenThuyetThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="FrontendVsDesigner"
        component={FrontendVsDesigner}
        durationInFrames={3790}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="FrontendVsDesignerThumbnail"
        component={FrontendVsDesignerThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SalesVsEngineering"
        component={SalesVsEngineering}
        durationInFrames={4593}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SalesVsEngineeringThumbnail"
        component={SalesVsEngineeringThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="DongMonNguyHiem"
        component={DongMonNguyHiem}
        durationInFrames={4002}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="DongMonNguyHiemThumbnail"
        component={DongMonNguyHiemThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CacheThanKhi"
        component={CacheThanKhi}
        durationInFrames={4007}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CacheThanKhiThumbnail"
        component={CacheThanKhiThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="BackendTamMa"
        component={BackendTamMa}
        durationInFrames={4308}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="BackendTamMaThumbnail"
        component={BackendTamMaThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CommentChanDong"
        component={CommentChanDong}
        durationInFrames={3805}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CommentChanDongThumbnail"
        component={CommentChanDongThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="MicroserviceDaiTran"
        component={MicroserviceDaiTran}
        durationInFrames={4204}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="MicroserviceDaiTranThumbnail"
        component={MicroserviceDaiTranThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="GioiHanKiemTu"
        component={GioiHanKiemTu}
        durationInFrames={2922}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="GioiHanKiemTuThumbnail"
        component={GioiHanKiemTuThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="NetworkTruyenAm"
        component={NetworkTruyenAm}
        durationInFrames={5637}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="NetworkTruyenAmThumbnail"
        component={NetworkTruyenAmThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="PmVsDevHieuLam"
        component={PmVsDevHieuLam}
        durationInFrames={3976}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="PmVsDevHieuLamThumbnail"
        component={PmVsDevHieuLamThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="IndexThanThu"
        component={IndexThanThu}
        durationInFrames={4450}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="IndexThanThuThumbnail"
        component={IndexThanThuThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="DesignPatternTruyenThua"
        component={DesignPatternTruyenThua}
        durationInFrames={4300}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="DesignPatternTruyenThuaThumbnail"
        component={DesignPatternTruyenThuaThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TruyenThuyetCoThat"
        component={TruyenThuyetCoThat}
        durationInFrames={6693}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TruyenThuyetCoThatThumbnail"
        component={TruyenThuyetCoThatThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="WebhookDao"
        component={WebhookDao}
        durationInFrames={3504}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="WebhookDaoThumbnail"
        component={WebhookDaoThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SinhVatThanBi"
        component={SinhVatThanBi}
        durationInFrames={6498}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SinhVatThanBiThumbnail"
        component={SinhVatThanBiThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TodoThuongCo"
        component={TodoThuongCo}
        durationInFrames={4452}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TodoThuongCoThumbnail"
        component={TodoThuongCoThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="RabbitmqDao"
        component={RabbitmqDao}
        durationInFrames={4369}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="RabbitmqDaoThumbnail"
        component={RabbitmqDaoThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CodeDaoNhapMon"
        component={CodeDaoNhapMon}
        durationInFrames={4990}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CodeDaoNhapMonThumbnail"
        component={CodeDaoNhapMonThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TienTeDao"
        component={TienTeDao}
        durationInFrames={7090}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TienTeDaoThumbnail"
        component={TienTeDaoThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="PovTester"
        component={PovTester}
        durationInFrames={5583}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="PovTesterThumbnail"
        component={PovTesterThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="PovBa"
        component={PovBa}
        durationInFrames={7164}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="PovBaThumbnail"
        component={PovBaThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="PovPo"
        component={PovPo}
        durationInFrames={6022}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="PovPoThumbnail"
        component={PovPoThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="GroupChatDongMon"
        component={GroupChatDongMon}
        durationInFrames={4569}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="GroupChatDongMonThumbnail"
        component={GroupChatDongMonThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="PovPm"
        component={PovPm}
        durationInFrames={8721}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="PovPmThumbnail"
        component={PovPmThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="QaDao"
        component={QaDao}
        durationInFrames={7480}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="QaDaoThumbnail"
        component={QaDaoThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TcpDao"
        component={TcpDao}
        durationInFrames={6650}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TcpDaoThumbnail"
        component={TcpDaoThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TuSiCuoiThang"
        component={TuSiCuoiThang}
        durationInFrames={4951}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TuSiCuoiThangThumbnail"
        component={TuSiCuoiThangThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="GrpcDao"
        component={GrpcDao}
        durationInFrames={12160}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="GrpcDaoThumbnail"
        component={GrpcDaoThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="PovDevops"
        component={PovDevops}
        durationInFrames={8916}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="PovDevopsThumbnail"
        component={PovDevopsThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="PovKetoan"
        component={PovKetoan}
        durationInFrames={5765}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="PovKetoanThumbnail"
        component={PovKetoanThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SeniorJunior"
        component={SeniorJunior}
        durationInFrames={5220}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SeniorJuniorThumbnail"
        component={SeniorJuniorThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="HttpSessionJwt"
        component={HttpSessionJwt}
        durationInFrames={8872}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="HttpSessionJwtThumbnail"
        component={HttpSessionJwtThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="PovKtv"
        component={PovKtv}
        durationInFrames={6430}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="PovKtvThumbnail"
        component={PovKtvThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ThienCoSu"
        component={ThienCoSu}
        durationInFrames={6604}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ThienCoSuThumbnail"
        component={ThienCoSuThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CleanArch"
        component={CleanArch}
        durationInFrames={7692}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CleanArchThumbnail"
        component={CleanArchThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="PovCreator"
        component={PovCreator}
        durationInFrames={5410}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="PovCreatorThumbnail"
        component={PovCreatorThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="HoaTuKiemTu"
        component={HoaTuKiemTu}
        durationInFrames={6525}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="HoaTuKiemTuThumbnail"
        component={HoaTuKiemTuThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SalesDao"
        component={SalesDao}
        durationInFrames={6180}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SalesDaoThumbnail"
        component={SalesDaoThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="MeetingDao"
        component={MeetingDao}
        durationInFrames={5889}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="MeetingDaoThumbnail"
        component={MeetingDaoThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="MoiGioiDao"
        component={MoiGioiDao}
        durationInFrames={6192}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="MoiGioiDaoThumbnail"
        component={MoiGioiDaoThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="QaVsDev"
        component={QaVsDev}
        durationInFrames={6421}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="QaVsDevThumbnail"
        component={QaVsDevThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="RaceCondition"
        component={RaceCondition}
        durationInFrames={10537}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="RaceConditionThumbnail"
        component={RaceConditionThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ThuongKhach"
        component={ThuongKhach}
        durationInFrames={7408}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ThuongKhachThumbnail"
        component={ThuongKhachThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="HoaTu"
        component={HoaTu}
        durationInFrames={6203}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="HoaTuThumbnail"
        component={HoaTuThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="NhanSu"
        component={NhanSu}
        durationInFrames={5395}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="NhanSuThumbnail"
        component={NhanSuThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CodeReview"
        component={CodeReview}
        durationInFrames={6328}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CodeReviewThumbnail"
        component={CodeReviewThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="HoDao"
        component={HoDao}
        durationInFrames={6347}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="HoDaoThumbnail"
        component={HoDaoThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Helpdesk"
        component={Helpdesk}
        durationInFrames={4286}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="HelpdeskThumbnail"
        component={HelpdeskThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TruMa"
        component={TruMa}
        durationInFrames={5845}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TruMaThumbnail"
        component={TruMaThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TanTuSi"
        component={TanTuSi}
        durationInFrames={6946}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TanTuSiThumbnail"
        component={TanTuSiThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="XKiro"
        component={XKiro}
        durationInFrames={2075}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ bgm: true }}
      />
      <Composition
        id="XKiroNoBgm"
        component={XKiro}
        durationInFrames={2075}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ bgm: false }}
      />
      <Composition
        id="TuCodeFootage"
        component={TuCodeFootage}
        durationInFrames={729}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ bgm: true }}
      />
      <Composition
        id="TuCodeCliff"
        component={TuCodeCliff}
        durationInFrames={810}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ bgm: true }}
      />
      <Composition
        id="TuCodeCliffNoBgm"
        component={TuCodeCliff}
        durationInFrames={810}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ bgm: false }}
      />
      <Composition
        id="HoaNgonThumbnail"
        component={HoaNgonThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="HoaNgon"
        component={HoaNgon}
        durationInFrames={3191}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ bgm: true }}
      />
      <Composition
        id="HoaNgonNoBgm"
        component={HoaNgon}
        durationInFrames={3191}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ bgm: false }}
      />
      <Composition
        id="ThienCoMatNgonThumbnail"
        component={ThienCoMatNgonThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ThienCoMatNgon"
        component={ThienCoMatNgon}
        durationInFrames={4021}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ bgm: true }}
      />
      <Composition
        id="ThienCoMatNgonNoBgm"
        component={ThienCoMatNgon}
        durationInFrames={4021}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ bgm: false }}
      />
      <Composition
        id="MatNgonBangHuuThumbnail"
        component={MatNgonBangHuuThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="MatNgonBangHuu"
        component={MatNgonBangHuu}
        durationInFrames={4799}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ bgm: true }}
      />
      <Composition
        id="OfficeBattleRoyale"
        component={OfficeBattleRoyale}
        durationInFrames={OBR_DURATION}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ sfx: true }}
      />
      <Composition
        id="OfficeBattleRoyaleSilent"
        component={OfficeBattleRoyale}
        durationInFrames={OBR_DURATION}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ sfx: false }}
      />
      <Composition
        id="MatNgonKiemTuThumbnail"
        component={MatNgonKiemTuThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="MatNgonKiemTu"
        component={MatNgonKiemTu}
        durationInFrames={9260}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ bgm: true }}
      />
      <Composition
        id="RbacDaoThumbnail"
        component={RbacDaoThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="RbacDao"
        component={RbacDao}
        durationInFrames={12523}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ bgm: true }}
      />
      <Composition
        id="MatNgonChieuMoThumbnail"
        component={MatNgonChieuMoThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="MatNgonChieuMo"
        component={MatNgonChieuMo}
        durationInFrames={9276}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ bgm: true }}
      />
      <Composition
        id="MatNgonChieuMoNoBgm"
        component={MatNgonChieuMo}
        durationInFrames={9276}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ bgm: false }}
      />
      <Composition
        id="RbacDaoNoBgm"
        component={RbacDao}
        durationInFrames={12523}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ bgm: false }}
      />
      <Composition
        id="MatNgonKiemTuNoBgm"
        component={MatNgonKiemTu}
        durationInFrames={9260}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ bgm: false }}
      />
      <Composition
        id="MatNgonBangHuuNoBgm"
        component={MatNgonBangHuu}
        durationInFrames={4799}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ bgm: false }}
      />
      <Composition
        id="TuCodeThumbnail"
        component={TuCodeThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TuCode"
        component={TuCode}
        durationInFrames={729}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ bgm: true }}
      />
      <Composition
        id="XKiroThumbnail"
        component={XKiroThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CloudflareDdos"
        component={CloudflareDdos}
        durationInFrames={6856}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CloudflareDdosThumbnail"
        component={CloudflareDdosThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SlideCarouselItFaCanhGioi"
        component={SlideCarouselItFaCanhGioi}
        durationInFrames={8}
        fps={1}
        width={1080}
        height={1920}
      />
      <Composition
        id="ItFaCanhGioi"
        component={ItFaCanhGioi}
        durationInFrames={4360}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ItFaCanhGioiThumbnail"
        component={ItFaCanhGioiThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SlideCarouselTop7DaoHuu"
        component={SlideCarouselTop7DaoHuu}
        durationInFrames={8}
        fps={1}
        width={1080}
        height={1920}
      />
      <Composition
        id="Top7DaoHuu"
        component={Top7DaoHuu}
        durationInFrames={3400}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Top7DaoHuuThumbnail"
        component={Top7DaoHuuThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SlideCarouselNguoiKhongHop"
        component={SlideCarouselNguoiKhongHop}
        durationInFrames={8}
        fps={1}
        width={1080}
        height={1920}
      />
      <Composition
        id="NguoiKhongHopNhanGian"
        component={NguoiKhongHopNhanGian}
        durationInFrames={3120}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="NguoiKhongHopNhanGianThumbnail"
        component={NguoiKhongHopNhanGianThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SlideCarouselTop7Manager"
        component={SlideCarouselTop7Manager}
        durationInFrames={8}
        fps={1}
        width={1080}
        height={1920}
      />
      <Composition
        id="Top7Manager"
        component={Top7Manager}
        durationInFrames={3720}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Top7ManagerThumbnail"
        component={Top7ManagerThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SlideCarouselDonGianDaiDao"
        component={SlideCarouselDonGianDaiDao}
        durationInFrames={8}
        fps={1}
        width={1080}
        height={1920}
      />
      <Composition
        id="DonGianDaiDao"
        component={DonGianDaiDao}
        durationInFrames={3240}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="DonGianDaiDaoThumbnail"
        component={DonGianDaiDaoThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="DonGianDaiDaoAnimated"
        component={DonGianDaiDaoAnimated}
        durationInFrames={3240}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CodingTangThapNhat"
        component={CodingTangThapNhat}
        durationInFrames={3500}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CodingTangThapNhatThumbnail"
        component={CodingTangThapNhatThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="EngineerSongSotAi"
        component={EngineerSongSotAi}
        durationInFrames={4660}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="EngineerSongSotAiThumbnail"
        component={EngineerSongSotAiThumbnail}
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
        id="BlockyStageTest"
        component={BlockyStageTest}
        durationInFrames={BLOCKY_STAGE_TEST_DURATION}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="PovNoFlushThumbnail"
        component={PovNoFlushThumbnail}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="PovNoFlush"
        component={PovNoFlush}
        durationInFrames={POV_NOFLUSH_DURATION}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="BlockyCharSheet"
        component={BlockyCharSheet}
        durationInFrames={180}
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
