/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    screens: {
			xl: { max: "1280px" },
			lg: { max: "1024px" },
			md: { max: "768px" },
			sm: { max: "640px" }
		}
  },
  plugins: []
}