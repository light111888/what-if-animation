import React from 'react';
import { clamp, easeOut, backOut } from '../anim';
import { FONT } from '../fonts';

// The schematic: the genre's diagram shot for the science beat ("That's real."). A dark blueprint with a fine grid,
// cream line drawings that draw on, labels in the mono face, a number that counts, icons that light up in orange.
// Keep it to one idea per shot, readable in the time it's up.

export const SCH = { ground: '#101A2A', grid: '#1C2C44', line: '#F6EFE3', dim: '#7E8DA6', live: '#FF8A3D', glow: '#FFB15A' };

const SCH_THEMES = [
  { ground: '#0C182B', grid: '#1B3458', glow: '#2C6CB0', accent: '#4CC9F0', gx: 560, gy: 380, pat: 0 },
  { ground: '#09211D', grid: '#174A40', glow: '#228B72', accent: '#39FF88', gx: 1360, gy: 420, pat: 1 },
  { ground: '#24140B', grid: '#542E18', glow: '#A85820', accent: '#FF9F1C', gx: 960, gy: 320, pat: 2 },
  { ground: '#1A102E', grid: '#3A2366', glow: '#6B3FA0', accent: '#B57BFF', gx: 620, gy: 700, pat: 3 },
  { ground: '#260D16', grid: '#581D30', glow: '#9E2A4B', accent: '#FF3B4E', gx: 1320, gy: 660, pat: 4 },
  { ground: '#0E1433', grid: '#243274', glow: '#3F56B8', accent: '#688BFF', gx: 440, gy: 560, pat: 5 },
  { ground: '#08252C', grid: '#165260', glow: '#20889E', accent: '#4CC9F0', gx: 1460, gy: 340, pat: 6 },
  { ground: '#211C0D', grid: '#4D401B', glow: '#8F7626', accent: '#FFD166', gx: 960, gy: 760, pat: 7 },
  { ground: '#122416', grid: '#285232', glow: '#3D8C50', accent: '#5BE08A', gx: 520, gy: 460, pat: 8 },
  { ground: '#251128', grid: '#522459', glow: '#8F3D9C', accent: '#E07BFF', gx: 1400, gy: 520, pat: 9 },
];

