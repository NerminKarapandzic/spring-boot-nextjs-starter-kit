import type { Config } from "tailwindcss"
const { fontFamily } = require("tailwindcss/defaultTheme")
import pluginMantine from "@devoss/tailwind-plugin-mantine";
import { createTheme } from "@mantine/core";

export const theme = createTheme({
  // Put your mantine theme override here
});

const config = {
  darkMode: ["selector", '[data-mantine-color-scheme="dark"]'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  prefix: "",
  theme: {
    extend: {},
  },
  plugins: [require("tailwindcss-animate"), pluginMantine(theme)],
} satisfies Config

export default config