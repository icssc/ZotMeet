"use client";

import { blue, green, orange, red } from "@mui/material/colors";
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
				fontWeight: 600,
			},
		},
		palette: {
			mode,
			action: {
				hoverOpacity: 0.08,
				selectedOpacity: 0.16,
			},
			background: {
				default: mode === "dark" ? "#1C1B1B" : "#F5F5F5",
				paper: mode === "dark" ? "#2A2929" : "#ffffff",
			},
			text: {
				primary: mode === "dark" ? "#FFFFFF" : "#000000",
				secondary:
					mode === "dark" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.6)",
			},
			primary: {
				main: "#F26489",
				contrastText: "#FFFFFF",
			},
			secondary: {
				main: "#1F2A44",
				contrastText: "#FFFFFF",
			},
			success: {
				main: green[800],
				dark: green[900],
				light: green[500],
				contrastText: "#FFFFFF",
			},
			warning: {
				main: orange[800],
				dark: orange[900],
				light: orange[500],
				contrastText: "#FFFFFF",
			},
			info: {
				main: "#1976D2",
			},
			error: {
				main: red[700],
				dark: red[800],
				light: red[400],
				contrastText: "#FFFFFF",
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
			MuiButton: {
				styleOverrides: {
					root: {
						textTransform: "none",
					},
					contained: ({ theme }) => ({
						boxShadow: `0 4px 0 0 rgba(0,0,0,0.15), 0 4px 0 0 ${theme.palette.primary.main}`,
						"&:hover": {
							boxShadow: `0 4px 0 0 rgba(0,0,0,0.15), 0 4px 0 0 ${theme.palette.primary.main}`,
						},
						"&:active": {
							boxShadow: "none",
							transform: "translateY(4px)",
						},
					}),
					outlinedPrimary: ({ theme }) => ({
						borderColor: `rgba(242, 100, 137, 0.5)`,
						"&:hover": {
							borderColor: theme.palette.primary.main,
						},
					}),
					outlinedInherit: ({ theme }) => ({
						borderColor:
							theme.palette.mode === "dark"
								? "rgba(255,255,255,0.3)"
								: "rgba(0,0,0,0.3)",
					}),
				},
			},
		},
	});

export default getTheme;
