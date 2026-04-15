import { SITE } from "@/data/site";

export default function ConnectSection() {
  return (
    <div>
      <p className="paragraph text-gray-200 font-medium mb-2 dark:text-gray-100">
        Follow me on{" "}
        <a
          href={SITE.links.x}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-[#2A2A2A] dark:hover:text-white"
        >
          X
        </a>
        , view my code and open-source projects on{" "}
        <a
          href={SITE.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-[#2A2A2A] dark:hover:text-white"
        >
          GitHub
        </a>
        , or email me directly at{" "}
        <a
          href={`mailto:${SITE.email}`}
          className="underline hover:text-[#2A2A2A] dark:hover:text-white"
        >
          {SITE.email}
        </a>
        .
      </p>
    </div>
  );
}
