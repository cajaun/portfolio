import React from "react";
import CajaunArt from "@/app/assets/Cajaun_art.png";
import Image from "next/image";

const Header = () => {
  return (
    <div className="mb-16 flex animate-slide-down-fade items-center"  style={{ animationDelay: "90ms" }}>
      <div>
        <Image
          alt="Photo of Cajaun Campbell"
          src={CajaunArt}
          className="h-16 w-16 rounded-full object-cover"
          quality={100}
          sizes="64px"
          priority
        />
      </div>
      <div className="ml-4 ">
        <h1 className="font-medium mb-0.5">
         Cajaun Campbell
        </h1>
        <p className="paragraph group inline-flex items-center justify-center overflow-hidden transition text-gray-200 font-medium dark:text-gray-100">
          <span>Software Engineer</span>
        </p>
      </div>
    </div>
  );
};

export default Header;
