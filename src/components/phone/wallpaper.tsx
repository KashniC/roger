import { gradients, panoramaShapes, towerTopShapes, wallpaperShapes, type SceneId, type Shape } from "./scenes";

type SvgProps = {
  shapes: Shape[];
  w: number;
  h: number;
  gid: string;
  grads?: ReturnType<typeof gradients>;
  className?: string;
  preserve?: string;
};

function ShapesSvg({ shapes, w, h, gid, grads, className = "", preserve = "xMidYMid slice" }: SvgProps) {
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio={preserve} className={className} aria-hidden="true" focusable="false">
      {grads && (
        <defs>
          {(["sky", "lake"] as const).map((k) => (
            <linearGradient key={k} id={`${gid}-${k}`} x1="0" y1="0" x2="0" y2="1">
              {grads[k].map(([o, c]) => (
                <stop key={o} offset={o} stopColor={c} />
              ))}
            </linearGradient>
          ))}
        </defs>
      )}
      {shapes.map((s, i) =>
        s.kind === "rect" ? (
          <rect key={i} x={s.x} y={s.y} width={s.w} height={s.h} rx={s.rx} fill={s.fill} opacity={s.o} />
        ) : s.kind === "path" ? (
          <path key={i} d={s.d} fill={s.fill} opacity={s.o} />
        ) : (
          <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill={s.fill} opacity={s.o} />
        ),
      )}
    </svg>
  );
}

/** The lock-screen wallpaper. `uid` keeps gradient ids unique when a page shows several phones. */
export function Wallpaper({ id, uid, className = "", preserve }: { id: SceneId; uid: string; className?: string; preserve?: string }) {
  const gid = `wp-${uid}-${id}`;
  return <ShapesSvg shapes={wallpaperShapes(id, gid)} w={390} h={844} gid={gid} grads={gradients(id)} className={className} preserve={preserve} />;
}

/** Just the tower's top, drawn again above the clock: the iOS depth effect. */
export function TowerTop({ id, className = "", preserve }: { id: SceneId; className?: string; preserve?: string }) {
  return <ShapesSvg shapes={towerTopShapes(id)} w={390} h={844} gid="tt" className={className} preserve={preserve} />;
}

/** The same skyline as a landscape: the band behind the business page's window. */
export function Panorama({ id = "dawn", className = "" }: { id?: SceneId; className?: string }) {
  const gid = `pano-${id}`;
  return <ShapesSvg shapes={panoramaShapes(id, gid)} w={1200} h={620} gid={gid} grads={gradients(id)} className={className} preserve="xMidYMax slice" />;
}
