import React from 'react';
import {
  Hero,
  Pose,
  basePose,
  poseAt,
  faceAt,
  walkPose,
  feetBelowHips,
  joints,
  toWorld,
  HEAD,
  LEG_LEN,
  C,
  LOOKS,
  camT,
  camZoom,
  kf,
  lerp,
  clamp,
  easeOut,
  easeInOut,
  backOut,
  settle,
  rnd,
  FONT,
  UI,
  Glow,
  LightVeil,
  Dust,
  Foreground,
  FocusRings,
  Sparkle,
  TitleCard,
  Tag,
  Dial,
  Bed,
  Desk,
  Laptop,
  Mug,
  Lamp,
  BookStack,
  Study,
  STUDY,
  Stairwell,
  hipGround,
  Banister,
  Classroom,
  CLASS,
  Student,
  Rooftop,
  Kitchen,
  KITCHEN,
  KitchenIsland,
  Tabletop,
  Bedroom,
  BEDROOM,
  Schematic,
  SCH,
  SchBox,
  SchArrow,
  SchLabel,
  ZOO,
  ShotProps,
  InsertArm,
  StreetRain,
  SurveillanceLab,
  SubwayCar,
  BioMedLab,
  ForestCanopy,
  OceanAbyss,
  ObservatoryDome,
  HospitalICU,
  CityHighway,
  ServerVault,
  stand,
} from '../../engine';

// ============================================================================
// EPISODE: ĐIỀU GÌ XẢY RA NẾU BẠN KHÔNG BAO GIỜ CẦN NGỦ NỮA? (zero-sleep-8m)
// 140 100% Unique Shots (Sh1..Sh140) — Strict 1-Cut-1-Shot Policy (0 Repeats)
// ============================================================================

const PIP = LOOKS.pipHood;
const MO = LOOKS.mo;
const SIS = LOOKS.sis;
const MOM = LOOKS.mom;
const SUIT = LOOKS.suit;

const CYAN = '#4CC9F0';
const GREEN = '#39FF88';
const AMBER = '#FF9F1C';
const CRIMSON = '#FF3B4E';
const VIOLET = '#B57BFF';

/** Screen-space telemetry banner rendered outside camT so it never clips under camera zoom. */
const AwakeOverlay: React.FC<{ t: number; label: string; color?: string }> = ({
  t,
  label,
  color = CYAN,
}) => {
  const pulse = 0.55 + 0.35 * Math.sin(t * 0.22);
  const bw = Math.max(780, Math.min(1560, Math.round(label.length * 17.5 + 72)));
  return (
    <g>
      <rect
        x={28}
        y={28}
        width={1864}
        height={1024}
        rx={26}
        fill="none"
        stroke={color}
        strokeWidth={4}
        opacity={pulse * 0.45}
      />
      <g transform="translate(960 985)">
        <rect x={-bw / 2} y={-28} width={bw} height={52} rx={14} fill="#080D1A" opacity={0.9} stroke={color} strokeWidth={2.5} />
        <text x={0} y={7} textAnchor="middle" fontFamily={FONT.ui} fontWeight={800} fontSize={23} fill={color} letterSpacing={2}>
          {label}
        </text>
      </g>
    </g>
  );
};

const NeuroBoard: React.FC<{ t: number; hallucinate?: boolean }> = ({ t, hallucinate = false }) => (
  <g transform="translate(960 355)">
    <rect x={-420} y={-130} width={840} height={260} rx={10} fill="#182B29" stroke="#3D2B1F" strokeWidth={12} />
    <text x={0} y={-68} textAnchor="middle" fontFamily={FONT.ui} fontWeight={800} fontSize={28} fill="#A8F0D8">
      SINH HỌC THẦN KINH · CHU KỲ GIẤC NGỦ REM & NREM
    </text>
    <text x={0} y={-12} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={30} fill="#FFF5D6">
      ADENOSINE + THỤ THỂ A2A → ÁP LỰC NGỦ SÂU
    </text>
    {hallucinate ? (
      <g opacity={0.85}>
        <path
          d={`M -340 55 Q -170 ${10 + Math.sin(t * 0.2) * 35} 0 55 T 340 55`}
          stroke={VIOLET}
          strokeWidth={6}
          fill="none"
        />
        <circle cx={-180 + Math.sin(t * 0.12) * 40} cy={45} r={14} fill={CYAN} opacity={0.7} />
        <circle cx={160 + Math.cos(t * 0.12) * 40} cy={48} r={16} fill={AMBER} opacity={0.7} />
      </g>
    ) : (
      <text x={0} y={58} textAnchor="middle" fontFamily={FONT.ui} fontSize={24} fill="#8FD8C0">
        ĐỘT BIẾN DEC2: KHÓA VĨNH VIỄN CÔNG TẮC VLPO
      </text>
    )}
  </g>
);

// ============================================================================
// SCENE 1 — bedroom_awakening (Beats 1–2, Sh1..Sh6)
// ============================================================================

// --- Sh1: Macro insert on digital nightstand clock at 03:14 AM as Pip's InsertArm reaches in ---
export const Sh1: React.FC<ShotProps> = ({ t }) => {
  const handX = kf(t, [[0, 1520], [32, 1210], [68, 1140], [96, 1180]]);
  const handY = kf(t, [[0, 380], [32, 490], [68, 515], [96, 495]]);
  const sec = Math.floor(t / 24) % 60;
  return (
    <g>
      <g transform={camT(960, 540, camZoom(t, 1.04, 1.18, 96))}>
        <Tabletop />
        <Glow x={820} y={520} r={540} o={0.38} />
        {/* Untouched Pillow on Left */}
        <g transform="translate(420 620)">
          <rect x={-180} y={-70} width={360} height={140} rx={48} fill="#D8E2F0" stroke="#1C2236" strokeWidth={6} />
          <text x={0} y={8} textAnchor="middle" fontFamily={FONT.ui} fontSize={22} fill="#364260">
            GỐI CHƯA HỀ CHẠM ĐẦU
          </text>
        </g>
        {/* Red/Cyan Digital Clock */}
        <g transform="translate(880 540)">
          <rect x={-230} y={-110} width={460} height={210} rx={24} fill="#0D1220" stroke={CYAN} strokeWidth={6} />
          <text x={0} y={18} textAnchor="middle" fontFamily={FONT.ui} fontWeight={900} fontSize={92} fill={CRIMSON}>
            {`03:14:${sec < 10 ? '0' : ''}${sec}`}
          </text>
          <text x={0} y={72} textAnchor="middle" fontFamily={FONT.ui} fontSize={22} fill={CYAN}>
            36 GIỜ THỨC TRẮNG LIÊN TIẾP
          </text>
        </g>
        <InsertArm x0={1920} y0={280} x1={handX} y1={handY} curve={28} sleeveColor={C.jacket} />
      </g>
      <AwakeOverlay t={t} label="03:14 AM · 36 GIỜ KHÔNG NGỦ · TỈNH TÁO 100%" />
    </g>
  );
};

// --- Sh2: Wide shot of Bedroom at 03:14 AM — Pip sits upright on bed with glowing cyan eyes ---
const S2_PIP = stand(BEDROOM, 0.56, 0.48);
export const Sh2: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: S2_PIP.x, y: S2_PIP.y - 25, scale: S2_PIP.scale, yaw: -0.25, armL: { a: 28, b: 15 }, armR: { a: 45, b: 25 } } },
    { f: 34, p: { headTilt: -8, armR: { a: 85, b: 35 } } },
    { f: 72, p: { headTilt: 4, armL: { a: 55, b: 20 }, armR: { a: 62, b: 18 } } },
    { f: 100, p: { headTilt: -4, armR: { a: 95, b: 30 } } },
  ]);
  const face = faceAt(t, [[0, 'neutral'], [28, 'cool'], [64, 'happy']]);
  return (
    <g transform={camT(960, 520, camZoom(t, 1.0, 1.12, 96))}>
      <Bedroom t={t} id="sh2bed" veil={0.34} />
      <Hero look={PIP} pose={{ ...pose, ...face, glint: 1, glintColor: CYAN }} shadow={0.35} rimId="rimR" />
      <Tag x={960} y={175} t={t - 4} text="KHÔNG MỘT CÁI NGÁP · 03:14 AM" color={CYAN} />
    </g>
  );
};

// --- Sh3: Extreme close-up on Pip's wide-awake eyes with cyan FocusRings ---
export const Sh3: React.FC<ShotProps> = ({ t }) => {
  const sc = 3.5;
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 610 - HEAD.y * sc, scale: sc, yaw: 0.12, look: -0.3 } },
    { f: 32, p: { look: 0.35, headTilt: -4 } },
    { f: 68, p: { look: 0.0, headTilt: 3 } },
    { f: 96, p: { look: -0.2, headTilt: -2 } },
  ]);
  return (
    <g>
      <g transform={camT(960, 540, camZoom(t, 1.02, 1.14, 96))}>
        <g filter="url(#blur16)">
          <Bedroom t={t} id="sh3bed" veil={0.48} />
        </g>
        <Hero look={PIP} pose={{ ...pose, expr: 'cool', glint: 1, glintColor: CYAN }} shadow={0} rimId="rimR" />
        <g transform="translate(960 440) scale(0.48)">
          <FocusRings f={t} color={CYAN} />
        </g>
      </g>
      <AwakeOverlay t={t} label="THỤ THỂ ADENOSINE: BỊ KHÓA HOÀN TOÀN" />
    </g>
  );
};

// --- Sh4: Schematic of Adenosine molecules bouncing off Pip's cortical receptor shield ---
export const Sh4: React.FC<ShotProps> = ({ t }) => {
  const wave = (t * 6) % 240;
  return (
    <g transform={camT(960, 540, camZoom(t, 1.0, 1.08, 96))}>
      <Schematic t={t} id="sh4sch" />
      <SchLabel x={960} y={115} t={t - 1} text="CƠ CHẾ CHỐNG BUỒN NGỦ: MÀNG CHẮN THỤ THỂ ADENOSINE A2A" size={38} color={CYAN} />
      <SchBox x={380} y={480} w={420} h={210} t={t - 2} label="PHÂN TỬ ADENOSINE" sub="CHẤT GÂY MỆT MỎI TỰ NHIÊN" color={AMBER} />
      <SchArrow x0={600} y0={480} x1={920} y1={480} t={t - 5} color={AMBER} />
      {/* Glowing Receptor Shield */}
      <g transform="translate(1060 480)">
        <path d="M -60 -160 Q 40 0 -60 160" stroke={CYAN} strokeWidth={12} fill="none" />
        <circle cx={-95 - (wave % 90)} cy={-60} r={16} fill={AMBER} />
        <circle cx={-85 - ((wave + 45) % 90)} cy={55} r={16} fill={AMBER} />
      </g>
      <SchBox x={1420} y={480} w={440} h={210} t={t - 8} label="VỎ NÃO TRƯỚC TRÁN" sub="0% TÍN HIỆU BUỒN NGỦ" color={GREEN} />
      <SchLabel x={960} y={840} t={t - 10} text="MỌI THỤ THỂ MỆT MỎI ĐỀU IM LẶNG TUYỆT ĐỐI" size={32} color={SCH.live} />
    </g>
  );
};

// --- Sh5: Medium shot by Bedroom window — Pip stretches energized while city sleeps ---
export const Sh5: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 1120, y: 720, scale: 1.18, yaw: -0.35, armL: { a: 45, b: 20 }, armR: { a: 60, b: 25 } } },
    { f: 35, p: { armL: { a: 145, b: 15 }, armR: { a: 150, b: 15 }, headTilt: -8 } },
    { f: 70, p: { armL: { a: 95, b: 25 }, armR: { a: 110, b: 20 }, headTilt: 4 } },
    { f: 100, p: { armL: { a: 130, b: 18 }, armR: { a: 135, b: 18 } } },
  ]);
  const face = faceAt(t, [[0, 'happy'], [42, 'cool'], [78, 'happy']]);
  return (
    <g transform={camT(1060, 520, camZoom(t, 1.22, 1.34, 96))}>
      <Bedroom t={t + 40} id="sh5bed" veil={0.3} />
      <Hero look={PIP} pose={{ ...pose, ...face, glint: 0.9, glintColor: CYAN }} shadow={0.35} rimId="rimL" />
      <Sparkle x={1120} y={420} t={t - 8} s={2.1} />
    </g>
  );
};

// --- Sh6: Over the shoulder looking at Pip's glowing midnight notebook ---
export const Sh6: React.FC<ShotProps> = ({ t }) => {
  const penX = kf(t, [[0, 820], [32, 1080], [64, 860], [96, 1120]]);
  return (
    <g transform={camT(960, 540, camZoom(t, 1.05, 1.16, 96))}>
      <Tabletop />
      <g transform="translate(960 520)">
        <rect x={-440} y={-240} width={880} height={480} rx={18} fill="#F4EEE1" stroke="#241E30" strokeWidth={8} />
        <line x1={0} y1={-230} x2={0} y2={230} stroke="#D5C8B4" strokeWidth={4} />
        <text x={-220} y={-140} textAnchor="middle" fontFamily={FONT.ui} fontWeight={800} fontSize={28} fill="#1E2436">
          NHẬT KÝ THỨC TRẮNG
        </text>
        <text x={-220} y={-65} textAnchor="middle" fontFamily={FONT.ui} fontSize={24} fill="#2B6CB0">
          • GIỜ THỨ 36: TỈNH TÁO 100%
        </text>
        <text x={-220} y={0} textAnchor="middle" fontFamily={FONT.ui} fontSize={24} fill="#2B6CB0">
          • TỐC ĐỘ ĐỌC: +180%
        </text>
        <text x={220} y={-110} textAnchor="middle" fontFamily={FONT.ui} fontWeight={800} fontSize={28} fill="#C53030">
          MỤC TIÊU ĐÊM NAY:
        </text>
        <text x={220} y={-35} textAnchor="middle" fontFamily={FONT.ui} fontSize={24} fill="#1E2436">
          ĐÀI THIÊN VĂN 05:30 AM
        </text>
      </g>
      <InsertArm x0={1860} y0={980} x1={penX} y1={560} curve={-24} sleeveColor={C.jacket} />
      <Foreground x={240} side="left" />
    </g>
  );
};

// ============================================================================
// SCENE 2 — subway_dawn (Beats 3–4, Sh7..Sh12)
// ============================================================================

// --- Sh7: Wide shot inside SubwayCar at 04:00 AM — Passengers asleep while Pip reads upright ---
export const Sh7: React.FC<ShotProps> = ({ t }) => {
  const pipPose = poseAt(t, [
    { f: 0, p: { x: 960, y: 590, scale: 0.96, yaw: 0.15, legL: { a: 75, b: -75 }, legR: { a: 75, b: -75 }, armR: { a: 55, b: 45 }, armL: { a: 48, b: 40 } } },
    { f: 40, p: { headTilt: -6, armR: { a: 68, b: 52 } } },
    { f: 85, p: { headTilt: 5, armR: { a: 52, b: 42 } } },
  ]);
  const sleeperL: Pose = { ...basePose, x: 320, y: 595, scale: 0.9, yaw: 0.4, tilt: 18, headTilt: 28, expr: 'tired', blink: 1, legL: { a: 75, b: -75 }, legR: { a: 75, b: -75 } };
  const sleeperR: Pose = { ...basePose, x: 1560, y: 595, scale: 0.9, yaw: -0.4, tilt: -16, headTilt: -26, expr: 'tired', blink: 1, legL: { a: 75, b: -75 }, legR: { a: 75, b: -75 } };
  return (
    <g transform={camT(960, 520, camZoom(t, 1.0, 1.09, 96))}>
      <SubwayCar t={t} id="sh7sub" stationText="04:00 AM · TUYẾN TÀU NGẦM SỐ 4 · HÀNH KHÁCH NGỦ GẬT" />
      <Hero look={MO} pose={sleeperL} shadow={0.3} rimId="rimR" />
      <Hero look={SUIT} pose={sleeperR} shadow={0.3} rimId="rimL" />
      <Hero look={PIP} pose={{ ...pipPose, expr: 'cool', glint: 0.9, glintColor: CYAN }} shadow={0.35} rimId="rimR" />
      <Tag x={960} y={250} t={t - 3} text="ĐỌC XONG 400 TRANG VẬT LÝ THIÊN VĂN" color={CYAN} />
    </g>
  );
};

// --- Sh8: Macro insert on Pip's InsertArms flipping pages of 400-page Astrophysics textbook ---
export const Sh8: React.FC<ShotProps> = ({ t }) => {
  const pageFlip = kf(t, [[0, -180], [28, 180], [30, -180], [62, 180], [64, -180], [96, 180]]);
  const handRX = kf(t, [[0, 1240], [32, 1120], [64, 1260], [96, 1140]]);
  return (
    <g transform={camT(960, 540, camZoom(t, 1.04, 1.16, 96))}>
      <Tabletop />
      <g transform="translate(960 540)">
        <rect x={-480} y={-270} width={960} height={540} rx={20} fill="#182238" stroke="#4CC9F0" strokeWidth={6} />
        <rect x={-450} y={-245} width={440} height={490} rx={10} fill="#F6EFE3" />
        <rect x={10} y={-245} width={440} height={490} rx={10} fill="#F6EFE3" />
        {/* Flipping page */}
        <line x1={0} y1={-245} x2={pageFlip} y2={245} stroke="#D9C6AE" strokeWidth={8} />
        <text x={-230} y={-140} textAnchor="middle" fontFamily={FONT.ui} fontWeight={800} fontSize={28} fill="#141824">
          VẬT LÝ THIÊN VĂN
        </text>
        <text x={-230} y={-60} textAnchor="middle" fontFamily={FONT.ui} fontSize={26} fill="#2B6CB0">
          ds² = -(1 - 2GM/rc²)dt²
        </text>
        <text x={230} y={-140} textAnchor="middle" fontFamily={FONT.ui} fontWeight={800} fontSize={28} fill="#C53030">
          TRANG 398 / 400
        </text>
        <path d="M 80 40 Q 220 -80 380 40" stroke="#2B6CB0" strokeWidth={6} fill="none" />
      </g>
      <InsertArm x0={420} y0={1060} x1={680} y1={700} curve={18} sleeveColor={C.jacket} />
      <InsertArm x0={1520} y0={1060} x1={handRX} y1={660} curve={-18} sleeveColor={C.jacket} />
    </g>
  );
};

// --- Sh9: Close-up on a sleeping commuter nodding on a subway strap vs sharp Pip behind ---
export const Sh9: React.FC<ShotProps> = ({ t }) => {
  const nod = Math.sin(t * 0.12) * 10;
  const commuterPose = poseAt(t, [
    { f: 0, p: { x: 680, y: 680, scale: 1.45, yaw: 0.35, headTilt: 22 + nod, tilt: 12, expr: 'tired', blink: 1 } },
    { f: 48, p: { headTilt: 32, tilt: 16 } },
    { f: 96, p: { headTilt: 20, tilt: 10 } },
  ]);
  const pipBg = poseAt(t, [
    { f: 0, p: { x: 1320, y: 640, scale: 1.05, yaw: -0.25, armR: { a: 72, b: 35 } } },
    { f: 48, p: { armR: { a: 95, b: 25 }, headTilt: -6 } },
    { f: 96, p: { armR: { a: 68, b: 38 }, headTilt: 4 } },
  ]);
  return (
    <g transform={camT(960, 520, camZoom(t, 1.12, 1.24, 96))}>
      <SubwayCar t={t + 30} id="sh9sub" />
      <Hero look={PIP} pose={{ ...pipBg, expr: 'cool', glint: 1, glintColor: CYAN }} shadow={0.3} rimId="rimL" />
      <Hero look={SUIT} pose={commuterPose} shadow={0.4} rimId="rimR" />
      <Tag x={1320} y={340} t={t - 4} text="TỈNH TÁO TUYỆT ĐỐI GIỮA TOA TÀU NGỦ GẬT" color={GREEN} />
    </g>
  );
};

// --- Sh10: Over the shoulder holographic formulas rising from Pip's textbook ---
export const Sh10: React.FC<ShotProps> = ({ t }) => {
  const riseY = kf(t, [[0, 560], [48, 410], [96, 330]]);
  return (
    <g transform={camT(960, 520, camZoom(t, 1.06, 1.18, 96))}>
      <SubwayCar t={t + 60} id="sh10sub" veil={0.42} />
      <Glow x={960} y={420} r={520} o={0.45} />
      <g transform={`translate(960 ${riseY})`}>
        <rect x={-460} y={-130} width={920} height={240} rx={20} fill="#091526" opacity={0.9} stroke={CYAN} strokeWidth={5} />
        <text x={0} y={-45} textAnchor="middle" fontFamily={FONT.ui} fontWeight={800} fontSize={36} fill={CYAN}>
          ∇²ψ - (1/c²) ∂²ψ/∂t² = (m₀c/ħ)²ψ
        </text>
        <text x={0} y={35} textAnchor="middle" fontFamily={FONT.ui} fontSize={28} fill={GREEN}>
          GHI NHỚ TỨC THÌ · TỐC ĐỘ XỬ LÝ LƯỢNG TỬ
        </text>
      </g>
      <Foreground x={260} side="left" />
    </g>
  );
};

// --- Sh11: Medium shot of Pip on SubwayCar jotting insights with glowing pen ---
export const Sh11: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 680, scale: 1.38, yaw: 0.2, armR: { a: 64, b: 42 }, armL: { a: 45, b: 30 } } },
    { f: 32, p: { armR: { a: 88, b: 28 }, headTilt: -7 } },
    { f: 64, p: { armR: { a: 58, b: 46 }, headTilt: 5 } },
    { f: 96, p: { armR: { a: 84, b: 30 }, headTilt: -4 } },
  ]);
  const face = faceAt(t, [[0, 'cool'], [36, 'happy'], [72, 'smug']]);
  return (
    <g transform={camT(960, 500, camZoom(t, 1.18, 1.3, 96))}>
      <SubwayCar t={t + 90} id="sh11sub" stationText="04:28 AM · GA ĐỒI THIÊN VĂN" />
      <Hero look={PIP} pose={{ ...pose, ...face, glint: 0.9, glintColor: CYAN }} shadow={0.35} rimId="rimR" />
      <Sparkle x={1080} y={460} t={t - 6} s={2.0} />
    </g>
  );
};

