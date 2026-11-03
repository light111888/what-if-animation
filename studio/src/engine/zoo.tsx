import React from 'react';
import { camT, clamp, easeInOut, easeOut, backOut, lerp } from './anim';
import { C } from './rig';
import { FONT } from './fonts';
import { UI } from './ui';

export type AnimalSpecies =
  | 'wolf'
  | 'dog'
  | 'cat'
  | 'eagle'
  | 'bird'
  | 'shark'
  | 'whale'
  | 'dolphin'
  | 'trex'
  | 'raptor'
  | 'elephant'
  | 'cheetah'
  | 'octopus'
  | 'tardigrade';

export type OrganKind =
  | 'eye'
  | 'retina'
  | 'brain'
  | 'neuron'
  | 'heart'
  | 'lungs'
  | 'airsac'
  | 'jaw'
  | 'teeth'
  | 'spine'
  | 'bone'
  | 'fin'
  | 'claw'
  | 'skin'
  | 'dna';

export type AnatomyAnchors = Record<OrganKind, { x: number; y: number }>;

const LOCAL_ANCHORS: Record<string, Partial<Record<OrganKind, [number, number]>>> = {
  default: {
    eye: [115, -92],
    retina: [110, -92],
    brain: [82, -110],
    neuron: [82, -110],
    jaw: [130, -68],
    teeth: [134, -68],
    heart: [36, -34],
    lungs: [12, -46],
    airsac: [8, -48],
    spine: [-18, -68],
    bone: [42, 24],
    claw: [58, 76],
    fin: [0, -88],
    skin: [-30, -40],
    dna: [20, -40],
  },
  shark: {
    eye: [148, -22],
    retina: [144, -22],
    brain: [110, -34],
    neuron: [110, -34],
    jaw: [152, 12],
    teeth: [156, 12],
    heart: [56, 8],
    lungs: [72, -6],
    airsac: [72, -6],
    spine: [-10, -18],
    bone: [10, -68],
    fin: [10, -78],
    claw: [35, 52],
    skin: [-40, -10],
    dna: [20, -10],
  },
  eagle: {
    eye: [86, -84],
    retina: [82, -84],
    brain: [68, -96],
    neuron: [68, -96],
    jaw: [108, -76],
    teeth: [108, -76],
    heart: [28, -32],
    lungs: [10, -42],
    airsac: [-6, -38],
    spine: [-16, -52],
    bone: [-24, -84],
    claw: [24, 58],
    fin: [-24, -84],
    skin: [-20, -30],
    dna: [15, -36],
  },
};

export function getAnatomyAnchors(
  species: AnimalSpecies = 'wolf',
  x = 960,
  y = 680,
  scale = 1,
  facing: 1 | -1 = 1,
): AnatomyAnchors {
  const key =
    species === 'shark' || species === 'whale' || species === 'dolphin'
      ? 'shark'
      : species === 'eagle' || species === 'bird'
        ? 'eagle'
        : 'default';
  const base = { ...LOCAL_ANCHORS.default, ...(LOCAL_ANCHORS[key] || {}) };
  const out = {} as AnatomyAnchors;
  for (const [k, pt] of Object.entries(base)) {
    const [lx, ly] = pt!;
    out[k as OrganKind] = {
      x: x + lx * scale * facing,
      y: y + ly * scale,
    };
  }
  return out;
}

export type AnimalProps = {
  species?: AnimalSpecies;
  x?: number;
  y?: number;
  scale?: number;
  facing?: 1 | -1;
  t?: number;
  color?: string;
  shade?: string;
  accent?: string;
  highlightOrgan?: OrganKind;
};

