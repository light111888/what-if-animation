import React from 'react';
import { NightSky, Skyline } from '../kit';
import { LightVeil, Glow, Dust } from '../light';
import { FONT } from '../fonts';

/**
 * 1. Underground Subway / Night Metro Carriage (<SubwayCar>):
 *    Warm overhead fluorescent strips, passing tunnel light streaks outside the windows,
 *    chrome handrails, hanging straps that sway with `t`, and a digital station ticker.
 */
export const SubwayCar: React.FC<{
  t: number;
  id?: string;
  stationText?: string;
  speed?: number;
  veil?: number;
}> = ({
  t,
  id = 'sub',
  stationText = '03:42 AM · CHUYẾN TÀU ĐÊM · KHÔNG AI NGỦ',
  speed = 1,
  veil = 0.3,
}) => {
  const sway = Math.sin(t * 0.14) * 5;
  return (
    <g>
      <rect x={-400} y={-400} width={2720} height={1880} fill="#12101E" />
      {/* Interior Cabin Walls & Ceiling */}
      <rect x={60} y={80} width={1800} height={680} rx={28} fill="#232036" stroke="#353050" strokeWidth={6} />
      <path d="M 60 150 L 1860 150" stroke="#FFE4B5" strokeWidth={8} opacity={0.75} />
      {/* Digital Station Ticker */}
      <g transform="translate(960 116)">
        <rect x={-380} y={-24} width={760} height={44} rx={8} fill="#0A0D16" stroke="#39FF88" strokeWidth={2.5} />
        <text x={0} y={7} textAnchor="middle" fontFamily={FONT.ui} fontSize={22} fill="#39FF88" letterSpacing={2}>
          {stationText}
        </text>
      </g>
      {/* Windows with Passing Tunnel Light Streaks */}
      {[340, 960, 1580].map((wx, idx) => {
        const streakX = ((t * 28 * speed + idx * 190) % 520) - 260;
        return (
          <g key={idx} transform={`translate(${wx} 360)`}>
            <rect x={-230} y={-150} width={460} height={280} rx={18} fill="#080B14" stroke="#161426" strokeWidth={10} />
            <rect x={streakX - 60} y={-110} width={120} height={18} rx={9} fill="#7FD4FF" opacity={0.35} />
            <rect x={streakX - 30} y={20} width={90} height={12} rx={6} fill="#FF8A3D" opacity={0.3} />
          </g>
        );
      })}
      {/* Subway Bench Seats */}
      <rect x={100} y={620} width={540} height={65} rx={12} fill="#D9534F" stroke="#1A1626" strokeWidth={5} />
      <rect x={1280} y={620} width={540} height={65} rx={12} fill="#D9534F" stroke="#1A1626" strokeWidth={5} />
      {/* Cabin Floor */}
      <rect x={-200} y={720} width={2320} height={420} fill="#181526" />
      <line x1={-200} y1={720} x2={2120} y2={720} stroke="#443D66" strokeWidth={5} />
      {/* Chrome Handrails & Swaying Straps */}
      <line x1={120} y1={190} x2={1800} y2={190} stroke="#C8D0E0" strokeWidth={8} />
      {[280, 520, 760, 1160, 1400, 1640].map((sx, i) => (
        <g key={i} transform={`translate(${sx} 190) rotate(${sway + (i % 2) * 2})`}>
          <line x1={0} y1={0} x2={0} y2={72} stroke="#8A94A8" strokeWidth={5} />
          <path d="M -18 72 L 18 72 L 12 104 L -12 104 Z" fill="none" stroke="#FFE2A8" strokeWidth={5} strokeLinejoin="round" />
        </g>
      ))}
      <LightVeil id={`${id}veil`} o={veil} lights={[[460, 480, 440], [960, 480, 520], [1460, 480, 440]]} />
    </g>
  );
};

/**
 * 2. Neuro-Genetics & Sleep Research Chamber (<BioMedLab>):
 *    Cylindrical glowing bio-scanner / MRI ring, floating molecular/CSF particles,
 *    dual hemispheric EEG readouts, and high-contrast cyan/amber laboratory lighting.
 */