// --- Sh12: Extreme close-up on Pip's eye reflecting passing blue tunnel light streaks ---
export const Sh12: React.FC<ShotProps> = ({ t }) => {
  const sc = 3.8;
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 630 - HEAD.y * sc, scale: sc, yaw: 0.22, look: -0.25 } },
    { f: 45, p: { look: 0.3, headTilt: -3 } },
    { f: 96, p: { look: -0.1, headTilt: 3 } },
  ]);
  return (
    <g>
      <g transform={camT(960, 540, camZoom(t, 1.0, 1.12, 96))}>
        <SubwayCar t={t * 1.4} id="sh12sub" veil={0.48} />
        <Hero look={PIP} pose={{ ...pose, expr: 'cool', glint: 1, glintColor: CYAN }} shadow={0} rimId="rimR" />
      </g>
      <AwakeOverlay t={t} label="TRÍ NHỚ LÀM VIỆC: HOẠT ĐỘNG Ở CÔNG SUẤT CỰC ĐẠI" />
    </g>
  );
};

// ============================================================================
// SCENE 3 — observatory_sunrise (Beats 5–6, Sh13..Sh18)
// ============================================================================

// --- Sh13: Wide shot in ObservatoryDome at 05:30 AM — Mo arrives yawning with two coffees while Pip calibrates ---
export const Sh13: React.FC<ShotProps> = ({ t }) => {
  const moWalk = walkPose(kf(t, [[0, 380], [60, 640], [96, 680]]), t * 0.35, 710, 0.95, { expr: 'tired' }, 1);
  const pipPose = poseAt(t, [
    { f: 0, p: { x: 1180, y: 710 - LEG_LEN, scale: 1.0, yaw: -0.35, armL: { a: 85, b: 30 }, armR: { a: 60, b: 20 } } },
    { f: 45, p: { armL: { a: 125, b: 20 }, headTilt: -8 } },
    { f: 96, p: { armL: { a: 95, b: 25 }, armR: { a: 110, b: 25 } } },
  ]);
  return (
    <g transform={camT(960, 520, camZoom(t, 1.0, 1.08, 96))}>
      <ObservatoryDome t={t} id="sh13obs" />
      <Hero look={MO} pose={moWalk} shadow={0.35} rimId="rimR" />
      <Hero look={PIP} pose={{ ...pipPose, expr: 'happy', glint: 0.85, glintColor: CYAN }} shadow={0.35} rimId="rimL" />
      <Tag x={1180} y={320} t={t - 4} text="05:30 AM · ĐÃ HIỆU CHỈNH XONG TỪ NỬA ĐÊM" color={CYAN} />
    </g>
  );
};

// --- Sh14: Medium two-shot — Tired Mo with dark eye rings vs hyper-fresh Pip ---
export const Sh14: React.FC<ShotProps> = ({ t }) => {
  const moPose = poseAt(t, [
    { f: 0, p: { x: 720, y: 720, scale: 1.22, yaw: 0.3, tilt: 8, headTilt: 14, armR: { a: 58, b: 40 } } },
    { f: 45, p: { headTilt: 22, tilt: 12, armR: { a: 48, b: 35 } } },
    { f: 96, p: { headTilt: 10, tilt: 6, armR: { a: 66, b: 42 } } },
  ]);
  const pipPose = poseAt(t, [
    { f: 0, p: { x: 1180, y: 720, scale: 1.22, yaw: -0.3, armL: { a: 95, b: 25 }, armR: { a: 45, b: 15 } } },
    { f: 45, p: { armL: { a: 135, b: 18 }, headTilt: -6 } },
    { f: 96, p: { armL: { a: 108, b: 22 }, headTilt: 4 } },
  ]);
  const moHand = toWorld(moPose, joints(moPose).armR.end);
  return (
    <g transform={camT(950, 510, camZoom(t, 1.18, 1.28, 96))}>
      <ObservatoryDome t={t + 30} id="sh14obs" />
      <Hero look={MO} pose={{ ...moPose, ...faceAt(t, [[0, 'tired'], [38, 'shock']]) }} shadow={0.35} rimId="rimR" />
      <Mug x={moHand.x} y={moHand.y} />
      <Hero look={PIP} pose={{ ...pipPose, ...faceAt(t, [[0, 'happy'], [42, 'cool']]), glint: 0.9, glintColor: CYAN }} shadow={0.35} rimId="rimL" />
    </g>
  );
};

// --- Sh15: Macro insert on InsertArm turning brass & digital telescope micrometer dial ---
export const Sh15: React.FC<ShotProps> = ({ t }) => {
  const rotAng = kf(t, [[0, 0], [48, 145], [96, 280]]);
  const handX = kf(t, [[0, 1080], [48, 1020], [96, 1060]]);
  return (
    <g transform={camT(960, 540, camZoom(t, 1.04, 1.16, 96))}>
      <Tabletop />
      <Glow x={960} y={540} r={560} o={0.4} />
      <g transform="translate(960 540)">
        <circle r={240} fill="#161E30" stroke={CYAN} strokeWidth={8} />
        <g transform={`rotate(${rotAng})`}>
          <circle r={175} fill="#25324C" stroke={AMBER} strokeWidth={6} strokeDasharray="24 14" />
          <line x1={0} y1={-170} x2={0} y2={-90} stroke={GREEN} strokeWidth={8} />
        </g>
        <text x={0} y={12} textAnchor="middle" fontFamily={FONT.ui} fontWeight={800} fontSize={36} fill="#FFF">
          RA 14h 29m 42s
        </text>
      </g>
      <InsertArm x0={1880} y0={840} x1={handX} y1={560} curve={24} sleeveColor={C.jacket} />
    </g>
  );
};

// --- Sh16: Over Mo's shoulder looking at the completed orbital calibration console ---
export const Sh16: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, camZoom(t, 1.04, 1.15, 96))}>
    <ObservatoryDome t={t + 55} id="sh16obs" veil={0.38} />
    <g transform="translate(960 450)">
      <rect x={-480} y={-220} width={960} height={420} rx={20} fill="#091324" stroke={GREEN} strokeWidth={6} />
      <text x={0} y={-135} textAnchor="middle" fontFamily={FONT.ui} fontWeight={800} fontSize={32} fill={GREEN}>
        HỆ THỐNG KÍNH VIỄN VỌNG · HOÀN TẤT 100%
      </text>
      <circle cx={0} cy={15} r={95} fill="none" stroke={CYAN} strokeWidth={5} strokeDasharray="16 10" transform={`rotate(${t * 1.8})`} />
      <circle cx={0} cy={15} r={12} fill={AMBER} />
      <text x={0} y={160} textAnchor="middle" fontFamily={FONT.ui} fontSize={26} fill="#F6EFE3">
        ĐỘ CHÍNH XÁC QUỸ ĐẠO: 99,98% · LÚC 02:15 AM
      </text>
    </g>
    <Foreground x={280} side="left" />
  </g>
);

// --- Sh17: Low-angle shot of Pip standing against the sunrise rays piercing the dome ---
export const Sh17: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 720, scale: 1.28, yaw: 0.15, armL: { a: 32, b: 12 }, armR: { a: 48, b: 18 } } },
    { f: 45, p: { headTilt: -10, armR: { a: 112, b: 24 } } },
    { f: 96, p: { headTilt: -4, armR: { a: 78, b: 18 } } },
  ]);
  return (
    <g transform={camT(960, 480, camZoom(t, 1.12, 1.25, 96))}>
      <ObservatoryDome t={t + 80} id="sh17obs" veil={0.22} />
      <Glow x={960} y={280} r={680} o={0.55} />
      <Hero look={PIP} pose={{ ...pose, expr: 'cool', glint: 1, glintColor: AMBER }} shadow={0.4} rimId="rimR" />
      <Tag x={960} y={160} t={t - 3} text="BÌNH MINH THỨ 3 LIÊN TIẾP · 72 GIỜ THỨC" color={AMBER} />
    </g>
  );
};

// --- Sh18: Close-up on biometric wristwatch reading 72 HOURS AWAKE & 64 BPM ---
export const Sh18: React.FC<ShotProps> = ({ t }) => {
  const handX = kf(t, [[0, 920], [48, 960], [96, 940]]);
  return (
    <g>
      <g transform={camT(960, 540, camZoom(t, 1.06, 1.18, 96))}>
        <Tabletop />
        <InsertArm x0={220} y0={620} x1={handX} y1={540} curve={18} scale={1.35} sleeveColor={C.jacket}>
          <g transform="translate(-140 -10)">
            <rect x={-150} y={-95} width={300} height={190} rx={26} fill="#0A1220" stroke={GREEN} strokeWidth={6} />
            <text x={0} y={-28} textAnchor="middle" fontFamily={FONT.ui} fontWeight={800} fontSize={26} fill={CYAN}>
              72 GIỜ KHÔNG NGỦ
            </text>
            <text x={0} y={34} textAnchor="middle" fontFamily={FONT.ui} fontWeight={900} fontSize={44} fill={GREEN}>
              64 BPM
            </text>
          </g>
        </InsertArm>
      </g>
      <AwakeOverlay t={t} label="NHỊP TIM ỔN ĐỊNH: 64 NHỊP/PHÚT · KHÔNG HỀ MỆT MỎI" color={GREEN} />
    </g>
  );
};

// ============================================================================
// SCENE 4 — biomed_premise (Beats 7–12, Sh19..Sh34)
// ============================================================================

// --- Sh19: Grand Title Card over BioMedLab — "ĐIỀU GÌ XẢY RA NẾU BẠN KHÔNG BAO GIỜ CẦN NGỦ NỮA?" ---
export const Sh19: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 690, scale: 1.05, yaw: 0.1, armL: { a: 42, b: 18 }, armR: { a: 42, b: 18 } } },
    { f: 48, p: { armL: { a: 88, b: 22 }, armR: { a: 88, b: 22 }, headTilt: -6 } },
    { f: 96, p: { armL: { a: 58, b: 16 }, armR: { a: 58, b: 16 }, headTilt: 2 } },
  ]);
  return (
    <g transform={camT(960, 540, camZoom(t, 1.0, 1.08, 96))}>
      <BioMedLab t={t} id="sh19bio" headline="DỰ ÁN ĐỘT BIẾN GEN DEC2-ZERO" subline="3 QUY LUẬT SINH TỒN KHẮT KHE" />
      <Hero look={PIP} pose={{ ...pose, expr: 'cool', glint: 1, glintColor: CYAN }} shadow={0.4} rimId="rimR" />
      <TitleCard
        f={t}
        line1="ĐIỀU GÌ XẢY RA NẾU BẠN"
        line2="KHÔNG BAO GIỜ CẦN NGỦ NỮA?"
        accent={CYAN}
      />
    </g>
  );
};

// --- Sh20: Close-up on Pip inside BioMedLab cylinder as laser scan ring sweeps past ---
export const Sh20: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 740, scale: 1.55, yaw: -0.18, headTilt: -4 } },
    { f: 48, p: { yaw: 0.18, headTilt: 6 } },
    { f: 96, p: { yaw: -0.1, headTilt: -2 } },
  ]);
  return (
    <g transform={camT(960, 480, camZoom(t, 1.15, 1.28, 96))}>
      <BioMedLab t={t + 25} id="sh20bio" />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [36, 'cool']]), glint: 1, glintColor: GREEN }} shadow={0.3} rimId="rimR" />
      <Tag x={960} y={210} t={t - 3} text="QUÉT THẦN KINH TOÀN PHẦN · GEN DEC2" color={GREEN} />
    </g>
  );
};

// --- Sh21: Schematic — 81 Years Lifespan = 54 Years Awake + 27 Years Unconscious (1/3 of Life) ---
export const Sh21: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, camZoom(t, 1.0, 1.08, 96))}>
    <Schematic t={t} id="sh21sch" />
    <SchLabel x={960} y={115} t={t - 1} text="THỐNG KÊ VÒNG ĐỜI: 8 GIỜ NGỦ/NGÀY = 1/3 CUỘC ĐỜI" size={40} color={AMBER} />
    <SchBox x={560} y={480} w={520} h={240} t={t - 3} label="VÒNG ĐỜI 81 NĂM" sub="54 NĂM THỨC TỈNH HOẠT ĐỘNG" color={CYAN} />
    <SchArrow x0={830} y0={480} x1={1080} y1={480} t={t - 6} color={CRIMSON} />
    <SchBox x={1360} y={480} w={520} h={240} t={t - 8} label="27 NĂM VÔ THỨC" sub="NẰM BẤT ĐỘNG TRONG BÓNG TỐI" color={CRIMSON} />
    <SchLabel x={960} y={840} t={t - 10} text="MẤT TRỌN 27 NĂM TRÊN CHIẾC GIƯỜNG CỦA MÌNH" size={34} color={SCH.live} />
  </g>
);

// --- Sh22: Medium shot in dark Bedroom — Silhouette asleep while years count up 1 -> 27 ---
export const Sh22: React.FC<ShotProps> = ({ t }) => {
  const yrs = Math.min(27, Math.max(1, Math.round(lerp(1, 27, clamp(t / 75)))));
  return (
    <g transform={camT(960, 540, camZoom(t, 1.06, 1.18, 96))}>
      <Bedroom t={t} id="sh22bed" veil={0.46} />
      <Bed x={540} y={700} />
      <Dial x={1480} y={340} r={135} p={clamp(t / 80)} readout={`${yrs} NĂM`} size={46} />
      <Tag x={760} y={480} t={t - 4} text="1/3 CUỘC ĐỜI TRÔI QUA TRONG VÔ THỨC" color={AMBER} />
    </g>
  );
};

// --- Sh23: Macro insert on DNA double helix with glowing DEC2 mutation locus ---
export const Sh23: React.FC<ShotProps> = ({ t }) => {
  const target = { x: 960, y: 540 };
  return (
    <g transform={camT(960, 540, camZoom(t, 1.02, 1.14, 96))}>
      <Schematic t={t} id="sh23sch" />
      <SchLabel x={960} y={110} t={t - 1} text="QUY LUẬT 1: ĐỘT BIẾN KÉP TRÊN GEN DEC2 & THỤ THỂ A2A" size={38} color={GREEN} />
      {ZOO.drawAnatomyReticle({ x: target.x - 240, y: target.y, t, r: 78, color: GREEN, label: 'LOCUS GEN DEC2' })}
      {ZOO.drawOrganInset({
        targetX: target.x - 240,
        targetY: target.y,
        insetX: 1340,
        insetY: 500,
        r: 185,
        t,
        organ: 'dna',
        title: 'ĐỘT BIẾN GEN DEC2-ZERO',
        subtitle: 'KHÓA CÔNG TẮC NGỦ VLPO',
        color: GREEN,
      })}
    </g>
  );
};

// --- Sh24: Wide shot in BioMedLab — Mo and Pip inspect Rule 1 holographic receptor lock ---
export const Sh24: React.FC<ShotProps> = ({ t }) => {
  const moPose = poseAt(t, [
    { f: 0, p: { x: 640, y: 710, scale: 1.0, yaw: 0.35, armR: { a: 88, b: 25 } } },
    { f: 48, p: { armR: { a: 122, b: 18 }, headTilt: -6 } },
    { f: 96, p: { armR: { a: 74, b: 28 }, headTilt: 4 } },
  ]);
  const pipPose = poseAt(t, [
    { f: 0, p: { x: 1280, y: 710, scale: 1.0, yaw: -0.35, armL: { a: 68, b: 22 } } },
    { f: 48, p: { armL: { a: 115, b: 16 }, headTilt: -8 } },
    { f: 96, p: { armL: { a: 82, b: 24 }, headTilt: 3 } },
  ]);
  return (
    <g transform={camT(960, 520, camZoom(t, 1.0, 1.1, 96))}>
      <BioMedLab t={t + 40} id="sh24bio" headline="QUY LUẬT 1: KHÓA CÔNG TẮC VÙNG DƯỚI ĐỒI" subline="DUY TRÌ TỈNH TÁO 100% SUỐT NGÀY ĐÊM" />
      <Hero look={MO} pose={{ ...moPose, expr: 'cool' }} shadow={0.35} rimId="rimR" />
      <Hero look={PIP} pose={{ ...pipPose, expr: 'happy', glint: 1, glintColor: CYAN }} shadow={0.35} rimId="rimL" />
    </g>
  );
};

// --- Sh25: Extreme close-up on hypothalamic VLPO sleep switch clamped to OFF ---
export const Sh25: React.FC<ShotProps> = ({ t }) => {
  const clampX = kf(t, [[0, 140], [36, 0], [96, 0]]);
  return (
    <g>
      <g transform={camT(960, 540, camZoom(t, 1.04, 1.16, 96))}>
        <Schematic t={t} id="sh25sch" />
        <g transform="translate(960 520)">
          <circle r={210} fill="#101D33" stroke={CYAN} strokeWidth={7} />
          <rect x={-120 + clampX} y={-48} width={240} height={96} rx={18} fill="#143828" stroke={GREEN} strokeWidth={6} />
          <text x={clampX} y={12} textAnchor="middle" fontFamily={FONT.ui} fontWeight={900} fontSize={40} fill={GREEN}>
            TỈNH TÁO 100%
          </text>
        </g>
      </g>
      <AwakeOverlay t={t} label="VÙNG DƯỚI ĐỒI VLPO: KHÓA CỨNG TRẠNG THÁI THỨC" color={GREEN} />
    </g>
  );
};

// --- Sh26: Schematic of Rule 2 — +8 Hours/Day = +2,920 Hours/Year (+4.5 Months) ---
export const Sh26: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, camZoom(t, 1.0, 1.08, 96))}>
    <Schematic t={t} id="sh26sch" />
    <SchLabel x={960} y={115} t={t - 1} text="QUY LUẬT 2: DƯ RA 8 GIỜ HOẠT ĐỘNG MỖI NGÀY" size={40} color={CYAN} />
    <SchBox x={440} y={480} w={380} h={210} t={t - 2} label="+8 GIỜ / NGÀY" sub="24 GIỜ TỈNH TÁO" color={CYAN} />
    <SchArrow x0={640} y0={480} x1={760} y1={480} t={t - 4} color={CYAN} />
    <SchBox x={960} y={480} w={380} h={210} t={t - 6} label="+2.920 GIỜ / NĂM" sub="365 × 8 GIỜ" color={GREEN} />
    <SchArrow x0={1160} y0={480} x1={1280} y1={480} t={t - 8} color={GREEN} />
    <SchBox x={1480} y={480} w={380} h={210} t={t - 10} label="+4,5 THÁNG / NĂM" sub="SỐNG THÊM MỖI NĂM" color={AMBER} />
    <SchLabel x={960} y={840} t={t - 12} text="MỖI NĂM BẠN SỐNG DÀI HƠN NGƯỜI KHÁC GẦN NỬA NĂM" size={32} color={SCH.live} />
  </g>
);

// --- Sh27: Medium shot — Pip walks briskly forward while background figures stand frozen ---
export const Sh27: React.FC<ShotProps> = ({ t }) => {
  const walkX = kf(t, [[0, 620], [96, 1260]]);
  const pipWalk = walkPose(walkX, t * 0.55, 720, 1.12, { expr: 'happy', glint: 1, glintColor: CYAN }, 1);
  const frozen1: Pose = { ...basePose, x: 480, y: 720 - LEG_LEN * 0.95, scale: 0.95, yaw: 0.2, expr: 'tired', blink: 1 };
  const frozen2: Pose = { ...basePose, x: 1440, y: 720 - LEG_LEN * 0.95, scale: 0.95, yaw: -0.2, expr: 'tired', blink: 1 };
  return (
    <g transform={camT(960, 520, camZoom(t, 1.06, 1.18, 96))}>
      <BioMedLab t={t} id="sh27bio" headline=" +2.920 GIỜ TỈNH TÁO MỖI NĂM" subline="BƯỚC ĐI KHI THẾ GIỚI DỪNG LẠI" />
      <Hero look={MO} pose={frozen1} shadow={0.3} rimId="rimR" />
      <Hero look={SIS} pose={frozen2} shadow={0.3} rimId="rimL" />
      <Hero look={PIP} pose={pipWalk} shadow={0.4} rimId="rimR" />
    </g>
  );
};

// --- Sh28: Macro insert comparing Normal 16h Dial vs Pip's 24h Continuous Chronometer ---
export const Sh28: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, camZoom(t, 1.03, 1.14, 96))}>
    <Tabletop />
    <Dial x={580} y={480} r={160} p={0.66} readout="16 GIỜ" size={48} />
    <Tag x={580} y={740} t={t - 3} text="NGƯỜI BÌNH THƯỜNG (HẾT PIN LÚC 23:00)" color={AMBER} />
    <Dial x={1340} y={480} r={160} p={clamp(t / 85)} readout="24/24" size={52} />
    <Tag x={1340} y={740} t={t - 6} text="ĐỘT BIẾN DEC2 (CHẠY LIÊN TỤC KHÔNG NGHỈ)" color={GREEN} />
  </g>
);

// --- Sh29: Wide shot in BioMedLab — Rule 3 Thermal Metabolic Cost ---
export const Sh29: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 710, scale: 1.08, yaw: 0.12, armL: { a: 62, b: 20 }, armR: { a: 62, b: 20 } } },
    { f: 48, p: { armL: { a: 118, b: 15 }, armR: { a: 118, b: 15 }, headTilt: -6 } },
    { f: 96, p: { armL: { a: 78, b: 22 }, armR: { a: 78, b: 22 }, headTilt: 4 } },
  ]);
  return (
    <g transform={camT(960, 520, camZoom(t, 1.0, 1.1, 96))}>
      <BioMedLab t={t + 60} id="sh29bio" alert headline="QUY LUẬT 3: ĐỐT NHIÊN LIỆU CÔNG SUẤT BAN NGÀY 24/24" subline="KHÔNG CÓ PHA HẠ NHIỆT LÚC NỬA ĐÊM" />
      <Glow x={960} y={540} r={460} o={0.45} />
      <Hero look={PIP} pose={{ ...pose, expr: 'shock', glint: 1, glintColor: AMBER }} shadow={0.4} rimId="rimRed" />
    </g>
  );
};

// --- Sh30: Close-up thermal infrared scan of Pip's head & chest running at full daytime wattage ---
export const Sh30: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 780, scale: 1.85, yaw: 0.15, headTilt: -5 } },
    { f: 48, p: { yaw: -0.15, headTilt: 6 } },
    { f: 96, p: { yaw: 0.1, headTilt: -3 } },
  ]);
  return (
    <g>
      <g transform={camT(960, 500, camZoom(t, 1.08, 1.2, 96))}>
        <Schematic t={t} id="sh30sch" />
        <Glow x={960} y={480} r={520} o={0.5} />
        <Hero look={PIP} pose={{ ...pose, expr: 'worried', glint: 1, glintColor: AMBER }} shadow={0} rimId="rimRed" />
        <Tag x={960} y={200} t={t - 3} text="KHÔNG HẠ NHIỆT BAN ĐÊM · ĐỐT NĂNG LƯỢNG LIÊN TỤC" color={CRIMSON} />
      </g>
      <AwakeOverlay t={t} label="CÔNG SUẤT CHUYỂN HÓA: 100% SUỐT 24 GIỜ" color={AMBER} />
    </g>
  );
};

