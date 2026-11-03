import { loadFont } from '@remotion/fonts';
import { staticFile } from 'remotion';
import { loadFont as loadBricolage } from '@remotion/google-fonts/BricolageGrotesque';
import { loadFont as loadMono } from '@remotion/google-fonts/FragmentMono';
import { loadFont as loadJetBrainsMono } from '@remotion/google-fonts/JetBrainsMono';
import { loadFont as loadHand } from '@remotion/google-fonts/Kalam';
import { STUDIO } from '../studio.config';

// Three faces: a heavy display face for the title card, a mono for on-screen readouts (timers, labels, chips),
// and a handwriting face for chalk and notes. Full Vietnamese + Latin-Ext subsets are loaded so diacritics
// never fall back to a mismatched system font.

loadBricolage('normal', { weights: ['600', '700', '800'], subsets: ['latin', 'latin-ext', 'vietnamese'] });
loadMono('normal', { weights: ['400'], subsets: ['latin', 'latin-ext'] });
loadJetBrainsMono('normal', { weights: ['500', '700'], subsets: ['latin', 'latin-ext', 'vietnamese'] });
loadHand('normal', { weights: ['400', '700'], subsets: ['latin', 'latin-ext'] });
if (STUDIO.titleFont) loadFont({ family: STUDIO.titleFont.family, url: staticFile(STUDIO.titleFont.file), weight: STUDIO.titleFont.weight });

export const FONT = {
  title: STUDIO.titleFont ? STUDIO.titleFont.family : 'Bricolage Grotesque',
  ui: "'Fragment Mono', 'JetBrains Mono', monospace",
  hand: 'Kalam',
};
