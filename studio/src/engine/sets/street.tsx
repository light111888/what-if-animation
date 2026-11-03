import React from 'react';
import { Look, LOOKS } from '../rig';
import { NightSky, Skyline } from '../kit';
import { LightVeil, Glow, Dust } from '../light';
import { FONT } from '../fonts';

/**
 * Biomechanical Insert Arm + Sleeve + Mitten (modeled on rewind/shots.tsx Sh2).
 * Connects the hand at (x1 / x, y1 / y) to the frame edge at (x0 / fromX, y0 / fromY)
 * with a curved forearm so close-up/macro inserts never draw a disembodied floating circle.
 */
export const InsertArm: React.FC<{
  x?: number;
  y?: number;
  fromX?: number;
  fromY?: number;
  x0?: number;
  y0?: number;
  x1?: number;
  y1?: number;
  curve?: number;
  sleeveColor?: string;
  look?: Look;
  scale?: number;
  rimId?: 'rimR' | 'rimL' | 'rimRed' | 'rimBlue';
  children?: React.ReactNode;
}> = ({
  x,
  y,
  fromX,
  fromY,
  x0,
  y0,
  x1,
  y1,
  curve = 24,
  sleeveColor,
  look = LOOKS.pipHood,
  scale = 1,
  rimId = 'rimR',
  children,
}) => {
  const hx = x1 ?? x ?? 960;
  const hy = y1 ?? y ?? 540;
  const sx = x0 ?? fromX ?? hx + 420;
  const sy = y0 ?? fromY ?? hy - 280;
  const ctrlX = (hx + sx) * 0.5 + curve * 1.4;
  const ctrlY = (hy + sy) * 0.5 - curve;
  const wLine = 66 * scale;
  const wLimb = 52 * scale;
  const rHand = 42 * scale;
  const armFill = sleeveColor || look.limb;
  return (
    <g filter={`url(#${rimId})`}>
      <path
        d={`M ${hx} ${hy} Q ${ctrlX} ${ctrlY} ${sx} ${sy}`}
        stroke={look.line}
        strokeWidth={wLine}
        fill="none"
        strokeLinecap="round"
      />
      <path
        d={`M ${hx} ${hy} Q ${ctrlX} ${ctrlY} ${sx} ${sy}`}
        stroke={armFill}
        strokeWidth={wLimb}
        fill="none"
        strokeLinecap="round"
      />
      <circle cx={hx} cy={hy} r={rHand} fill={look.hand} stroke={look.line} strokeWidth={6 * scale} />
      {children ? <g transform={`translate(${hx} ${hy})`}>{children}</g> : null}
    </g>
  );
};

/**
 * Rain-slicked city street intersection at dusk/night: perspective asphalt road, zebra crosswalk,
 * streetlamps with warm light pools, construction crane, and rain streaks that freeze when `rainSpeed` -> 0.
 */