// --- Sh31: Schematic of cellular ATP turbine spinning at 100% across midnight ---
export const Sh31: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, camZoom(t, 1.0, 1.08, 96))}>
    <Schematic t={t} id="sh31sch" />
    <SchLabel x={960} y={115} t={t - 1} text="CHU TRÌNH TI THỂ A-TÊ-PÊ: KHÔNG CÓ KHOẢNG NGHỈ SINH HỌC" size={38} color={AMBER} />
    <g transform={`translate(960 490) rotate(${t * 5})`}>
      <circle r={165} fill="none" stroke={AMBER} strokeWidth={10} strokeDasharray="36 18" />
      <circle r={95} fill="none" stroke={CRIMSON} strokeWidth={6} strokeDasharray="18 12" />
    </g>
    <text x={960} y={502} textAnchor="middle" fontFamily={FONT.ui} fontWeight={900} fontSize={42} fill="#FFF">
      ATP 24/24
    </text>
    <SchLabel x={960} y={830} t={t - 6} text="TẾ BÀO THẦN KINH CHẠY LIÊN TỤC KHÔNG MỘT GIÂY TẮT MÁY" size={32} color={SCH.live} />
  </g>
);

// --- Sh32: Over the shoulder — Pip's InsertArm tosses the alarm clock into a bin ---
export const Sh32: React.FC<ShotProps> = ({ t }) => {
  const clockX = kf(t, [[0, 640], [45, 960], [96, 1180]]);
  const clockY = kf(t, [[0, 380], [45, 290], [96, 680]]);
  return (
    <g transform={camT(960, 540, camZoom(t, 1.04, 1.15, 96))}>
      <Bedroom t={t} id="sh32bed" veil={0.34} />
      {/* Bin on Right */}
      <g transform="translate(1180 740)">
        <polygon points="-90,-120 90,-120 68,90 -68,90" fill="#2A324B" stroke="#141824" strokeWidth={6} />
      </g>
      {/* Tossed Alarm Clock */}
      <g transform={`translate(${clockX} ${clockY}) rotate(${t * 4})`}>
        <circle r={54} fill={CRIMSON} stroke="#FFF" strokeWidth={5} />
        <line x1={0} y1={0} x2={0} y2={-32} stroke="#FFF" strokeWidth={5} />
        <line x1={0} y1={0} x2={24} y2={0} stroke="#FFF" strokeWidth={5} />
      </g>
      <InsertArm x0={180} y0={640} x1={620} y1={420} curve={-22} sleeveColor={C.jacket} />
      <Tag x={960} y={190} t={t - 3} text="KHÔNG CÒN ĐỒNG HỒ BÁO THỨC · KHÔNG CÒN CƠN NGÁP" color={CYAN} />
    </g>
  );
};

// --- Sh33: Medium shot in BioMedLab — Pip energized while Mo checks tablet ---
export const Sh33: React.FC<ShotProps> = ({ t }) => {
  const pipPose = poseAt(t, [
    { f: 0, p: { x: 820, y: 710, scale: 1.2, yaw: 0.25, armL: { a: 95, b: 20 }, armR: { a: 110, b: 25 } } },
    { f: 48, p: { armL: { a: 145, b: 12 }, armR: { a: 150, b: 12 }, headTilt: -8 } },
    { f: 96, p: { armL: { a: 112, b: 18 }, armR: { a: 120, b: 18 }, headTilt: 3 } },
  ]);
  const moPose = poseAt(t, [
    { f: 0, p: { x: 1240, y: 710, scale: 1.18, yaw: -0.3, armL: { a: 62, b: 42 } } },
    { f: 48, p: { armL: { a: 78, b: 35 }, headTilt: 6 } },
    { f: 96, p: { armL: { a: 58, b: 44 }, headTilt: -4 } },
  ]);
  return (
    <g transform={camT(1020, 510, camZoom(t, 1.14, 1.26, 96))}>
      <BioMedLab t={t + 90} id="sh33bio" />
      <Hero look={PIP} pose={{ ...pipPose, expr: 'happy', glint: 1, glintColor: CYAN }} shadow={0.35} rimId="rimR" />
      <Hero look={MO} pose={{ ...moPose, expr: 'shock' }} shadow={0.35} rimId="rimL" />
    </g>
  );
};

// --- Sh34: Extreme close-up on cortical neuron firing nonstop ---
export const Sh34: React.FC<ShotProps> = ({ t }) => (
  <g>
    <g transform={camT(960, 540, camZoom(t, 1.05, 1.18, 96))}>
      <Schematic t={t} id="sh34sch" />
      <Glow x={960} y={540} r={540} o={0.45} />
      {ZOO.drawOrgan({ organ: 'neuron', x: 960, y: 520, scale: 2.8, t, color: CYAN })}
    </g>
    <AwakeOverlay t={t} label="86 TỶ NƠ-RON: PHÁT XUNG LIÊN TỤC KHÔNG KHOẢNG NGHỈ" color={CYAN} />
  </g>
);

// ============================================================================
// SCENE 5 — study_polymath (Beats 13–15, Sh35..Sh43)
// ============================================================================

// --- Sh35: Wide shot of Study at 23:00 PM — Pip's "Second Life Shift" begins ---
export const Sh35: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 980, y: 712, scale: 1.02, yaw: -0.25, armL: { a: 58, b: 32 }, armR: { a: 64, b: 36 } } },
    { f: 45, p: { armL: { a: 84, b: 24 }, armR: { a: 92, b: 28 }, headTilt: -6 } },
    { f: 96, p: { armL: { a: 62, b: 30 }, armR: { a: 70, b: 34 }, headTilt: 4 } },
  ]);
  return (
    <g transform={camT(960, 520, camZoom(t, 1.0, 1.1, 96))}>
      <Study t={t} id="sh35st" veil={0.3} />
      <Hero look={PIP} pose={{ ...pose, expr: 'happy', glint: 0.9, glintColor: CYAN }} shadow={0.35} rimId="rimL" />
      <Desk x0={620} x1={1340} y={700} />
      <Laptop x={880} y={700} />
      <Lamp x={1220} y={700} />
      <Tag x={960} y={190} t={t - 3} text="23:00 ĐÊM · CA SỐNG THỨ HAI BẮT ĐẦU" color={AMBER} />
    </g>
  );
};

// --- Sh36: Macro insert on Pip's InsertArm mastering 3 foreign languages in notebooks ---
export const Sh36: React.FC<ShotProps> = ({ t }) => {
  const hx = kf(t, [[0, 620], [32, 960], [64, 1320], [96, 980]]);
  return (
    <g transform={camT(960, 540, camZoom(t, 1.04, 1.16, 96))}>
      <Tabletop />
      {[
        { x: 480, title: 'NGOẠI NGỮ 1 · TIẾNG HOA', sub: '你好 · 量子天文学', col: CYAN },
        { x: 960, title: 'NGOẠI NGỮ 2 · TIẾNG PHÁP', sub: 'L’ÉVOLUTION DU CERVEAU', col: GREEN },
        { x: 1440, title: 'NGOẠI NGỮ 3 · TIẾNG TÂY BAN NHA', sub: 'SINAPSIS ETERNA', col: AMBER },
      ].map((card, i) => (
        <g key={i} transform={`translate(${card.x} 480)`}>
          <rect x={-210} y={-170} width={420} height={340} rx={16} fill="#141C2E" stroke={card.col} strokeWidth={5} />
          <text x={0} y={-75} textAnchor="middle" fontFamily={FONT.ui} fontWeight={800} fontSize={22} fill={card.col}>
            {card.title}
          </text>
          <text x={0} y={25} textAnchor="middle" fontFamily={FONT.ui} fontWeight={900} fontSize={28} fill="#FFF">
            {card.sub}
          </text>
        </g>
      ))}
      <InsertArm x0={1860} y0={980} x1={hx} y1={560} curve={-24} sleeveColor={C.jacket} />
    </g>
  );
};

// --- Sh37: Medium shot in Study at 02:00 AM — Pip coding AI OS with both hands ---
export const Sh37: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 712, scale: 1.24, yaw: -0.2, armL: { a: 62, b: 40 }, armR: { a: 68, b: 38 } } },
    { f: 32, p: { armL: { a: 78, b: 32 }, armR: { a: 54, b: 44 }, headTilt: -5 } },
    { f: 64, p: { armL: { a: 56, b: 44 }, armR: { a: 82, b: 30 }, headTilt: 4 } },
    { f: 96, p: { armL: { a: 72, b: 36 }, armR: { a: 64, b: 38 }, headTilt: -3 } },
  ]);
  return (
    <g transform={camT(960, 510, camZoom(t, 1.15, 1.28, 96))}>
      <Study t={t + 40} id="sh37st" veil={0.28} />
      <Hero look={PIP} pose={{ ...pose, expr: 'cool', glint: 1, glintColor: GREEN }} shadow={0.35} rimId="rimL" />
      <Desk x0={580} x1={1340} y={700} />
      <Laptop x={880} y={700} />
      <Tag x={960} y={230} t={t - 3} text="02:00 AM · TỰ VIẾT XONG HỆ ĐIỀU HÀNH AI" color={GREEN} />
    </g>
  );
};

// --- Sh38: Close-up in Study — Pip practicing violin at 03:15 AM under warm lamp ---
export const Sh38: React.FC<ShotProps> = ({ t }) => {
  const bowSwing = kf(t, [[0, 62], [32, 118], [64, 58], [96, 114]]);
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 740, scale: 1.5, yaw: 0.25, headTilt: 10, armL: { a: 82, b: 55 }, armR: { a: bowSwing, b: 35 } } },
    { f: 48, p: { headTilt: 14, armR: { a: 112, b: 25 } } },
    { f: 96, p: { headTilt: 8, armR: { a: 68, b: 40 } } },
  ]);
  const handL = toWorld(pose, joints(pose).armL.end);
  const handR = toWorld(pose, joints(pose).armR.end);
  return (
    <g transform={camT(760, 470, camZoom(t, 1.24, 1.38, 96))}>
      <Study t={t + 75} id="sh38st" veil={0.38} />
      <Glow x={760} y={440} r={580} o={0.62} />
      <Hero look={PIP} pose={{ ...pose, expr: 'happy', glint: 0.85, glintColor: AMBER }} shadow={0.3} rimId="rimR" />
      {/* Violin & Bow attached to hands */}
      <ellipse cx={handL.x - 30} cy={handL.y - 10} rx={52} ry={26} transform={`rotate(-18 ${handL.x - 30} ${handL.y - 10})`} fill="#B85D19" stroke="#2B1810" strokeWidth={5} />
      <line x1={handR.x - 90} y1={handR.y + 20} x2={handR.x + 90} y2={handR.y - 40} stroke="#FFE2A8" strokeWidth={5} />
      <Sparkle x={880} y={320} t={t - 5} s={2.2} />
      <Tag x={780} y={200} t={t - 3} text="03:15 AM · LUYỆN ĐÀN VĨ CẦM GIỮA ĐÊM KHUYA" color={AMBER} />
    </g>
  );
};

// --- Sh39: Wide shot in Study — Mo fast asleep on sofa while Pip solves equations ---
export const Sh39: React.FC<ShotProps> = ({ t }) => {
  const moSleep: Pose = { ...basePose, x: 460, y: 690, scale: 0.92, yaw: 0.45, tilt: 22, headTilt: 28, expr: 'tired', blink: 1, legL: { a: 65, b: -65 }, legR: { a: 65, b: -65 } };
  const pipPose = poseAt(t, [
    { f: 0, p: { x: 1260, y: 712, scale: 1.04, yaw: -0.3, armL: { a: 105, b: 22 }, armR: { a: 48, b: 18 } } },
    { f: 48, p: { armL: { a: 142, b: 14 }, headTilt: -6 } },
    { f: 96, p: { armL: { a: 92, b: 26 }, headTilt: 4 } },
  ]);
  return (
    <g transform={camT(960, 520, camZoom(t, 1.0, 1.09, 96))}>
      <Study t={t + 110} id="sh39st" veil={0.3} />
      <Hero look={MO} pose={moSleep} shadow={0.35} rimId="rimR" />
      <Hero look={PIP} pose={{ ...pipPose, expr: 'cool', glint: 1, glintColor: CYAN }} shadow={0.35} rimId="rimL" />
      <BookStack x={1080} y={700} n={9} />
      <Tag x={460} y={420} t={t - 3} text="MO ĐÃ NGỦ SAY TỪ 01:00 SÁNG" color={AMBER} />
    </g>
  );
};

// --- Sh40: Over sleeping Mo's shoulder looking at Pip surrounded by towers of finished books ---
export const Sh40: React.FC<ShotProps> = ({ t }) => {
  const pipPose = poseAt(t, [
    { f: 0, p: { x: 1140, y: 712, scale: 1.15, yaw: -0.25, armR: { a: 88, b: 30 } } },
    { f: 48, p: { armR: { a: 128, b: 18 }, headTilt: -8 } },
    { f: 96, p: { armR: { a: 76, b: 32 }, headTilt: 3 } },
  ]);
  return (
    <g transform={camT(1020, 520, camZoom(t, 1.1, 1.22, 96))}>
      <Study t={t + 140} id="sh40st" veil={0.32} />
      <BookStack x={860} y={700} n={10} />
      <BookStack x={1380} y={700} n={11} />
      <Hero look={PIP} pose={{ ...pipPose, expr: 'happy', glint: 0.9, glintColor: CYAN }} shadow={0.35} rimId="rimL" />
      <Foreground x={260} side="left" />
    </g>
  );
};

// --- Sh41: Schematic — 30 Days Zero-Sleep = 3.5 Years of Normal Learning ---
export const Sh41: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, camZoom(t, 1.0, 1.08, 96))}>
    <Schematic t={t} id="sh41sch" />
    <SchLabel x={960} y={115} t={t - 1} text="TỐC ĐỘ TÍCH LŨY TRI THỨC SAU 30 NGÀY KHÔNG NGỦ" size={38} color={GREEN} />
    <SchBox x={560} y={480} w={480} h={220} t={t - 3} label="30 ĐÊM THỨC TRẮNG" sub="240 GIỜ HỌC TẬP SÂU" color={CYAN} />
    <SchArrow x0={810} y0={480} x1={1090} y1={480} t={t - 6} color={GREEN} />
    <SchBox x={1360} y={480} w={480} h={220} t={t - 8} label="= 3,5 NĂM HỌC TẬP" sub="CỦA NGƯỜI BÌNH THƯỜNG" color={GREEN} />
    <SchLabel x={960} y={840} t={t - 10} text="KHÔNG BỊ NGẮT QUÃNG BỞI CƠN BUỒN NGỦ" size={32} color={SCH.live} />
  </g>
);

// --- Sh42: Macro insert on InsertArm checking off Day 30 on wall calendar ---
export const Sh42: React.FC<ShotProps> = ({ t }) => {
  const hx = kf(t, [[0, 1340], [45, 1140], [96, 1220]]);
  return (
    <g transform={camT(960, 540, camZoom(t, 1.04, 1.16, 96))}>
      <Tabletop />
      <g transform="translate(960 510)">
        <rect x={-420} y={-250} width={840} height={500} rx={20} fill="#F6EFE3" stroke="#1E2436" strokeWidth={8} />
        <rect x={-420} y={-250} width={840} height={86} rx={16} fill={CRIMSON} />
        <text x={0} y={-194} textAnchor="middle" fontFamily={FONT.ui} fontWeight={900} fontSize={36} fill="#FFF">
          THÁNG THỨ NHẤT · 30 NGÀY THỨC TRẮNG
        </text>
        {Array.from({ length: 15 }).map((_, i) => {
          const cx = -310 + (i % 5) * 155;
          const cy = -80 + Math.floor(i / 5) * 110;
          return (
            <g key={i} transform={`translate(${cx} ${cy})`}>
              <rect x={-52} y={-38} width={104} height={76} rx={10} fill="#E5DEC9" />
              <path d="M -26 2 L -6 22 L 30 -18" stroke={GREEN} strokeWidth={8} fill="none" strokeLinecap="round" />
            </g>
          );
        })}
      </g>
      <InsertArm x0={1880} y0={920} x1={hx} y1={620} curve={-22} sleeveColor={C.jacket} />
    </g>
  );
};

// --- Sh43: Close-up on Pip smiling confidently in the warm study glow ---
export const Sh43: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 1120, y: 760, scale: 1.65, yaw: -0.18, headTilt: -6 } },
    { f: 48, p: { yaw: 0.12, headTilt: 5 } },
    { f: 96, p: { yaw: -0.08, headTilt: -3 } },
  ]);
  const face = faceAt(t, [[0, 'smug'], [40, 'happy'], [78, 'cool']]);
  return (
    <g>
      <g transform={camT(1140, 490, camZoom(t, 1.16, 1.28, 96))}>
        <Study t={t + 160} id="sh43st" veil={0.18} />
        <Glow x={1140} y={440} r={520} o={0.45} />
        <Hero look={PIP} pose={{ ...pose, ...face, glint: 1, glintColor: CYAN }} shadow={0.3} rimId="rimL" />
      </g>
      <AwakeOverlay t={t} label="THÁNG THỨ NHẤT: NĂNG SUẤT HỌC TẬP TĂNG 350%" color={CYAN} />
    </g>
  );
};

// ============================================================================
// SCENE 6 — kitchen_midnight (Beats 16–18, Sh44..Sh51)
// ============================================================================

// --- Sh44: Wide shot in Kitchen at 02:30 AM — Pip cooking to replenish +650 kcal ---
const S44_PIP = stand(KITCHEN, 0.56, 0.45);
export const Sh44: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: S44_PIP.x, y: S44_PIP.y, scale: S44_PIP.scale, yaw: -0.25, armL: { a: 68, b: 35 }, armR: { a: 74, b: 38 } } },
    { f: 45, p: { armR: { a: 108, b: 24 }, headTilt: -6 } },
    { f: 96, p: { armR: { a: 66, b: 40 }, headTilt: 4 } },
  ]);
  return (
    <g transform={camT(1080, 520, camZoom(t, 1.16, 1.28, 96))}>
      <Kitchen t={t} id="sh44k" veil={0.48} />
      <Glow x={1180} y={560} r={620} o={0.62} />
      <Hero look={PIP} pose={{ ...pose, expr: 'happy', glint: 0.85, glintColor: AMBER }} shadow={0.35} rimId="rimR" />
      <KitchenIsland />
      <Tag x={1080} y={220} t={t - 3} text="02:30 AM · ĐỐT THÊM +650 KILOCALO MỖI ĐÊM" color={AMBER} />
    </g>
  );
};

// --- Sh45: Macro insert on InsertArm flipping a sizzling skillet over stove flame ---
export const Sh45: React.FC<ShotProps> = ({ t }) => {
  const panY = kf(t, [[0, 560], [28, 490], [56, 565], [96, 505]]);
  return (
    <g transform={camT(960, 540, camZoom(t, 1.04, 1.16, 96))}>
      <Tabletop />
      <Glow x={900} y={620} r={520} o={0.48} />
      <g transform={`translate(880 ${panY})`}>
        <ellipse cx={0} cy={0} rx={260} ry={95} fill="#222634" stroke="#10121A" strokeWidth={10} />
        <ellipse cx={-50} cy={-14} rx={95} ry={42} fill="#FF7A45" />
        <circle cx={85} cy={-10} r={34} fill="#39FF88" opacity={0.75} />
      </g>
      <InsertArm x0={1880} y0={640} x1={1220} y1={panY} curve={18} sleeveColor={C.jacket} />
    </g>
  );
};

// --- Sh46: Medium shot in Kitchen — Pip eating a midnight feast while reading ---
export const Sh46: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 720, scale: 1.25, yaw: 0.2, armR: { a: 62, b: 42 }, armL: { a: 54, b: 35 } } },
    { f: 45, p: { armR: { a: 96, b: 52 }, headTilt: -5 } },
    { f: 96, p: { armR: { a: 64, b: 38 }, headTilt: 4 } },
  ]);
  return (
    <g transform={camT(960, 510, camZoom(t, 1.16, 1.28, 96))}>
      <Kitchen t={t + 35} id="sh46k" veil={0.3} />
      <Hero look={PIP} pose={{ ...pose, expr: 'happy', glint: 0.85, glintColor: CYAN }} shadow={0.35} rimId="rimR" />
      <KitchenIsland />
    </g>
  );
};

// --- Sh47: Wide shot in Kitchen at 06:00 AM — Mom and Sis amazed by breakfast banquet & manuscript ---
const S47_MOM = stand(KITCHEN, 0.3, 0.46);
const S47_SIS = stand(KITCHEN, 0.48, 0.49);
const S47_PIP = stand(KITCHEN, 0.72, 0.46);
export const Sh47: React.FC<ShotProps> = ({ t }) => {
  const momPose = poseAt(t, [
    { f: 0, p: { x: S47_MOM.x, y: S47_MOM.y, scale: S47_MOM.scale, yaw: 0.35, armR: { a: 52, b: 25 } } },
    { f: 48, p: { armR: { a: 95, b: 32 }, headTilt: -6 } },
    { f: 96, p: { armR: { a: 68, b: 28 }, headTilt: 3 } },
  ]);
  const sisPose = poseAt(t, [
    { f: 0, p: { x: S47_SIS.x, y: S47_SIS.y, scale: S47_SIS.scale * 0.82, yaw: 0.25, armL: { a: 72, b: 28 }, armR: { a: 78, b: 28 } } },
    { f: 48, p: { armL: { a: 125, b: 18 }, armR: { a: 128, b: 18 } } },
    { f: 96, p: { armL: { a: 88, b: 24 }, armR: { a: 92, b: 24 } } },
  ]);
  const pipPose = poseAt(t, [
    { f: 0, p: { x: S47_PIP.x, y: S47_PIP.y, scale: S47_PIP.scale, yaw: -0.35, armL: { a: 74, b: 24 } } },
    { f: 48, p: { armL: { a: 112, b: 18 }, headTilt: -5 } },
    { f: 96, p: { armL: { a: 82, b: 22 }, headTilt: 4 } },
  ]);
  return (
    <g transform={camT(880, 500, camZoom(t, 1.0, 1.09, 96))}>
      <Kitchen t={t + 70} id="sh47k" veil={0.05} />
      <Hero look={MOM} pose={{ ...momPose, expr: 'shock' }} shadow={0.35} rimId="rimR" />
      <Hero look={SIS} pose={{ ...sisPose, expr: 'happy' }} shadow={0.35} rimId="rimR" />
      <Hero look={PIP} pose={{ ...pipPose, expr: 'cool', glint: 0.9, glintColor: CYAN }} shadow={0.35} rimId="rimL" />
      <KitchenIsland />
      <BookStack x={960} y={640} n={8} />
    </g>
  );
};