export const BioMedLab: React.FC<{
  t: number;
  id?: string;
  headline?: string;
  subline?: string;
  alert?: boolean;
  veil?: number;
}> = ({
  t,
  id = 'biomed',
  headline = 'NEURO-GLYMPHATIC SCAN · GEN DEC2-ZERO',
  subline = 'ĐỘ BÃO HÒA KHỚP THẦN KINH: 98,4%',
  alert = false,
  veil = 0.28,
}) => {
  const accent = alert ? '#FF3B4E' : '#39FF88';
  const secondary = alert ? '#FF8A3D' : '#7FD4FF';
  const scanY = 310 + Math.sin(t * 0.08) * 145;
  return (
    <g>
      <rect x={-400} y={-400} width={2720} height={1880} fill="#09101D" />
      {/* Architectural Lab Wall Panels */}
      {[-640, -320, 0, 320, 640].map((ox, i) => (
        <line key={i} x1={960 + ox} y1={60} x2={960 + ox} y2={740} stroke="#16243B" strokeWidth={3} />
      ))}
      {/* Left Holographic Display */}
      <g transform="translate(360 390)">
        <rect x={-230} y={-190} width={460} height={360} rx={16} fill="#0D192B" stroke={secondary} strokeWidth={4} />
        <text x={0} y={-135} textAnchor="middle" fontFamily={FONT.ui} fontSize={24} fill={secondary} letterSpacing={2}>
          EEG BÁN CẦU TRÁI · THỨC
        </text>
        <path
          d={`M -190 -40 Q -120 ${-90 + Math.sin(t * 0.25) * 35} -50 -40 T 90 -40 T 190 -40`}
          stroke={accent}
          strokeWidth={5}
          fill="none"
        />
        <text x={0} y={40} textAnchor="middle" fontFamily={FONT.ui} fontSize={24} fill="#FFE2A8" letterSpacing={2}>
          EEG BÁN CẦU PHẢI · SÓNG DELTA
        </text>
        <path
          d={`M -190 115 Q -95 ${70 + Math.cos(t * 0.1) * 28} 0 115 T 190 115`}
          stroke={secondary}
          strokeWidth={5}
          fill="none"
        />
      </g>
      {/* Center Bio-Chamber Cylinder */}
      <g transform="translate(960 410)">
        <ellipse cx={0} cy={-240} rx={210} ry={34} fill="#162844" stroke={secondary} strokeWidth={4} />
        <rect x={-210} y={-240} width={420} height={510} fill="#0E223D" opacity={0.55} stroke={secondary} strokeWidth={3} />
        <line x1={-206} y1={scanY - 410} x2={206} y2={scanY - 410} stroke={accent} strokeWidth={6} opacity={0.85} />
        <ellipse cx={0} cy={270} rx={220} ry={40} fill="#1C304F" stroke={secondary} strokeWidth={5} />
        <Glow x={0} y={0} r={340} o={0.35} />
      </g>
      {/* Right Telemetry Board */}
      <g transform="translate(1560 390)">
        <rect x={-230} y={-190} width={460} height={360} rx={16} fill="#0D192B" stroke={accent} strokeWidth={4} />
        <text x={0} y={-125} textAnchor="middle" fontFamily={FONT.ui} fontSize={23} fill={accent} letterSpacing={1.5}>
          {headline}
        </text>
        <text x={0} y={-20} textAnchor="middle" fontFamily={FONT.ui} fontSize={54} fontWeight={900} fill="#F6EFE3">
          {alert ? '41,2 °C' : '0 GIỜ NGỦ'}
        </text>
        <text x={0} y={110} textAnchor="middle" fontFamily={FONT.ui} fontSize={22} fill="#FFE2A8">
          {subline}
        </text>
      </g>
      {/* Lab Floor */}
      <rect x={-400} y={720} width={2720} height={460} fill="#101A2C" />
      <line x1={-400} y1={720} x2={2320} y2={720} stroke={secondary} strokeWidth={4} opacity={0.65} />
      <LightVeil id={`${id}veil`} o={veil} lights={[[360, 420, 380], [960, 450, 560], [1560, 420, 380]]} />
    </g>
  );
};

/**
 * 3. Biotic Dusk Forest & Wildlife Reserve (<ForestCanopy>):
 *    Layered pine/redwood silhouettes, volumetric sunset/moonlight shafts, drifting fireflies,
 *    and a natural clearing floor for animal & outdoor scenes.
 */