export const Animal: React.FC<AnimalProps> = ({
  species = 'wolf',
  x = 960,
  y = 680,
  scale = 1,
  facing = 1,
  t = 0,
  color = '#D8C7B2',
  shade = '#9E8C78',
  accent = '#FF8A3D',
  highlightOrgan,
}) => {
  const breathe = Math.sin(t * 0.12) * 3;
  const tailWag = Math.sin(t * 0.22) * 8;
  const isDolphin = species === 'dolphin' || species === 'whale';
  const isShark = species === 'shark';
  const isAquatic = isDolphin || isShark;
  const isAvian = species === 'eagle' || species === 'bird';
  const isDino = species === 'trex' || species === 'raptor';
  const anchorKey = isAquatic ? 'shark' : isAvian ? 'eagle' : 'default';
  const organPt = highlightOrgan
    ? (LOCAL_ANCHORS[anchorKey]?.[highlightOrgan] ?? LOCAL_ANCHORS.default[highlightOrgan] ?? [40, -40])
    : null;

  return (
    <g transform={`translate(${x} ${y}) scale(${scale * facing} ${scale})`}>
      {/* Contact shadow */}
      <ellipse cx={0} cy={88} rx={145} ry={18} fill="#000" opacity={0.32} />

      {isDolphin ? (
        <g transform={`translate(0 ${breathe})`}>
          {/* Dolphin horizontal tail flukes */}
          <path
            d={`M -145 4 L -215 ${-42 + tailWag * 0.55} Q -185 4 -212 ${44 + tailWag * 0.55} Z`}
            fill={shade}
            stroke={C.ink}
            strokeWidth={5}
            strokeLinejoin="round"
          />
          {/* Curved falcate dorsal fin (characteristic dolphin curve, distinct from shark triangle) */}
          <path
            d="M -18 -38 Q 4 -116 -38 -110 Q -18 -72 -42 -36 Z"
            fill={shade}
            stroke={C.ink}
            strokeWidth={5}
            strokeLinejoin="round"
          />
          {/* Arched dolphin body + melon forehead + bottlenose rostrum */}
          <path
            d="M -150 4 Q -45 -68 95 -42 Q 145 -32 158 -8 Q 198 -4 202 10 Q 194 24 148 20 Q 82 42 -35 44 Q -105 34 -150 4 Z"
            fill={color}
            stroke={C.ink}
            strokeWidth={5}
            strokeLinejoin="round"
          />
          {/* Cream ventral belly countershading */}
          <path d="M -118 12 Q 15 40 150 16 Q 85 38 -32 39 Z" fill="#F6EFE3" opacity={0.88} />
          {/* Blowhole on top of melon + rising air bubbles */}
          <ellipse cx={92} cy={-38} rx={9} ry={3.5} fill={C.ink} />
          <circle cx={92} cy={-56 - ((t * 1.2) % 24)} r={5} fill="#8ECAE6" opacity={0.75} />
          <circle cx={102} cy={-72 - ((t * 1.2 + 12) % 24)} r={7} fill="#8ECAE6" opacity={0.55} />
          {/* Smooth curved pectoral flipper */}
          <path
            d="M 36 16 Q 12 76 -12 72 Q 6 38 64 24 Z"
            fill={shade}
            stroke={C.ink}
            strokeWidth={5}
            strokeLinejoin="round"
          />
          {/* Friendly bottlenose smile line & bright mammalian eye */}
          <path d="M 142 12 Q 172 18 194 10" stroke={C.ink} strokeWidth={4} fill="none" strokeLinecap="round" />
          <circle cx={136} cy={-14} r={8.5} fill={C.ink} />
          <circle cx={138} cy={-16} r={3.2} fill="#FFF" />
        </g>
      ) : isShark ? (
        <g transform={`translate(0 ${breathe})`}>
          {/* Tail & dorsal fin */}
          <path
            d={`M -140 0 L -210 ${-54 + tailWag * 0.5} L -185 0 L -205 ${48 + tailWag * 0.5} Z`}
            fill={shade}
            stroke={C.ink}
            strokeWidth={5}
            strokeLinejoin="round"
          />
          <path d="M -20 -42 L 18 -108 L 48 -38 Z" fill={shade} stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />
          {/* Streamlined torso */}
          <path
            d="M -150 0 Q -40 -62 110 -34 Q 175 -18 190 0 Q 165 32 95 36 Q -30 48 -150 0 Z"
            fill={color}
            stroke={C.ink}
            strokeWidth={5}
            strokeLinejoin="round"
          />
          <path d="M -120 8 Q 10 38 155 12 Q 95 34 -30 38 Z" fill="#F6EFE3" opacity={0.8} />
          {/* Gill slits */}
          {[-1, 0, 1].map((g) => (
            <path key={g} d={`M ${68 + g * 12} -14 L ${64 + g * 12} 14`} stroke={C.ink} strokeWidth={3.5} strokeLinecap="round" />
          ))}
          {/* Pectoral fin */}
          <path d="M 28 18 L 2 74 L 62 28 Z" fill={shade} stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />
          {/* Jaw & eye */}
          <path d="M 118 8 L 166 12 L 132 24 Z" fill={C.ink} />
          <circle cx={148} cy={-18} r={8} fill={C.ink} />
          <circle cx={150} cy={-20} r={3} fill="#FFF" />
        </g>
      ) : isAvian ? (
        <g transform={`translate(0 ${breathe})`}>
          {/* Tail feathers */}
          <path d="M -68 -12 L -132 14 L -118 36 L -52 10 Z" fill={shade} stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />
          {/* Talons */}
          <path d="M 12 22 L 18 68 M 18 68 L 4 78 M 18 68 L 32 76" stroke={accent} strokeWidth={6} strokeLinecap="round" />
          <path d="M 34 20 L 42 66 M 42 66 L 28 76 M 42 66 L 56 74" stroke={accent} strokeWidth={6} strokeLinecap="round" />
          {/* Avian body */}
          <ellipse cx={6} cy={-24} rx={78} ry={46} transform="rotate(-18 6 -24)" fill={color} stroke={C.ink} strokeWidth={5} />
          {/* Swept wing */}
          <path
            d={`M -36 -48 Q -8 -128 54 ${-112 + tailWag} Q 32 -44 -28 -18 Z`}
            fill={shade}
            stroke={C.ink}
            strokeWidth={5}
            strokeLinejoin="round"
          />
          {/* Head & hooked beak */}
          <circle cx={76} cy={-78} r={32} fill="#F6EFE3" stroke={C.ink} strokeWidth={5} />
          <path d="M 102 -86 Q 134 -80 124 -58 L 98 -66 Z" fill={accent} stroke={C.ink} strokeWidth={4.5} strokeLinejoin="round" />
          <circle cx={86} cy={-82} r={7} fill={C.ink} />
          <circle cx={88} cy={-84} r={2.5} fill="#FFF" />
        </g>
      ) : (
        <g>
          {/* Back legs */}
          <path d="M -66 -10 L -82 38 L -68 82" stroke={shade} strokeWidth={18} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M 42 -10 L 34 40 L 44 82" stroke={shade} strokeWidth={18} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          {/* Tail */}
          <path
            d={isDino ? `M -82 -38 Q -165 -28 -225 ${-10 + tailWag}` : `M -82 -44 Q -138 ${-68 + tailWag} -154 ${-28 + tailWag}`}
            stroke={color}
            strokeWidth={isDino ? 26 : 16}
            strokeLinecap="round"
            fill="none"
          />
          {/* Torso */}
          <path
            d="M -88 -42 Q -10 -78 68 -52 Q 94 -22 68 8 Q -12 16 -84 -4 Z"
            transform={`translate(0 ${breathe})`}
            fill={color}
            stroke={C.ink}
            strokeWidth={5}
            strokeLinejoin="round"
          />
          {/* Near legs */}
          <path d="M -52 -6 L -64 42 L -50 84" stroke={color} strokeWidth={18} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M -52 -6 L -64 42 L -50 84" stroke={C.ink} strokeWidth={4} strokeLinecap="round" fill="none" />
          <path d="M 54 -6 L 52 44 L 62 84" stroke={color} strokeWidth={18} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M 54 -6 L 52 44 L 62 84" stroke={C.ink} strokeWidth={4} strokeLinecap="round" fill="none" />
          {/* Neck & Head */}
          <g transform={`translate(0 ${breathe})`}>
            <path d="M 48 -46 L 88 -96 L 138 -82 L 132 -56 L 76 -48 Z" fill={color} stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />
            {/* Ears */}
            {!isDino ? (
              <path d="M 74 -94 L 68 -132 L 96 -104 Z M 94 -96 L 96 -130 L 114 -100 Z" fill={shade} stroke={C.ink} strokeWidth={4.5} strokeLinejoin="round" />
            ) : null}
            {/* Jaw / snout */}
            <path d="M 96 -64 L 138 -62 L 128 -48 L 92 -52 Z" fill={shade} stroke={C.ink} strokeWidth={4} strokeLinejoin="round" />
            {/* Eye */}
            <circle cx={112} cy={-86} r={7.5} fill={C.ink} />
            <circle cx={114} cy={-88} r={2.8} fill="#FFF" />
          </g>
        </g>
      )}

      {/* Subtle internal organ silhouette cue when highlighted */}
      {organPt ? (
        <circle
          cx={organPt[0]}
          cy={organPt[1]}
          r={22 + Math.sin(t * 0.3) * 4}
          fill={accent}
          opacity={0.35}
        />
      ) : null}
    </g>
  );
};