// --- Sh48: Close-up on Sis holding up Pip's thick finished overnight manuscript ---
export const Sh48: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 770, scale: 1.42, yaw: 0.18, armR: { a: 84, b: 36 }, armL: { a: 76, b: 34 } } },
    { f: 48, p: { armR: { a: 112, b: 24 }, armL: { a: 106, b: 24 }, headTilt: -7 } },
    { f: 96, p: { armR: { a: 88, b: 32 }, armL: { a: 82, b: 30 }, headTilt: 4 } },
  ]);
  return (
    <g transform={camT(960, 500, camZoom(t, 1.12, 1.24, 96))}>
      <Kitchen t={t + 95} id="sh48k" veil={0.32} />
      <Hero look={SIS} pose={{ ...pose, ...faceAt(t, [[0, 'shock'], [42, 'happy']]) }} shadow={0.3} rimId="rimR" />
      <Tag x={960} y={210} t={t - 3} text="HOÀN THÀNH CHỒNG BẢN THẢO TRONG 1 ĐÊM" color={GREEN} />
    </g>
  );
};

// --- Sh49: Over Mom's shoulder as Pip pours morning juice with zero fatigue ---
export const Sh49: React.FC<ShotProps> = ({ t }) => {
  const pipPose = poseAt(t, [
    { f: 0, p: { x: 1080, y: 710, scale: 1.22, yaw: -0.3, armL: { a: 78, b: 30 } } },
    { f: 48, p: { armL: { a: 106, b: 20 }, headTilt: -6 } },
    { f: 96, p: { armL: { a: 72, b: 32 }, headTilt: 3 } },
  ]);
  return (
    <g transform={camT(1020, 510, camZoom(t, 1.1, 1.22, 96))}>
      <Kitchen t={t + 120} id="sh49k" veil={0.3} />
      <Hero look={PIP} pose={{ ...pipPose, expr: 'happy', glint: 0.9, glintColor: CYAN }} shadow={0.35} rimId="rimL" />
      <KitchenIsland />
      <Foreground x={260} side="left" />
    </g>
  );
};

// --- Sh50: Low-angle on Rooftop at Dawn — Day 60 (1,440 Hours Awake) ---
export const Sh50: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 710, scale: 1.18, yaw: 0.15, armL: { a: 36, b: 14 }, armR: { a: 48, b: 18 } } },
    { f: 48, p: { armL: { a: 118, b: 18 }, armR: { a: 124, b: 18 }, headTilt: -9 } },
    { f: 96, p: { armL: { a: 72, b: 16 }, armR: { a: 78, b: 16 }, headTilt: -3 } },
  ]);
  return (
    <g transform={camT(960, 500, camZoom(t, 1.06, 1.18, 96))}>
      <Rooftop t={t} id="sh50rf" low veil={0.24} />
      <Hero look={PIP} pose={{ ...pose, expr: 'cool', glint: 1, glintColor: AMBER }} shadow={0.4} rimId="rimR" />
      <Tag x={960} y={180} t={t - 3} text="BÌNH MINH LẦN THỨ 60 LIÊN TIẾP · 1.440 GIỜ THỨC" color={AMBER} />
    </g>
  );
};

// --- Sh51: Extreme close-up on Pip's eyes reflecting the 60th sunrise on Rooftop ---
export const Sh51: React.FC<ShotProps> = ({ t }) => {
  const sc = 3.6;
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 620 - HEAD.y * sc, scale: sc, yaw: 0.2, sway: -8 } },
    { f: 48, p: { sway: 10, headTilt: -4 } },
    { f: 96, p: { sway: -6, headTilt: 3 } },
  ]);
  return (
    <g>
      <g transform={camT(960, 540, camZoom(t, 1.02, 1.14, 96))}>
        <Rooftop t={t + 40} id="sh51rf" low veil={0.38} />
        <Hero look={PIP} pose={{ ...pose, expr: 'smug', glint: 1, glintColor: AMBER }} shadow={0} rimId="rimR" />
      </g>
      <AwakeOverlay t={t} label="NGÀY 60 · CẢM GIÁC NHƯ VỊ THẦN NẮM GIỮ THỜI GIAN" color={AMBER} />
    </g>
  );
};

// ============================================================================
// SCENE 7 — stairwell_isolation (Beats 19–20, Sh52..Sh57)
// ============================================================================

// --- Sh52: Wide shot in Stairwell at 03:00 AM — Day 90 (2,160 Hours Awake) ---
export const Sh52: React.FC<ShotProps> = ({ t }) => {
  const wx = kf(t, [[0, 620], [96, 1080]]);
  const walk = walkPose(wx, t * 0.35, hipGround, 0.96, { expr: 'worried' }, 1);
  return (
    <g transform={camT(960, 520, camZoom(t, 1.0, 1.1, 96))}>
      <Stairwell t={t} id="sh52sw" />
      <Hero look={PIP} pose={walk} shadow={0.4} rimId="rimR" />
      <Banister />
      <Tag x={960} y={180} t={t - 3} text="THÁNG THỨ 3 · 2.160 GIỜ THỨC TRẮNG LIÊN TỤC" color={VIOLET} />
    </g>
  );
};

// --- Sh53: Close-up on Pip pausing on Stairwell landing with psychological weight ---
export const Sh53: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 940, y: hipGround(940) - LEG_LEN * 1.15, scale: 1.15, yaw: 0.22, headTilt: 10, armL: { a: 62, b: 68 } } },
    { f: 48, p: { headTilt: 16, armL: { a: 78, b: 74 }, tilt: 4 } },
    { f: 96, p: { headTilt: 8, armL: { a: 58, b: 62 }, tilt: -2 } },
  ]);
  return (
    <g transform={camT(940, 480, camZoom(t, 1.25, 1.38, 96))}>
      <Stairwell t={t + 40} id="sh53sw" />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'worried'], [44, 'tired']]) }} shadow={0.4} rimId="rimR" />
      <Banister />
    </g>
  );
};

// --- Sh54: Schematic — 90 Days Without Sleep Blur Into One Endless Afternoon ---
export const Sh54: React.FC<ShotProps> = ({ t }) => {
  const blurW = kf(t, [[0, 260], [60, 1180], [96, 1340]]);
  return (
    <g transform={camT(960, 540, camZoom(t, 1.0, 1.08, 96))}>
      <Schematic t={t} id="sh54sch" />
      <SchLabel x={960} y={115} t={t - 1} text="MẤT DẤU CHẤM CÂU SINH HỌC: 90 NGÀY HÒA LÀM MỘT" size={38} color={VIOLET} />
      <g transform="translate(960 490)">
        <rect x={-680} y={-95} width={1360} height={190} rx={22} fill="#14182B" stroke={VIOLET} strokeWidth={5} />
        <rect x={-670} y={-85} width={blurW} height={170} rx={18} fill={VIOLET} opacity={0.35} />
        <text x={0} y={14} textAnchor="middle" fontFamily={FONT.ui} fontWeight={900} fontSize={42} fill="#FFF">
          NGÀY 1 ────────── NGÀY 45 ────────── NGÀY 90
        </text>
      </g>
      <SchLabel x={960} y={830} t={t - 6} text="KHÔNG CÓ GIẤC NGỦ ĐỂ ĐÓNG LẠI NGÀY HÔM QUA" size={32} color={SCH.live} />
    </g>
  );
};

// --- Sh55: High-angle shot looking down Stairwell at Pip sitting alone at 03:30 AM ---
export const Sh55: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 690, scale: 0.92, yaw: -0.25, headTilt: 14, legL: { a: 68, b: -68 }, legR: { a: 68, b: -68 }, armL: { a: 52, b: 48 } } },
    { f: 48, p: { headTilt: 20, armL: { a: 64, b: 56 } } },
    { f: 96, p: { headTilt: 10, armL: { a: 48, b: 44 } } },
  ]);
  return (
    <g transform={camT(960, 560, camZoom(t, 1.08, 1.2, 96))}>
      <Stairwell t={t + 80} id="sh55sw" />
      <Hero look={PIP} pose={{ ...pose, expr: 'worried' }} shadow={0.45} rimId="rimL" />
      <Banister />
      <Tag x={960} y={240} t={t - 4} text="MỘT BUỔI CHIỀU DÀI LÊ THÊ KHÔNG CÓ ĐIỂM DỪNG" color={VIOLET} />
    </g>
  );
};

// --- Sh56: Macro insert on Pip's diary where Day 78, Day 84, and Day 90 overlap ---
export const Sh56: React.FC<ShotProps> = ({ t }) => {
  const hx = kf(t, [[0, 780], [48, 1140], [96, 920]]);
  return (
    <g transform={camT(960, 540, camZoom(t, 1.04, 1.16, 96))}>
      <Tabletop />
      <g transform="translate(960 520)">
        <rect x={-440} y={-240} width={880} height={480} rx={18} fill="#EAE0CE" stroke="#1E2030" strokeWidth={8} />
        <text x={0} y={-110} textAnchor="middle" fontFamily={FONT.ui} fontWeight={800} fontSize={36} fill="#3B2F4A" opacity={0.65}>
          NGÀY 78... HAY NGÀY 84?
        </text>
        <text x={15} y={-20} textAnchor="middle" fontFamily={FONT.ui} fontWeight={900} fontSize={44} fill={CRIMSON}>
          NGÀY 90 · MẤT KHÁI NIỆM THỜI GIAN
        </text>
        <path d="M -320 85 Q -80 40 120 95 T 340 70" stroke="#3B2F4A" strokeWidth={5} fill="none" />
      </g>
      <InsertArm x0={1860} y0={980} x1={hx} y1={580} curve={-20} sleeveColor={C.jacket} />
    </g>
  );
};

// --- Sh57: Medium shot — Pip looks into a hallway mirror as the reflection lags ---
export const Sh57: React.FC<ShotProps> = ({ t }) => {
  const pipPose = poseAt(t, [
    { f: 0, p: { x: 680, y: 720, scale: 1.18, yaw: 0.35, armR: { a: 54, b: 28 } } },
    { f: 48, p: { armR: { a: 96, b: 36 }, headTilt: -8 } },
    { f: 96, p: { armR: { a: 62, b: 24 }, headTilt: 4 } },
  ]);
  const lagPose = poseAt(Math.max(0, t - 14), [
    { f: 0, p: { x: 1240, y: 720, scale: 1.18, facing: -1, yaw: -0.35, armL: { a: 54, b: 28 } } },
    { f: 48, p: { armL: { a: 96, b: 36 }, headTilt: 8 } },
    { f: 96, p: { armL: { a: 62, b: 24 }, headTilt: -4 } },
  ]);
  return (
    <g transform={camT(960, 520, camZoom(t, 1.08, 1.2, 96))}>
      <Bedroom t={t + 90} id="sh57bed" veil={0.38} />
      <rect x={960} y={140} width={560} height={620} rx={18} fill="#121C30" opacity={0.65} stroke={VIOLET} strokeWidth={6} />
      <Hero look={PIP} pose={{ ...pipPose, expr: 'worried' }} shadow={0.35} rimId="rimR" />
      <g opacity={0.65}>
        <Hero look={PIP} pose={{ ...lagPose, expr: 'dizzy', glint: 1, glintColor: VIOLET }} shadow={0} rimId="rimL" />
      </g>
    </g>
  );
};

// ============================================================================
// SCENE 8 — classroom_hallucination (Beats 21–24, Sh58..Sh66)
// ============================================================================

// --- Sh58: Wide shot in Classroom with custom NeuroBoard — Pip disoriented beside Mo ---
const S58_PIP = stand(CLASS, 0.56, 0.52);
const S58_MO = stand(CLASS, 0.34, 0.52);
export const Sh58: React.FC<ShotProps> = ({ t }) => {
  const pipPose = poseAt(t, [
    { f: 0, p: { x: S58_PIP.x, y: S58_PIP.y, scale: S58_PIP.scale, yaw: -0.25, headTilt: 8 } },
    { f: 48, p: { headTilt: -10, armL: { a: 68, b: 42 } } },
    { f: 96, p: { headTilt: 6, armL: { a: 42, b: 28 } } },
  ]);
  const moPose = poseAt(t, [
    { f: 0, p: { x: S58_MO.x, y: S58_MO.y, scale: S58_MO.scale, yaw: 0.3, armR: { a: 74, b: 30 } } },
    { f: 48, p: { armR: { a: 104, b: 22 }, headTilt: -5 } },
    { f: 96, p: { armR: { a: 68, b: 32 }, headTilt: 3 } },
  ]);
  return (
    <g transform={camT(960, 520, camZoom(t, 1.0, 1.1, 96))}>
      <Classroom t={t} id="sh58cl" board={<NeuroBoard t={t} />} />
      <Student x={1440} y={660} seed={3} />
      <Hero look={MO} pose={{ ...moPose, expr: 'worried' }} shadow={0.35} rimId="rimR" />
      <Hero look={PIP} pose={{ ...pipPose, expr: 'dizzy' }} shadow={0.35} rimId="rimL" />
    </g>
  );
};

// --- Sh59: Close-up on Pip's confused face — "20 Minutes Ago or 2 Weeks Ago?" ---
export const Sh59: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 760, scale: 1.68, yaw: -0.15, headTilt: 8 } },
    { f: 48, p: { yaw: 0.15, headTilt: -8 } },
    { f: 96, p: { yaw: -0.1, headTilt: 5 } },
  ]);
  return (
    <g transform={camT(960, 490, camZoom(t, 1.1, 1.22, 96))}>
      <Classroom t={t + 30} id="sh59cl" board={<NeuroBoard t={t} />} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'worried'], [42, 'shock']]) }} shadow={0.3} rimId="rimR" />
      <Tag x={960} y={200} t={t - 3} text="20 PHÚT TRƯỚC... HAY 2 TUẦN TRƯỚC?" color={VIOLET} />
    </g>
  );
};

// --- Sh60: Schematic of REM Sleep Pressure overflowing into Waking Visual Cortex ---
export const Sh60: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, camZoom(t, 1.0, 1.08, 96))}>
    <Schematic t={t} id="sh60rem_overflow" />
    <rect x={-120} y={-120} width={2160} height={1320} fill="#2A0B3F" opacity={0.45} />
    <Glow x={960} y={500} r={680} o={0.55} />
    <SchLabel x={960} y={115} t={t - 1} text="ÁP LỰC GIẤC NGỦ REM: GIẤC MƠ TRÀN VÀO LÚC MỞ MẮT" size={38} color={VIOLET} />
    <SchBox x={960} y={340} w={820} h={175} t={t - 3} label="90 ĐÊM CHẶN GIẤC MƠ REM" sub="ÁP LỰC CẢM XÚC TÍCH TỤ 195% TRONG THÂN NÃO" color={AMBER} />
    <SchArrow x0={960} y0={435} x1={960} y1={545} t={t - 6} color={VIOLET} />
    <SchBox x={960} y={655} w={920} h={185} t={t - 8} label="ẢO GIÁC THỊ GIÁC LÚC ĐANG THỨC" sub="VỎ NÃO TỰ CHIẾU GIẤC MƠ LÊN THỰC TẠI KHI ĐANG MỞ MẮT" color={VIOLET} />
    <SchLabel x={960} y={875} t={t - 10} text="RANH GIỚI GIỮA MƠ VÀ THỰC SỤP ĐỔ HOÀN TOÀN" size={32} color={SCH.live} />
  </g>
);

// --- Sh61: Over Pip's shoulder toward NeuroBoard as purple dream waves & constellations float ---
export const Sh61: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 500, camZoom(t, 1.06, 1.18, 96))}>
    <Classroom t={t + 60} id="sh61cl" board={<NeuroBoard t={t} hallucinate />} />
    <Glow x={960} y={360} r={540} o={0.45} />
    {Array.from({ length: 8 }).map((_, i) => {
      const sx = 520 + i * 125 + Math.sin(t * 0.1 + i) * 28;
      const sy = 260 + (i % 3) * 85 + Math.cos(t * 0.12 + i) * 24;
      return <circle key={i} cx={sx} cy={sy} r={10} fill={VIOLET} opacity={0.8} />;
    })}
    <Tag x={960} y={175} t={t - 3} text="GIẤC MƠ REM TRÀN LÊN BẢNG ĐEN TRONG 15 GIÂY" color={VIOLET} />
    <Foreground x={260} side="left" />
  </g>
);

// --- Sh62: Extreme close-up on Pip's open eye projecting violet dream nebulae ---
export const Sh62: React.FC<ShotProps> = ({ t }) => {
  const sc = 3.7;
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 625 - HEAD.y * sc, scale: sc, yaw: 0.14, look: -0.2 } },
    { f: 48, p: { look: 0.25, headTilt: -5 } },
    { f: 96, p: { look: -0.1, headTilt: 4 } },
  ]);
  return (
    <g>
      <g transform={camT(960, 540, camZoom(t, 1.02, 1.14, 96))}>
        <Classroom t={t + 90} id="sh62cl" board={<NeuroBoard t={t} hallucinate />} />
        <Hero look={PIP} pose={{ ...pose, expr: 'shock', glint: 1, glintColor: VIOLET }} shadow={0} rimId="rimRed" />
      </g>
      <AwakeOverlay t={t} label="HIỆN TƯỢNG XÂM NHẬP REM: MƠ KHI ĐANG THỨC" color={VIOLET} />
    </g>
  );
};

// --- Sh63: Medium shot in Classroom — Pip reaches toward phantom constellation while Mo watches ---
export const Sh63: React.FC<ShotProps> = ({ t }) => {
  const pipPose = poseAt(t, [
    { f: 0, p: { x: 1060, y: 710, scale: 1.2, yaw: -0.25, armL: { a: 88, b: 25 } } },
    { f: 48, p: { armL: { a: 132, b: 14 }, headTilt: -8 } },
    { f: 96, p: { armL: { a: 96, b: 22 }, headTilt: 4 } },
  ]);
  const moPose = poseAt(t, [
    { f: 0, p: { x: 680, y: 710, scale: 1.18, yaw: 0.3, armR: { a: 58, b: 30 } } },
    { f: 48, p: { armR: { a: 86, b: 28 }, headTilt: 6 } },
    { f: 96, p: { armR: { a: 64, b: 32 }, headTilt: -3 } },
  ]);
  return (
    <g transform={camT(920, 510, camZoom(t, 1.12, 1.24, 96))}>
      <Classroom t={t + 120} id="sh63cl" board={<NeuroBoard t={t} hallucinate />} />
      <Hero look={MO} pose={{ ...moPose, expr: 'worried' }} shadow={0.35} rimId="rimR" />
      <Hero look={PIP} pose={{ ...pipPose, expr: 'dizzy', glint: 1, glintColor: VIOLET }} shadow={0.35} rimId="rimL" />
    </g>
  );
};

// --- Sh64: Macro insert on trembling InsertArm holding pen over notebook ---
export const Sh64: React.FC<ShotProps> = ({ t }) => {
  const tremorY = Math.sin(t * 0.35) * 9;
  const hx = kf(t, [[0, 780], [48, 1080], [96, 940]]);
  return (
    <g transform={camT(960, 540, camZoom(t, 1.05, 1.16, 96))}>
      <Tabletop />
      <g transform="translate(960 530)">
        <rect x={-420} y={-230} width={840} height={460} rx={16} fill="#F4EEE1" stroke="#1E2030" strokeWidth={7} />
        <path d="M -320 -40 L -210 -65 L -120 -15 L -20 -70 L 90 -10 L 210 -60 L 310 -20" stroke={CRIMSON} strokeWidth={6} fill="none" />
        <text x={0} y={95} textAnchor="middle" fontFamily={FONT.ui} fontWeight={800} fontSize={30} fill={CRIMSON}>
          RUN CƠ VI MÔ · QUÁ TẢI DẪN TRUYỀN VẬN ĐỘNG
        </text>
      </g>
      <InsertArm x0={1860} y0={960} x1={hx} y1={500 + tremorY} curve={-22} sleeveColor={C.jacket} />
    </g>
  );
};

// --- Sh65: Close-up thermal forehead scan spiking to 38.6 °C ---
export const Sh65: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 1080, y: 770, scale: 1.72, yaw: 0.16, headTilt: 6 } },
    { f: 48, p: { headTilt: 12, yaw: -0.12 } },
    { f: 96, p: { headTilt: 4, yaw: 0.08 } },
  ]);
  return (
    <g>
      <g transform={camT(1080, 470, camZoom(t, 1.24, 1.38, 96))}>
        <Classroom t={t + 150} id="sh65cl" board={<NeuroBoard t={t} hallucinate />} />
        <rect x={-200} y={-200} width={2320} height={1480} fill="#4A0E1C" opacity={0.38} />
        <Glow x={1080} y={420} r={580} o={0.62} />
        <Hero look={PIP} pose={{ ...pose, expr: 'tired', glint: 1, glintColor: CRIMSON }} shadow={0.3} rimId="rimRed" />
      </g>
      <AwakeOverlay t={t} label="NHIỆT ĐỘ VÙNG TRÁN: 38,6 °C · BÁO ĐỘNG ĐỎ" color={CRIMSON} />
    </g>
  );
};

// --- Sh66: Wide shot of Classroom shifting into crimson-violet warning light for The Science Turn ---
export const Sh66: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: S58_PIP.x, y: S58_PIP.y, scale: S58_PIP.scale, yaw: 0.1, armL: { a: 54, b: 48 }, armR: { a: 54, b: 48 } } },
    { f: 48, p: { headTilt: 14, armL: { a: 72, b: 58 }, armR: { a: 72, b: 58 } } },
    { f: 96, p: { headTilt: 8, armL: { a: 60, b: 50 }, armR: { a: 60, b: 50 } } },
  ]);
  return (
    <g transform={camT(960, 520, camZoom(t, 1.0, 1.12, 96))}>
      <Classroom t={t + 180} id="sh66cl" board={<NeuroBoard t={t} hallucinate />} />
      <rect x={-200} y={-200} width={2320} height={1480} fill="#5A0B1C" opacity={0.28} />
      <Hero look={PIP} pose={{ ...pose, expr: 'shock', glint: 1, glintColor: CRIMSON }} shadow={0.4} rimId="rimRed" />
      <Tag x={960} y={180} t={t - 3} text="BƯỚC NGOẶT KHOA HỌC: BÍ MẬT PHÁT HIỆN NĂM 2013" color={CRIMSON} />
    </g>
  );
};

// ============================================================================
// SCENE 9 — glymphatic_science (Beats 25–32, Sh67..Sh82)
// ============================================================================

