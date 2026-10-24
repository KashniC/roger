import { gradients, wallpaperShapes, type SceneId, type Shape } from "@/components/phone/scenes";

function shape(s: Shape) {
  const o = s.o !== undefined ? ` opacity="${s.o}"` : "";
  if (s.kind === "rect") return `<rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}"${s.rx ? ` rx="${s.rx}"` : ""} fill="${s.fill}"${o}/>`;
  if (s.kind === "path") return `<path d="${s.d}" fill="${s.fill}"${o}/>`;
  return `<circle cx="${s.cx}" cy="${s.cy}" r="${s.r}" fill="${s.fill}"${o}/>`;
}

/** The lock-screen wallpaper as an SVG string, for generated images (the social card). */
export function wallpaperSvg(id: SceneId = "dawn") {
  const gid = "g";
  const g = gradients(id);
  const stops = (list: [number, string][]) => list.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 390 844" width="390" height="844"><defs><linearGradient id="${gid}-sky" x1="0" y1="0" x2="0" y2="1">${stops(g.sky)}</linearGradient><linearGradient id="${gid}-lake" x1="0" y1="0" x2="0" y2="1">${stops(g.lake)}</linearGradient></defs>${wallpaperShapes(id, gid).map(shape).join("")}</svg>`;
}

export function svgDataUri(svg: string) {
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}