export const StreetRain: React.FC<{
  t: number;
  id?: string;
  rainSpeed?: number;
  redAlert?: number;
  red?: number;
  craneSnap?: number;
  crane?: boolean;
  beamDrop?: number;
  poleTilt?: number;
  asphaltCrack?: number;
  crack?: number;
  blueGlass?: number;
  veil?: number;
}> = ({
  t,
  id = 'str',
  rainSpeed = 1,
  redAlert,
  red = 0,
  craneSnap,
  crane = false,
  beamDrop = 0,
  poleTilt = 0,
  asphaltCrack,
  crack = 0,
  blueGlass = 0,
  veil = 0.34,
}) => {
  const horizonY = 660;
  const floorY = 820;
  const effRed = redAlert ?? red;
  const effCrane = craneSnap ?? (crane ? Math.max(0.2, beamDrop) : 0);
  const effCrack = asphaltCrack ?? crack;
  return (
    <g>
      <NightSky id={`${id}sky`} horizonY={horizonY} />
      {effRed > 0 ? <rect x={-400} y={-400} width={2720} height={1880} fill="#7A0F22" opacity={0.45 * effRed} /> : null}
      <Skyline y={horizonY + 20} seed={19} color="#171429" h={240} />
      <Skyline y={horizonY + 45} seed={31} color="#211B38" h={180} />

      {/* Construction Crane on the left skyline */}
      <g transform="translate(520 180)">
        <rect x={-16} y={0} width={32} height={520} fill="#1B182B" stroke="#2D2744" strokeWidth={4} />
        <path d="M -16 40 L 16 80 L -16 120 L 16 160 L -16 200 L 16 240" stroke="#2D2744" strokeWidth={4} fill="none" />
        <rect x={-140} y={0} width={480} height={22} fill="#25203B" />
        {/* Crane cable & steel beam */}
        <line
          x1={180}
          y1={22}
          x2={180}
          y2={effCrane > 0 ? 110 : 210}
          stroke="#9BA4B8"
          strokeWidth={5}
        />
        <g transform={`translate(180 ${210 + effCrane * 220}) rotate(${effCrane * 14})`}>
          <rect x={-150} y={0} width={300} height={38} rx={4} fill="#394154" stroke="#16141F" strokeWidth={5} />
          <line x1={-140} y1={19} x2={140} y2={19} stroke="#FF8A3D" strokeWidth={4} strokeDasharray="18 12" />
        </g>
      </g>

      {/* Sidewalk & Wet Asphalt Road */}
      <rect x={-400} y={horizonY + 40} width={2720} height={120} fill="#262136" />
      <rect x={-400} y={horizonY + 150} width={2720} height={10} fill="#3B3352" />
      <rect x={-400} y={horizonY + 160} width={2720} height={660} fill="#161321" />

      {/* Zebra Crosswalk Stripes in perspective */}
      {Array.from({ length: 7 }).map((_, i) => {
        const cx = 420 + i * 180;
        return (
          <polygon
            key={i}
            points={`${cx - 45},${floorY - 12} ${cx + 45},${floorY - 12} ${cx + 70},${floorY + 72} ${cx - 70},${floorY + 72}`}
            fill="#D8D2C5"
            opacity={0.42}
          />
        );
      })}

      {/* Asphalt Impact Cracks when Pip kicks off at high G */}
      {effCrack > 0 ? (
        <g transform="translate(860 825)" opacity={effCrack}>
          <ellipse cx={0} cy={0} rx={130} ry={28} fill="#0B0912" />
          <path d="M -120 -4 L -40 8 L 0 0 L 75 -16 L 145 -6 M -55 22 L 0 0 L 62 24 M -18 -24 L 0 0 L 24 28" stroke="#FF5A4A" strokeWidth={4} fill="none" />
        </g>
      ) : null}

      {/* Left & Right Streetlamps with practical light pools */}
      <g transform="translate(280 260)">
        <rect x={-8} y={0} width={16} height={460} fill="#1E1A2D" />
        <path d="M 0 0 Q 60 -20 110 10" stroke="#1E1A2D" strokeWidth={12} fill="none" />
        <ellipse cx={110} cy={14} rx={24} ry={10} fill="#FFE2A8" />
        <Glow x={110} y={14} r={240} o={0.55} />
      </g>
      <g transform={`translate(1480 260) rotate(${-poleTilt})`} style={{ transformOrigin: '0px 460px' }}>
        <rect x={-8} y={0} width={16} height={460} fill="#1E1A2D" />
        <path d="M 0 0 Q -60 -20 -110 10" stroke="#1E1A2D" strokeWidth={12} fill="none" />
        <ellipse cx={-110} cy={14} rx={24} ry={10} fill="#FFE2A8" />
        <Glow x={-110} y={14} r={240} o={0.55} />
      </g>

      {/* LightVeil with pools under streetlamps */}
      <LightVeil
        id={`${id}veil`}
        o={veil}
        lights={[
          [390, 580, 340],
          [960, 680, 440],
          [1370, 580, 340],
        ]}
      />

      {blueGlass > 0 ? <rect x={-400} y={-400} width={2720} height={1880} fill="#0A2246" opacity={blueGlass} /> : null}

      {/* Rain streaks or frozen crystal raindrops */}
      {Array.from({ length: 36 }).map((_, i) => {
        const rx = 80 + ((i * 173 + Math.floor(t * rainSpeed * 6)) % 1760);
        const ry = 60 + ((i * 251 + Math.floor(t * rainSpeed * 22)) % 880);
        return rainSpeed < 0.15 ? (
          <g key={i} transform={`translate(${rx} ${ry})`}>
            <circle cx={0} cy={0} r={5.5} fill="#8BE0FF" opacity={0.88} />
            <circle cx={-1.5} cy={-1.5} r={2} fill="#FFFFFF" />
          </g>
        ) : (
          <line
            key={i}
            x1={rx}
            y1={ry}
            x2={rx - 8}
            y2={ry + 28}
            stroke="#9CC8EE"
            strokeWidth={2.5}
            opacity={0.45}
            strokeLinecap="round"
          />
        );
      })}
    </g>
  );
};

/**
 * Indoor Sports Arena & Boxing/Table-Tennis Stadium with overhead stadium spotlights and crowd silhouettes.
 */