// --- Sh67: Schematic — Why Evolution Never Eliminated Sleep (Discovery of 2013) ---
export const Sh67: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, camZoom(t, 1.0, 1.08, 96))}>
    <Schematic t={t} id="sh67sch" />
    <SchLabel x={960} y={115} t={t - 1} text="NGHỊCH LÝ TIẾN HÓA: TẠI SAO MỌI ĐỘNG VẬT CÓ VÚ ĐỀU PHẢI NGỦ?" size={38} color={AMBER} />
    <SchBox x={540} y={480} w={480} h={220} t={t - 3} label="NẰM BẤT ĐỘNG 8 GIỜ" sub="PHƠI MÌNH TRƯỚC KẺ SĂN MỒI" color={CRIMSON} />
    <SchArrow x0={800} y0={480} x1={1080} y1={480} t={t - 6} color={CYAN} />
    <SchBox x={1380} y={480} w={480} h={220} t={t - 8} label="PHÁT HIỆN NĂM 2013" sub="HỆ THỐNG GLYMPHATIC (SCIENCE)" color={CYAN} />
    <SchLabel x={960} y={840} t={t - 10} text="GIẤC NGỦ LÀ CƠ CHẾ RỬA SẠCH ĐỘC TỐ SỐNG CÒN CỦA NÃO" size={32} color={SCH.live} />
  </g>
);

// --- Sh68: Close-up anatomical brain cross-section — The Glymphatic Dishwasher ---
export const Sh68: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, camZoom(t, 1.02, 1.14, 96))}>
    <Schematic t={t} id="sh68sch" />
    <SchLabel x={960} y={110} t={t - 1} text="HỆ THỐNG RỬA NÃO GLYMPHATIC (NEDERGAARD · 2013)" size={40} color={CYAN} />
    {ZOO.drawOrgan({ organ: 'brain', x: 960, y: 500, scale: 3.1, t, color: CYAN })}
    <Tag x={960} y={840} t={t - 4} text="DỊCH NÃO TỦY (CSF) BƠM QUA KHE KẼ NƠ-RON" color={CYAN} />
  </g>
);

// --- Sh69: Macro insert on Waking Brain Tissue — Narrow channels block CSF ---
export const Sh69: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, camZoom(t, 1.04, 1.15, 96))}>
    <Schematic t={t} id="sh69sch" />
    <SchLabel x={960} y={115} t={t - 1} text="KHI BẠN THỨC: TẾ BÀO ĐỆM NẰM SÁT KHÍT (KHE HẸP 20 NM)" size={38} color={AMBER} />
    {[-360, 0, 360].map((ox, i) => (
      <g key={i} transform={`translate(${960 + ox} 490)`}>
        <rect x={-165} y={-165} width={330} height={330} rx={42} fill="#2A1F3D" stroke={AMBER} strokeWidth={6} />
        <circle r={48} fill={CRIMSON} />
      </g>
    ))}
    <SchLabel x={960} y={830} t={t - 5} text="DỊCH NÃO TỦY KHÔNG THỂ LEN LỎI ĐỂ DỌN RÁC CHUYỂN HÓA" size={32} color={CRIMSON} />
  </g>
);

// --- Sh70: Macro insert on Deep Slow-Wave Sleep — Glial cells shrink, channels expand +60% ---
export const Sh70: React.FC<ShotProps> = ({ t }) => {
  const shrink = kf(t, [[0, 1.0], [45, 0.64], [96, 0.62]]);
  return (
    <g transform={camT(960, 540, camZoom(t, 1.04, 1.15, 96))}>
      <Schematic t={t} id="sh70sch" />
      <SchLabel x={960} y={115} t={t - 1} text="KHI NGỦ SÂU SÓNG CHẬM: KHÔNG GIAN KẼ GIÃN RỘNG +60%" size={38} color={GREEN} />
      {[-380, 0, 380].map((ox, i) => (
        <g key={i} transform={`translate(${960 + ox} 490) scale(${shrink})`}>
          <rect x={-165} y={-165} width={330} height={330} rx={42} fill="#16324A" stroke={CYAN} strokeWidth={6} />
          <circle r={44} fill={GREEN} />
        </g>
      ))}
      <SchLabel x={960} y={830} t={t - 5} text="TẾ BÀO HÌNH SAO CO NHỎ MỞ ĐƯỜNG CHO DỊCH NÃO TỦY" size={32} color={GREEN} />
    </g>
  );
};

// --- Sh71: Wide schematic — High-pressure CSF wave flushing Beta-Amyloid & Tau 20x faster ---
export const Sh71: React.FC<ShotProps> = ({ t }) => {
  const waveX = kf(t, [[0, 260], [60, 1480], [96, 1680]]);
  return (
    <g transform={camT(960, 540, camZoom(t, 1.0, 1.09, 96))}>
      <Schematic t={t} id="sh71sch" />
      <SchLabel x={960} y={115} t={t - 1} text="DÒNG DỊCH NÃO TỦY CUỐN TRÔI ĐỘC TỐ NHANH GẤP 20 LẦN" size={38} color={CYAN} />
      <rect x={220} y={340} width={1480} height={300} rx={24} fill="#0B192E" stroke={CYAN} strokeWidth={5} />
      <rect x={225} y={345} width={Math.max(40, waveX - 225)} height={290} rx={20} fill={CYAN} opacity={0.35} />
      <circle cx={waveX} cy={430} r={24} fill={AMBER} />
      <circle cx={waveX + 55} cy={540} r={28} fill={CRIMSON} />
      <SchLabel x={960} y={820} t={t - 6} text="RỬA SẠCH PROTEIN BETA-AMYLOID & PROTEIN TAU" size={34} color={GREEN} />
    </g>
  );
};

// --- Sh72: Close-up on Beta-Amyloid and Tau neurotoxin clusters ---
export const Sh72: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, camZoom(t, 1.04, 1.16, 96))}>
    <Schematic t={t} id="sh72sch" />
    <SchBox x={580} y={480} w={500} h={240} t={t - 2} label="PROTEIN BETA-AMYLOID" sub="MẢNG BÁM GÂY SUY GIẢM TRÍ NHỚ" color={AMBER} />
    <SchBox x={1340} y={480} w={500} h={240} t={t - 5} label="PROTEIN TAU XOẮN RỐI" sub="PHÁ HỦY ĐƯỜNG DẪN TRUYỀN NƠ-RON" color={CRIMSON} />
    <SchLabel x={960} y={830} t={t - 8} text="HAI LOẠI RÁC THẢI CHUYỂN HÓA NGUY HIỂM NHẤT TRONG NÃO" size={32} color={SCH.live} />
  </g>
);

// --- Sh73: Schematic — +20 mg/day waste = > 7 grams of neurotoxic plaque per year ---
export const Sh73: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, camZoom(t, 1.0, 1.08, 96))}>
    <Schematic t={t} id="sh73sch" />
    <SchLabel x={960} y={115} t={t - 1} text="TÍCH TỤ RÁC THẢI THẦN KINH KHI KHÔNG NGỦ" size={40} color={CRIMSON} />
    <SchBox x={540} y={480} w={480} h={220} t={t - 3} label="+20 MG / NGÀY" sub="ĐỘC TỐ KHÔNG ĐƯỢC RỬA TRÔI" color={AMBER} />
    <SchArrow x0={800} y0={480} x1={1080} y1={480} t={t - 6} color={CRIMSON} />
    <SchBox x={1380} y={480} w={480} h={220} t={t - 8} label="> 7,3 GAM / NĂM" sub="MẢNG BÁM BÍT KÍN HỒI HẢI MÃ" color={CRIMSON} />
    <SchLabel x={960} y={840} t={t - 10} text="BỘ NÃO BỊ NGỘ ĐỘC CHÍNH CHẤT THẢI CỦA MÌNH" size={32} color={SCH.live} />
  </g>
);

// --- Sh74: Extreme close-up on neural synapse choked with amber Beta-Amyloid plaques ---
export const Sh74: React.FC<ShotProps> = ({ t }) => (
  <g>
    <g transform={camT(960, 540, camZoom(t, 1.05, 1.18, 96))}>
      <Schematic t={t} id="sh74sch" />
      {ZOO.drawOrgan({ organ: 'neuron', x: 960, y: 500, scale: 2.7, t, color: CRIMSON })}
      {[
        [820, 440],
        [1080, 460],
        [940, 580],
        [1040, 390],
      ].map(([px, py], i) => (
        <circle key={i} cx={px} cy={py} r={28 + Math.sin(t * 0.15 + i) * 4} fill={AMBER} opacity={0.82} />
      ))}
    </g>
    <AwakeOverlay t={t} label="MẢNG BÁM BETA-AMYLOID CHẶN ĐỨNG XUNG ĐIỆN TRÍ NHỚ" color={CRIMSON} />
  </g>
);

// --- Sh75: Wide thermodynamic schematic — 1.4 kg Brain (2% mass, 86B neurons) = 20% Body Energy ---
export const Sh75: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, camZoom(t, 1.0, 1.08, 96))}>
    <Schematic t={t} id="sh75sch" />
    <SchLabel x={960} y={115} t={t - 1} text="ĐỊNH LUẬT NHIỆT ĐỘNG LỰC HỌC NÃO BỘ (RAICHLE · PNAS)" size={38} color={CYAN} />
    <SchBox x={440} y={480} w={390} h={220} t={t - 2} label="KHỐI LƯỢNG: 1,4 KG" sub="CHỈ CHIẾM 2% CƠ THỂ" color={CYAN} />
    <SchBox x={960} y={480} w={390} h={220} t={t - 5} label="86 TỶ NƠ-RON" sub="MẬT ĐỘ XỬ LÝ DÀY ĐẶC" color={GREEN} />
    <SchBox x={1480} y={480} w={390} h={220} t={t - 8} label="20% NĂNG LƯỢNG" sub="400 KILOCALO / NGÀY" color={AMBER} />
    <SchLabel x={960} y={840} t={t - 10} text="CƠ QUAN TIÊU THỤ NĂNG LƯỢNG ĐẮT ĐỎ NHẤT TRONG CƠ THỂ" size={32} color={SCH.live} />
  </g>
);

// --- Sh76: Close-up on 20-Watt Thermal Bulb inside translucent brain diagram ---
export const Sh76: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, camZoom(t, 1.04, 1.16, 96))}>
    <Schematic t={t} id="sh76sch" />
    <Glow x={960} y={480} r={540} o={0.55} />
    {ZOO.drawOrgan({ organ: 'brain', x: 960, y: 490, scale: 3.0, t, color: AMBER })}
    <text x={960} y={505} textAnchor="middle" fontFamily={FONT.ui} fontWeight={900} fontSize={64} fill="#FFF">
      20 WATT
    </text>
    <Tag x={960} y={820} t={t - 4} text="TỎA NHIỆT LIÊN TỤC NHƯ BÓNG ĐÈN 20 OÁT" color={AMBER} />
  </g>
);

// --- Sh77: Schematic — Nocturnal -1.2 °C Core Brain Cooling Curve vs 24/7 Overheat ---
export const Sh77: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, camZoom(t, 1.0, 1.08, 96))}>
    <Schematic t={t} id="sh77sch" />
    <SchLabel x={960} y={115} t={t - 1} text="PHA HẠ NHIỆT LÕI NÃO BỘ (-1,2 °C) TRONG GIẤC NGỦ SÂU" size={38} color={CYAN} />
    <g transform="translate(960 490)">
      <rect x={-580} y={-190} width={1160} height={360} rx={18} fill="#0B1526" stroke={CYAN} strokeWidth={4} />
      {/* Sleepless Red Flat/Rising Line */}
      <path d="M -520 -40 L 0 -65 L 520 -115" stroke={CRIMSON} strokeWidth={7} fill="none" />
      {/* Normal Sleep Cooling Dip */}
      <path d="M -520 -40 Q -260 -40 -120 90 Q 40 135 220 80 Q 380 -30 520 -40" stroke={GREEN} strokeWidth={7} fill="none" />
      <text x={320} y={-130} textAnchor="middle" fontFamily={FONT.ui} fontSize={24} fill={CRIMSON}>
        KHÔNG NGỦ: QUÁ NHIỆT LIÊN TỤC
      </text>
      <text x={40} y={145} textAnchor="middle" fontFamily={FONT.ui} fontSize={24} fill={GREEN}>
        NGỦ SÂU: HẠ 1,2 °C ĐỂ SỬA CHỮA MÀNG TẾ BÀO
      </text>
    </g>
  </g>
);

// --- Sh78: Macro insert on ATP regeneration during cool slow-wave sleep ---
export const Sh78: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, camZoom(t, 1.04, 1.15, 96))}>
    <Schematic t={t} id="sh78sch" />
    <SchBox x={960} y={480} w={760} h={280} t={t - 2} label="TÁI TẠO NĂNG LƯỢNG PHÂN TỬ A-TÊ-Pê" sub="PHỤC HỒI DỰ TRỮ NĂNG LƯỢNG TRONG GIẤC NGỦ SÂU" color={GREEN} />
    <SchLabel x={960} y={830} t={t - 5} text="GIÚP NƠ-RON SẴN SÀNG PHÁT XUNG VÀO SÁNG HÔM SAU" size={32} color={CYAN} />
  </g>
);

// --- Sh79: Macro insert on overheated mitochondria leaking Reactive Oxygen Species (ROS) ---
export const Sh79: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, camZoom(t, 1.04, 1.16, 96))}>
    <Schematic t={t} id="sh79sch" />
    <Glow x={960} y={490} r={480} o={0.5} />
    <SchBox x={960} y={480} w={820} h={280} t={t - 2} label="RÒ RỈ GỐC TỰ DO Ô-XY HÓA (ROS)" sub="TI THỂ QUÁ TẢI KHI CHẠY 24/24 KHÔNG NGHỈ" color={CRIMSON} />
    <SchLabel x={960} y={830} t={t - 5} text="GÂY STRESS Ô-XY HÓA TRỰC TIẾP LÊN TẾ BÀO THẦN KINH" size={32} color={AMBER} />
  </g>
);

// --- Sh80: Close-up on nerve axon Myelin sheath fraying under thermal oxidative stress ---
export const Sh80: React.FC<ShotProps> = ({ t }) => (
  <g>
    <g transform={camT(960, 540, camZoom(t, 1.05, 1.18, 96))}>
      <Schematic t={t} id="sh80sch" />
      <g transform="translate(960 500)">
        <line x1={-560} y1={0} x2={560} y2={0} stroke={AMBER} strokeWidth={18} />
        {[-380, -130, 130, 380].map((mx, i) => (
          <rect key={i} x={mx - 95} y={-44} width={190} height={88} rx={22} fill="#1E2942" stroke={CRIMSON} strokeWidth={6} strokeDasharray="18 8" />
        ))}
      </g>
    </g>
    <AwakeOverlay t={t} label="TỔN THƯƠNG VỎ BỌC MYELIN DO QUÁ TẢI NHIỆT" color={CRIMSON} />
  </g>
);

// --- Sh81: Medium shot in BioMedLab — Pip and Mo examine the myelin warning scan ---
export const Sh81: React.FC<ShotProps> = ({ t }) => {
  const pipPose = poseAt(t, [
    { f: 0, p: { x: 760, y: 710, scale: 1.18, yaw: 0.25, armR: { a: 68, b: 28 } } },
    { f: 48, p: { armR: { a: 102, b: 20 }, headTilt: 6 } },
    { f: 96, p: { armR: { a: 74, b: 26 }, headTilt: -3 } },
  ]);
  const moPose = poseAt(t, [
    { f: 0, p: { x: 1180, y: 710, scale: 1.18, yaw: -0.25, armL: { a: 84, b: 24 } } },
    { f: 48, p: { armL: { a: 118, b: 18 }, headTilt: -6 } },
    { f: 96, p: { armL: { a: 78, b: 28 }, headTilt: 4 } },
  ]);
  return (
    <g transform={camT(960, 510, camZoom(t, 1.12, 1.24, 96))}>
      <BioMedLab t={t + 110} id="sh81bio" alert headline="CẢNH BÁO TỔN THƯƠNG MYELIN" subline="CẦN CƠ CHẾ LÀM MÁT & RỬA NÃO KHẨN CẤP" />
      <Hero look={PIP} pose={{ ...pipPose, expr: 'worried' }} shadow={0.35} rimId="rimR" />
      <Hero look={MO} pose={{ ...moPose, expr: 'shock' }} shadow={0.35} rimId="rimL" />
    </g>
  );
};

// --- Sh82: Over Mo's shoulder opening the Marine & Avian Evolutionary Database ---
export const Sh82: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 520, camZoom(t, 1.04, 1.15, 96))}>
    <BioMedLab t={t + 140} id="sh82bio" headline="HỒ SƠ TIẾN HÓA ĐỘNG VẬT HOANG DÃ" subline="CÁ HEO · CÁ MẬP TRẮNG · ĐẠI BÀNG · MÈO RỪNG" />
    <Foreground x={260} side="left" />
  </g>
);

// ============================================================================
// SCENE 10 — zoo_ocean_abyss (Beats 33–38, Sh83..Sh92 — Mandatory ZOO.* Marine Deep Dive)
// ============================================================================

// --- Sh83: Wide shot in OceanAbyss at 420m depth — Bottlenose Dolphin swimming ---
export const Sh83: React.FC<ShotProps> = ({ t }) => {
  const dx = kf(t, [[0, 680], [48, 960], [96, 1180]]);
  return (
    <g transform={camT(880, 500, camZoom(t, 1.04, 1.16, 96))}>
      <OceanAbyss t={t} id="sh83oc" depthText="ĐỘ SÂU 420 MÉT · CÁ HEO MŨI CHAI (TURSIOPS TRUNCATUS)" />
      <Glow x={680} y={320} r={720} o={0.55} />
      {ZOO.drawAnimal({
        species: 'dolphin',
        x: dx,
        y: 520,
        scale: 1.55,
        facing: 1,
        t,
        color: '#8ECAE6',
        shade: '#219EBC',
        accent: CYAN,
      })}
      <Tag x={960} y={840} t={t - 3} text="ĐỘNG VẬT CÓ VÚ BƠI LIÊN TỤC & CHỦ ĐỘNG TRỒI LÊN THỞ" color={CYAN} />
    </g>
  );
};

// --- Sh84: MANDATORY ZOO ANATOMICAL ZOOM + LOUPE INSET (Dolphin Brain — Unihemispheric Sleep USWS) ---
export const Sh84: React.FC<ShotProps> = ({ t }) => {
  const brainPt = ZOO.anchors('dolphin', 560, 560, 1.45, 1).brain;
  return (
    <g>
      {ZOO.withAnatomyZoom({
        t,
        startF: 4,
        endF: 36,
        targetX: 840,
        targetY: 520,
        baseZoom: 1.0,
        targetZoom: 1.28,
        children: (
          <g>
            <OceanAbyss t={t + 30} id="sh84oc" depthText="" />
            <Glow x={580} y={480} r={620} o={0.5} />
            {ZOO.drawAnimal({
              species: 'dolphin',
              x: 560,
              y: 560,
              scale: 1.45,
              facing: 1,
              t,
              highlightOrgan: 'brain',
              color: '#8ECAE6',
              shade: '#219EBC',
              accent: CYAN,
            })}
            {ZOO.drawAnatomyReticle({ x: brainPt.x, y: brainPt.y, t: t - 3, r: 46, color: CYAN, label: 'NÃO CÁ HEO' })}
            {ZOO.drawOrganInset({
              targetX: brainPt.x,
              targetY: brainPt.y,
              insetX: 1180,
              insetY: 460,
              r: 155,
              t: t - 5,
              organ: 'brain',
              title: 'NGỦ ĐƠN BÁN CẦU (USWS)',
              subtitle: 'TRÁI NGỦ SÂU · PHẢI THỨC TỈNH',
              color: CYAN,
            })}
          </g>
        ),
      })}
    </g>
  );
};

// --- Sh85: MANDATORY ZOO ANATOMICAL ZOOM + LOUPE INSET (Dolphin Open Eye & Lungs) ---
export const Sh85: React.FC<ShotProps> = ({ t }) => {
  const anchors = ZOO.anchors('dolphin', 1340, 520, 1.45, -1);
  return (
    <g>
      {ZOO.withAnatomyZoom({
        t,
        startF: 4,
        endF: 36,
        targetX: 1060,
        targetY: 500,
        baseZoom: 1.0,
        targetZoom: 1.28,
        children: (
          <g>
            <OceanAbyss t={t + 60} id="sh85oc" depthText="" />
            <rect x={-200} y={-200} width={2320} height={1480} fill="#062E26" opacity={0.38} />
            <Glow x={1300} y={480} r={660} o={0.55} />
            {ZOO.drawAnimal({
              species: 'dolphin',
              x: 1340,
              y: 520,
              scale: 1.45,
              facing: -1,
              t,
              highlightOrgan: 'lungs',
              color: '#8ECAE6',
              shade: '#219EBC',
              accent: GREEN,
            })}
            {ZOO.drawAnatomyReticle({ x: anchors.eye.x, y: anchors.eye.y, t: t - 2, r: 28, color: AMBER })}
            {ZOO.drawAnatomyReticle({ x: anchors.lungs.x, y: anchors.lungs.y, t: t - 4, r: 44, color: GREEN, label: 'PHỔI & HÔ HẤP' })}
            {ZOO.drawOrganInset({
              targetX: anchors.lungs.x,
              targetY: anchors.lungs.y,
              insetX: 700,
              insetY: 460,
              r: 155,
              t: t - 6,
              organ: 'lungs',
              title: 'ĐIỀU KHIỂN PHỔI & MẮT',
              subtitle: 'TRỒI LÊN THỞ & CANH CÁ MẬP',
              color: GREEN,
            })}
          </g>
        ),
      })}
      <AwakeOverlay t={t} label="BÁN CẦU THỨC ĐIỀU KHIỂN VÂY BƠI LÊN MẶT NƯỚC HÍT THỞ" color={GREEN} />
    </g>
  );
};

// --- Sh86: Schematic — Dolphin 120-Minute Hemispheric Shift Swap ---
export const Sh86: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, camZoom(t, 1.0, 1.08, 96))}>
    <Schematic t={t} id="sh86sch" />
    <SchLabel x={960} y={115} t={t - 1} text="CHU KỲ ĐỔI CA MỖI 120 PHÚT CỦA NÃO CÁ HEO" size={40} color={CYAN} />
    <SchBox x={540} y={480} w={480} h={220} t={t - 3} label="CA 1 (0–120 PHÚT)" sub="NÃO TRÁI NGỦ · NÃO PHẢI THỨC" color={CYAN} />
    <SchArrow x0={800} y0={480} x1={1080} y1={480} t={t - 6} color={GREEN} />
    <SchBox x={1380} y={480} w={480} h={220} t={t - 8} label="CA 2 (120–240 PHÚT)" sub="NÃO PHẢI NGỦ · NÃO TRÁI THỨC" color={GREEN} />
    <SchLabel x={960} y={840} t={t - 10} text="BƠI SUỐT ĐỜI MÀ VẪN RỬA SẠCH ĐỘC TỐ CẢ HAI BÁN CẦU" size={32} color={SCH.live} />
  </g>
);

