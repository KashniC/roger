import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Roger: the AI team you don’t hire. AI and automation for family-owned companies, Toronto.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** The card people see when the link is shared: the workshop gauge, the promise, the price. */
export default async function Image() {
  const [semibold, regular, photo] = await Promise.all([
    readFile(join(process.cwd(), "src/assets/MonaSans-600.ttf")),
    readFile(join(process.cwd(), "src/assets/MonaSans-400.ttf")),
    readFile(join(process.cwd(), "src/assets/og/gauge-hero.jpg")),
  ]);
  const src = `data:image/jpeg;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ display: "flex", position: "relative", width: "100%", height: "100%", background: "#0f0d0c", fontFamily: "Mona Sans", color: "#f5f5f7" }}>
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img src={src} width={1200} height={800} style={{ position: "absolute", left: 0, top: -110, objectFit: "cover" }} />
        <div style={{ display: "flex", position: "absolute", left: 0, top: 0, width: 1200, height: 630, /* taste-skill-ignore: neutral scrim over a photo */ backgroundImage: "linear-gradient(90deg, rgba(12,10,9,0.96) 0%, rgba(12,10,9,0.86) 50%, rgba(12,10,9,0.1) 80%)" }} />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", padding: "60px 0 58px 72px", width: 760 }}>
          <div style={{ display: "flex", fontSize: 30, fontWeight: 600, letterSpacing: -0.5 }}>Roger</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", flexDirection: "column", fontSize: 76, fontWeight: 600, lineHeight: 1.02, letterSpacing: -3.2 }}>
              <span>The AI team</span>
              <span>you don’t hire</span>
            </div>
            <div style={{ marginTop: 26, fontSize: 26, color: "rgba(245,245,247,0.8)", fontWeight: 400 }}>For family-owned companies · Toronto</div>
          </div>
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
