import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ['class', 'class'], 
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  
  theme: {
  	extend: {
			fontFamily: {
				sans: ["var(--font-open-runde)", "sans-serif"],
			},
  		colors: {
				gray: {
					100: "#A3A3A3",  
					200: "#737373",  
					300: "#0000000D",
				},
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
			},
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