// --- Sh87: Medium shot in OceanAbyss — Dolphin surfacing smoothly to breathe ---
export const Sh87: React.FC<ShotProps> = ({ t }) => {
  const dy = kf(t, [[0, 580], [48, 390], [96, 440]]);
  return (
    <g transform={camT(960, 500, camZoom(t, 1.06, 1.18, 96))}>
      <OceanAbyss t={t + 90} id="sh87oc" depthText="ĐỔI CA BÁN CẦU · BƠI LÊN MẶT NƯỚC HÍT THỞ" />
      {ZOO.drawAnimal({
        species: 'dolphin',
        x: 960,
        y: dy,
        scale: 1.65,
        facing: 1,
        t,
        highlightOrgan: 'brain',
        color: '#8ECAE6',
        shade: '#219EBC',
        accent: GREEN,
      })}
    </g>
  );
};

// --- Sh88: Wide shot in OceanAbyss — Great White Shark ram-ventilation swimming ---
export const Sh88: React.FC<ShotProps> = ({ t }) => {
  const sx = kf(t, [[0, 1240], [48, 960], [96, 720]]);
  return (
    <g transform={camT(1060, 560, camZoom(t, 1.08, 1.2, 96))}>
      <OceanAbyss t={t + 120} id="sh88oc" depthText="CÁ MẬP TRẮNG LỚN · BƠI LIÊN TỤC ĐỂ ÉP NƯỚC QUA MANG" />
      <rect x={-200} y={-200} width={2320} height={1480} fill="#1A0E06" opacity={0.35} />
      <Glow x={1220} y={620} r={680} o={0.52} />
      {ZOO.drawAnimal({
        species: 'shark',
        x: sx,
        y: 540,
        scale: 1.6,
        facing: -1,
        t,
        color: '#98A8B8',
        shade: '#5C6B7C',
        accent: AMBER,
      })}
      <Tag x={1060} y={220} t={t - 3} text="CÁ MẬP TRẮNG LỚN · BƠI KHÔNG NGHỈ ĐỂ BƠM Ô-XY QUA MANG" color={AMBER} />
    </g>
  );
};

// --- Sh89: MANDATORY ZOO ANATOMICAL ZOOM + LOUPE INSET (Shark Spinal Cord CPG) ---
export const Sh89: React.FC<ShotProps> = ({ t }) => {
  const spinePt = ZOO.anchors('shark', 560, 560, 1.45, 1).spine;
  return (
    <g>
      {ZOO.withAnatomyZoom({
        t,
        startF: 4,
        endF: 36,
        targetX: 840,
        targetY: 520,
        baseZoom: 1.0,
        targetZoom: 1.28,
        children: (
          <g>
            <OceanAbyss t={t + 150} id="sh89oc" depthText="" />
            <rect x={-200} y={-200} width={2320} height={1480} fill="#2B1606" opacity={0.38} />
            <Glow x={580} y={540} r={620} o={0.5} />
            {ZOO.drawAnimal({
              species: 'shark',
              x: 560,
              y: 560,
              scale: 1.45,
              facing: 1,
              t,
              highlightOrgan: 'spine',
              color: '#98A8B8',
              shade: '#5C6B7C',
              accent: AMBER,
            })}
            {ZOO.drawAnatomyReticle({ x: spinePt.x, y: spinePt.y, t: t - 3, r: 46, color: AMBER, label: 'TỦY SỐNG CÁ MẬP' })}
            {ZOO.drawOrganInset({
              targetX: spinePt.x,
              targetY: spinePt.y,
              insetX: 1180,
              insetY: 460,
              r: 155,
              t: t - 5,
              organ: 'spine',
              title: 'PHÁT NHỊP TỦY SỐNG (CPG)',
              subtitle: 'TỰ ĐỘNG QUẪY ĐUÔI KHI NÃO NGHỈ',
              color: AMBER,
            })}
          </g>
        ),
      })}
    </g>
  );
};

// --- Sh90: MANDATORY ZOO ANATOMICAL ZOOM + LOUPE INSET (Shark Heart & Gill Oxygenation) ---
export const Sh90: React.FC<ShotProps> = ({ t }) => {
  const heartPt = ZOO.anchors('shark', 1340, 520, 1.45, -1).heart;
  return (
    <g>
      {ZOO.withAnatomyZoom({
        t,
        startF: 4,
        endF: 36,
        targetX: 1060,
        targetY: 500,
        baseZoom: 1.0,
        targetZoom: 1.28,
        children: (
          <g>
            <OceanAbyss t={t + 180} id="sh90oc" depthText="" />
            <rect x={-200} y={-200} width={2320} height={1480} fill="#360916" opacity={0.42} />
            <Glow x={1300} y={500} r={660} o={0.55} />
            {ZOO.drawAnimal({
              species: 'shark',
              x: 1340,
              y: 520,
              scale: 1.45,
              facing: -1,
              t,
              highlightOrgan: 'heart',
              color: '#98A8B8',
              shade: '#5C6B7C',
              accent: CRIMSON,
            })}
            {ZOO.drawAnatomyReticle({ x: heartPt.x, y: heartPt.y, t: t - 3, r: 44, color: CRIMSON, label: 'TIM & TUẦN HOÀN MANG' })}
            {ZOO.drawOrganInset({
              targetX: heartPt.x,
              targetY: heartPt.y,
              insetX: 700,
              insetY: 460,
              r: 155,
              t: t - 5,
              organ: 'heart',
              title: 'TIM & KHE MANG CÁ MẬP',
              subtitle: 'NÃO TRƯỚC NGHỈ NGƠI KHI ĐANG BƠI',
              color: CRIMSON,
            })}
          </g>
        ),
      })}
      <AwakeOverlay t={t} label="CÁ MẬP BƠI VÔ THỨC NHỜ TỦY SỐNG ĐỂ BƠM Ô-XY QUA MANG" color={CRIMSON} />
    </g>
  );
};

// --- Sh91: Over the shoulder submarine viewport watching Dolphin and Shark in OceanAbyss ---
export const Sh91: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, camZoom(t, 1.04, 1.14, 96))}>
    <OceanAbyss t={t + 210} id="sh91oc" />
    {ZOO.drawAnimal({ species: 'dolphin', x: 640, y: 460, scale: 1.2, facing: 1, t, color: '#8ECAE6', accent: CYAN })}
    {ZOO.drawAnimal({ species: 'shark', x: 1320, y: 580, scale: 1.25, facing: -1, t, color: '#98A8B8', accent: AMBER })}
    <Foreground x={240} side="left" />
  </g>
);

// --- Sh92: Schematic comparing Marine Sleep Adaptations ---
export const Sh92: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, camZoom(t, 1.0, 1.08, 96))}>
    <Schematic t={t} id="sh92_marine_compare" />
    <rect x={-120} y={-120} width={2160} height={1320} fill="#06283D" opacity={0.48} />
    <Glow x={520} y={360} r={580} o={0.5} />
    <SchLabel x={960} y={115} t={t - 1} text="SO SÁNH CƠ CHẾ NGỦ KHI ĐANG DI CHUYỂN TRONG ĐẠI DƯƠNG" size={38} color={CYAN} />
    <SchBox x={960} y={350} w={980} h={180} t={t - 3} label="CÁ HEO MŨI CHAI (ĐỘNG VẬT CÓ VÚ)" sub="CHIA ĐÔI 2 BÁN CẦU NÃO LUÂN PHIÊN NGỦ MỖI 120 PHÚT" color={CYAN} />
    <SchBox x={960} y={630} w={980} h={180} t={t - 6} label="CÁ MẬP TRẮNG LỚN (CÁ SỤN)" sub="TỦY SỐNG TỰ ĐỘNG QUẪY ĐUÔI ĐỂ NÃO TRƯỚC NGHỈ NGƠI" color={AMBER} />
  </g>
);

// ============================================================================
// SCENE 11 — zoo_forest_sky (Beats 39–40, Sh93..Sh98 — Mandatory ZOO.* Avian & Feline Deep Dive)
// ============================================================================

// --- Sh93: Wide shot in ForestCanopy — Eagle / Migratory Bird flying 10 days nonstop (10,000 km) ---
export const Sh93: React.FC<ShotProps> = ({ t }) => {
  const ex = kf(t, [[0, 660], [48, 960], [96, 1220]]);
  const ey = kf(t, [[0, 420], [48, 360], [96, 400]]);
  return (
    <g transform={camT(960, 520, camZoom(t, 1.0, 1.1, 96))}>
      <ForestCanopy t={t} id="sh93for" />
      {ZOO.drawAnimal({
        species: 'eagle',
        x: ex,
        y: ey,
        scale: 1.5,
        facing: 1,
        t,
        color: '#F4EEE1',
        accent: AMBER,
      })}
      <Tag x={960} y={160} t={t - 3} text="BAY VƯỢT ĐẠI DƯƠNG 10 NGÀY LIỀN · 10.000 KM KHÔNG ĐÁP" color={AMBER} />
    </g>
  );
};

// --- Sh94: MANDATORY ZOO ANATOMICAL ZOOM + LOUPE INSET (Eagle Eye & Retina) ---
export const Sh94: React.FC<ShotProps> = ({ t }) => {
  const eyePt = ZOO.anchors('eagle', 540, 520, 1.45, 1).eye;
  return (
    <g>
      {ZOO.withAnatomyZoom({
        t,
        startF: 4,
        endF: 36,
        targetX: 840,
        targetY: 500,
        baseZoom: 1.0,
        targetZoom: 1.28,
        children: (
          <g>
            <ForestCanopy t={t + 30} id="sh94for" />
            {ZOO.drawAnimal({
              species: 'eagle',
              x: 540,
              y: 520,
              scale: 1.45,
              facing: 1,
              t,
              highlightOrgan: 'eye',
              color: '#F4EEE1',
              accent: AMBER,
            })}
            {ZOO.drawAnatomyReticle({ x: eyePt.x, y: eyePt.y, t: t - 3, r: 42, color: AMBER, label: 'MẮT & VÕNG MẠC' })}
            {ZOO.drawOrganInset({
              targetX: eyePt.x,
              targetY: eyePt.y,
              insetX: 1180,
              insetY: 450,
              r: 155,
              t: t - 5,
              organ: 'eye',
              title: 'VÕNG MẠC ĐỊNH HƯỚNG BAY',
              subtitle: 'GIỮ THĂNG BẰNG TRÊN LUỒNG KHÍ NÓNG',
              color: AMBER,
            })}
          </g>
        ),
      })}
    </g>
  );
};

// --- Sh95: MANDATORY ZOO ANATOMICAL ZOOM + LOUPE INSET (Eagle Brain — 12-Second Mid-Air Micro-Sleeps) ---
export const Sh95: React.FC<ShotProps> = ({ t }) => {
  const brainPt = ZOO.anchors('eagle', 1320, 480, 1.45, -1).brain;
  return (
    <g>
      {ZOO.withAnatomyZoom({
        t,
        startF: 4,
        endF: 36,
        targetX: 1060,
        targetY: 480,
        baseZoom: 1.0,
        targetZoom: 1.28,
        children: (
          <g>
            <ForestCanopy t={t + 60} id="sh95for" />
            <rect x={-200} y={-200} width={2320} height={1480} fill="#160C32" opacity={0.4} />
            <Glow x={1300} y={440} r={660} o={0.55} />
            {ZOO.drawAnimal({
              species: 'eagle',
              x: 1320,
              y: 480,
              scale: 1.45,
              facing: -1,
              t,
              highlightOrgan: 'brain',
              color: '#F4EEE1',
              accent: CYAN,
            })}
            {ZOO.drawAnatomyReticle({ x: brainPt.x, y: brainPt.y, t: t - 3, r: 44, color: CYAN, label: 'NÃO CHIM DI CƯ' })}
            {ZOO.drawOrganInset({
              targetX: brainPt.x,
              targetY: brainPt.y,
              insetX: 700,
              insetY: 450,
              r: 155,
              t: t - 5,
              organ: 'brain',
              title: 'VI GIẤC NGỦ 12 GIÂY',
              subtitle: 'NGỦ NGẮN KHI ĐANG LƯỢN TRÊN BẦU TRỜI',
              color: CYAN,
            })}
          </g>
        ),
      })}
      <AwakeOverlay t={t} label="CHIM DI CƯ NGỦ TỪNG NHỊP 12 GIÂY NGAY KHI ĐANG BAY" color={CYAN} />
    </g>
  );
};

// --- Sh96: Medium shot in ForestCanopy — Wild Cat predator on forest floor ---
export const Sh96: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, camZoom(t, 1.04, 1.15, 96))}>
    <ForestCanopy t={t + 90} id="sh96for" />
    {ZOO.drawAnimal({
      species: 'cat',
      x: 960,
      y: 620,
      scale: 1.55,
      facing: 1,
      t,
      color: '#E6D5B8',
      accent: GREEN,
    })}
    <Tag x={960} y={220} t={t - 3} text="MÈO RỪNG SĂN ĐÊM · NGỦ ĐA CHU KỲ ĐỂ BẢO VỆ NƠ-RON" color={GREEN} />
  </g>
);

// --- Sh97: MANDATORY ZOO ANATOMICAL ZOOM + LOUPE INSET (Cat Neural Cortex & Spine — 70ms Reflex Pruning) ---
export const Sh97: React.FC<ShotProps> = ({ t }) => {
  const anchors = ZOO.anchors('cat', 540, 600, 1.45, 1);
  return (
    <g>
      {ZOO.withAnatomyZoom({
        t,
        startF: 4,
        endF: 36,
        targetX: 840,
        targetY: 520,
        baseZoom: 1.0,
        targetZoom: 1.28,
        children: (
          <g>
            <ForestCanopy t={t + 120} id="sh97for" />
            {ZOO.drawAnimal({
              species: 'cat',
              x: 540,
              y: 600,
              scale: 1.45,
              facing: 1,
              t,
              highlightOrgan: 'neuron',
              color: '#E6D5B8',
              accent: GREEN,
            })}
            {ZOO.drawAnatomyReticle({ x: anchors.neuron.x, y: anchors.neuron.y, t: t - 2, r: 42, color: GREEN, label: 'NƠ-RON VỎ NÃO' })}
            {ZOO.drawAnatomyReticle({ x: anchors.spine.x, y: anchors.spine.y, t: t - 4, r: 38, color: CYAN, label: 'CỘT SỐNG' })}
            {ZOO.drawOrganInset({
              targetX: anchors.neuron.x,
              targetY: anchors.neuron.y,
              insetX: 1180,
              insetY: 460,
              r: 155,
              t: t - 6,
              organ: 'neuron',
              title: 'CẮT TỈA KHỚP THẦN KINH',
              subtitle: 'GIỮ PHẢN XẠ SĂN MỒI 70 MILI-GIÂY',
              color: GREEN,
            })}
          </g>
        ),
      })}
    </g>
  );
};

// --- Sh98: Schematic Summary of All 4 Animal Evolutionary Strategies ---
export const Sh98: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, camZoom(t, 1.0, 1.08, 96))}>
    <Schematic t={t} id="sh98sch" />
    <SchLabel x={960} y={115} t={t - 1} text="4 GIẢI PHÁP TIẾN HÓA: KHÔNG LOÀI NÀO BỎ QUA VIỆC RỬA NÃO" size={38} color={GREEN} />
    <SchBox x={480} y={390} w={420} h={170} t={t - 2} label="CÁ HEO MŨI CHAI" sub="NGỦ ĐƠN BÁN CẦU 120 PHÚT" color={CYAN} />
    <SchBox x={1440} y={390} w={420} h={170} t={t - 4} label="CÁ MẬP TRẮNG" sub="TỦY SỐNG TỰ BƠI" color={AMBER} />
    <SchBox x={480} y={640} w={420} h={170} t={t - 6} label="ĐẠI BÀNG DI CƯ" sub="VI GIẤC NGỦ 12 GIÂY KHI BAY" color={GREEN} />
    <SchBox x={1440} y={640} w={420} h={170} t={t - 8} label="MÈO SĂN ĐÊM" sub="NGỦ NGẮN ĐA CHU KỲ (70 MS)" color={VIOLET} />
  </g>
);


// ============================================================================
// SCENE 12 — highway_society (Beats 41–44, Sh99..Sh106)
// ============================================================================

// --- Sh99: Wide shot of CityHighway at 03:00 AM glowing brighter than noon ---
export const Sh99: React.FC<ShotProps> = ({ t }) => {
  const pipPose = poseAt(t, [
    { f: 0, p: { x: 640, y: 720, scale: 1.12, yaw: 0.25, armR: { a: 54, b: 28 } } },
    { f: 48, p: { armR: { a: 88, b: 22 }, headTilt: -6 } },
    { f: 96, p: { armR: { a: 62, b: 26 }, headTilt: 3 } },
  ]);
  const moPose = poseAt(t, [
    { f: 0, p: { x: 1280, y: 720, scale: 1.12, yaw: -0.25, armL: { a: 64, b: 28 } } },
    { f: 48, p: { armL: { a: 96, b: 20 }, headTilt: 5 } },
    { f: 96, p: { armL: { a: 58, b: 30 }, headTilt: -3 } },
  ]);
  return (
    <g transform={camT(960, 520, camZoom(t, 1.0, 1.1, 96))}>
      <CityHighway t={t} id="sh99hw" />
      <Hero look={PIP} pose={{ ...pipPose, expr: 'shock' }} shadow={0.35} rimId="rimR" />
      <Hero look={MO} pose={{ ...moPose, expr: 'worried' }} shadow={0.35} rimId="rimL" />
    </g>
  );
};

// --- Sh100: Schematic — Global Mattress & Bedroom Industry Collapse ($100B Vanishes) ---
export const Sh100: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, camZoom(t, 1.0, 1.08, 96))}>
    <Schematic t={t} id="sh100_econ_shock" />
    <rect x={-120} y={-120} width={2160} height={1320} fill="#361906" opacity={0.48} />
    <Glow x={1420} y={420} r={620} o={0.55} />
    <SchLabel x={960} y={115} t={t - 1} text="CÚ SỐC KINH TẾ TOÀN CẦU KHI 8 TỶ NGƯỜI KHÔNG NGỦ" size={38} color={AMBER} />
    <SchBox x={420} y={360} w={460} h={190} t={t - 2} label="NGÀNH NỆM 100 TỶ USD" sub="SỤP ĐỔ HOÀN TOÀN TRONG 1 TUẦN" color={CRIMSON} />
    <SchBox x={960} y={520} w={460} h={190} t={t - 5} label="KHÁCH SẠN & RESORT" sub="CHUYỂN ĐỔI THÀNH VĂN PHÒNG 24/7" color={AMBER} />
    <SchBox x={1500} y={680} w={460} h={190} t={t - 8} label="CA LÀM VIỆC 16 GIỜ/NGÀY" sub="ÁP LỰC LAO ĐỘNG TĂNG GẤP ĐÔI" color={CYAN} />
    <SchLabel x={960} y={885} t={t - 10} text="KHÁI NIỆM 'ĐÊM NGHỈ NGƠI' BIẾN MẤT KHỎI NỀN VĂN MINH" size={32} color={SCH.live} />
  </g>
);

// --- Sh101: Medium shot on CityHighway overpass — 3-Shift Workday & 16-Hour Labor Contract ---
export const Sh101: React.FC<ShotProps> = ({ t }) => {
  const pipPose = poseAt(t, [
    { f: 0, p: { x: 960, y: 710, scale: 1.22, yaw: -0.15, armL: { a: 72, b: 34 }, armR: { a: 72, b: 34 } } },
    { f: 48, p: { armL: { a: 112, b: 22 }, armR: { a: 112, b: 22 }, headTilt: 8 } },
    { f: 96, p: { armL: { a: 80, b: 30 }, armR: { a: 80, b: 30 }, headTilt: -4 } },
  ]);
  return (
    <g transform={camT(960, 510, camZoom(t, 1.1, 1.22, 96))}>
      <CityHighway t={t + 40} id="sh101hw" />
      <Hero look={PIP} pose={{ ...pipPose, expr: 'worried' }} shadow={0.35} rimId="rimR" />
      <Tag x={960} y={180} t={t - 3} text="CA LÀM VIỆC TIÊU CHUẨN TĂNG TỪ 8 GIỜ LÊN 16 GIỜ / NGÀY" color={AMBER} />
    </g>
  );
};

// --- Sh102: Close-up on Pip's shocked face as the 8 extra hours are swallowed by work ---
export const Sh102: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 760, scale: 1.68, yaw: 0.18, headTilt: -4 } },
    { f: 48, p: { yaw: -0.14, headTilt: 10, armR: { a: 94, b: 58 } } },
    { f: 96, p: { yaw: 0.1, headTilt: -3, armR: { a: 52, b: 34 } } },
  ]);
  return (
    <g transform={camT(960, 490, camZoom(t, 1.12, 1.24, 96))}>
      <CityHighway t={t + 70} id="sh102hw" />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'shock'], [45, 'tired']]) }} shadow={0.3} rimId="rimR" />
      <Tag x={960} y={200} t={t - 3} text="8 GIỜ DƯ RA KHÔNG PHẢI ĐỂ NGHỈ · MÀ ĐỂ CÀY GẤP ĐÔI" color={CRIMSON} />
    </g>
  );
};

// --- Sh103: Schematic — Global Power Grid Surge (+42% Demand at 03:00 AM) ---
export const Sh103: React.FC<ShotProps> = ({ t }) => {
  const barH = kf(t, [[0, 120], [55, 290], [96, 310]]);
  return (
    <g transform={camT(960, 540, camZoom(t, 1.0, 1.08, 96))}>
      <Schematic t={t} id="sh103sch" />
      <SchLabel x={960} y={115} t={t - 1} text="QUÁ TẢI LƯỚI ĐIỆN TOÀN CẦU: TĂNG VỌT +42% VÀO BAN ĐÊM" size={38} color={CRIMSON} />
      <g transform="translate(960 520)">
        <rect x={-520} y={-210} width={1040} height={380} rx={20} fill="#14192E" stroke={CRIMSON} strokeWidth={5} />
        <rect x={-340} y={140 - 180} width={220} height={180} rx={10} fill={CYAN} />
        <text x={-230} y={110} textAnchor="middle" fontFamily={FONT.ui} fontWeight={800} fontSize={24} fill="#08121E">
          TRƯỚC ĐÂY (100%)
        </text>
        <rect x={120} y={140 - barH} width={220} height={barH} rx={10} fill={CRIMSON} />
        <text x={230} y={110} textAnchor="middle" fontFamily={FONT.ui} fontWeight={800} fontSize={24} fill="#FFF">
          KHÔNG NGỦ (142%)
        </text>
      </g>
      <SchLabel x={960} y={840} t={t - 8} text="TRẠM BIẾN ÁP KHÔNG CÒN KHOẢNG TRÙNG BAN ĐÊM ĐỂ HẠ NHIỆT" size={32} color={AMBER} />
    </g>
  );
};

