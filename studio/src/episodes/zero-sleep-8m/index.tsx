import React from 'react';
import { defineEpisode, Timeline, LookDef, TapeLines, HudChip, Dial, FONT } from '../../engine';
import timeline from './timeline.json';
import { SHOTS } from './shots';

// Power look for the 8.5-minute Zero-Sleep episode: bioluminescent cyan neural alertness grade,
// hemispheric scanlines, "DEC2 · 0 GIỜ NGỦ" HUD chip, and a waking-hour chronometer.
const awakeLook: LookDef = {
  grade: (lv) => `saturate(${1 + 0.12 * lv}) contrast(${1 + 0.14 * lv}) hue-rotate(${-8 * lv}deg)`,
  jitter: 2,
  Overlay: ({ f, p, n }) => {
    const hrs = Math.min(8760, Math.round(36 + (n * 180) + p * 120));
    return (
      <g>
        <TapeLines f={f} />
        <HudChip f={f} label="GEN DEC2 · THỨC 24/24" icon="rewind" />
        <Dial p={1 - p * 0.5} readout={`${hrs}h`} />
        <text x={1820} y={1010} textAnchor="end" fontFamily={FONT.ui} fontSize={28} fill="#4CC9F0" opacity={0.78}>
          {`ĐỒNG HỒ SINH HỌC · PHA #${n + 1}`}
        </text>
      </g>
    );
  },
};

export const zeroSleep8m = defineEpisode('ZeroSleep8m', {
  timeline: timeline as Timeline,
  shots: SHOTS,
  looks: { awake: awakeLook, rewind: awakeLook },
});
