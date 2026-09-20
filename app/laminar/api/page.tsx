import type { Metadata } from "next";
import LaminarDocsArticle from "@/components/laminar/docs-article";
import ApiDocs from "@/components/laminar/docs/api.mdx";

export const metadata: Metadata = {
  title: "Laminar API",
  description: "Props, exports, and API reference for Laminar.",
};

export default function LaminarApiPage() {
  return (
    <LaminarDocsArticle>
      <ApiDocs />
    </LaminarDocsArticle>
  );
}
