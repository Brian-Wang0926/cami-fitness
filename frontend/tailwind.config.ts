import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  important: '#__next', // 確保 Tailwind 樣式能覆蓋 MUI
  theme: {
    extend: {},
  },
  plugins: [],
}
export default config