export type AnatomyZoomProps = {
  t: number;
  startF?: number;
  endF?: number;
  targetX: number;
  targetY: number;
  baseCx?: number;
  baseCy?: number;
  baseZoom?: number;
  targetZoom?: number;
  children: React.ReactNode;
};

export const AnatomyZoom: React.FC<AnatomyZoomProps> = ({
  t,
  startF = 6,
  endF = 24,
  targetX,
  targetY,
  baseCx = 960,
  baseCy = 540,
  baseZoom = 1.0,
  targetZoom = 2.15,
  children,
}) => {
  const u = easeInOut(clamp((t - startF) / Math.max(1, endF - startF)));
  const cx = lerp(baseCx, targetX, u);
  const cy = lerp(baseCy, targetY, u);
  const z = lerp(baseZoom, targetZoom, u);
  return <g transform={camT(cx, cy, z)}>{children}</g>;
};

export type AnatomyReticleProps = {
  x: number;
  y: number;
  t: number;
  r?: number;
  color?: string;
  label?: string;
};

export const AnatomyReticle: React.FC<AnatomyReticleProps> = ({
  x,
  y,
  t,
  r = 44,
  color = '#7FD4FF',
  label,
}) => {
  if (t < 0) return null;
  const open = backOut(clamp(t / 8));
  const pulse = 1 + 0.08 * Math.sin(t * 0.25);
  const rad = r * open * pulse;
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={rad * 1.35} fill={color} opacity={0.12} />
      <circle
        r={rad}
        fill="none"
        stroke={color}
        strokeWidth={4}
        strokeDasharray="14 8"
        transform={`rotate(${t * 2.5})`}
      />
      <circle r={rad * 0.55} fill="none" stroke="#F6EFE3" strokeWidth={2.5} opacity={0.85} />
      <path
        d={`M ${-rad - 12} 0 L ${-rad + 8} 0 M ${rad - 8} 0 L ${rad + 12} 0 M 0 ${-rad - 12} L 0 ${-rad + 8} M 0 ${rad - 8} L 0 ${rad + 12}`}
        stroke={color}
        strokeWidth={3.5}
        strokeLinecap="round"
      />
      {label ? (
        <g transform={`translate(0 ${-rad - 26})`}>
          <rect x={-label.length * 11 - 18} y={-22} width={label.length * 22 + 36} height={34} rx={8} fill={UI.pill} opacity={0.85} stroke={color} strokeWidth={2} />
          <text y={3} textAnchor="middle" fontFamily={FONT.ui} fontSize={22} fill={UI.text} letterSpacing={2}>
            {label}
          </text>
        </g>
      ) : null}
    </g>
  );
};

