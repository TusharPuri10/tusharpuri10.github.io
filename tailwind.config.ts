import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        shake: 'shake 5s linear infinite',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateY(0)' },
          '10%, 90%': { transform: 'translateY(-5px)' },
          '20%, 80%': { transform: 'translateY(5px)' },
          '30%, 50%, 70%': { transform: 'translateY(-3px)' },
          '40%, 60%': { transform: 'translateY(3px)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
