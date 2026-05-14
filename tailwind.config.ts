import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ['class'],
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
				preview: {
					surface: "lab(100% 0 0)",
					"surface-muted": "lab(98.956% 0.0000298023 -0.0000119209)",
					"surface-active": "lab(96.752% 0 0)",
					border: "lab(91.996% -0.0000298023 0.0000119209)",
					text: "lab(12.304% -0.00000745058 0)",
					"text-muted": "lab(54.76% 0 0)",
					"dark-surface": "lab(3.04863% 0 0)",
					"dark-surface-muted": "lab(8.708% 0 0)",
					"dark-stage": "lab(17.06% 0 0)",
					"dark-active": "lab(12.304% -0.00000745058 0)",
					"dark-border": "#2C2C2B",
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
