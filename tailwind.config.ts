import { type Config } from "tailwindcss"

const config: Config = {
	darkMode: ["class"],
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: '#04D5FF',
					light: 'rgba(4, 213, 255, 0.1)',
				},
				secondary: {
					DEFAULT: '#00FACA',
					light: 'rgba(0, 250, 202, 0.1)',
				},
			},
		},
	},
	// eslint-disable-next-line @typescript-eslint/no-require-imports
	plugins: [require("tailwindcss-animate")],
}

export default config