function hashId(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export const Schematic: React.FC<{ t: number; id?: string }> = ({ t, id = 'sch' }) => {
  const h = hashId(id);
  const theme = SCH_THEMES[h % SCH_THEMES.length];
  const gridStep = 36 + (h % 5) * 8;
  const cx = 360 + (h % 7) * 200;
  const cy = 280 + ((h >> 3) % 5) * 130;
  const rot = ((h >> 5) % 7) * 12 - 36;
  return (
    <g>
      <defs>
        <pattern id={`${id}grid`} width={gridStep} height={gridStep} patternUnits="userSpaceOnUse">
          <path d={`M ${gridStep} 0 L 0 0 0 ${gridStep}`} fill="none" stroke={theme.grid} strokeWidth={1.6} />
        </pattern>
        <pattern id={`${id}grid5`} width={gridStep * 5} height={gridStep * 5} patternUnits="userSpaceOnUse">
          <path d={`M ${gridStep * 5} 0 L 0 0 0 ${gridStep * 5}`} fill="none" stroke={theme.grid} strokeWidth={3.2} />
        </pattern>
        <radialGradient id={`${id}glow`}>
          <stop offset="0%" stopColor={theme.glow} stopOpacity={0.92} />
          <stop offset="100%" stopColor={theme.ground} stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect x={-400} y={-400} width={2720} height={1880} fill={theme.ground} />
      <circle cx={theme.gx} cy={theme.gy} r={980} fill={`url(#${id}glow)`} />
      <circle cx={1920 - theme.gx} cy={1080 - theme.gy} r={680} fill={theme.accent} opacity={0.1} />
      <g transform={`translate(${(t * 0.4) % gridStep} 0)`}>
        <rect x={-440} y={-400} width={2800} height={1880} fill={`url(#${id}grid)`} />
        <rect x={-440} y={-400} width={2800} height={1880} fill={`url(#${id}grid5)`} />
      </g>
      {/* Unique architectural blueprint watermark per schematic shot */}
      <g opacity={0.22} stroke={theme.accent} fill="none">
        {theme.pat % 5 === 0 ? (
          <g transform={`translate(${cx} ${cy}) rotate(${rot + t * 0.25})`}>
            <circle r={420} strokeWidth={3} strokeDasharray="24 14" />
            <circle r={290} strokeWidth={2.5} />
            <circle r={160} strokeWidth={2} strokeDasharray="10 10" />
            <line x1={-480} y1={0} x2={480} y2={0} strokeWidth={2} />
            <line x1={0} y1={-480} x2={0} y2={480} strokeWidth={2} />
          </g>
        ) : theme.pat % 5 === 1 ? (
          <g transform={`translate(0 ${(h % 5) * 30 - 60})`}>
            {[-260, -120, 20, 160, 300].map((oy, k) => (
              <path
                key={k}
                d={`M 60 ${540 + oy} Q 520 ${380 + oy + (k % 2 ? 120 : -120)} 960 ${540 + oy} T 1860 ${540 + oy}`}
                strokeWidth={3}
                strokeDasharray={k % 2 ? '18 10' : undefined}
              />
            ))}
          </g>
        ) : theme.pat % 5 === 2 ? (
          <g transform={`translate(${cx} ${cy}) rotate(${rot})`}>
            {[-3, -2, -1, 0, 1, 2, 3].map((k) => (
              <polygon
                key={k}
                points="0,-110 95,-55 95,55 0,110 -95,55 -95,-55"
                transform={`translate(${k * 210} ${(k % 2) * 110})`}
                strokeWidth={3}
              />
            ))}
          </g>
        ) : theme.pat % 5 === 3 ? (
          <g>
            {[0, 1, 2, 3, 4, 5].map((k) => (
              <rect
                key={k}
                x={180 + k * 270}
                y={220 + ((k + h) % 4) * 90}
                width={190}
                height={520 - ((k + h) % 4) * 90}
                rx={12}
                strokeWidth={2.5}
                fill={theme.accent}
                fillOpacity={0.08}
              />
            ))}
          </g>
        ) : (
          <g transform={`translate(960 540) rotate(${rot})`}>
            <ellipse rx={720} ry={260} strokeWidth={3} strokeDasharray="20 12" />
            <ellipse rx={720} ry={260} transform="rotate(60)" strokeWidth={2.5} />
            <ellipse rx={720} ry={260} transform="rotate(-60)" strokeWidth={2.5} />
          </g>
        )}
      </g>
      {/* Top & bottom telemetry framing bars */}
      <rect x={70} y={54} width={1780} height={8} rx={4} fill={theme.accent} opacity={0.28} />
      <rect x={70} y={1018} width={1780} height={8} rx={4} fill={theme.accent} opacity={0.28} />
      {/* corner registration marks, like a drawing sheet */}
      {[
        [80, 80, 1, 1],
        [1840, 80, -1, 1],
        [80, 1000, 1, -1],
        [1840, 1000, -1, -1],
      ].map(([x, y, sx, sy], i) => (
        <path key={i} d={`M ${x} ${y + sy * 40} L ${x} ${y} L ${x + sx * 40} ${y}`} stroke={theme.accent} strokeWidth={4} fill="none" />
      ))}
    </g>
  );
};

/** A path that draws on from t = 0 over `dur` frames. */
export const DrawOn: React.FC<{ d: string; t: number; dur?: number; color?: string; width?: number; fill?: string }> = ({ d, t, dur = 10, color = SCH.line, width = 5, fill = 'none' }) => {
  const p = easeOut(clamp(t / dur));
  if (p <= 0) return null;
  return <path d={d} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} stroke={color} strokeWidth={width} fill={p >= 1 ? fill : 'none'} strokeLinecap="round" strokeLinejoin="round" />;
};

/** An arrow from (x0, y0) to (x1, y1), drawing on from t = 0, with a slight arc. */
export const Arrow: React.FC<{ x0: number; y0: number; x1: number; y1: number; t: number; dur?: number; color?: string; bend?: number }> = ({ x0, y0, x1, y1, t, dur = 8, color = SCH.line, bend = 0.12 }) => {
  const mx = (x0 + x1) / 2 - (y1 - y0) * bend;
  const my = (y0 + y1) / 2 + (x1 - x0) * bend;
  const p = easeOut(clamp(t / dur));
  const a = Math.atan2(y1 - my, x1 - mx);
  return (
    <g>
      <DrawOn d={`M ${x0} ${y0} Q ${mx} ${my} ${x1} ${y1}`} t={t} dur={dur} color={color} width={5} />
      {p >= 1 ? <path d={`M ${x1 - 22 * Math.cos(a - 0.45)} ${y1 - 22 * Math.sin(a - 0.45)} L ${x1} ${y1} L ${x1 - 22 * Math.cos(a + 0.45)} ${y1 - 22 * Math.sin(a + 0.45)}`} stroke={color} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" /> : null}
    </g>
  );
};

/** A label in the mono face that pops on from t = 0. */
export const SchLabel: React.FC<{ x: number; y: number; t: number; text: string; size?: number; color?: string; anchor?: 'start' | 'middle' | 'end' }> = ({ x, y, t, text, size = 36, color = SCH.line, anchor = 'middle' }) => {
  if (t < 0) return null;
  const s = backOut(clamp(t / 6));
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <text textAnchor={anchor} fontFamily={FONT.ui} fontSize={size} fill={color} letterSpacing={2}>
        {text}
      </text>
    </g>
  );
};

