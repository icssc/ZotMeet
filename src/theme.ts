"use client";

import { createTheme } from "@mui/material/styles";
import { Figtree } from "next/font/google";

export const figtree = Figtree({
	subsets: ["latin"],
	variable: "--font-figtree",
	display: "swap",
	weight: ["400", "500", "600", "700"],
});

export const getTheme = (mode: "light" | "dark") =>
	createTheme({
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
		palette: {
			mode,
			background: {
				default: mode === "dark" ? "#1C1B1B" : "#F5F5F5",
				paper: mode === "dark" ? "#2A2929" : "#ffffff",
			},
			text: {
				primary: mode === "dark" ? "#FFFFFF" : "#000000",
				secondary:
					mode === "dark" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.6)",
			},
			divider: mode === "dark" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)",
		},
		components: {
			MuiSvgIcon: {
				styleOverrides: {
					root: ({ theme }) => ({
						color: theme.palette.text.primary,
					}),
				},
			},
		},
	});

export default getTheme;
