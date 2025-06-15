import Header from "@/components/ui/header";
import { ScrollIsland } from "../components/ui/scroll-island";
import ThemeToggleButton from "@/components/hooks/useTheme";
import BlogSection from "@/components/blog-section";

const sections = [
  {
    id: "about-me",
    title: "About me",
    content: (
      <div className="">
        <p className="mb-2 text-gray-200 font-medium leading-6 tracking-[-0.1px]">
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
      <div className="">
        <p className="mb-2 text-gray-200 font-medium leading-6 tracking-[-0.1px]">
          I&apos;m currently focused on building mobile apps driven by ideas I find
          fun, curious, or personally meaningful.
        </p>

        <p className="mb-2 text-gray-200 font-medium leading-6 tracking-[-0.1px]">
          One of the ideas I&apos;m exploring is a &quot;Shazam for movies&quot; a tool that
          can identify films from short clips or scenes.
        </p>

        <p className="mb-2 text-gray-200 font-medium leading-6 tracking-[-0.1px]">
          I&apos;m also working on a remake of the New York Times&apos;{" "}
          <em>Connections</em> puzzle.
        </p>

        <p className="mb-2 text-gray-200 font-medium leading-6 tracking-[-0.1px]">
          Alongside that, I&apos;m putting together a collection of fluid, reusable
          UI components and animations for React Native which is designed to
          help you build smooth, modern interfaces with ease.
        </p>
      </div>
    ),
  },
  {
    id: "projects",
    title: "Projects",
    content: (
      <>
        <a
          href="https://rankedout.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col w-full "
        >
          <div className="w-full flex justify-between items-center hover:bg-gray-300 transition-colors duration-200 py-4 rounded-xl px-4 text-gray-200 hover:dark:bg-[#191918] hover:text-black hover:dark:text-white">
            <p className="font-medium">RankedOut</p>
          </div>
        </a>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col w-full"
        >
          <div className="w-full flex justify-between items-center hover:bg-gray-300 transition-colors duration-200 py-4 rounded-xl px-4 text-gray-200 hover:dark:bg-[#191918] hover:text-black hover:dark:text-white">
            <p className="font-medium">Movers</p>
          </div>
        </a>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col w-full"
        >
          <div className="w-full flex justify-between items-center hover:bg-gray-300 transition-colors duration-200 py-4 rounded-xl px-4 text-gray-200 hover:dark:bg-[#191918] hover:text-black hover:dark:text-white">
            <p className="font-medium">Auto-Care</p>
          </div>
        </a>
      </>
    ),
  },

  {
    id: "blog",
    title: "Blog",
    content: (
      <div>
        <BlogSection />
      </div>
    ),
  },

  {
    id: "connect",
    title: "Connect",
    content: (
      <div>
        <p className="paragraph text-gray-200 font-medium mb-2">
          Follow me on{" "}
          <a
            href="https://x.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-100"
          >
            X
          </a>
          , view my code and open-source projects on{" "}
          <a
            href="https://github.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-100"
          >
            Github
          </a>
          , or email me directly at{" "}
          <a
            href="mailto:cajaun@yahoo.com"
            className="underline hover:text-gray-100"
          >
            cajaun@yahoo.com
          </a>
          .
        </p>
      </div>
    ),
  },
];

export default function Home() {
  return (
    <>
      <main className="mx-auto mb-14 flex w-full max-w-screen-sm flex-1 flex-col px-4 pb-8 pt-20 dark:text-white">
        <Header />

        <ScrollIsland sections={sections} />
      </main>

      <footer className="mx-auto mt-auto w-full max-w-screen-sm border-t border-gray-300 dark:border-[#2A2A28] px-4 ">
        <div
          className="flex items-center justify-between px-0 pt-4 md:px-0"
          style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}
        >
          <p className="text-sm text-gray-100 font-semibold">
            © 2025 Cajaun Campbell
          </p>
          <ThemeToggleButton />
        </div>
      </footer>
    </>
  );
}
