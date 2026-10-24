/**
 * The Toronto skyline seen from the Island ferry dock, painted flat in five
 * lights. One geometry, many renderings: the lock screen (390×844), the
 * business band (1200×620) and the social card all come from here, so the
 * brand has one picture of the city.
 *
 * West to east: the CityPlace condos, Rogers Centre, the CN Tower, then the
 * Financial District (Scotia Plaza's notched crown, First Canadian Place,
 * Commerce Court, the black TD towers, Bay Adelaide), Harbourfront in front,
 * the harbour, and the Island's tree line at the bottom.
 */
export type SceneId = "dawn" | "morning" | "noon" | "afternoon" | "night";

export type Scene = {
  skyTop: string;
  skyBottom: string;
  sun: { cx: number; cy: number; r: number; fill: string; opacity: number };
  cloud: string;
  cloudOpacity: number;
  haze: string;
  far: string;
  city: string;
  td: string;
  near: string;
  lakeTop: string;
  lakeBottom: string;
  glint: string;
  trees: string;
  /** 0 = no lit windows, up to 1 = night. */
  lit: number;
  towerLights: boolean;
  /** Notification glass that reads on this wallpaper. */
  glass: "light" | "dark";
  clock: string;
};

export const scenes: Record<SceneId, Scene> = {
  dawn: {
    skyTop: "#b48e9c",
    skyBottom: "#f3c6a2",
    sun: { cx: 300, cy: 476, r: 42, fill: "#fde2bb", opacity: 0.95 },
    cloud: "#f6d6c0",
    cloudOpacity: 0.55,
    haze: "#f5cfae",
    far: "#b58070",
    city: "#6c4236",
    td: "#4f2e27",
    near: "#5a362d",
    lakeTop: "#8c8399",
    lakeBottom: "#4f5672",
    glint: "#f9d4ab",
    trees: "#2f2a2e",
    lit: 0,
    towerLights: false,
    glass: "light",
    clock: "#ffffff",
  },
  morning: {
    skyTop: "#94b7d8",
    skyBottom: "#f1dcc6",
    sun: { cx: 330, cy: 300, r: 30, fill: "#fff4de", opacity: 0.9 },
    cloud: "#ffffff",
    cloudOpacity: 0.55,
    haze: "#efe1d0",
    far: "#9a9db2",
    city: "#545769",
    td: "#36384a",
    near: "#474a5b",
    lakeTop: "#7d9ab5",
    lakeBottom: "#4a6888",
    glint: "#fff1dc",
    trees: "#2c3330",
    lit: 0,
    towerLights: false,
    glass: "light",
    clock: "#ffffff",
  },
  noon: {
    skyTop: "#5a94cd",
    skyBottom: "#c2dcf1",
    sun: { cx: 62, cy: 258, r: 26, fill: "#ffffff", opacity: 0.85 },
    cloud: "#ffffff",
    cloudOpacity: 0.7,
    haze: "#dbe9f5",
    far: "#86a0b9",
    city: "#3a495b",
    td: "#222d3a",
    near: "#33414f",
    lakeTop: "#4d86b8",
    lakeBottom: "#2a5a88",
    glint: "#eaf4fc",
    trees: "#23352c",
    lit: 0,
    towerLights: false,
    glass: "light",
    clock: "#ffffff",
  },
  afternoon: {
    skyTop: "#cf8a62",
    skyBottom: "#f6d49f",
    sun: { cx: 54, cy: 444, r: 46, fill: "#ffe6b3", opacity: 0.95 },
    cloud: "#f9c99a",
    cloudOpacity: 0.6,
    haze: "#f8dbab",
    far: "#b0744f",
    city: "#57382d",
    td: "#3c241e",
    near: "#4a2f27",
    lakeTop: "#a07c70",
    lakeBottom: "#4f4c62",
    glint: "#ffd9a0",
    trees: "#2c2626",
    lit: 0.35,
    towerLights: false,
    glass: "light",
    clock: "#ffffff",
  },
  night: {
    skyTop: "#0c0f27",
    skyBottom: "#2b2b52",
    sun: { cx: 336, cy: 262, r: 14, fill: "#f4efe2", opacity: 0.9 },
    cloud: "#3a3a66",
    cloudOpacity: 0.5,
    haze: "#38355f",
    far: "#1d1e3a",
    city: "#0c0d1b",
    td: "#07080f",
    near: "#090a14",
    lakeTop: "#161a36",
    lakeBottom: "#06081a",
    glint: "#e8a97f",
    trees: "#05060c",
    lit: 1,
    towerLights: true,
    glass: "dark",
    clock: "#f5f5f7",
  },
};