export const ForestCanopy: React.FC<{
  t: number;
  id?: string;
  veil?: number;
}> = ({ t, id = 'forest', veil = 0.28 }) => {
  return (
    <g>
      <NightSky id={`${id}sky`} horizonY={680} />
      {/* Distant Mountain Ridge */}
      <polygon points="-200,680 320,360 780,580 1280,310 1740,560 2160,390 2160,680" fill="#18152B" />
      {/* Volumetric Moonbeams / Dusk Shafts */}
      {[480, 980, 1440].map((bx, i) => (
        <polygon
          key={i}
          points={`${bx - 120},0 ${bx + 60},0 ${bx + 320},820 ${bx - 40},820`}
          fill="#FFE4B5"
          opacity={0.07}
        />
      ))}
      {/* Redwood / Pine Tree Trunks */}
      {[160, 420, 1520, 1780].map((tx, i) => (
        <g key={i} transform={`translate(${tx} 0)`}>
          <rect x={-34} y={40} width={68} height={700} fill="#141122" />
          <polygon points="-140,280 0,80 140,280" fill="#1B2A2F" />
          <polygon points="-120,190 0,20 120,190" fill="#22383D" />
        </g>
      ))}
      {/* Forest Clearing Ground */}
      <rect x={-400} y={680} width={2720} height={520} fill="#172226" />
      <ellipse cx={960} cy={740} rx={680} ry={75} fill="#213236" />
      {/* Glowing Fireflies */}
      {Array.from({ length: 18 }).map((_, i) => {
        const fx = 220 + ((i * 137) % 1480) + Math.sin(t * 0.08 + i) * 28;
        const fy = 260 + ((i * 89) % 440) + Math.cos(t * 0.1 + i * 0.7) * 22;
        return <circle key={i} cx={fx} cy={fy} r={4.5} fill="#FFE27A" opacity={0.55 + 0.4 * Math.sin(t * 0.2 + i)} />;
      })}
      <LightVeil id={`${id}veil`} o={veil} lights={[[960, 560, 680]]} />
    </g>
  );
};

/**
 * 4. Deep-Sea Bioluminescent Trench & Observation Dome (<OceanAbyss>):
 *    Abyssal blue-violet gradient, rising bubble streams, caustic light shafts from above,
 *    depth sonar readout, and ocean floor ridge for marine biology (`whale`, `dolphin`, `shark`).
 */
export const OceanAbyss: React.FC<{
  t: number;
  id?: string;
  depthText?: string;
  veil?: number;
}> = ({ t, id = 'ocean', depthText = 'ĐỘ SÂU: 420 MÉT · NGỦ ĐƠN BÁN CẦU (USWS)', veil = 0.26 }) => {
  return (
    <g>
      <rect x={-400} y={-400} width={2720} height={1880} fill="#071529" />
      {/* Upper Water Caustic Rays */}
      {[380, 780, 1180, 1540].map((rx, i) => (
        <polygon
          key={i}
          points={`${rx - 70},-40 ${rx + 70},-40 ${rx + 210 + Math.sin(t * 0.06 + i) * 30},840 ${rx - 190},840`}
          fill="#4CC9F0"
          opacity={0.08}
        />
      ))}
      {/* Depth & Sonar Readout Pill */}
      {depthText ? (
        <g transform="translate(960 155)">
          <rect x={-410} y={-28} width={820} height={54} rx={14} fill="#06101F" stroke="#4CC9F0" strokeWidth={3} opacity={0.9} />
          <text x={0} y={8} textAnchor="middle" fontFamily={FONT.ui} fontSize={25} fill="#7FD4FF" letterSpacing={2}>
            {depthText}
          </text>
        </g>
      ) : null}
      {/* Abyssal Seafloor Ridge */}
      <path d="M -300 760 Q 260 690 780 740 T 1640 710 T 2220 760 L 2220 1180 L -300 1180 Z" fill="#0B1F38" />
      {/* Rising Bioluminescent Bubbles */}
      {Array.from({ length: 24 }).map((_, i) => {
        const bx = 160 + ((i * 149) % 1600) + Math.sin(t * 0.12 + i) * 16;
        const by = 820 - ((t * 5 + i * 73) % 760);
        const br = 4 + (i % 4) * 2.5;
        return <circle key={i} cx={bx} cy={by} r={br} fill="#7FD4FF" opacity={0.45} />;
      })}
      <LightVeil id={`${id}veil`} o={veil} lights={[[960, 480, 740]]} />
    </g>
  );
};

/**
 * 5. Astronomical & Circadian Observatory Dome (<ObservatoryDome>):
 *    Vaulted dome ribs opening to a rotating starfield & crescent moon,
 *    giant telescope barrel, and circadian clock ring.
 */
