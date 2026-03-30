"use client";

import { createTheme } from "@mui/material/styles";
import { Figtree } from "next/font/google";

export const figtree = Figtree({
	subsets: ["latin"],
	variable: "--font-figtree",
	display: "swap",
	weight: ["400", "500", "600", "700"],
});

const theme = createTheme({
	typography: {
		fontFamily: figtree.style.fontFamily,
		h1: {
			fontSize: "2.5rem",
			fontWeight: 600,
		},
		h2: {
			fontSize: "2rem",
			fontWeight: 600,
		},
		h3: {
			fontSize: "1.75rem",
			fontWeight: 600,
		},
		h4: {
			fontSize: "1.5rem",
			fontWeight: 600,
		},
		h5: {
			fontSize: "1.25rem",
			fontWeight: 600,
		},
		h6: {
			fontSize: "1rem",
			fontWeight: 600,
		},
		body1: {
			fontFamily: figtree.style.fontFamily,
		},
		body2: {
			fontFamily: figtree.style.fontFamily,
		},
		button: {
			fontFamily: figtree.style.fontFamily,
			fontWeight: 500,
		},
	},
});

export default theme;
