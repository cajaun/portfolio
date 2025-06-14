import { ScrollIsland } from "../components/ui/scroll-island";

const sections = [
  {
    id: "about-me",
    title: "About me",
    content: (
      <div className="">
        <p className="paragraph mb-2 text-gray-200 font-medium">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus facilis
          consequuntur harum nihil quis commodi dolorem aliquid laudantium
          facere at, beatae, architecto nam. Beatae non ad reprehenderit, ipsa
          corrupti ea.
        </p>
      </div>
    ),
  },
  {
    id: "now",
    title: "Now",
    content: (
      <div className="">
        <p className="paragraph mb-2 text-gray-200 font-medium">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus facilis
          consequuntur harum nihil quis commodi dolorem aliquid laudantium
          facere at, beatae, architecto nam. Beatae non ad reprehenderit, ipsa
          corrupti ea.
        </p>
      </div>
    ),
  },
  {
    id: "more",
    title: "More",
    content: (
      <div className="">
        <p className="paragraph text-gray-200 font-medium">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus facilis
          consequuntur harum nihil quis commodi dolorem aliquid laudantium
          facere at, beatae, architecto nam. Beatae non ad reprehenderit, ipsa
          corrupti ea.
        </p>
      </div>
    ),
  },
  {
    id: "connect",
    title: "Connect",
    content: (
      <div className="">
        <p className="paragraph text-gray-200 font-medium">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus facilis
          consequuntur harum nihil quis commodi dolorem aliquid laudantium
          facere at, beatae, architecto nam. Beatae non ad reprehenderit, ipsa
          corrupti ea.
        </p>
      </div>
    ),
  },
];

export default function Home() {
  return (
    <main className="mx-auto mb-14 flex w-full max-w-screen-sm flex-1 flex-col px-4 pb-8 pt-20 dark:text-white">
      <div className="fixed top-0 left-0 right-0 h-16 z-40 pointer-events-none">
        <div className="h-full bg-gradient-to-b from-white via-white/15 to-transparent " />
      </div>

      <div className="mb-16 flex animate-slideFromDownAndFade items-center">
        <div>
          <a href="/">
            <img
              alt="Photo of Julien Thibeaut or Ibelick"
              width="400"
              height="400"
              decoding="async"
              className="pointer-events-none h-16 w-16 rounded-full"
              style={{ color: "transparent" }}
              src="https://github.com/cajaun.png"
            />
          </a>
        </div>
        <div className="ml-4 ">
          <h1 className="font-bold mb-0.5">
            <a href="/">Cajaun Campbell</a>
          </h1>
          <p className="paragraph group inline-flex items-center justify-center overflow-hidden transition text-gray-200 font-medium">
            <span>Software Engineer</span>
          </p>
        </div>
      </div>
      <ScrollIsland sections={sections} isDarkMode={false} />
    </main>
  );
}
