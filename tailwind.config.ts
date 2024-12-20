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
        blue: '#20C786',
        blueDark: '#06CC80',
        key: '#F9FCFA',
        paper: '#06CC80',
        text: '#06CC80',
        tool: '#2F2F2F',
        bgGray: "#2F2F2F",
        bgDeepGray: "#191919",
        primaryGray: "#3F3F3F",
        primaryLightGray: "#5F5F5F",
        secondaryGray: "#3C3C3C",
        thirdGray: "#D9D9D9",
        textGray: "#B3B3B3",
        mainWhite: "#ffffff",
        mainLightGreen: "#CEFFEC",
        mainGreen: "#20C786",
        mainDarkGreen: "#06CC80",
        mainBlack: "#000000",
        mainGray: "#666666",
        customLightGreen: 'rgba(206,255,236,1)',
        customGreen: 'rgba(6,204,128,1)',
      },
      fontFamily: {
        Pretendard: ["Pretendard"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        textAnimation: {
          '0%, 10%': { marginTop: '0rem' },
          '20%, 30%': { marginTop: '-2.5rem' },
          '40%, 50%': { marginTop: '-5.2rem' },
          '60%, 70%': { marginTop: '-8.2rem' },
          '80%, 90%': { marginTop: '-10.2rem' },
          '90%, 100%': { marginTop: '0rem' },
        },
        bounce05: {
          '85%, 92%, 100%': { transform: 'translateY(0)' },
          '89%': { transform: 'translateY(-4px)' },
          '95%': { transform: 'translateY(2px)' },
        },
        slide05: {
          '5%': { transform: 'translateX(14px)' },
          '15%, 30%': { transform: 'translateX(6px)' },
          '40%, 55%': { transform: 'translateX(0)' },
          '65%, 70%': { transform: 'translateX(-4px)' },
          '80%, 89%': { transform: 'translateX(-12px)' },
          '100%': { transform: 'translateX(14px)' },
        },
        paper05: {
          '5%': { transform: 'translateY(46px)' },
          '20%, 30%': { transform: 'translateY(34px)' },
          '40%, 55%': { transform: 'translateY(22px)' },
          '65%, 70%': { transform: 'translateY(10px)' },
          '80%, 85%': { transform: 'translateY(0)' },
          '92%, 100%': { transform: 'translateY(46px)' },
        },
        keyboard05: {
          '5%, 12%, 21%, 30%, 39%, 48%, 57%, 66%, 75%, 84%': {
            boxShadow:
              '15px 0 0 var(--key), 30px 0 0 var(--key), 45px 0 0 var(--key), 60px 0 0 var(--key), 75px 0 0 var(--key), 90px 0 0 var(--key), 22px 10px 0 var(--key), 37px 10px 0 var(--key), 52px 10px 0 var(--key), 60px 10px 0 var(--key), 68px 10px 0 var(--key), 83px 10px 0 var(--key)',
          },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.3" },
        },
        subtleBlink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
      animation: {
        blink: "blink 1.5s infinite",
        subtleBlink: "subtleBlink 2s infinite",
        textAnimation: 'textAnimation 8s infinite',
        bounce05: 'bounce05 3s linear infinite',
        slide05: 'slide05 3s ease infinite',
        paper05: 'paper05 3s linear infinite',
        keyboard05: 'keyboard05 3s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
