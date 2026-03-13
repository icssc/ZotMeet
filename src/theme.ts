"use client";

import { createTheme } from "@mui/material/styles";
import { DM_Sans, Montserrat } from "next/font/google";

export const dmSans = DM_Sans({
	subsets: ["latin"],
	display: "swap",
	weight: ["400", "500", "600", "700"],
});

export const montserrat = Montserrat({
	subsets: ["latin"],
	display: "swap",
	weight: ["400", "500", "600", "700"],
});

export const getTheme = (mode: "light" | "dark") =>
	createTheme({
		palette: {
			mode,
			background:
				mode === "dark"
					? {
							default: "#1C1B1B",
							paper: "#1C1B1B",
						}
					: {
							default: "#ffffff",
							paper: "#ffffff",
						},
			text:
				mode === "dark"
					? {
							primary: "#FFFFFF",
							secondary: "rgba(255,255,255,0.3)",
						}
					: {
							primary: "#000000",
							secondary: "rgba(0,0,0,0.6)",
						},
			divider: mode === "dark" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)",
		},
		typography: {
			fontFamily: dmSans.style.fontFamily,
			h1: {
				fontFamily: montserrat.style.fontFamily,
				fontSize: "2.5rem",
				fontWeight: 600,
			},
			h2: {
				fontFamily: montserrat.style.fontFamily,
				fontSize: "2rem",
				fontWeight: 600,
			},
			h3: {
				fontFamily: montserrat.style.fontFamily,
				fontSize: "1.75rem",
				fontWeight: 600,
			},
			h4: {
				fontFamily: montserrat.style.fontFamily,
				fontSize: "1.5rem",
				fontWeight: 600,
			},
			h5: {
				fontFamily: montserrat.style.fontFamily,
				fontSize: "1.25rem",
				fontWeight: 600,
			},
			h6: {
				fontFamily: montserrat.style.fontFamily,
				fontSize: "1rem",
				fontWeight: 600,
			},
			body1: {
				fontFamily: dmSans.style.fontFamily,
			},
			body2: {
				fontFamily: dmSans.style.fontFamily,
			},
			button: {
				fontFamily: dmSans.style.fontFamily,
				fontWeight: 500,
			},
		},
	});
