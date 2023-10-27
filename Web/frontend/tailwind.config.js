/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
	theme: {
		extend: {
			aspectRatio: {
				'20/9': '20 / 9',
			},
			fontFamily: {
				CreteRoundItalic: ["CreteRound-Italic", "serif"],
				CreteRoundRegular: ["CreteRound-Regular", "serif"],
			},
			colors: {
				background: "#f5f5f5", // light grey
				backgroundDark: "#191919", // dark grey
				foreground: "#ffffff", // white
				foregroundDark: "#000000", // black

				// TODO: Update these colors
				// -------------------------
				primary: "#24c8b4", // greenish teal - 1st color in gradient
				secondary: "#48a5c8", // light blue - 2nd color in gradient
				tertiary: "#2470ff", // blue - 3rd color in gradient
				accent1: "#6012e6", // purple - for buttons, links, etc
				accent2: "#ffa500", // orange - for alerts, warnings, etc
				// -------------------------

			},
		},
	},
  plugins: [],
}