/** A number counting from 0 to `to` between t = 0 and dur, formatted with commas (or by `format`). */
export const CountUp: React.FC<{ x: number; y: number; t: number; to: number; dur?: number; size?: number; color?: string; suffix?: string; format?: (v: number) => string }> = ({
  x, y, t, to, dur = 30, size = 64, color = SCH.live, suffix = '', format,
}) => {
  if (t < 0) return null;
  const v = to * easeOut(clamp(t / dur));
  const txt = format ? format(v) : Math.round(v).toLocaleString('en-US');
  return (
    <text x={x} y={y} textAnchor="middle" fontFamily={FONT.ui} fontSize={size} fill={color} style={{ filter: `drop-shadow(0 0 14px ${SCH.glow}66)` }}>
      {txt + suffix}
    </text>
  );
};

/** A line icon of a kind of power plant, lit (orange, glowing) when `on` > 0. Centred on x, y, about 120 tall. */
export const PlantIcon: React.FC<{ x: number; y: number; kind: 'tower' | 'wind' | 'solar' | 'dam' | 'factory'; on: number; t: number; s?: number }> = ({ x, y, kind, on, t, s = 1 }) => {
  const c = on > 0 ? SCH.live : SCH.dim;
  const w = 5;
  const body: Record<string, React.ReactNode> = {
    tower: (
      <g>
        <path d="M -44 50 Q -26 0 -36 -50 L 36 -50 Q 26 0 44 50 Z" />
        <path d="M 50 50 L 50 -20 L 70 -20 L 70 50" />
        {on > 0 ? <path d={`M -20 -62 q ${-10 + Math.sin(t / 5) * 6} -20 0 -36 q 14 -14 4 -30`} strokeOpacity={0.7} /> : null}
      </g>
    ),
    wind: (
      <g>
        <path d="M 0 -20 L -6 50 L 6 50 Z" />
        <g transform={`translate(0 -20) rotate(${on > 0 ? t * 12 : 20})`}>
          <path d="M 0 0 L 0 -56 M 0 0 L 48 28 M 0 0 L -48 28" />
        </g>
      </g>
    ),
    solar: (
      <g>
        <path d="M -60 20 L -36 -30 L 60 -30 L 36 20 Z" />
        <path d="M -48 -5 L 48 -5 M -12 -30 L -24 20 M 24 -30 L 12 20" />
        <path d="M 0 20 L 0 50" />
      </g>
    ),
    dam: (
      <g>
        <path d="M -60 -40 L -40 50 L 40 50 L 60 -40 Z" />
        <path d="M -20 10 Q -10 30 -20 50 M 10 10 Q 20 30 10 50" />
      </g>
    ),
    factory: (
      <g>
        <path d="M -60 50 L -60 0 L -30 -20 L -30 0 L 0 -20 L 0 0 L 30 -20 L 30 50 Z" />
        <path d="M 40 50 L 40 -50 L 58 -50 L 58 50" />
      </g>
    ),
  };
  return (
    <g transform={`translate(${x} ${y}) scale(${s * (1 + 0.12 * Math.sin(clamp(on) * Math.PI))})`} stroke={c} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" style={on > 0 ? { filter: `drop-shadow(0 0 10px ${SCH.glow})` } : undefined}>
      {body[kind]}
    </g>
  );
};

export const SchArrow = Arrow;

/** A blueprint diagram box centred on (x, y) with title and subtitle that pop in from t = 0. */
export const SchBox: React.FC<{
  x: number;
  y: number;
  w?: number;
  h?: number;
  t: number;
  label: string;
  sub?: string;
  color?: string;
}> = ({ x, y, w = 440, h = 200, t, label, sub, color = SCH.live }) => {
  if (t < 0) return null;
  const s = backOut(clamp(t / 6));
  const pillW = Math.max(w, Math.max(label.length * 22, (sub || '').length * 15) + 56);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-pillW / 2} y={-h / 2} width={pillW} height={h} rx={22} fill="#0A1424" opacity={0.94} />
      <rect x={-pillW / 2} y={-h / 2} width={pillW} height={h} rx={22} fill={color} opacity={0.22} stroke={color} strokeWidth={5} />
      <rect x={-pillW / 2 + 10} y={-h / 2 + 10} width={pillW - 20} height={24} rx={10} fill={color} opacity={0.5} />
      <text x={0} y={sub ? 4 : 16} textAnchor="middle" fontFamily={FONT.ui} fontWeight={900} fontSize={32} fill="#FFFFFF">
        {label}
      </text>
      {sub ? (
        <text x={0} y={48} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={22} fill={color}>
          {sub}
        </text>
      ) : null}
    </g>
  );
};
