import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import Link from "next/link";
import { Fragment } from "react";
import WorkSection from "@/components/work-section";
import { getBlogPosts } from "@/data/blog";

export default async function Home() {
const posts = (await getBlogPosts()).map((post) => ({
  slug: post.slug,
  title: post.metadata.title,
  publishedAt: post.metadata.publishedAt,
}));

  const sections = [
    {
      id: "about-me",
      title: "About me",
      content: (
        <div>
          <p className="mb-2 text-gray-200 font-medium leading-6 tracking-[-0.1px] dark:text-gray-100">
            I am a Software Engineer focused on going from zero-to-one with
            startups, aligning with my passion for innovation and crafting
            impactful solutions.
          </p>
        </div>
      ),
    },
    {
      id: "now",
      title: "Now",
      content: (
        <div>
          <p className="mb-2 text-gray-200 font-medium leading-6 tracking-[-0.1px] dark:text-gray-100">
            I&apos;m interested in building consumer apps driven by ideas I find
            fun, curious, or personally meaningful.
          </p>

          <p className="mb-2 text-gray-200 font-medium leading-6 tracking-[-0.1px] dark:text-gray-100">
            Right now I&apos;m working on Varse, an app that captures short clips
            from any video and matches them to the exact film and scene in
            seconds.
          </p>

          <p className="mb-2 text-gray-200 font-medium leading-6 tracking-[-0.1px] dark:text-gray-100">
            I also spend some time doing design engineering, focusing on
            interaction, motion and the small details that make apps feel smooth
            and enjoyable to use.
          </p>
        </div>
      ),
    },
    {
      id: "work",
      title: "Work",
      content: <WorkSection posts={posts} />,
    },
    {
      id: "connect",
      title: "Connect",
      content: (
        <div>
          <p className="paragraph text-gray-200 font-medium mb-2 dark:text-gray-100">
            Follow me on{" "}
            <a
              href="https://x.com/cajauncampbell"
              target="_blank"
              rel="noopener noreferrer"
              className="underline dark:hover:text-white hover:text-[#2A2A2A]"
            >
              X
            </a>
            , view my code and open-source projects on{" "}
            <a
              href="https://github.com/cajaun"
              target="_blank"
              rel="noopener noreferrer"
              className="underline dark:hover:text-white hover:text-[#2A2A2A]"
            >
              Github
            </a>
            , or email me directly at{" "}
            <a
              href="mailto:cajaun@yahoo.com"
              className="underline dark:hover:text-white hover:text-[#2A2A2A]"
            >
              cajaun@yahoo.com
            </a>
            .
          </p>
        </div>
      ),
    },
  ];

  return (
    <>
      <main className="mx-auto mb-14 flex w-full max-w-screen-sm flex-1 flex-col px-4 pb-8 pt-20">
        <Header />

        <div className="text-balance">
          {sections.map((item, index) => (
            <Fragment key={item.id}>
              <div className={index !== sections.length - 1 ? "mb-16" : ""}>
                <h2
                  id={item.id}
                  className="font-medium animate-slide-down-fade px-2"
                  style={{ animationDelay: `${90 * (index + 1)}ms` }}
                >
                  {item.title}
                </h2>

                <div
                  className="my-4 animate-slide-down-fade px-2"
                  style={{ animationDelay: `${90 * (index + 1)}ms` }}
                >
                  {item.content}
                </div>
              </div>
            </Fragment>
          ))}
        </div>
      </main>

      {/* <div className="bottom-scroll-mask pointer-events-none" aria-hidden="true" />
      <div className="top-scroll-mask pointer-events-none" aria-hidden="true" /> */}

      <Footer />
    </>
  );
}