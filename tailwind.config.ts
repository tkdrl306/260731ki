import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          pink: "#FFD1DC",
          mint: "#A2E4B8",
          blue: "#AEC6CF",
          lemon: "#FDFD96"
        }
      },
      fontFamily: {
        jua: ["Jua", "sans-serif"],
        himelody: ["Hi Melody", "sans-serif"],
      }
    },
  },
  plugins: [],
};
export default config;
