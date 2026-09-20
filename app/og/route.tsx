import { ImageResponse } from "next/og";
import { SITE } from "@/data/site";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") ?? SITE.name;

  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "flex-end",
          background: "#ffffff",
          color: "#222222",
          display: "flex",
          height: "100%",
          padding: "0 96px 72px",
          width: "100%",
        }}
      >
        <div
          style={{
            color: "#222222",
            display: "flex",
            fontSize: 78,
            fontWeight: 700,
            letterSpacing: "-0.045em",
            lineHeight: 1,
            maxWidth: "1050px",
          }}
        >
          {title}
        </div>
      </div>
    ),
    {
      height: 630,
      width: 1200,
    },
  );
}
