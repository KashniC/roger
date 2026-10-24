import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const TOQUE =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" stroke="#fff" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19.5C5.9 19 4 16.6 4 13.8 4 10.6 6.6 8 9.8 8c.5 0 1 .1 1.5.2C12.3 5.7 14 4 16 4s3.7 1.7 4.7 4.2c.5-.1 1-.2 1.5-.2C25.4 8 28 10.6 28 13.8c0 2.8-1.9 5.2-5 5.7"/><path d="M9 19.5V27h14v-7.5"/><path d="M9 23.5h14"/><path d="M12.5 15.5v4M16 14.5v5M19.5 15.5v4"/></svg>';

export default function AppleIcon() {
  const src = `data:image/svg+xml;base64,${Buffer.from(TOQUE).toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center", background: "#9A5226" }}>
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img src={src} width={124} height={124} />
      </div>
    ),
    size,
  );
}
