import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        white: "#FFFFFF",
        black: "#000000",
        "black-90": "#1A1A1A",
        "black-80": "#333333",
        "black-70": "#4D4D4D",
        "black-60": "#676767",
        primary: "#06CC80",
        secondary: "#CEFFEC",
      },
      fontFamily: {
        Pretendard: ["Pretendard"],
      },
      fontSize: {
        "bold-20": ["20px", "20px"],
        "bold-16": ["16px", "16px"],
        "semibold-16": ["16px", "24px"],
        "regular-16": ["16px", "16px"],
        "regular-12": ["12px", "12px"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        textAnimation: {
          "0%, 10%": { marginTop: "0rem" },
          "20%, 30%": { marginTop: "-2.5rem" },
          "40%, 50%": { marginTop: "-5.2rem" },
          "60%, 70%": { marginTop: "-8.2rem" },
          "80%, 90%": { marginTop: "-10.2rem" },
          "90%, 100%": { marginTop: "0rem" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.3" },
        },
      },
      animation: {
        blink: "blink 1.5s infinite",
        textAnimation: "textAnimation 8s infinite",
      },
    },
  },
  plugins: [],
};

export default config;