// --- Sh104: Over-the-shoulder shot looking at congested 03:30 AM highway & red overload warning ---
export const Sh104: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 520, camZoom(t, 1.04, 1.15, 96))}>
    <CityHighway t={t + 100} id="sh104hw" overload />
    <Foreground x={260} side="left" />
  </g>
);

// --- Sh105: Macro insert on digital power grid meter crossing 142% redline ---
export const Sh105: React.FC<ShotProps> = ({ t }) => {
  const hx = kf(t, [[0, 820], [48, 1120], [96, 980]]);
  return (
    <g transform={camT(960, 540, camZoom(t, 1.04, 1.16, 96))}>
      <Tabletop />
      <g transform="translate(960 510)">
        <rect x={-460} y={-230} width={920} height={460} rx={24} fill="#121626" stroke={CRIMSON} strokeWidth={8} />
        <text x={0} y={-80} textAnchor="middle" fontFamily={FONT.ui} fontWeight={800} fontSize={32} fill={AMBER}>
          CÔNG SUẤT PHỤ TẢI LÚC 03:30 SÁNG
        </text>
        <text x={0} y={55} textAnchor="middle" fontFamily={FONT.ui} fontWeight={900} fontSize={112} fill={CRIMSON}>
          142,8%
        </text>
        <text x={0} y={155} textAnchor="middle" fontFamily={FONT.ui} fontWeight={800} fontSize={28} fill="#FFF">
          NGUY CƠ NỔ TRẠM BIẾN ÁP LIÊN HOÀN
        </text>
      </g>
      <InsertArm x0={1860} y0={980} x1={hx} y1={590} curve={-20} sleeveColor={C.jacket} />
    </g>
  );
};

// --- Sh106: Wide shot of CityHighway in full overload as transformers spark across the skyline ---
export const Sh106: React.FC<ShotProps> = ({ t }) => {
  const pipPose = poseAt(t, [
    { f: 0, p: { x: 820, y: 720, scale: 1.14, yaw: -0.2, armL: { a: 84, b: 36 } } },
    { f: 48, p: { armL: { a: 124, b: 20 }, headTilt: -8 } },
    { f: 96, p: { armL: { a: 92, b: 30 }, headTilt: 4 } },
  ]);
  return (
    <g transform={camT(960, 520, camZoom(t, 1.0, 1.12, 96))}>
      <CityHighway t={t + 140} id="sh106hw" overload />
      <Glow x={960} y={340} r={520} o={0.45} />
      <Hero look={PIP} pose={{ ...pipPose, expr: 'shock', glint: 1, glintColor: CRIMSON }} shadow={0.4} rimId="rimRed" />
      <Tag x={960} y={840} t={t - 3} text="HẠ TẦNG ĐÔ THỊ QUÁ NHIỆT VÌ KHÔNG CÓ BAN ĐÊM" color={CRIMSON} />
    </g>
  );
};

// ============================================================================
// SCENE 13 — server_vault_crisis (Beats 45–47, Sh107..Sh116)
// ============================================================================

// --- Sh107: Wide shot in ServerVault — 8 Billion Users Streaming 24/7 ---
export const Sh107: React.FC<ShotProps> = ({ t }) => {
  const pipPose = poseAt(t, [
    { f: 0, p: { x: 740, y: 720, scale: 1.14, yaw: 0.25, armR: { a: 58, b: 28 } } },
    { f: 48, p: { armR: { a: 96, b: 22 }, headTilt: -5 } },
    { f: 96, p: { armR: { a: 64, b: 28 }, headTilt: 3 } },
  ]);
  const moPose = poseAt(t, [
    { f: 0, p: { x: 1180, y: 720, scale: 1.14, yaw: -0.25, armL: { a: 68, b: 26 } } },
    { f: 48, p: { armL: { a: 104, b: 18 }, headTilt: 6 } },
    { f: 96, p: { armL: { a: 72, b: 24 }, headTilt: -3 } },
  ]);
  return (
    <g transform={camT(960, 520, camZoom(t, 1.0, 1.1, 96))}>
      <ServerVault t={t} id="sh107sv" />
      <Hero look={PIP} pose={{ ...pipPose, expr: 'worried' }} shadow={0.35} rimId="rimR" />
      <Hero look={MO} pose={{ ...moPose, expr: 'shock' }} shadow={0.35} rimId="rimL" />
    </g>
  );
};

// --- Sh108: Close-up on Mo in ServerVault as liquid cooling manifolds boil at 98 °C ---
export const Sh108: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 760, scale: 1.65, yaw: -0.2, armL: { a: 84, b: 28 } } },
    { f: 48, p: { armL: { a: 122, b: 18 }, headTilt: -7 } },
    { f: 96, p: { armL: { a: 88, b: 24 }, headTilt: 4 } },
  ]);
  return (
    <g transform={camT(960, 490, camZoom(t, 1.1, 1.22, 96))}>
      <ServerVault t={t + 35} id="sh108sv" overheat />
      <Hero look={MO} pose={{ ...pose, expr: 'shock', glint: 1, glintColor: CRIMSON }} shadow={0.3} rimId="rimRed" />
      <Tag x={960} y={200} t={t - 3} text="8 TỶ NGƯỜI TRUY CẬP CÙNG LÚC · MÁY CHỦ SÔI Ở 98 °C" color={CRIMSON} />
    </g>
  );
};

// --- Sh109: Schematic — Global Calorie Surge (2,200 -> 3,400 kcal/day, +1.5M tons food/day) ---
export const Sh109: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, camZoom(t, 1.0, 1.08, 96))}>
    <Schematic t={t} id="sh109sch" />
    <SchLabel x={960} y={115} t={t - 1} text="KHỦNG HOẢNG LƯƠNG THỰC: NHU CẦU NĂNG LƯỢNG TĂNG +55%" size={38} color={AMBER} />
    <SchBox x={540} y={480} w={480} h={220} t={t - 3} label="2.200 → 3.400 KCAL" sub="MỖI NGƯỜI CẦN THÊM 1.200 KCAL / NGÀY" color={AMBER} />
    <SchArrow x0={800} y0={480} x1={1080} y1={480} t={t - 6} color={CRIMSON} />
    <SchBox x={1380} y={480} w={480} h={220} t={t - 8} label="+1,5 TRIỆU TẤN / NGÀY" sub="CHUỖI CUNG ỨNG NÔNG NGHIỆP ĐỨT GÃY" color={CRIMSON} />
    <SchLabel x={960} y={840} t={t - 10} text="CƠ THỂ THỨC 24 GIỜ ĐỐT NĂNG LƯỢNG NHƯ LÒ PHẢN ỨNG" size={32} color={SCH.live} />
  </g>
);

// --- Sh110: Macro insert on daily metabolic ration counter hitting 3,400 kcal ---
export const Sh110: React.FC<ShotProps> = ({ t }) => {
  const hx = kf(t, [[0, 780], [48, 1100], [96, 940]]);
  return (
    <g transform={camT(960, 540, camZoom(t, 1.04, 1.15, 96))}>
      <Tabletop />
      <g transform="translate(960 510)">
        <rect x={-440} y={-220} width={880} height={440} rx={22} fill="#182032" stroke={AMBER} strokeWidth={8} />
        <text x={0} y={-70} textAnchor="middle" fontFamily={FONT.ui} fontWeight={800} fontSize={32} fill={CYAN}>
          ĐỊNH MỨC DINH DƯỠNG BẮT BUỘC KHI KHÔNG NGỦ
        </text>
        <text x={0} y={55} textAnchor="middle" fontFamily={FONT.ui} fontWeight={900} fontSize={92} fill={AMBER}>
          3.400 KCAL / NGÀY
        </text>
        <text x={0} y={145} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={26} fill="#FFF">
          4 BỮA CHÍNH + 2 BỮA ĐÊM ĐỂ DUY TRÌ ĐƯỜNG HUYẾT NÃO
        </text>
      </g>
      <InsertArm x0={1860} y0={980} x1={hx} y1={580} curve={-18} sleeveColor={C.jacket} />
    </g>
  );
};

// --- Sh111: Medium shot in ServerVault — Month 6 (4,320 Hours Awake) Amygdala Rage ---
export const Sh111: React.FC<ShotProps> = ({ t }) => {
  const pipPose = poseAt(t, [
    { f: 0, p: { x: 660, y: 710, scale: 1.2, yaw: 0.3, armR: { a: 78, b: 36 }, armL: { a: 62, b: 32 } } },
    { f: 48, p: { armR: { a: 118, b: 22 }, headTilt: 8 } },
    { f: 96, p: { armR: { a: 84, b: 30 }, headTilt: -4 } },
  ]);
  const sisPose = poseAt(t, [
    { f: 0, p: { x: 1260, y: 710, scale: 1.2, facing: -1, yaw: -0.3, armL: { a: 92, b: 24 } } },
    { f: 48, p: { armL: { a: 134, b: 14 }, headTilt: -10 } },
    { f: 96, p: { armL: { a: 88, b: 28 }, headTilt: 5 } },
  ]);
  return (
    <g transform={camT(960, 510, camZoom(t, 1.1, 1.22, 96))}>
      <ServerVault t={t + 70} id="sh111sv" overheat />
      <Hero look={PIP} pose={{ ...pipPose, expr: 'angry', glint: 1, glintColor: CRIMSON }} shadow={0.35} rimId="rimRed" />
      <Hero look={SIS} pose={{ ...sisPose, expr: 'angry', glint: 1, glintColor: AMBER }} shadow={0.35} rimId="rimL" />
      <Tag x={960} y={180} t={t - 3} text="THÁNG THỨ 6 · 4.320 GIỜ THỨC · BÙNG NỔ XUNG ĐỘT CẢM XÚC" color={CRIMSON} />
    </g>
  );
};

// --- Sh112: Extreme close-up on hyper-reactive bloodshot eye — Amygdala +60% ---
export const Sh112: React.FC<ShotProps> = ({ t }) => {
  const sc = 3.7;
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 625 - HEAD.y * sc, scale: sc, yaw: 0.16, sway: -6 } },
    { f: 48, p: { sway: 8, headTilt: -5 } },
    { f: 96, p: { sway: -4, headTilt: 3 } },
  ]);
  return (
    <g>
      <g transform={camT(960, 540, camZoom(t, 1.02, 1.14, 96))}>
        <ServerVault t={t + 100} id="sh112sv" overheat />
        <Hero look={PIP} pose={{ ...pose, expr: 'angry', glint: 1, glintColor: CRIMSON }} shadow={0} rimId="rimRed" />
      </g>
      <AwakeOverlay t={t} label="HẠCH HẠNH NHÂN TĂNG PHẢN ỨNG CẢM XÚC +60%" color={CRIMSON} />
    </g>
  );
};

// --- Sh113: Schematic — Prefrontal Cortex Disconnect from Hyperactive Amygdala ---
export const Sh113: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, camZoom(t, 1.0, 1.08, 96))}>
    <Schematic t={t} id="sh113_amygdala_disconnect" />
    <rect x={-120} y={-120} width={2160} height={1320} fill="#3B0918" opacity={0.44} />
    <Glow x={1380} y={540} r={620} o={0.55} />
    <SchLabel x={960} y={115} t={t - 1} text="MẤT PHANH KIỂM SOÁT CẢM XÚC SAU 6 THÁNG KHÔNG NGỦ" size={38} color={CRIMSON} />
    <SchBox x={500} y={360} w={520} h={200} t={t - 3} label="VỎ NÃO TRƯỚC TRÁN" sub="SUY GIẢM TƯ DUY LÝ TRÍ & KIỀM CHẾ" color={CYAN} />
    <SchArrow x0={780} y0={420} x1={1140} y1={580} t={t - 6} color={CRIMSON} />
    <SchBox x={1400} y={620} w={540} h={210} t={t - 8} label="HẠCH HẠNH NHÂN (+60%)" sub="PHẢN ỨNG NÓNG GIẬN & HOẢNG LOẠN" color={CRIMSON} />
    <SchLabel x={960} y={865} t={t - 10} text="MẤT ĐỒNG CẢM XÃ HỘI · XUNG ĐỘT BÙNG PHÁT KHẮP NƠI" size={32} color={SCH.live} />
  </g>
);

// --- Sh114: Over Pip's shoulder watching ServerVault red emergency klaxons flash ---
export const Sh114: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 520, camZoom(t, 1.04, 1.15, 96))}>
    <ServerVault t={t + 130} id="sh114sv" overheat />
    <Glow x={960} y={320} r={520} o={0.5} />
    <Foreground x={260} side="left" />
  </g>
);

// --- Sh115: Close-up on Pip clutching his temples as neural fatigue peaks ---
export const Sh115: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 760, scale: 1.66, yaw: 0.12, armL: { a: 112, b: 84 }, armR: { a: 112, b: 84 }, headTilt: 8 } },
    { f: 48, p: { headTilt: 16, tilt: 5 } },
    { f: 96, p: { headTilt: 6, tilt: -3 } },
  ]);
  return (
    <g transform={camT(960, 490, camZoom(t, 1.1, 1.22, 96))}>
      <ServerVault t={t + 160} id="sh115sv" overheat />
      <Hero look={PIP} pose={{ ...pose, expr: 'pain', glint: 1, glintColor: CRIMSON }} shadow={0.3} rimId="rimRed" />
    </g>
  );
};

// --- Sh116: Wide shot in ServerVault — Mo guides Pip toward the ICU medical wing ---
export const Sh116: React.FC<ShotProps> = ({ t }) => {
  const wx = kf(t, [[0, 720], [96, 1180]]);
  const walkPip = walkPose(wx, t * 0.45, () => 720, 1.1, { expr: 'tired' }, 1);
  const walkMo = walkPose(wx + 220, t * 0.45 + 12, () => 720, 1.1, { expr: 'worried' }, 1);
  return (
    <g transform={camT(960, 520, camZoom(t, 1.0, 1.1, 96))}>
      <ServerVault t={t + 190} id="sh116sv" overheat />
      <Hero look={PIP} pose={walkPip} shadow={0.35} rimId="rimRed" />
      <Hero look={MO} pose={walkMo} shadow={0.35} rimId="rimL" />
    </g>
  );
};

// ============================================================================
// SCENE 14 — icu_saturation (Beats 48–50, Sh117..Sh126)
// ============================================================================

// --- Sh117: Wide shot in HospitalICU — Month 8 (5,840 Hours Awake) Immune Collapse ---
export const Sh117: React.FC<ShotProps> = ({ t }) => {
  const pipPose = poseAt(t, [
    { f: 0, p: { x: 820, y: 710, scale: 1.12, yaw: 0.2, headTilt: 10 } },
    { f: 48, p: { headTilt: 16, armL: { a: 54, b: 48 } } },
    { f: 96, p: { headTilt: 8, armL: { a: 42, b: 36 } } },
  ]);
  const moPose = poseAt(t, [
    { f: 0, p: { x: 1180, y: 710, scale: 1.14, yaw: -0.25, armL: { a: 74, b: 28 } } },
    { f: 48, p: { armL: { a: 108, b: 20 }, headTilt: -5 } },
    { f: 96, p: { armL: { a: 68, b: 28 }, headTilt: 3 } },
  ]);
  return (
    <g transform={camT(960, 520, camZoom(t, 1.0, 1.1, 96))}>
      <HospitalICU t={t} id="sh117icu" />
      <Hero look={PIP} pose={{ ...pipPose, expr: 'tired' }} shadow={0.35} rimId="rimR" />
      <Hero look={MO} pose={{ ...moPose, expr: 'worried' }} shadow={0.35} rimId="rimL" />
    </g>
  );
};

// --- Sh118: Schematic — Natural Killer (NK) Cells Drop -70% Without Deep Sleep ---
export const Sh118: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, camZoom(t, 1.0, 1.08, 96))}>
    <Schematic t={t} id="sh118_immune_collapse" />
    <rect x={-120} y={-120} width={2160} height={1320} fill="#082E2B" opacity={0.46} />
    <Glow x={540} y={520} r={640} o={0.55} />
    <SchLabel x={960} y={115} t={t - 1} text="SỤP ĐỔ HỆ MIỄN DỊCH Ở THÁNG THỨ 8 (5.840 GIỜ THỨC)" size={38} color={CRIMSON} />
    <SchBox x={960} y={350} w={920} h={180} t={t - 3} label="TẾ BÀO SÁT THỦ TỰ NHIÊN (NK) GIẢM -70%" sub="MẤT KHẢ NĂNG TIÊU DIỆT TẾ BÀO NHIỄM VI-RÚT NGAY TỪ ĐẦU" color={CRIMSON} />
    <SchArrow x0={960} y0={445} x1={960} y1={545} t={t - 6} color={AMBER} />
    <SchBox x={960} y={645} w={920} h={180} t={t - 8} label="CYTOKINE & KHÁNG THỂ BẢO VỆ CẠN KIỆT" sub="CHỈ ĐƯỢC TỔNG HỢP MẠNH MẼ TRONG PHA NGỦ SÂU SÓNG CHẬM" color={AMBER} />
    <SchLabel x={960} y={865} t={t - 10} text="CẢM CÚM THÔNG THƯỜNG CŨNG BIẾN THÀNH VIÊM PHỔI NẶNG" size={32} color={SCH.live} />
  </g>
);

// --- Sh119: Macro microscopic view of depleted T-Cells overwhelmed by viral particles ---
export const Sh119: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, camZoom(t, 1.04, 1.16, 96))}>
    <Schematic t={t} id="sh119_tcell_macro" />
    <rect x={-120} y={-120} width={2160} height={1320} fill="#2E0B26" opacity={0.45} />
    <Glow x={960} y={490} r={620} o={0.55} />
    <SchLabel x={960} y={115} t={t - 1} text="CẬN CẢNH VI MÔ: TẾ BÀO MIỄN DỊCH KIỆT QUỆ TRƯỚC VI KHUẨN" size={38} color={CRIMSON} />
    <circle cx={960} cy={490} r={145} fill="#2A163B" stroke={CYAN} strokeWidth={8} strokeDasharray="18 10" />
    <text x={960} y={498} textAnchor="middle" fontFamily={FONT.ui} fontWeight={800} fontSize={30} fill={CYAN}>
      T-CELL SUY YẾU
    </text>
    {Array.from({ length: 8 }).map((_, i) => {
      const ang = (i * Math.PI) / 4 + t * 0.02;
      const vx = 960 + Math.cos(ang) * 260;
      const vy = 490 + Math.sin(ang) * 195;
      return <circle key={i} cx={vx} cy={vy} r={32} fill={CRIMSON} stroke="#FFF" strokeWidth={3} />;
    })}
  </g>
);

// --- Sh120: Medium shot in HospitalICU — Mo checks Pip's critical vital monitor ---
export const Sh120: React.FC<ShotProps> = ({ t }) => {
  const pipPose = poseAt(t, [
    { f: 0, p: { x: 820, y: 710, scale: 1.2, yaw: 0.25, headTilt: 12 } },
    { f: 48, p: { headTilt: 18, armR: { a: 52, b: 44 } } },
    { f: 96, p: { headTilt: 10, armR: { a: 44, b: 36 } } },
  ]);
  return (
    <g transform={camT(920, 510, camZoom(t, 1.12, 1.24, 96))}>
      <HospitalICU t={t + 50} id="sh120icu" critical />
      <Hero look={PIP} pose={{ ...pipPose, expr: 'tired' }} shadow={0.35} rimId="rimRed" />
      <Tag x={960} y={180} t={t - 3} text="NHỊP TIM 138 BPM · MIỄN DỊCH CHỈ CÒN 30%" color={CRIMSON} />
    </g>
  );
};

// --- Sh121: Close-up on Pip's pale, exhausted face in HospitalICU ---
export const Sh121: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 760, scale: 1.68, yaw: -0.14, headTilt: 10 } },
    { f: 48, p: { headTilt: 16, yaw: 0.1 } },
    { f: 96, p: { headTilt: 8, yaw: -0.08 } },
  ]);
  return (
    <g transform={camT(960, 490, camZoom(t, 1.1, 1.22, 96))}>
      <HospitalICU t={t + 80} id="sh121icu" critical />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'tired'], [46, 'pain']]) }} shadow={0.3} rimId="rimRed" />
    </g>
  );
};

// --- Sh122: Over Mo's shoulder at ICU central board showing 98% bed saturation ---
export const Sh122: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 520, camZoom(t, 1.04, 1.15, 96))}>
    <HospitalICU t={t + 110} id="sh122icu" critical />
    <Tag x={960} y={830} t={t - 3} text="BỆNH VIỆN QUÁ TẢI 98% VÌ HỘI CHỨNG SUY MIỄN DỊCH MẤT NGỦ" color={CRIMSON} />
    <Foreground x={260} side="left" />
  </g>
);

// --- Sh123: Schematic — Fatal Familial Insomnia (FFI) & Randy Gardner (264h = 11 Days) ---
export const Sh123: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, camZoom(t, 1.0, 1.08, 96))}>
    <Schematic t={t} id="sh123sch" />
    <SchLabel x={960} y={115} t={t - 1} text="BẰNG CHỨNG Y HỌC THỰC TẾ VỀ GIỚI HẠN MẤT NGỦ" size={38} color={AMBER} />
    <SchBox x={540} y={480} w={480} h={220} t={t - 3} label="RANDY GARDNER (1964)" sub="KỶ LỤC 11 NGÀY (264 GIỜ): ẢO GIÁC NẶNG" color={AMBER} />
    <SchArrow x0={800} y0={480} x1={1080} y1={480} t={t - 6} color={CRIMSON} />
    <SchBox x={1380} y={480} w={480} h={220} t={t - 8} label="MẤT NGỦ GIA ĐÌNH (FFI)" sub="ĐỘT BIẾN PRION ĐỒI THỊ → SUY ĐA TẠNG" color={CRIMSON} />
    <SchLabel x={960} y={840} t={t - 10} text="KHÔNG MỘT CƠ THỂ NÀO SỐNG SÓT NẾU NÃO KHÔNG ĐƯỢC RỬA ĐỘC TỐ" size={32} color={SCH.live} />
  </g>
);