export const ObservatoryDome: React.FC<{
  t: number;
  id?: string;
  veil?: number;
}> = ({ t, id = 'obs', veil = 0.28 }) => {
  const starRot = t * 0.08;
  return (
    <g>
      <NightSky id={`${id}sky`} horizonY={700} />
      {/* Rotating Starfield Arcs in the Open Dome Aperture */}
      <g transform={`translate(960 360) rotate(${starRot})`}>
        {[160, 240, 320].map((r, i) => (
          <circle
            key={i}
            cx={0}
            cy={0}
            r={r}
            fill="none"
            stroke="#7FD4FF"
            strokeWidth={2}
            strokeDasharray="18 28"
            opacity={0.35}
          />
        ))}
      </g>
      {/* Dome Architectural Silhouette */}
      <path d="M -200 720 A 1100 680 0 0 1 620 80 L 620 720 Z" fill="#161326" stroke="#2D274B" strokeWidth={6} />
      <path d="M 2120 720 A 1100 680 0 0 0 1300 80 L 1300 720 Z" fill="#161326" stroke="#2D274B" strokeWidth={6} />
      {/* Telescope Mount */}
      <g transform={`translate(1280 560) rotate(${-28 + Math.sin(t * 0.05) * 4})`}>
        <rect x={-180} y={-28} width={340} height={56} rx={12} fill="#30384E" stroke="#141824" strokeWidth={5} />
        <ellipse cx={-180} cy={0} rx={14} ry={28} fill="#7FD4FF" />
      </g>
      <rect x={-400} y={710} width={2720} height={460} fill="#1B172E" />
      <LightVeil id={`${id}veil`} o={veil} lights={[[960, 460, 660]]} />
    </g>
  );
};

/**
 * 6. Hospital / Sleep Deprivation ICU Bay (<HospitalICU>):
 *    Bedside vitals monitor with animated ECG & brain-temp readout, IV stand,
 *    curtain divider, and cool moonlight slats.
 */
export const HospitalICU: React.FC<{
  t: number;
  id?: string;
  bpmText?: string;
  tempText?: string;
  critical?: boolean;
  veil?: number;
}> = ({ t, id = 'icu', bpmText, tempText, critical = false, veil = 0.3 }) => {
  const pulseX = ((t * 14) % 360) - 180;
  const resolvedBpm = bpmText ?? (critical ? 'NHỊP TIM: 148 BPM · BÁO ĐỘNG' : 'NHỊP TIM: 118 BPM');
  const resolvedTemp = tempText ?? (critical ? 'MIỄN DỊCH NK: 30% · NGUY KỊCH' : 'NHIỆT ĐỘ NÃO: 39,4 °C');
  return (
    <g>
      <rect x={-400} y={-400} width={2720} height={1880} fill="#101624" />
      {/* Window Slats with Cool Moonlight */}
      <g transform="translate(340 320)">
        <rect x={-180} y={-180} width={360} height={340} rx={12} fill="#1A2740" stroke="#2C3E60" strokeWidth={6} />
        {Array.from({ length: 7 }).map((_, i) => (
          <rect key={i} x={-165} y={-150 + i * 44} width={330} height={18} fill="#7FD4FF" opacity={0.18} />
        ))}
      </g>
      {/* Bedside Vitals Monitor */}
      <g transform="translate(1480 360)">
        <rect x={-240} y={-170} width={480} height={320} rx={18} fill="#0A101C" stroke={critical ? '#FF3B4E' : '#4CC9F0'} strokeWidth={5} />
        <text x={-200} y={-110} fontFamily={FONT.ui} fontSize={24} fill={critical ? '#FF3B4E' : '#39FF88'}>
          {resolvedBpm}
        </text>
        <text x={-200} y={-65} fontFamily={FONT.ui} fontSize={24} fill="#FF8A3D">
          {resolvedTemp}
        </text>
        <path
          d="M -200 30 L -90 30 L -60 -45 L -30 75 L 0 -60 L 30 45 L 65 30 L 200 30"
          stroke="#FF3B4E"
          strokeWidth={5}
          fill="none"
        />
        <circle cx={pulseX} cy={30} r={8} fill="#FFFFFF" />
      </g>
      {/* Floor */}
      <rect x={-400} y={710} width={2720} height={460} fill="#182032" />
      <line x1={-400} y1={710} x2={2320} y2={710} stroke="#2E3D5C" strokeWidth={5} />
      <LightVeil id={`${id}veil`} o={veil} lights={[[420, 480, 440], [960, 560, 520], [1480, 420, 440]]} />
    </g>
  );
};