export type OrganProps = {
  organ: OrganKind;
  x?: number;
  y?: number;
  scale?: number;
  t?: number;
  color?: string;
};

export const Organ: React.FC<OrganProps> = ({
  organ,
  x = 0,
  y = 0,
  scale = 1,
  t = 0,
  color = '#FF8A3D',
}) => {
  const pulse = 1 + 0.07 * Math.sin(t * 0.35);
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {organ === 'heart' ? (
        <g transform={`scale(${pulse})`}>
          <path
            d="M 0 68 C -75 20 -88 -42 -42 -64 C -14 -76 0 -48 0 -32 C 0 -48 14 -76 42 -64 C 88 -42 75 20 0 68 Z"
            fill="#E04848"
            stroke="#F6EFE3"
            strokeWidth={5}
          />
          {/* Aorta & vessels */}
          <path d="M -18 -58 L -26 -96 M 12 -60 L 24 -94" stroke="#7FD4FF" strokeWidth={12} strokeLinecap="round" />
          <path d="M -38 -12 Q 0 12 38 -8 M 0 -32 L 0 52" stroke="#8C1D24" strokeWidth={5} fill="none" strokeLinecap="round" />
        </g>
      ) : organ === 'eye' || organ === 'retina' ? (
        <g>
          <circle r={76} fill="#1E1B2E" stroke="#F6EFE3" strokeWidth={5} />
          {/* Retina layer arc */}
          <path d="M -48 -58 A 74 74 0 1 1 -48 58" fill="none" stroke="#FF8A3D" strokeWidth={10} strokeLinecap="round" />
          {/* Cornea & lens */}
          <ellipse cx={-56} cy={0} rx={22} ry={44} fill="#7FD4FF" opacity={0.75} stroke="#F6EFE3" strokeWidth={4} />
          {/* Light rays converging onto retina */}
          <path d="M -105 -24 L -52 -16 L 62 0 M -105 24 L -52 16 L 62 0" stroke="#FFE27A" strokeWidth={3.5} strokeDasharray="6 4" fill="none" />
          {/* Optic nerve */}
          <path d="M 74 -12 L 112 -18 M 74 12 L 112 18" stroke="#F6EFE3" strokeWidth={6} strokeLinecap="round" />
        </g>
      ) : organ === 'brain' || organ === 'neuron' ? (
        <g>
          <path
            d="M -68 18 C -88 -12 -72 -62 -28 -68 C -10 -82 32 -80 52 -62 C 86 -48 88 6 58 26 C 36 44 -34 42 -68 18 Z"
            fill="#F29B9B"
            stroke="#F6EFE3"
            strokeWidth={5}
          />
          <path
            d="M -42 -28 Q -12 -46 18 -24 Q 44 -42 54 -10 M -48 4 Q -8 -14 28 8 M -16 -56 Q 4 -18 -8 24"
            stroke="#8C3B4A"
            strokeWidth={4.5}
            fill="none"
            strokeLinecap="round"
          />
          {/* Firing neural synapses */}
          {[
            [-28, -26],
            [16, -32],
            [32, 2],
            [-14, 8],
          ].map(([nx, ny], idx) => (
            <circle
              key={idx}
              cx={nx}
              cy={ny}
              r={5 + ((t + idx * 5) % 12) * 0.6}
              fill="#7FD4FF"
              opacity={1 - (((t + idx * 5) % 12) / 12)}
            />
          ))}
        </g>
      ) : organ === 'lungs' || organ === 'airsac' ? (
        <g transform={`scale(${1 + 0.05 * Math.sin(t * 0.2)})`}>
          <path d="M 0 -86 L 0 -28 M 0 -28 L -28 -4 M 0 -28 L 28 -4" stroke="#F6EFE3" strokeWidth={10} strokeLinecap="round" fill="none" />
          <path d="M -18 -48 C -72 -44 -86 24 -56 64 C -32 82 -12 58 -12 12 Z" fill="#E88B9C" stroke="#F6EFE3" strokeWidth={4.5} />
          <path d="M 18 -48 C 72 -44 86 24 56 64 C 32 82 12 58 12 12 Z" fill="#E88B9C" stroke="#F6EFE3" strokeWidth={4.5} />
          {/* Bronchioles / air sacs */}
          <circle cx={-46} cy={22} r={14} fill="none" stroke="#7FD4FF" strokeWidth={3} />
          <circle cx={46} cy={22} r={14} fill="none" stroke="#7FD4FF" strokeWidth={3} />
        </g>
      ) : organ === 'jaw' || organ === 'teeth' ? (
        <g>
          <path d="M -78 -36 L 68 -18 L 56 4 L -72 -4 Z" fill="#E6DAC6" stroke="#F6EFE3" strokeWidth={4.5} />
          <path d="M -72 28 L 62 16 L 52 38 L -68 48 Z" fill="#E6DAC6" stroke="#F6EFE3" strokeWidth={4.5} />
          {[-48, -22, 4, 30, 50].map((tx, i) => (
            <path key={i} d={`M ${tx} -12 L ${tx + 7} 8 L ${tx + 14} -10 M ${tx} 22 L ${tx + 7} 4 L ${tx + 14} 20`} fill="#FFF" stroke={C.ink} strokeWidth={2.5} />
          ))}
        </g>
      ) : (
        /* Spine / Bone / Claw / Fin / DNA default structural diagram */
        <g>
          {[-56, -28, 0, 28, 56].map((vx, i) => (
            <g key={i} transform={`translate(${vx} ${Math.sin(i * 0.7 + t * 0.1) * 6})`}>
              <rect x={-11} y={-22} width={22} height={44} rx={6} fill="#F6EFE3" stroke={color} strokeWidth={3.5} />
              <circle r={5} fill={color} />
            </g>
          ))}
          <path d="M -74 0 L 74 0" stroke="#7FD4FF" strokeWidth={4} strokeDasharray="8 6" />
        </g>
      )}
    </g>
  );
};

