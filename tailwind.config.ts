import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class', 
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  
  theme: {
    extend: {
      colors: {
        black: {
          DEFAULT: '#090A0E'
        },
        accent: "#82AAFF",
        impureWhite: "#E1EAFD",
        offGray: "#3F485E",
        secondary: "#ACB5C8",
        tertiary: "#0E121F",
        antiTertiary: "#EFF4FF",
        quaternary: "#1d212a"

      },
      animation: {
        'slide-down-fade': 'slideFromDownFade 0.6s ease-in-out both',
      },
      keyframes: {
        slideFromDownFade: {
          '0%': {
            opacity: '0',
            filter: 'blur(10px)',
            transform: 'translateY(15px)',
          },
          '100%': {
            opacity: '1',
            filter: 'blur(0)',
            transform: 'translateY(0)',
          },
        },
        
      }
    },
  },
  plugins: [],
};
export default config;