/**
 * 7. Sleepless 24-Hour Metropolis Overpass (<CityHighway>):
 *    Elevated suspension bridge / highway at 03:00 AM with every skyscraper window lit up,
 *    moving streams of headlights & tail lights, and power-grid load signs.
 */
export const CityHighway: React.FC<{
  t: number;
  id?: string;
  bannerText?: string;
  overload?: boolean;
  veil?: number;
}> = ({ t, id = 'hwy', bannerText, overload = false, veil = 0.28 }) => {
  const resolvedBanner = bannerText ?? (overload ? 'BÁO ĐỘNG ĐỎ · LƯỚI ĐIỆN QUÁ TẢI 142% LÚC 03:30 SÁNG' : '03:00 AM · CA LÀM VIỆC 16 GIỜ · THÀNH PHỐ KHÔNG NGỦ');
  return (
    <g>
      <NightSky id={`${id}sky`} horizonY={640} />
      <Skyline y={640} seed={41} color="#1B1630" h={320} />
      <Skyline y={660} seed={73} color="#251E40" h={240} />
      {/* Highway Gantry Sign */}
      <g transform="translate(960 150)">
        <rect x={-520} y={-42} width={1040} height={84} rx={12} fill="#0E1524" stroke={overload ? '#FF3B4E' : '#FF8A3D'} strokeWidth={4} />
        <text x={0} y={10} textAnchor="middle" fontFamily={FONT.ui} fontSize={26} fill={overload ? '#FF3B4E' : '#FFE2A8'} letterSpacing={2}>
          {resolvedBanner}
        </text>
      </g>
      {/* Elevated Overpass Deck */}
      <rect x={-400} y={660} width={2720} height={110} fill="#221D34" />
      <rect x={-400} y={760} width={2720} height={420} fill="#151221" />
      {/* Moving Headlight & Taillight Streams */}
      {Array.from({ length: 10 }).map((_, i) => {
        const cx = ((t * 16 + i * 220) % 2200) - 200;
        const rx = 2000 - ((t * 14 + i * 220) % 2200);
        return (
          <g key={i}>
            <rect x={cx} y={685} width={74} height={14} rx={7} fill="#FFF3D6" opacity={0.85} />
            <rect x={rx} y={722} width={68} height={14} rx={7} fill="#FF3B4E" opacity={0.85} />
          </g>
        );
      })}
      <LightVeil id={`${id}veil`} o={veil} lights={[[460, 560, 480], [960, 520, 620], [1460, 560, 480]]} />
    </g>
  );
};

/**
 * 8. Quantum / Global Grid Server Vault (<ServerVault>):
 *    Converging perspective aisles of optical server monoliths with rising data pulses
 *    and floor cooling grates.
 */
export const ServerVault: React.FC<{
  t: number;
  id?: string;
  alert?: boolean;
  overheat?: boolean;
  veil?: number;
}> = ({ t, id = 'vault', alert = false, overheat = false, veil = 0.28 }) => {
  const col = alert || overheat ? '#FF3B4E' : '#4CC9F0';
  return (
    <g>
      <rect x={-400} y={-400} width={2720} height={1880} fill="#070B14" />
      {/* Perspective Server Monoliths */}
      {[-720, -480, -260, 260, 480, 720].map((ox, i) => {
        const h = 420 + Math.abs(ox) * 0.25;
        const pulseY = 420 - ((t * 8 + i * 55) % 340);
        return (
          <g key={i} transform={`translate(${960 + ox} 440)`}>
            <rect x={-75} y={-h / 2} width={150} height={h} rx={10} fill="#101829" stroke="#1E2F4D" strokeWidth={4} />
            <line x1={0} y1={-h / 2 + 20} x2={0} y2={h / 2 - 20} stroke={col} strokeWidth={4} opacity={0.45} />
            <circle cx={0} cy={pulseY - 220} r={9} fill={col} />
          </g>
        );
      })}
      {/* Vault Floor & Perspective Grid */}
      <rect x={-400} y={700} width={2720} height={480} fill="#0C1322" />
      <line x1={-400} y1={700} x2={2320} y2={700} stroke={col} strokeWidth={4} opacity={0.7} />
      <LightVeil id={`${id}veil`} o={veil} lights={[[960, 500, 680]]} />
      <Dust seed={21} x0={240} y0={120} w={1440} h={620} t={t} />
    </g>
  );
};