export type OrganInsetProps = {
  targetX: number;
  targetY: number;
  insetX?: number;
  insetY?: number;
  r?: number;
  t: number;
  organ?: OrganKind;
  title?: string;
  subtitle?: string;
  color?: string;
  children?: React.ReactNode;
};

export const OrganInset: React.FC<OrganInsetProps> = ({
  targetX,
  targetY,
  insetX = 1480,
  insetY = 310,
  r = 165,
  t,
  organ = 'heart',
  title,
  subtitle,
  color = '#7FD4FF',
  children,
}) => {
  if (t < 0) return null;
  const open = backOut(clamp(t / 9));
  const lineDraw = easeOut(clamp(t / 7));
  const dx = insetX - targetX;
  const dy = insetY - targetY;
  const dist = Math.max(1, Math.hypot(dx, dy));
  const edgeX = insetX - (dx / dist) * r * open;
  const edgeY = insetY - (dy / dist) * r * open;
  const clipId = `loupeClip_${Math.round(insetX)}_${Math.round(insetY)}`;
  const heading = title ?? organ.toUpperCase();

  return (
    <g>
      {/* Callout projection line from anatomical reticle to magnifying loupe */}
      <line
        x1={targetX}
        y1={targetY}
        x2={lerp(targetX, edgeX, lineDraw)}
        y2={lerp(targetY, edgeY, lineDraw)}
        stroke={color}
        strokeWidth={4.5}
        strokeDasharray="10 8"
      />
      <circle cx={targetX} cy={targetY} r={7} fill={color} />

      {/* Magnifying Loupe Inset Window */}
      <g transform={`translate(${insetX} ${insetY}) scale(${open})`}>
        <defs>
          <clipPath id={clipId}>
            <circle r={r - 6} />
          </clipPath>
        </defs>
        <circle r={r + 10} fill={color} opacity={0.14} />
        <circle r={r} fill="#120E24" opacity={0.94} stroke={color} strokeWidth={7} />
        {/* Blueprint grid inside loupe */}
        <g clipPath={`url(#${clipId})`}>
          {[-120, -60, 0, 60, 120].map((g) => (
            <React.Fragment key={g}>
              <line x1={g} y1={-r} x2={g} y2={r} stroke={color} strokeWidth={1} opacity={0.16} />
              <line x1={-r} y1={g} x2={r} y2={g} stroke={color} strokeWidth={1} opacity={0.16} />
            </React.Fragment>
          ))}
          {children ?? <Organ organ={organ} t={t} color={color} />}
        </g>
        {/* Glass specular highlight */}
        <path d={`M ${-r * 0.65} ${-r * 0.45} A ${r * 0.85} ${r * 0.85} 0 0 1 ${r * 0.55} ${-r * 0.65}`} fill="none" stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" opacity={0.3} />
        {/* Label pill below loupe */}
        {(() => {
          const pillW = Math.max(320, Math.max(heading.length * 19, (subtitle || '').length * 14.5) + 52);
          return (
            <g transform={`translate(0 ${r + 34})`}>
              <rect x={-pillW / 2} y={-26} width={pillW} height={subtitle ? 74 : 48} rx={16} fill={UI.pill} opacity={0.92} stroke={color} strokeWidth={2.5} />
              <text y={6} textAnchor="middle" fontFamily={FONT.ui} fontSize={25} fill={UI.text} letterSpacing={2.5}>
                {heading}
              </text>
              {subtitle ? (
                <text y={36} textAnchor="middle" fontFamily={FONT.ui} fontSize={19} fill={UI.live}>
                  {subtitle}
                </text>
              ) : null}
            </g>
          );
        })()}
      </g>
    </g>
  );
};

export const ZOO = {
  Animal,
  AnatomyZoom,
  AnatomyReticle,
  OrganInset,
  Organ,
  anchors: getAnatomyAnchors,
  drawAnimal: (props: AnimalProps) => <Animal {...props} />,
  withAnatomyZoom: (props: AnatomyZoomProps) => <AnatomyZoom {...props} />,
  drawAnatomyReticle: (props: AnatomyReticleProps) => <AnatomyReticle {...props} />,
  drawOrganInset: (props: OrganInsetProps) => <OrganInset {...props} />,
  drawOrgan: (props: OrganProps) => <Organ {...props} />,
};
