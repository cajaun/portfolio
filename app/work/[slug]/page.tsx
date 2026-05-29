import Footer from "@/components/ui/footer";
import Header from "@/components/ui/header";
import { MosaicExamplesPreview } from "@/components/blog/previews/grids";
import { ActivePostPreview } from "@/components/blog/previews/intersection-observers";
import { PortalLayerPreview } from "@/components/blog/previews/modals";
import { SITE } from "@/data/site";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ComponentType } from "react";

type PageProps = {
  params: Promise<{ slug: string }>;
};

type WorkExample = {
  slug: string;
  title: string;
  publishedAt: string;
  summary: string;
  Component: ComponentType;
};

const WORK_EXAMPLES: WorkExample[] = [
  {
    slug: "modal-portal-layer",
    title: "Modal Portal Layer",
    publishedAt: "April 15, 2026",
    summary:
      "A modal demo that shows the dialog moving out of a clipped container when it renders through a portal.",
    Component: PortalLayerPreview,
  },
  {
    slug: "active-post-observer",
    title: "Active Post Observer",
    publishedAt: "April 17, 2026",
    summary:
      "A scrollable feed that updates the active post as cards cross the observer root.",
    Component: ActivePostPreview,
  },
  {
    slug: "image-grid-mosaic",
    title: "Image Grid Mosaic",
    publishedAt: "May 29, 2026",
    summary:
      "A media grid that switches between one, two, three, and four image compositions.",
    Component: MosaicExamplesPreview,
  },
];

function getWorkExample(slug: string) {
  return WORK_EXAMPLES.find((example) => example.slug === slug);
}

export function generateStaticParams() {
  return WORK_EXAMPLES.map((example) => ({ slug: example.slug }));
}

export async function generateMetadata(
  props: PageProps,
): Promise<Metadata | undefined> {
  const { slug } = await props.params;
  const example = getWorkExample(slug);

  if (!example) {
    return;
  }

  return {
    title: example.title,
    description: example.summary,
    openGraph: {
      title: example.title,
      description: example.summary,
      url: `${SITE.url}/work/${example.slug}`,
    },
    twitter: {
      card: "summary",
      title: example.title,
      description: example.summary,
    },
  };
}

export default async function WorkExamplePage(props: PageProps) {
  const { slug } = await props.params;
  const example = getWorkExample(slug);

  if (!example) {
    notFound();
  }

  const ExamplePreview = example.Component;
  const exampleIndex = WORK_EXAMPLES.findIndex((entry) => entry.slug === slug);
  const nextExample = WORK_EXAMPLES[exampleIndex + 1] ?? null;
  const previousExample = WORK_EXAMPLES[exampleIndex - 1] ?? null;
  const hasAdjacentExamples = Boolean(previousExample || nextExample);

  return (
    <>
      <section className="mx-auto mb-14 flex w-full max-w-screen-sm flex-1 flex-col px-4 pb-8 pt-20 dark:text-white">
        <Header />
        <div
          className="mb-16 animate-slide-down-fade px-2"
          style={{ animationDelay: "180ms" }}
        >
          <div className="flex items-center justify-between">
            <h2 className="font-medium">{example.title}</h2>
          </div>

          <div className="mt-4">
            <p className="text-gray-200 font-medium leading-6 tracking-[-0.1px] dark:text-gray-100">
              {example.summary}
            </p>
          </div>
        </div>

        <div
          className="animate-slide-down-fade px-2"
          style={{ animationDelay: "270ms" }}
        >
          <ExamplePreview />
        </div>
      </section>
      {hasAdjacentExamples ? (
        <section className="mx-auto w-full max-w-screen-sm px-4">
          <div
            className="animate-slide-down-fade px-2 dark:border-preview-dark-border"
            style={{ animationDelay: "360ms" }}
          >
            <div className="relative flex min-h-[5.5rem] pb-4 md:min-h-0 md:flex-row md:justify-between md:gap-10">
              {previousExample ? (
                <div className="absolute bottom-4 left-0 w-full max-w-[10rem] min-w-0 md:static md:max-w-none md:flex-1 md:min-h-[3.5rem]">
                  <Link
                    href={`/work/${previousExample.slug}`}
                    className="group block w-full overflow-hidden rounded-xl transition-opacity duration-300 hover:opacity-70"
                  >
                    <p className="text-sm font-medium text-gray-200 dark:text-gray-100">
                      Previous
                    </p>
                    <p className="truncate text-sm font-medium text-black dark:text-white">
                      {previousExample.title}
                    </p>
                  </Link>
                </div>
              ) : null}

              {nextExample ? (
                <div className="absolute bottom-4 right-0 w-full max-w-[10rem] min-w-0 text-right md:static md:ml-auto md:max-w-none md:flex-1 md:min-h-[3.5rem]">
                  <Link
                    href={`/work/${nextExample.slug}`}
                    className="group block w-full overflow-hidden rounded-xl transition-opacity duration-300 hover:opacity-70"
                  >
                    <p className="text-sm font-medium text-gray-200 dark:text-gray-100">
                      Next
                    </p>
                    <p className="truncate text-sm font-medium text-black dark:text-white">
                      {nextExample.title}
                    </p>
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}
      <Footer />
    </>
  );
}
