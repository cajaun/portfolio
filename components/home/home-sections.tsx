import { Fragment, ReactNode } from "react";
import { HOME_SECTIONS } from "@/data/home";
import ConnectSection from "./connect-section";
import TextSection from "./text-section";
import WorkSection from "@/components/work-section";
import type { PostSummary } from "@/data/blog";

type HomeSectionsProps = {
  posts: PostSummary[];
};

type Section = {
  id: string;
  title: string;
  content: ReactNode;
};

export default function HomeSections({ posts }: HomeSectionsProps) {
  const sections: Section[] = [
    {
      id: "about-me",
      title: "About me",
      content: <TextSection paragraphs={HOME_SECTIONS.about} />,
    },
    {
      id: "now",
      title: "Now",
      content: <TextSection paragraphs={HOME_SECTIONS.now} />,
    },
    {
      id: "work",
      title: "Work",
      content: <WorkSection posts={posts} />,
    },
    {
      id: "connect",
      title: "Connect",
      content: <ConnectSection />,
    },
  ];

  return (
    <div className="text-balance">
      {sections.map((section, index) => (
        <Fragment key={section.id}>
          <div className={index !== sections.length - 1 ? "mb-16" : ""}>
            <h2
              id={section.id}
              className="animate-slide-down-fade px-6 font-medium"
              style={{ animationDelay: `${90 * (index + 1)}ms` }}
            >
              {section.title}
            </h2>

            <div
              className={`my-4 animate-slide-down-fade ${
                section.id !== "work" ? "px-6" : ""
              }`}
              style={{ animationDelay: `${90 * (index + 1)}ms` }}
            >
              {section.content}
            </div>
          </div>
        </Fragment>
      ))}
    </div>
  );
}