// ---------------------------------------------------------------------------
// Geometry, in the phone's 390×844 frame. The skyline stands on y = 520.

export const GROUND = 520;

type R = [x: number, w: number, top: number];

/** Haze layer behind everything. */
const FAR: R[] = [
  [0, 42, 438],
  [150, 40, 414],
  [196, 30, 396],
  [240, 36, 404],
  [300, 34, 414],
  [340, 50, 428],
];

/** CityPlace condos west of the dome, drawn behind it. */
const WEST: R[] = [
  [2, 14, 432],
  [18, 12, 452],
  [32, 16, 444],
];

/** Plain towers of the Financial District (lit windows are drawn on these). */
const TOWERS: R[] = [
  [146, 16, 446],
  [163, 20, 412],
  [215, 25, 312], // First Canadian Place
  [322, 21, 350], // Bay Adelaide
  [345, 16, 398],
  [363, 27, 420],
];

/** The TD Centre's black towers. */
const TD: R[] = [
  [264, 19, 374],
  [285, 15, 398],
  [302, 17, 386],
];

/** Harbourfront low-rise in front of it all. */
const NEAR: R[] = [
  [0, 64, 504],
  [140, 46, 500],
  [192, 72, 494],
  [268, 44, 504],
  [316, 74, 498],
];

const SHAPED = [
  // Scotia Plaza's notched crown
  "M186 520 V362 L192.5 354 L199 361 L205.5 354 L212 362 V520 Z",
  // Commerce Court West's stepped top
  "M243 520 V366 H246 V360 H258 V366 H261 V520 Z",
  // Rogers Centre
  "M36 520 V507 Q40 485 72 480 Q104 485 108 507 V520 Z",
];

export const CN = {
  shaft: "M119 520 L123.6 302 L132.4 302 L137 520 Z",
  pod: "M112.5 303 L143.5 303 L141.5 295.5 Q128 287 114.5 295.5 Z",
  ring: "M117 291 L139 291 L137.5 285 Q128 281 118.5 285 Z",
  upper: "M125.2 286 L125.8 232 L130.2 232 L130.8 286 Z",
  skypod: "M122.5 233 L133.5 233 L132.5 225 L123.5 225 Z",
  antenna: "M126.7 226 L127.6 150 L128.4 150 L129.3 226 Z",
};

/** A shape any renderer can draw: React for the page, a string for generated images. */
export type Shape =
  | { kind: "rect"; x: number; y: number; w: number; h: number; fill: string; o?: number; rx?: number }
  | { kind: "path"; d: string; fill: string; o?: number }
  | { kind: "circle"; cx: number; cy: number; r: number; fill: string; o?: number };

function rects(list: R[], fill: string, dx = 0, ground = GROUND): Shape[] {
  return list.map(([x, w, top]) => ({ kind: "rect", x: x + dx, y: top, w, h: ground - top, fill }));
}

function hash(a: number, b: number) {
  return Math.abs((a * 73856093) ^ (b * 19349663));
}

function windows(list: R[], dx: number, amount: number, fill: string): Shape[] {
  if (!amount) return [];
  const out: Shape[] = [];
  for (const [x, w, top] of list) {
    for (let y = top + 7; y < GROUND - 22; y += 8) {
      for (let cx = x + 3; cx < x + w - 3; cx += 5) {
        if (hash(cx, y) % 9 < amount * 3) out.push({ kind: "rect", x: cx + dx, y, w: 1.8, h: 2.6, fill, o: 0.85 });
      }
    }
  }
  return out;
}