export const ArenaRing: React.FC<{
  t: number;
  id?: string;
  mode?: 'boxing' | 'pingpong';
  ropes?: boolean;
  scoreboardText?: string;
  title?: string;
  veil?: number;
}> = ({ t, id = 'arena', mode = 'boxing', ropes, scoreboardText, title, veil = 0.32 }) => {
  const showRopes = ropes ?? (mode === 'boxing');
  const label = title || scoreboardText || 'LIVE · ARENA CHAMPIONSHIP';
  return (
    <g>
      <rect x={-400} y={-400} width={2720} height={1880} fill="#141124" />
      {/* Overhead Stadium Spotlights */}
      {[460, 960, 1460].map((lx, i) => (
        <g key={i}>
          <polygon points={`${lx - 40},40 ${lx + 40},40 ${lx + 260},860 ${lx - 260},860`} fill="#FFE4B5" opacity={0.11} />
          <rect x={lx - 48} y={20} width={96} height={24} rx={6} fill="#2A243B" />
          <ellipse cx={lx} cy={44} rx={36} ry={10} fill="#FFF3D6" />
        </g>
      ))}
      {/* Stadium Jumbotron Scoreboard */}
      <g transform="translate(960 175)">
        <rect x={-420} y={-48} width={840} height={96} rx={16} fill="#0B0E1A" stroke="#FF8A3D" strokeWidth={4} />
        <text x={0} y={12} textAnchor="middle" fontFamily={FONT.ui} fontSize={32} fill="#FFE2A8" letterSpacing={3}>
          {label}
        </text>
      </g>
      {/* Distant Crowd Silhouettes */}
      {Array.from({ length: 28 }).map((_, i) => (
        <circle
          key={i}
          cx={140 + i * 62}
          cy={650 + Math.sin(t * 0.1 + i) * 4}
          r={28}
          fill="#1E1930"
        />
      ))}
      {/* Arena Floor */}
      <rect x={-400} y={680} width={2720} height={600} fill="#261F38" />
      <line x1={-400} y1={680} x2={2320} y2={680} stroke="#FF8A3D" strokeWidth={5} opacity={0.6} />
      {showRopes ? (
        <g>
          {/* Corner Posts & Ring Ropes */}
          <rect x={220} y={380} width={28} height={440} rx={6} fill="#D93848" stroke="#16141F" strokeWidth={5} />
          <rect x={1672} y={380} width={28} height={440} rx={6} fill="#3888FF" stroke="#16141F" strokeWidth={5} />
          <line x1={240} y1={450} x2={1680} y2={450} stroke="#FF3B4E" strokeWidth={10} />
          <line x1={240} y1={560} x2={1680} y2={560} stroke="#F4EEE1" strokeWidth={9} />
          <line x1={240} y1={670} x2={1680} y2={670} stroke="#7FD4FF" strokeWidth={10} />
        </g>
      ) : null}
      <LightVeil id={`${id}veil`} o={veil} lights={[[960, 580, 620]]} />
      <Dust seed={9} x0={260} y0={120} w={1400} h={640} t={t} />
    </g>
  );
};

/**
 * Biometric Surveillance / Telemetry Control Room with multi-monitor wall and server racks.
 */
export const SurveillanceLab: React.FC<{
  t: number;
  id?: string;
  headline?: string;
  subline?: string;
  alert?: boolean;
}> = ({
  t,
  id = 'surv',
  headline = 'BIOMETRIC TELEMETRY · 1.000 FPS',
  subline = 'ANOMALY DETECTED: 25 MS VISUAL LATENCY',
  alert = true,
}) => {
  const accent = alert ? '#FF3B4E' : '#7FD4FF';
  return (
    <g>
      <rect x={-400} y={-400} width={2720} height={1880} fill="#090D18" />
      {/* Server Racks Left & Right */}
      {[-1, 1].map((dir, s) => (
        <g key={s} transform={`translate(${960 + dir * 740} 480)`}>
          <rect x={-110} y={-320} width={220} height={640} rx={12} fill="#111828" stroke="#1F2B44" strokeWidth={4} />
          {Array.from({ length: 12 }).map((_, r) => (
            <g key={r} transform={`translate(0 ${-270 + r * 46})`}>
              <rect x={-85} y={-12} width={170} height={24} rx={4} fill="#182238" />
              <circle cx={-65} cy={0} r={4.5} fill={(r + Math.floor(t / 6)) % 3 === 0 ? accent : '#39FF88'} />
              <circle cx={-48} cy={0} r={4.5} fill="#7FD4FF" />
            </g>
          ))}
        </g>
      ))}
      {/* Main Widescreen Telemetry Wall */}
      <g transform="translate(960 400)">
        <rect x={-540} y={-240} width={1080} height={460} rx={20} fill="#0D1628" stroke={accent} strokeWidth={6} />
        <text x={0} y={-170} textAnchor="middle" fontFamily={FONT.ui} fontSize={34} fill={accent} letterSpacing={2}>
          {headline}
        </text>
        {/* Oscilloscope Waveform */}
        <path
          d={`M -460 10 L -220 10 L -160 -110 L -110 95 L -55 -135 L 0 70 L 55 10 L 460 10`}
          stroke={accent}
          strokeWidth={7}
          fill="none"
        />
        <text x={0} y={165} textAnchor="middle" fontFamily={FONT.ui} fontSize={30} fill="#F6EFE3">
          {subline}
        </text>
      </g>
      {/* Control Console Desk */}
      <rect x={220} y={720} width={1480} height={260} rx={16} fill="#131B2E" stroke="#23314F" strokeWidth={5} />
      <LightVeil id={`${id}veil`} o={0.35} lights={[[960, 460, 660]]} />
    </g>
  );
};
