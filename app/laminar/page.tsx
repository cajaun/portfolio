import type { Metadata } from "next";
import LaminarDocsArticle from "@/components/laminar/docs-article";
import GettingStartedDocs from "@/components/laminar/docs/getting-started.mdx";

export const metadata: Metadata = {
  title: "Laminar",
  description:
    "A morphing text component for animated strings, numbers, and layout-aware text transitions.",
  alternates: {
    canonical: "https://laminar.cajaun.com",
  },
  openGraph: {
    title: "Laminar",
    description:
      "A morphing text component for animated strings, numbers, and layout-aware text transitions.",
    url: "https://laminar.cajaun.com",
  },
};

export default function LaminarPage() {
  return (
    <LaminarDocsArticle>
      <GettingStartedDocs />
    </LaminarDocsArticle>
  );
}