function treeLine(width: number, y: number, fill: string, height: number): Shape {
  let d = `M0 ${y + 14}`;
  for (let x = 0, i = 3; x <= width; i++) {
    const step = 14 + (hash(i, 7) % 14);
    const peak = y + (hash(i, 11) % 12);
    d += ` Q${x + step / 2} ${peak - 6} ${x + step} ${y + 10 + (hash(i, 5) % 6)}`;
    x += step;
  }
  d += ` V${height} H0 Z`;
  return { kind: "path", d, fill };
}

/** The skyline cluster (west condos to the east towers), offset by dx. */
function cluster(s: Scene, dx: number): Shape[] {
  const out: Shape[] = [];
  out.push(...rects(WEST, s.city, dx));
  out.push(...rects(TOWERS, s.city, dx));
  for (const d of SHAPED) out.push({ kind: "path", d: shift(d, dx), fill: s.city });
  out.push(...rects(TD, s.td, dx));
  for (const d of Object.values(CN)) out.push({ kind: "path", d: shift(d, dx), fill: s.city });
  out.push(...windows([...TOWERS, ...TD, [186, 26, 362], [243, 18, 366]], dx, s.lit, "#f3c48f"));
  if (s.towerLights) {
    out.push({ kind: "rect", x: 114 + dx, y: 298, w: 28, h: 2, fill: "#e8a97f" });
    out.push({ kind: "rect", x: 123.5 + dx, y: 228.5, w: 9, h: 1.6, fill: "#e8a97f" });
    out.push({ kind: "circle", cx: 128 + dx, cy: 151, r: 1.6, fill: "#ff8a6a" });
  }
  return out;
}

/** Shift every x in a path made of absolute M/L/H/V/Q commands. */
function shift(d: string, dx: number) {
  if (!dx) return d;
  return d.replace(/([MLQHV])([^MLQHVZ]*)/g, (_, cmd: string, args: string) => {
    const nums = args.trim().split(/[\s,]+/).filter(Boolean).map(Number);
    if (cmd === "V") return `V${nums[0]} `;
    if (cmd === "H") return `H${nums[0] + dx} `;
    return cmd + nums.map((n, i) => (i % 2 === 0 ? n + dx : n)).join(" ") + " ";
  });
}

function lakeAndShore(s: Scene, width: number, height: number, cnX: number, lakeEnd: number, gradId: string): Shape[] {
  const out: Shape[] = [{ kind: "rect", x: 0, y: GROUND, w: width, h: height - GROUND, fill: `url(#${gradId}-lake)` }];
  // the tower's reflection, broken by the water
  out.push({ kind: "path", d: `M${cnX - 7} ${GROUND + 2} L${cnX + 7} ${GROUND + 2} L${cnX + 3} ${GROUND + 120} L${cnX - 3} ${GROUND + 120} Z`, fill: s.city, o: 0.22 });
  // the sun's column on the water, fading with distance
  const sx = s.sun.cx;
  [
    [GROUND + 8, 70, 0.4],
    [GROUND + 20, 48, 0.32],
    [GROUND + 34, 30, 0.26],
    [GROUND + 50, 18, 0.2],
  ].forEach(([y, w, o]) => out.push({ kind: "rect", x: sx - w / 2, y, w, h: 1.6, fill: s.glint, o, rx: 0.8 }));
  out.push(treeLine(width, lakeEnd, s.trees, height));
  return out;
}

/** A lens-shaped streak of cloud: pointed ends, fuller just left of centre. */
function streak(x: number, y: number, w: number, t: number) {
  return `M${x} ${y} Q${x + w * 0.4} ${y - t * 1.6} ${x + w} ${y} Q${x + w * 0.55} ${y + t * 0.7} ${x} ${y} Z`;
}

