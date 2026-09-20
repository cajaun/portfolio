import { ImageResponse } from "next/og";
import { SITE } from "@/data/site";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") ?? SITE.name;
  const description = searchParams.get("description") ?? SITE.description;

  return new ImageResponse(
    (
      <div
        style={{
          background: "#202124",
          color: "#f5f5f5",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
          padding: "64px",
          width: "100%",
        }}
      >
        <div
          style={{
            color: "#b8b8b8",
            display: "flex",
            fontSize: 28,
            fontWeight: 500,
          }}
        >
          {SITE.name}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              color: "#ffffff",
              display: "flex",
              fontSize: 64,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
              maxWidth: "1000px",
            }}
          >
            {title}
          </div>
          <div
            style={{
              color: "#b8b8b8",
              display: "flex",
              fontSize: 28,
              lineHeight: 1.25,
              maxWidth: "940px",
            }}
          >
            {description}
          </div>
        </div>

        <div
          style={{
            color: "#777777",
            display: "flex",
            fontSize: 24,
          }}
        >
          cajaun.com
        </div>
      </div>
    ),
    {
      height: 630,
      width: 1200,
    },
  );
}
