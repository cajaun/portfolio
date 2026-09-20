import type { Metadata } from "next";
import LaminarDocsArticle from "@/components/laminar/docs-article";
import ExamplesDocs from "@/components/laminar/docs/examples.mdx";

export const metadata: Metadata = {
  title: "Laminar Examples",
  description: "Code examples for common Laminar use cases.",
};

export default function LaminarExamplesPage() {
  return (
    <LaminarDocsArticle>
      <ExamplesDocs />
    </LaminarDocsArticle>
  );
}
