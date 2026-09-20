import { ImageResponse } from "next/og";
import { SITE } from "@/data/site";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") ?? SITE.name;
  const boldFont = await fetch(
    new URL("../fonts/OpenRunde-Bold.otf", import.meta.url),
  ).then((response) => response.arrayBuffer());

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
            fontFamily: "Open Runde",
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
      fonts: [
        {
          data: boldFont,
          name: "Open Runde",
          style: "normal",
          weight: 700,
        },
      ],
      height: 630,
      width: 1200,
    },
  );
}
