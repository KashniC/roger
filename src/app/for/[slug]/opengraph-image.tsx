import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { prospectBySlug } from "@/data/prospects";

export const alt = "Prepared by Roger: a plan for an AI team, without hiring one.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** The preview a prospect sees when Peter sends the link: their name, the date, the instrument on copper. */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = prospectBySlug(slug);
  const [semibold, regular, cutout] = await Promise.all([
    readFile(join(process.cwd(), "src/assets/MonaSans-600.ttf")),
    readFile(join(process.cwd(), "src/assets/MonaSans-400.ttf")),
    readFile(join(process.cwd(), "src/assets/og/gauge-cutout.png")),
  ]);
  const src = `data:image/png;base64,${cutout.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ display: "flex", position: "relative", width: "100%", height: "100%", background: "#fbfbfd", fontFamily: "Mona Sans", color: "#1d1d1f" }}>
        <div style={{ display: "flex", position: "absolute", right: -80, bottom: 0, width: 560, height: 360, borderRadius: 40, background: "#9a5226" }} />
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img src={src} width={360} height={457} style={{ position: "absolute", right: 70, bottom: 34 }} />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "58px 0 58px 72px", width: 720 }}>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 24, color: "#5d5d63" }}>
            <span style={{ fontWeight: 600, color: "#1d1d1f" }}>Prepared for {p?.company ?? "you"}</span>
            {p && <span>{p.meeting.label}</span>}
          </div>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 72, fontWeight: 600, lineHeight: 1.02, letterSpacing: -3 }}>
            <span>An AI team,</span>
            <span>without hiring one.</span>
          </div>
          <div style={{ display: "flex", fontSize: 26, fontWeight: 600 }}>Roger</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Mona Sans", data: semibold, style: "normal", weight: 600 },
        { name: "Mona Sans", data: regular, style: "normal", weight: 400 },
      ],
    },
  );
}
