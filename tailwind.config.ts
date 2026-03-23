import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#7C3AED",
        secondary: "#4F46E5",
        accent: "#A78BFA",
      },
      fontFamily: { sans: ["Inter", "sans-serif"] },
    },
  },
  plugins: [],
};
export default config;
