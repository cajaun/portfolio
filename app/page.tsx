// import ProgressBar from "./components/hooks/progress";

import ThemeToggleButton from "../components/hooks/useTheme";
import cajaun from "../public/Cajaun_Headshot.jpg";
import { ScrollIsland } from "../components/ui/scroll-island";

export default function Home() {
  return (
    <div className="">
      {/* <div className="fixed z-10 top-0 h-[65px]  w-full backdrop-blur-md border-b   dark:border-quaternary bg-transparent  backdrop-flter bg-opacty-40">
        <div className="flex justify-between my-auto mx-auto h-full max-w-2xl px-5">
          <div className="bg-secondary h-10 w-10 my-auto rounded-full"></div>

          <ThemeToggleButton/>
        </div>
      </div> */}

      <div className="fixed top-0 left-0 right-0 h-24 z-40 pointer-events-none">
        <div className="h-full bg-gradient-to-b from-background via-background/70 to-transparent" />
      </div>

      <ScrollIsland />

      {/* <ProgressBar /> */}

      <div className="w-full h-40 lg:h-48 relative">
        <div className="rounded-2xl absolute left-1/2 w-full max-w-xl inset-0 -translate-x-1/2 bg-neutral-100  bg-[url('/images/photos/netherlands.jpg')] bg-cover bg-center mx-auto lg:ml-0">
          <div className="w-full max-w-nav mx-auto left-1/2 -translate-x-1/2 absolute -bottom-12">
            <img
              src={cajaun.src}
              className="object-cover rounded-full w-24 border-4 border-light-neutral dark:border-black"
              alt="Florian as a student"
            />
          </div>
        </div>
      </div>

      <div
        className="text-landingText space-y-10 py-[105px] max-w-2xl  mx-auto"
        style={{ animationDelay: "90ms" }}
      >
        <div className="space-y-4 p-5 animate-slide-down-fade">
          <h3 className="text-xl font-bold  text-black dark:text-impureWhite">
            About me
          </h3>

          <p className="text-offGray dark:text-secondary">
            {" "}
            am a designer currently shaping the native mobile apps at Linear and
            crafting app icons for a variety of clients.
          </p>

          <p className="text-offGray dark:text-secondary">
            I focus on the intersection of form and function to create
            experiences that effortlessly become an extension of oneself. I
            believe in ideas over opinions, prototypes as the most valuable tool
            for collaboration, and exploring one hundred ideas to find the right
            one.
          </p>

          <p className="text-offGray dark:text-secondary">
            I am driven by curiosity and strive for a high level of
            craftsmanship and excellence in my work.
          </p>
        </div>

        <div
          className="space-y-4 p-5 animate-slide-down-fade "
          style={{ animationDelay: "180ms" }}
        >
          <h3 className="text-xl font-bold  text-black dark:text-impureWhite">
            Now
          </h3>

          <p className="text-offGray dark:text-secondary">
            {" "}
            My main focus is growing{" "}
            <a href="https://rankedout.com" className="underline">
              RankedOut
            </a>
            , a startup allowing students to rate, review and rank their
            professors and dormitories utilizing Artificial Intelligence and
            Ranking Algorithms.
          </p>

          <p className="text-offGray dark:text-secondary">
            I'm also working on projects like LiTrainer, an advanced "Learn from
            Your Mistakes" tool using React and Tailwind, enabling players on
            LiChess to engage in puzzle chess games derived from their losses
          </p>
        </div>

        <div
          className="space-y-4 py-5 animate-slide-down-fade "
          style={{ animationDelay: "270ms" }}
        >
          <h3 className=" text-black dark:text-impureWhite text-xl font-bold px-5">
            Projects
          </h3>

          <div className="">
            <div className="flex flex-col space-y-2 py-3 cursor-pointer rounded-lg px-5 hover:bg-antiTertiary dark:hover:bg-tertiary group transition-colors duration-300 ease-in-out">
              <p className="text-dark dark:text-impureWhite font-semibold hover:text-accent  group-hover:text-accent transition-colors duration-300 ease-in-out">
                RankedOut
              </p>

              <p className="text-offGray dark:text-secondary">
                Rate, review and rank your professors and dormitories
              </p>
            </div>

            <div className="flex flex-col space-y-2 py-3 cursor-pointer rounded-lg px-5 hover:bg-antiTertiary dark:hover:bg-tertiary group transition-colors duration-300 ease-in-out">
              <p className="text-dark dark:text-impureWhite hover:text-accent   font-semibold group-hover:text-accent transition-colors duration-300 ease-in-out">
                LiTrainer
              </p>

              <p className="text-offGray dark:text-secondary">
                Rate, review and rank your professors and dormitories
              </p>
            </div>
          </div>
        </div>

        <div
          className="space-y-4 py-5 animate-slide-down-fade "
          style={{ animationDelay: "360ms" }}
        >
          <div className="flex justify-between px-5">
            <h3 className=" text-black dark:text-impureWhite text-xl font-bold ">
              Blog
            </h3>

            <svg
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              viewBox="0 0 24 24"
              height="20"
              width="20"
              className=" text-black dark:text-impureWhite my-auto cursor-pointer"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
          <div className="">
            <div className="py-4 px-5">
              <p className=" text-black dark:text-impureWhite font-bold ">
                2024
              </p>
            </div>

            <div className="">
              <div className="flex gap-x-10 py-4 cursor-pointer rounded-lg px-5 hover:bg-antiTertiary dark:hover:bg-tertiary group transition-colors duration-300 ease-in-out">
                <span className="text-offGray dark:text-secondary">Oct 04</span>
                <p className="text-black dark:text-impureWhite  hover:text-accent font-semibold group-hover:text-accent transition-colors duration-300 ease-in-out">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </p>
              </div>

              <div className="flex gap-x-10 py-4  cursor-pointer rounded-lg px-5 hover:bg-antiTertiary dark:hover:bg-tertiary  group transition-colors duration-300 ease-in-out ">
                <span className="text-offGray dark:text-secondary">Oct 04</span>
                <p className="text-black dark:text-impureWhite  font-semibold group-hover:text-accent transition-colors duration-300 ease-in-out">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </p>
              </div>

              <div className="flex gap-x-10 py-4  cursor-pointer rounded-lg px-5 hover:bg-antiTertiary dark:hover:bg-tertiary  group transition-colors duration-300 ease-in-out">
                <span className="text-offGray dark:text-secondary">Oct 04</span>
                <p className="text-black dark:text-impureWhite  font-semibold group-hover:text-accent transition-colors duration-300 ease-in-out">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          className="space-y-4 p-5 animate-slide-down-fade "
          style={{ animationDelay: "450ms" }}
        >
          <h3 className="text-xl font-bold  text-black dark:text-impureWhite">
            Connect
          </h3>

          <p className="text-offGray dark:text-secondary">
            {" "}
            When you use the RankedOut, you may voluntarily provide information
            such as your username, email address, reviews, and any other content
            you submit.
          </p>

          <p className="text-offGray dark:text-secondary">
            We may collect certain information automatically, including your IP
            address, browser type, device information, and usage patterns when
            you interact with RankedOut.
          </p>
        </div>
      </div>
    </div>
  );
}