function sky(s: Scene, width: number, gradId: string): Shape[] {
  const out: Shape[] = [{ kind: "rect", x: 0, y: 0, w: width, h: GROUND + 2, fill: `url(#${gradId}-sky)` }];
  if (s.towerLights) {
    for (const [x, y] of [
      [40, 70],
      [120, 46],
      [190, 96],
      [330, 60],
      [300, 180],
      [24, 220],
      [160, 250],
      [356, 330],
    ])
      for (let k = 0; k * 390 < width; k++) out.push({ kind: "circle", cx: x + k * 390, cy: y, r: 1, fill: "#f5f5f7", o: 0.7 });
  }
  out.push({ kind: "circle", cx: s.sun.cx, cy: s.sun.cy, r: s.sun.r, fill: s.sun.fill, o: s.sun.opacity });
  // stratus streaks: thin, tapered at both ends, never the same twice
  for (let i = 0, x = -40; x < width; i++) {
    const w = 90 + (hash(i, 17) % 120);
    const y = 168 + (hash(i, 23) % 110);
    const t = 3 + (hash(i, 29) % 5);
    out.push({ kind: "path", d: streak(x, y, w, t), fill: s.cloud, o: s.cloudOpacity * (0.45 + (hash(i, 31) % 40) / 100) });
    x += w * 0.7 + (hash(i, 37) % 90);
  }
  return out;
}

export function wallpaperShapes(id: SceneId, gradId: string): Shape[] {
  const s = scenes[id];
  return [
    ...sky(s, 390, gradId),
    ...rects(FAR, s.far),
    { kind: "rect", x: 0, y: 440, w: 390, h: 82, fill: s.haze, o: 0.3 },
    ...cluster(s, 0),
    ...rects(NEAR, s.near),
    ...lakeAndShore(s, 390, 844, 128, 690, gradId),
  ];
}

/** Just the tower's top, drawn again above the clock: the iOS depth effect. */
export function towerTopShapes(id: SceneId): Shape[] {
  const s = scenes[id];
  const out: Shape[] = [
    { kind: "path", d: CN.skypod, fill: s.city },
    { kind: "path", d: CN.antenna, fill: s.city },
    { kind: "path", d: "M125.6 233 L125.9 214 L130.1 214 L130.4 233 Z", fill: s.city },
  ];
  if (s.towerLights) out.push({ kind: "circle", cx: 128, cy: 151, r: 1.6, fill: "#ff8a6a" });
  return out;
}

/** The same city as a 1200×620 landscape for the business page. */
export function panoramaShapes(id: SceneId, gradId: string): Shape[] {
  const s = scenes[id];
  const dx = 390;
  const side = (from: number, to: number, seed: number, min: number, max: number): R[] => {
    const out: R[] = [];
    for (let x = from, i = seed; x < to; i++) {
      const w = 14 + (hash(i, seed) % 20);
      out.push([x, w, min + (hash(i, seed + 1) % (max - min))]);
      x += w + 1 + (hash(i, 3) % 4);
    }
    return out;
  };
  const sun = { ...s, sun: { ...s.sun, cx: s.sun.cx + dx } };
  return [
    ...sky(sun, 1200, gradId),
    ...rects(side(0, 1200, 29, 404, 446), s.far),
    { kind: "rect", x: 0, y: 440, w: 1200, h: 82, fill: s.haze, o: 0.3 },
    ...rects(side(0, 380, 7, 440, 488), s.city),
    ...rects(side(800, 1200, 13, 420, 470), s.city),
    ...cluster(s, dx),
    ...rects(side(0, 1200, 41, 494, 508), s.near),
    ...lakeAndShore(sun, 1200, 620, 128 + dx, 588, gradId),
  ];
}

export function gradients(id: SceneId) {
  const s = scenes[id];
  return {
    sky: [
      [0, s.skyTop],
      [0.62, s.skyBottom],
    ] as [number, string][],
    lake: [
      [0, s.lakeTop],
      [1, s.lakeBottom],
    ] as [number, string][],
  };
}