// --- Sh124: Extreme close-up on Pip's pupils losing focus under FFI-like neural toxicity ---
export const Sh124: React.FC<ShotProps> = ({ t }) => {
  const sc = 3.7;
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 625 - HEAD.y * sc, scale: sc, yaw: 0.14, headTilt: 8 } },
    { f: 48, p: { headTilt: 14, sway: -8 } },
    { f: 96, p: { headTilt: 6, sway: 6 } },
  ]);
  return (
    <g>
      <g transform={camT(960, 540, camZoom(t, 1.02, 1.14, 96))}>
        <HospitalICU t={t + 140} id="sh124icu" critical />
        <Hero look={PIP} pose={{ ...pose, expr: 'dizzy', glint: 1, glintColor: CRIMSON }} shadow={0} rimId="rimRed" />
      </g>
      <AwakeOverlay t={t} label="NGUY CƠ SUY ĐA TẠNG DO ĐỘC TỐ THẦN KINH TÍCH TỤ" color={CRIMSON} />
    </g>
  );
};

// --- Sh125: Medium shot in HospitalICU — Mo reveals the Dolphin-Inspired Neural Cooling Helmet ---
export const Sh125: React.FC<ShotProps> = ({ t }) => {
  const moPose = poseAt(t, [
    { f: 0, p: { x: 960, y: 710, scale: 1.24, yaw: -0.15, armL: { a: 88, b: 26 }, armR: { a: 88, b: 26 } } },
    { f: 48, p: { armL: { a: 124, b: 16 }, armR: { a: 124, b: 16 }, headTilt: -6 } },
    { f: 96, p: { armL: { a: 96, b: 22 }, armR: { a: 96, b: 22 }, headTilt: 3 } },
  ]);
  return (
    <g transform={camT(960, 500, camZoom(t, 1.12, 1.24, 96))}>
      <HospitalICU t={t + 170} id="sh125icu" />
      <Hero look={MO} pose={{ ...moPose, expr: 'happy', glint: 1, glintColor: CYAN }} shadow={0.35} rimId="rimL" />
      <Tag x={960} y={180} t={t - 3} text="GIẢI PHÁP ĐỘT PHÁ: MŨ RỬA NÃO & NGỦ ĐƠN BÁN CẦU NHÂN TẠO" color={CYAN} />
    </g>
  );
};

// --- Sh126: Wide shot — Pip and Mo rush back to BioMedLab to test the neural helmet ---
export const Sh126: React.FC<ShotProps> = ({ t }) => {
  const wx = kf(t, [[0, 620], [96, 1240]]);
  const walkPip = walkPose(wx, t * 0.55, () => 710, 1.1, { expr: 'focus' }, 1);
  const walkMo = walkPose(wx + 240, t * 0.55 + 10, () => 710, 1.1, { expr: 'focus' }, 1);
  return (
    <g transform={camT(960, 520, camZoom(t, 1.0, 1.1, 96))}>
      <HospitalICU t={t + 200} id="sh126icu" />
      <Hero look={PIP} pose={walkPip} shadow={0.35} rimId="rimR" />
      <Hero look={MO} pose={walkMo} shadow={0.35} rimId="rimL" />
    </g>
  );
};

// ============================================================================
// SCENE 15 — biomed_cliffhanger (Beats 51–56, Sh127..Sh140)
// ============================================================================

// --- Sh127: Wide shot in BioMedLab — The Artificial Glymphatic & Unihemispheric Chamber ---
export const Sh127: React.FC<ShotProps> = ({ t }) => {
  const pipPose = poseAt(t, [
    { f: 0, p: { x: 760, y: 710, scale: 1.16, yaw: 0.25, armR: { a: 62, b: 28 } } },
    { f: 48, p: { armR: { a: 98, b: 20 }, headTilt: -5 } },
    { f: 96, p: { armR: { a: 68, b: 26 }, headTilt: 3 } },
  ]);
  const moPose = poseAt(t, [
    { f: 0, p: { x: 1180, y: 710, scale: 1.16, yaw: -0.25, armL: { a: 78, b: 24 } } },
    { f: 48, p: { armL: { a: 114, b: 18 }, headTilt: 6 } },
    { f: 96, p: { armL: { a: 74, b: 28 }, headTilt: -3 } },
  ]);
  return (
    <g transform={camT(960, 520, camZoom(t, 1.0, 1.1, 96))}>
      <BioMedLab t={t} id="sh127bio" headline="MŨ RỬA NÃO GLYMPHATIC NHÂN TẠO" subline="MÔ PHỎNG GIẤC NGỦ ĐƠN BÁN CẦU CỦA CÁ HEO" />
      <Hero look={PIP} pose={{ ...pipPose, expr: 'focus' }} shadow={0.35} rimId="rimR" />
      <Hero look={MO} pose={{ ...moPose, expr: 'happy' }} shadow={0.35} rimId="rimL" />
    </g>
  );
};

// --- Sh128: Macro insert on Mo's hands calibrating the Cryo-Glymphatic Neural Helmet (-1.2 °C) ---
export const Sh128: React.FC<ShotProps> = ({ t }) => {
  const hx = kf(t, [[0, 760], [48, 1080], [96, 940]]);
  return (
    <g transform={camT(960, 540, camZoom(t, 1.04, 1.15, 96))}>
      <Tabletop />
      <g transform="translate(960 510)">
        <path d="M -260 80 C -260 -180 260 -180 260 80 Z" fill="#162844" stroke={CYAN} strokeWidth={8} />
        <path d="M -180 20 C -180 -110 180 -110 180 20" fill="none" stroke={GREEN} strokeWidth={6} strokeDasharray="16 10" />
        <text x={0} y={150} textAnchor="middle" fontFamily={FONT.ui} fontWeight={900} fontSize={34} fill={CYAN}>
          MŨ VI LƯU DỊCH NÃO TỦY · HẠ NHIỆT -1,2 °C
        </text>
      </g>
      <InsertArm x0={1860} y0={980} x1={hx} y1={520} curve={-20} sleeveColor={C.altJacket} />
    </g>
  );
};

// --- Sh129: Close-up on Pip activating the glowing cyan neural helmet ---
export const Sh129: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 760, scale: 1.66, yaw: 0.14, armR: { a: 84, b: 38 } } },
    { f: 48, p: { armR: { a: 118, b: 24 }, headTilt: -5 } },
    { f: 96, p: { armR: { a: 68, b: 30 }, headTilt: 3 } },
  ]);
  return (
    <g transform={camT(960, 490, camZoom(t, 1.1, 1.22, 96))}>
      <BioMedLab t={t + 35} id="sh129bio" headline="KÍCH HOẠT RỬA NÃO BÁN CẦU TRÁI" subline="NHIỆT ĐỘ LÕI NÃO HẠ XUỐNG 35,8 °C" />
      <Glow x={960} y={380} r={420} o={0.5} />
      <Hero look={PIP} pose={{ ...pose, expr: 'cool', glint: 1, glintColor: CYAN }} shadow={0.3} rimId="rimR" />
    </g>
  );
};

// --- Sh130: Schematic — Artificial Unihemispheric Shift (90m Left Sleep / 90m Right Sleep) ---
export const Sh130: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, camZoom(t, 1.0, 1.08, 96))}>
    <Schematic t={t} id="sh130sch" />
    <SchLabel x={960} y={115} t={t - 1} text="CƠ CHẾ MŨ RỬA NÃO LUÂN PHIÊN TỪNG BÁN CẦU" size={38} color={CYAN} />
    <SchBox x={540} y={480} w={480} h={220} t={t - 3} label="90 PHÚT ĐẦU TIÊN" sub="BƠM DỊCH RỬA BÁN CẦU TRÁI" color={CYAN} />
    <SchArrow x0={800} y0={480} x1={1080} y1={480} t={t - 6} color={GREEN} />
    <SchBox x={1380} y={480} w={480} h={220} t={t - 8} label="90 PHÚT TIẾP THEO" sub="ĐỔI CA RỬA SẠCH BÁN CẦU PHẢI" color={GREEN} />
    <SchLabel x={960} y={840} t={t - 10} text="LOẠI BỎ 100% BETA-AMYLOID & PROTEIN TAU MÀ KHÔNG BẤT TỈNH" size={32} color={SCH.live} />
  </g>
);

// --- Sh131: Extreme close-up on Pip's eyes as cooling CSF flushes neural plaques ---
export const Sh131: React.FC<ShotProps> = ({ t }) => {
  const sc = 3.65;
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 625 - HEAD.y * sc, scale: sc, yaw: 0.12, headTilt: -3 } },
    { f: 48, p: { headTilt: 4, sway: 6 } },
    { f: 96, p: { headTilt: -2, sway: -4 } },
  ]);
  return (
    <g>
      <g transform={camT(960, 540, camZoom(t, 1.02, 1.14, 96))}>
        <BioMedLab t={t + 70} id="sh131bio" />
        <Hero look={PIP} pose={{ ...pose, expr: 'happy', glint: 1, glintColor: GREEN }} shadow={0} rimId="rimR" />
      </g>
      <AwakeOverlay t={t} label="ĐỘC TỐ THẦN KINH GIẢM TỪ 94% XUỐNG 12% AN TOÀN" color={GREEN} />
    </g>
  );
};

// --- Sh132: Medium shot in BioMedLab — Hologram shows green neural restoration ---
export const Sh132: React.FC<ShotProps> = ({ t }) => {
  const pipPose = poseAt(t, [
    { f: 0, p: { x: 840, y: 710, scale: 1.24, yaw: 0.25, armR: { a: 74, b: 26 } } },
    { f: 48, p: { armR: { a: 112, b: 18 }, headTilt: -6 } },
    { f: 96, p: { armR: { a: 80, b: 24 }, headTilt: 3 } },
  ]);
  const moPose = poseAt(t, [
    { f: 0, p: { x: 1240, y: 710, scale: 1.24, yaw: -0.25, armL: { a: 88, b: 22 } } },
    { f: 48, p: { armL: { a: 122, b: 16 }, headTilt: 6 } },
    { f: 96, p: { armL: { a: 84, b: 24 }, headTilt: -3 } },
  ]);
  return (
    <g transform={camT(1040, 490, camZoom(t, 1.18, 1.3, 96))}>
      <BioMedLab t={t + 100} id="sh132bio" headline="PHỤC HỒI VỎ BỌC MYELIN & A-TÊ-PÊ" subline="HỆ MIỄN DỊCH TĂNG TRỞ LẠI MỨC 96%" />
      <rect x={-200} y={-200} width={2320} height={1480} fill="#083828" opacity={0.34} />
      <Glow x={1040} y={460} r={680} o={0.55} />
      <Hero look={PIP} pose={{ ...pipPose, expr: 'happy', glint: 0.9, glintColor: GREEN }} shadow={0.35} rimId="rimR" />
      <Hero look={MO} pose={{ ...moPose, expr: 'happy', glint: 0.9, glintColor: CYAN }} shadow={0.35} rimId="rimL" />
    </g>
  );
};

// --- Sh133: Over Mo's right shoulder watching the neural toxicity gauge drop into the green zone ---
export const Sh133: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(900, 500, camZoom(t, 1.08, 1.2, 96))}>
    <BioMedLab t={t + 130} id="sh133bio" headline="GIẤC NGỦ KHÔNG PHẢI LÀ LÃNG PHÍ THỜI GIAN" subline="8 GIỜ NGỦ = 8 GIỜ BẢO TRÌ SỰ SỐNG TỐI THƯỢNG" />
    <rect x={-160} y={-160} width={2240} height={1400} fill="#083B2C" opacity={0.38} />
    <Glow x={760} y={440} r={640} o={0.55} />
    <Foreground x={1660} side="right" />
    <Tag x={780} y={840} t={t - 3} text="ĐỘC TỐ THẦN KINH GIẢM VỀ 0% · HỒI PHỤC HOÀN TOÀN" color={GREEN} />
  </g>
);

// --- Sh134: Wide shot on Night Rooftop under peaceful starlight — Pip and Mo breathe deeply ---
export const Sh134: React.FC<ShotProps> = ({ t }) => {
  const pipPose = poseAt(t, [
    { f: 0, p: { x: 740, y: 710, scale: 1.16, yaw: 0.2, armL: { a: 32, b: 14 }, armR: { a: 54, b: 22 } } },
    { f: 48, p: { armL: { a: 68, b: 18 }, armR: { a: 92, b: 18 }, headTilt: -7 } },
    { f: 96, p: { armL: { a: 38, b: 14 }, armR: { a: 48, b: 16 }, headTilt: -2 } },
  ]);
  const moPose = poseAt(t, [
    { f: 0, p: { x: 1180, y: 710, scale: 1.16, yaw: -0.2, armL: { a: 56, b: 24 } } },
    { f: 48, p: { armL: { a: 88, b: 18 }, headTilt: 5 } },
    { f: 96, p: { armL: { a: 46, b: 20 }, headTilt: -2 } },
  ]);
  return (
    <g transform={camT(960, 510, camZoom(t, 1.0, 1.12, 96))}>
      <Rooftop t={t + 80} id="sh134rf" veil={0.14} />
      <Glow x={960} y={420} r={620} o={0.45} />
      <Hero look={PIP} pose={{ ...pipPose, expr: 'happy', glint: 0.9, glintColor: CYAN }} shadow={0.35} rimId="rimR" />
      <Hero look={MO} pose={{ ...moPose, expr: 'happy', glint: 0.9, glintColor: GREEN }} shadow={0.35} rimId="rimL" />
      <Tag x={960} y={180} t={t - 3} text="ĐÊM BÌNH YÊN TRỞ LẠI · LẮNG NGHE NHỊP SINH HỌC TỰ NHIÊN" color={CYAN} />
    </g>
  );
};

// --- Sh135: Close-up in Bedroom — Pip smiles and welcomes natural sleep ---
export const Sh135: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: S2_PIP.x, y: S2_PIP.y, scale: S2_PIP.scale, yaw: 0.18, headTilt: -3 } },
    { f: 48, p: { headTilt: 5, armR: { a: 58, b: 28 } } },
    { f: 96, p: { headTilt: 2, armR: { a: 34, b: 18 } } },
  ]);
  return (
    <g transform={camT(S2_PIP.x, S2_PIP.y - 250 * S2_PIP.scale, camZoom(t, 1.45, 1.62, 96))}>
      <Bedroom t={t + 120} id="sh135bed" veil={0.25} />
      <Hero look={PIP} pose={{ ...pose, expr: 'happy', blink: kf(t, [[0, 0], [50, 1], [96, 1]]) }} shadow={0.35} rimId="rimR" />
      <Tag x={S2_PIP.x} y={S2_PIP.y - 470 * S2_PIP.scale} t={t - 3} text="NHẮM MẮT LẠI ĐỂ BỘ NÃO BẮT ĐẦU CA TRỰC ĐÊM KỲ DIỆU" color={GREEN} />
    </g>
  );
};

// --- Sh136: Schematic — The 4 Miracles Happening Tonight While You Sleep ---
export const Sh136: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, camZoom(t, 1.0, 1.08, 96))}>
    <Schematic t={t} id="sh136sch" />
    <SchLabel x={960} y={115} t={t - 1} text="4 PHÉP MÀU DIỄN RA NGAY TỐI NAY KHI BẠN CHÌM VÀO GIẤC NGỦ" size={38} color={CYAN} />
    <SchBox x={480} y={390} w={440} h={170} t={t - 2} label="1. GIÃN KHE KẼ +60%" sub="TẾ BÀO ĐỆM CO NHỎ MỞ ĐƯỜNG" color={CYAN} />
    <SchBox x={1440} y={390} w={440} h={170} t={t - 4} label="2. RỬA ĐỘC TỐ GẤP 20 LẦN" sub="CUỐN SẠCH BETA-AMYLOID & TAU" color={GREEN} />
    <SchBox x={480} y={640} w={440} h={170} t={t - 6} label="3. HẠ NHIỆT NÃO -1,2 °C" sub="PHỤC HỒI A-TÊ-PÊ & VỎ MYELIN" color={AMBER} />
    <SchBox x={1440} y={640} w={440} h={170} t={t - 8} label="4. TÁI TẠO MIỄN DỊCH" sub="SẢN SINH TẾ BÀO NK & KHÁNG THỂ" color={VIOLET} />
  </g>
);

// --- Sh137: Medium shot in ObservatoryDome — Pip and Mo beneath the stars ---
export const Sh137: React.FC<ShotProps> = ({ t }) => {
  const pipPose = poseAt(t, [
    { f: 0, p: { x: 760, y: 710, scale: 1.18, yaw: 0.2, armR: { a: 64, b: 26 } } },
    { f: 48, p: { armR: { a: 102, b: 18 }, headTilt: -6 } },
    { f: 96, p: { armR: { a: 70, b: 24 }, headTilt: 3 } },
  ]);
  const moPose = poseAt(t, [
    { f: 0, p: { x: 1180, y: 710, scale: 1.18, yaw: -0.2, armL: { a: 74, b: 24 } } },
    { f: 48, p: { armL: { a: 108, b: 18 }, headTilt: -5 } },
    { f: 96, p: { armL: { a: 68, b: 26 }, headTilt: 3 } },
  ]);
  return (
    <g transform={camT(960, 510, camZoom(t, 1.08, 1.2, 96))}>
      <ObservatoryDome t={t + 90} id="sh137obs" />
      <Hero look={PIP} pose={{ ...pipPose, expr: 'happy', glint: 1, glintColor: CYAN }} shadow={0.35} rimId="rimR" />
      <Hero look={MO} pose={{ ...moPose, expr: 'happy', glint: 1, glintColor: GREEN }} shadow={0.35} rimId="rimL" />
    </g>
  );
};

// --- Sh138: Close-up on Pip addressing the viewer in ObservatoryDome ---
export const Sh138: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 760, scale: 1.66, yaw: 0.14, armR: { a: 74, b: 28 } } },
    { f: 48, p: { armR: { a: 112, b: 20 }, headTilt: -5 } },
    { f: 96, p: { armR: { a: 78, b: 26 }, headTilt: 3 } },
  ]);
  return (
    <g transform={camT(960, 490, camZoom(t, 1.1, 1.22, 96))}>
      <ObservatoryDome t={t + 120} id="sh138obs" />
      <Hero look={PIP} pose={{ ...pose, expr: 'cool', glint: 1, glintColor: CYAN }} shadow={0.3} rimId="rimR" />
      <Tag x={960} y={200} t={t - 3} text="NẾU CÓ VIÊN THUỐC XÓA BỎ GIẤC NGỦ... BẠN CÓ DÁM UỐNG?" color={AMBER} />
    </g>
  );
};

// --- Sh139: Wide cinematic shot in ObservatoryDome — Final Question Card ---
export const Sh139: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 720, scale: 1.14, yaw: 0.1, armL: { a: 36, b: 14 }, armR: { a: 42, b: 16 } } },
    { f: 48, p: { armL: { a: 84, b: 18 }, armR: { a: 88, b: 18 }, headTilt: -6 } },
    { f: 96, p: { armL: { a: 48, b: 16 }, armR: { a: 52, b: 16 }, headTilt: -2 } },
  ]);
  return (
    <g transform={camT(960, 520, camZoom(t, 1.0, 1.12, 96))}>
      <ObservatoryDome t={t + 150} id="sh139obs" />
      <Hero look={PIP} pose={{ ...pose, expr: 'happy', glint: 1, glintColor: CYAN }} shadow={0.35} rimId="rimR" />
      <Tag x={960} y={840} t={t - 3} text="HÃY ĐỂ LẠI CÂU TRẢ LỜI & ĐỪNG THỨC KHUYA TỐI NAY!" color={GREEN} />
    </g>
  );
};

// --- Sh140: Extreme close-up cliffhanger on Pip's glowing cyan eyes ---
export const Sh140: React.FC<ShotProps> = ({ t }) => {
  const sc = 3.7;
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 625 - HEAD.y * sc, scale: sc, yaw: 0.15, sway: -6 } },
    { f: 48, p: { sway: 8, headTilt: -4 } },
    { f: 96, p: { sway: -4, headTilt: 3 } },
  ]);
  return (
    <g>
      <g transform={camT(960, 540, camZoom(t, 1.02, 1.14, 96))}>
        <ObservatoryDome t={t + 180} id="sh140obs" />
        <Hero look={PIP} pose={{ ...pose, expr: 'cool', glint: 1, glintColor: CYAN }} shadow={0} rimId="rimR" />
      </g>
      <AwakeOverlay t={t} label="8 GIỜ NGỦ ĐÊM NAY CHÍNH LÀ 8 GIỜ CỨU MẠNG BỘ NÃO CỦA BẠN" color={CYAN} />
    </g>
  );
};

export const SHOTS: Record<string, React.FC<ShotProps>> = {
  Sh1, Sh2, Sh3, Sh4, Sh5, Sh6, Sh7, Sh8, Sh9, Sh10,
  Sh11, Sh12, Sh13, Sh14, Sh15, Sh16, Sh17, Sh18, Sh19, Sh20,
  Sh21, Sh22, Sh23, Sh24, Sh25, Sh26, Sh27, Sh28, Sh29, Sh30,
  Sh31, Sh32, Sh33, Sh34, Sh35, Sh36, Sh37, Sh38, Sh39, Sh40,
  Sh41, Sh42, Sh43, Sh44, Sh45, Sh46, Sh47, Sh48, Sh49, Sh50,
  Sh51, Sh52, Sh53, Sh54, Sh55, Sh56, Sh57, Sh58, Sh59, Sh60,
  Sh61, Sh62, Sh63, Sh64, Sh65, Sh66, Sh67, Sh68, Sh69, Sh70,
  Sh71, Sh72, Sh73, Sh74, Sh75, Sh76, Sh77, Sh78, Sh79, Sh80,
  Sh81, Sh82, Sh83, Sh84, Sh85, Sh86, Sh87, Sh88, Sh89, Sh90,
  Sh91, Sh92, Sh93, Sh94, Sh95, Sh96, Sh97, Sh98, Sh99, Sh100,
  Sh101, Sh102, Sh103, Sh104, Sh105, Sh106, Sh107, Sh108, Sh109, Sh110,
  Sh111, Sh112, Sh113, Sh114, Sh115, Sh116, Sh117, Sh118, Sh119, Sh120,
  Sh121, Sh122, Sh123, Sh124, Sh125, Sh126, Sh127, Sh128, Sh129, Sh130,
  Sh131, Sh132, Sh133, Sh134, Sh135, Sh136, Sh137, Sh138, Sh139, Sh140,
};
