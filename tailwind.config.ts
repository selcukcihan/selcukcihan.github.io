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
        'primary-0': '#FEFAF6',
        'secondary-1': '#092635',
        'secondary-2': '#ECB159',
        'secondary-3': '#CE7C00',
      },
    },
    listStyleType: {
      none: 'none',
      square: 'square',
      disc: 'disc',
    },
  },
  plugins: [],
};
export default config;
