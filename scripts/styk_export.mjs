// Step 6b (StykAnimate Integration): Exports a What If episode (<slug>) into a 100% native,
// round-trip-validated .styk project file that opens directly in StykAnimate Editor & Backlot.
// Usage:
//   node <skill>/scripts/styk_export.mjs <slug> [--out <path.styk>] [--studio <dir>]
import fs from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const skillDir = path.resolve(scriptDir, '..');
const args = process.argv.slice(2);

function parseOpt(flag, fallback = null) {
  const idx = args.indexOf(flag);
  return idx >= 0 && args[idx + 1] ? args[idx + 1] : fallback;
}

function resolveStudioDir() {
  const flag = parseOpt('--studio');
  if (flag) return path.resolve(flag);
  if (process.env.WHAT_IF_STUDIO) return path.resolve(process.env.WHAT_IF_STUDIO);
  const cwd = process.cwd();
  for (const cand of [
    cwd,
    path.join(cwd, 'artifacts', 'what-if-studio'),
    path.join(cwd, 'what-if-studio'),
    path.join(skillDir, 'studio'),
  ]) {
    if (fs.existsSync(path.join(cand, 'src', 'episodes'))) return cand;
  }
  throw new Error('Could not locate what-if-studio directory.');
}

function resolveStykAppRoot() {
  const cwd = process.cwd();
  for (const cand of [cwd, path.resolve(skillDir, '..', '..', '..'), path.resolve(STUDIO, '..', '..')]) {
    if (fs.existsSync(path.join(cand, 'src', 'editor.mjs')) && fs.existsSync(path.join(cand, 'src', 'native-container.mjs'))) {
      return cand;
    }
  }
  throw new Error('Could not locate StykAnimate repository root (with src/editor.mjs).');
}

const STUDIO = resolveStudioDir();
const APP_ROOT = resolveStykAppRoot();
const slug = args[0];
if (!slug) throw new Error('Usage: node styk_export.mjs <slug> [--out <path.styk>]');

const { createFrame, createObject, defaultFigure, emptyDocument } = await import(
  pathToFileURL(path.join(APP_ROOT, 'src', 'demo.mjs')).href
);
const { Editor } = await import(pathToFileURL(path.join(APP_ROOT, 'src', 'editor.mjs')).href);
const { buildContainerV2, decodeDocument } = await import(
  pathToFileURL(path.join(APP_ROOT, 'src', 'native-container.mjs')).href
);
const { validateScene } = await import(pathToFileURL(path.join(APP_ROOT, 'src', 'pivot', 'model.mjs')).href);
const { validateAnimationDocument } = await import(
  pathToFileURL(path.join(APP_ROOT, 'src', 'animation-channels.mjs')).href
);
const { validateMovieclipGraph } = await import(
  pathToFileURL(path.join(APP_ROOT, 'src', 'movieclips.mjs')).href
);

function recolorFigure(figure, rgb, name) {
  const copy = structuredClone(figure);
  if (name) copy.name = name;
  for (const seg of copy.segments ?? []) {
    seg.color_rgb = [...rgb];
  }
  return copy;
}

function shotScaleForSize(sizeStr = '') {
  const s = String(sizeStr).toLowerCase();
  if (s.includes('extreme close') || s.includes('macro') || s.includes('insert')) return 1.55;
  if (s.includes('close')) return 1.38;
  if (s.includes('medium')) return 1.18;
  return 1.0;
}

const ep = JSON.parse(await readFile(path.join(STUDIO, 'src', 'episodes', slug, 'episode.json'), 'utf8'));
const tl = JSON.parse(await readFile(path.join(STUDIO, 'src', 'episodes', slug, 'timeline.json'), 'utf8'));
const rawShots = Array.isArray(ep.shots)
  ? ep.shots
  : Object.entries(ep.shots || {}).map(([id, s]) => ({ id, ...(typeof s === 'object' ? s : {}) }));
const shotsById = Object.fromEntries(rawShots.map((s) => [s.id, s]));

const width = 960;
const height = 540;
const fps = tl.fps || 30;
const totalFrames = Math.max(12, tl.total || 90);
const step = Math.max(1, Math.ceil(totalFrames / 900));
const keyframeCount = Math.ceil(totalFrames / step);

const doc = emptyDocument();
doc._styk.name = Array.isArray(ep.title) ? ep.title.join(' ') : ep.topic || slug;
doc.fps = fps;
doc.canvas_width = width;
doc.canvas_height = height;
doc.background_color_rgb = [14, 12, 30];
doc.background_color_raw = ((0xff << 24) | (14 << 16) | (12 << 8) | 30) >>> 0;

const pipFig = recolorFigure(defaultFigure(1), [242, 179, 61], 'Pip');
const moFig = recolorFigure(defaultFigure(2), [127, 212, 255], 'Mo');
doc.figure_types = [pipFig, moFig];

const segments = tl.segments || [{ shot: 'S1', a: 0, b: totalFrames, t0: 0, t1: totalFrames }];
doc.keyframes = Array.from({ length: keyframeCount }, (_, k) => {
  const f = k * step;
  const dur = Math.min(step, totalFrames - f);
  const seg = segments.find((s) => f >= s.a && f < s.b) || segments[segments.length - 1];
  const span = Math.max(1, seg.b - seg.a);
  const u = (f - seg.a) / span;
  const clockT = seg.t0 + (seg.t1 - seg.t0) * u;
  const phase = clockT * 0.22;
  const shotMeta = shotsById[seg.shot] || {};
  const zoom = shotScaleForSize(shotMeta.size);

  const pipX = width * 0.44 + Math.sin(phase * 0.7) * 28;
  const pipY = height * 0.58 - Math.abs(Math.sin(phase)) * 8;
  const pipObj = createObject(pipFig, 1, pipX, pipY);
  pipObj.angles = pipObj.angles.map((ang, idx) => ang + Math.sin(phase + idx * 0.55) * 0.36);

  const moX = width * 0.6 + Math.cos(phase * 0.65) * 24;
  const moY = height * 0.58 - Math.abs(Math.cos(phase)) * 7;
  const moObj = createObject(moFig, 2, moX, moY);
  moObj.angles = moObj.angles.map((ang, idx) => ang - Math.cos(phase + idx * 0.5) * 0.32);

  const frame = createFrame([pipObj, moObj]);
  frame.duration_raw = dur;
  if (zoom > 1.01) {
    frame.camera = {
      is_default: false,
      x: (pipX - width * 0.5) * 0.25,
      y: (pipY - height * 0.5) * 0.2,
      scale: zoom,
      angle_rad: 0,
    };
  }
  return frame;
});

const editor = new Editor({ demo: false, layerTimeline: true }).load(doc);
const saved = editor.serialize();
validateScene(saved);
validateAnimationDocument(saved);
validateMovieclipGraph(saved);

const outPath = path.resolve(parseOpt('--out', path.join(STUDIO, 'out', slug, `${slug}.styk`)));
await mkdir(path.dirname(outPath), { recursive: true });
const bytes = await buildContainerV2(saved, 'styk');
await writeFile(outPath, bytes);

const reopened = (await decodeDocument(new Uint8Array(await readFile(outPath)), 'styk')).document;
const verifyEditor = new Editor({ demo: false, layerTimeline: true }).load(reopened);

console.log(
  JSON.stringify(
    {
      episode: ep.id,
      slug,
      styk_path: outPath,
      fps: saved.fps,
      frame_count: verifyEditor.totalTicks,
      segments: segments.length,
      bytes: bytes.byteLength,
    },
    null,
    2,
  ),
);
