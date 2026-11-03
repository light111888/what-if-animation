// Step 4: the storyboard stills. Renders one still per shot at its key frame from the <Id>Board composition,
// bundling once. Can run from the studio folder or workspace root:
//   node <skill>/scripts/stills.mjs <slug> [S1 S4 ...] [--scale 0.5] [--studio <dir>]
// Writes out/<slug>/board/<shot>.png. With shot ids, renders only those (after a fix).
// Also: node <skill>/scripts/stills.mjs <slug> --frames 120 300   renders frames of the main composition
// (out/<slug>/frames/f0120.png), for checking a moment inside a shot.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const skillDir = path.resolve(scriptDir, '..');
const args = process.argv.slice(2);

function resolveStudioDir() {
  const studioFlagIdx = args.indexOf('--studio');
  if (studioFlagIdx >= 0 && args[studioFlagIdx + 1]) {
    return path.resolve(args[studioFlagIdx + 1]);
  }
  if (process.env.WHAT_IF_STUDIO) {
    return path.resolve(process.env.WHAT_IF_STUDIO);
  }
  const cwd = process.cwd();
  for (const cand of [
    cwd,
    path.join(cwd, 'artifacts', 'what-if-studio'),
    path.join(cwd, 'what-if-studio'),
    path.join(skillDir, 'studio'),
  ]) {
    if (fs.existsSync(path.join(cand, 'src', 'episodes')) && fs.existsSync(path.join(cand, 'package.json'))) {
      return cand;
    }
  }
  throw new Error('Could not locate what-if-studio directory (run from studio folder or workspace with artifacts/what-if-studio).');
}

const STUDIO = resolveStudioDir();
const require = createRequire(path.join(STUDIO, 'package.json'));
const { bundle } = require('@remotion/bundler');
const { renderStill, selectComposition } = require('@remotion/renderer');

const slug = args[0];
const scaleAt = args.indexOf('--scale');
const scale = scaleAt >= 0 ? Number(args[scaleAt + 1]) : 0.5;
const framesAt = args.indexOf('--frames');
const rest = args.slice(1).filter((a, i, all) => !a.startsWith('--') && all[i - 1] !== '--scale' && all[i - 1] !== '--studio');
const ep = JSON.parse(fs.readFileSync(path.join(STUDIO, 'src/episodes', slug, 'episode.json'), 'utf8'));
const tl = JSON.parse(fs.readFileSync(path.join(STUDIO, 'src/episodes', slug, 'timeline.json'), 'utf8'));

const serveUrl = await bundle({ entryPoint: path.join(STUDIO, 'src/index.ts'), publicDir: path.join(STUDIO, 'public') });
if (framesAt >= 0) {
  const outDir = path.join(STUDIO, 'out', slug, 'frames');
  fs.mkdirSync(outDir, { recursive: true });
  const composition = await selectComposition({ serveUrl, id: ep.id });
  for (const fr of rest.map(Number)) {
    const output = path.join(outDir, `f${String(fr).padStart(4, '0')}.png`);
    await renderStill({ serveUrl, composition, frame: fr, output, overwrite: true, scale });
    process.stdout.write(`${fr} `);
  }
} else {
  const outDir = path.join(STUDIO, 'out', slug, 'board');
  fs.mkdirSync(outDir, { recursive: true });
  const composition = await selectComposition({ serveUrl, id: `${ep.id}Board` });
  const want = rest.length ? rest : tl.shots.map((s) => s.id);
  for (const id of want) {
    const i = tl.shots.findIndex((s) => s.id === id);
    if (i < 0) throw new Error(`No shot ${id} in the timeline`);
    await renderStill({ serveUrl, composition, frame: i, output: path.join(outDir, `${id}.png`), overwrite: true, scale });
    process.stdout.write(`${id} `);
  }
}
console.log('\ndone');
