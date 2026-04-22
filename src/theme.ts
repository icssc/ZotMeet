"use client";

import { blue, green, orange, red } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";
import { figtree } from "@/fonts";

export const getTheme = (mode: "light" | "dark") =>
	createTheme({
		typography: {
			fontFamily: figtree.style.fontFamily,
			h1: {
				fontSize: "6rem",
				fontWeight: 300,
				lineHeight: 1.167,
				letterSpacing: "-1.5px",
			},
			h2: {
				fontSize: "3.75rem",
				fontWeight: 300,
				lineHeight: 1.2,
				letterSpacing: "-0.5px",
			},
			h3: {
				fontSize: "3rem",
				fontWeight: 400,
				lineHeight: 1.167,
				letterSpacing: "0px",
			},
			h4: {
				fontSize: "2.125rem",
				fontWeight: 400,
				lineHeight: 1.235,
				letterSpacing: "0.25px",
			},
			h5: {
				fontSize: "1.5rem",
				fontWeight: 500,
				lineHeight: 1.334,
				letterSpacing: "0px",
			},
			h6: {
				fontSize: "1.25rem",
				fontWeight: 600,
				lineHeight: 1.6,
				letterSpacing: "0.15px",
			},
			subtitle1: {
				fontSize: "1rem",
				fontWeight: 500,
				lineHeight: 1.2,
				letterSpacing: "0.15px",
			},
			subtitle2: {
				fontSize: "0.875rem",
				fontWeight: 500,
				lineHeight: 1.2,
				letterSpacing: "0.1px",
			},
			body1: {
				fontSize: "1rem",
				fontWeight: 400,
				lineHeight: 1.2,
				letterSpacing: "0.15px",
			},
			body2: {
				fontSize: "0.875rem",
				fontWeight: 400,
				lineHeight: 1.2,
				letterSpacing: "0.17px",
			},
			caption: {
				fontSize: "0.75rem",
				fontWeight: 500,
				lineHeight: 1,
				letterSpacing: "0.4px",
			},
			overline: {
				fontSize: "0.75rem",
				fontWeight: 500,
				lineHeight: 1,
				letterSpacing: "1px",
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
				primary: mode === "dark" ? "#ffffff" : "#000000",
				secondary:
					mode === "dark" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.6)",
			},
			primary: {
				main: "#F26489",
				contrastText: "#ffffff",
				light: "#fed3df",
			},
			secondary: {
				main: "#1F2A44",
				contrastText: "#ffffff",
			},
			success: {
				main: green[800],
				dark: green[900],
				light: green[500],
				contrastText: "#ffffff",
			},
			warning: {
				main: orange[800],
				dark: orange[900],
				light: orange[500],
				contrastText: "#ffffff",
			},
			info: {
				main: blue[700],
			},
			error: {
				main: red[700],
				dark: red[800],
				light: red[400],
				contrastText: "#ffffff",
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
			MuiTabs: {
				defaultProps: {
					textColor: "inherit",
				},
			},
			MuiTab: {
				styleOverrides: {
					root: ({ theme }) => ({
						color: theme.palette.text.primary,
						"&.Mui-selected": {
							color: theme.palette.text.primary,
							"& .MuiTab-iconWrapper": {
								color: theme.palette.primary.main,
							},
						},
					}),
				},
			},
			MuiSwitch: {
				styleOverrides: {
					track: {
						borderRadius: "100px",
					},
				},
			},
			MuiCheckbox: {
				defaultProps: {
					color: "primary",
				},
				styleOverrides: {
					root: {
						"& .MuiSvgIcon-root": {
							color: "inherit",
						},
					},
				},
			},
			MuiChip: {
				styleOverrides: {
					label: {
						fontSize: "0.8125rem",
						fontWeight: 400,
						lineHeight: "18px",
						letterSpacing: "0.16px",
					},
				},
			},
			MuiCard: {
				defaultProps: {
					elevation: 1,
				},
				styleOverrides: {
					root: ({ theme }) => ({
						borderRadius: 8,
						backgroundColor: theme.palette.background.paper,
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
							boxShadow: `0 2px 0 0 rgba(0,0,0,0.15), 0 2px 0 0 ${theme.palette.primary.main}`,
							transform: "translateY(2px)",
						},
						"&:active": {
							boxShadow: "none",
							transform: "translateY(4px)",
						},
					}),
					containedPrimary: ({ theme }) => ({
						"&:hover": {
							backgroundColor: theme.palette.primary.main,
						},
					}),
					containedSecondary: ({ theme }) => ({
						"&:hover": {
							backgroundColor: theme.palette.secondary.main,
						},
					}),
					outlined: {
						boxShadow: "0px 4px 0px 0px rgba(0,0,0,0.25)",
						"&:hover": {
							boxShadow: "0px 2px 0px 0px rgba(0,0,0,0.25)",
							transform: "translateY(2px)",
							backgroundColor: "transparent",
						},
						"&:active": {
							boxShadow: "none",
							transform: "translateY(4px)",
						},
					},
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
			MuiPaper: {
				styleOverrides: {
					outlined: ({ theme }) => ({
						border: `1px solid ${theme.palette.divider}`,
						borderRadius: 12,
						padding: theme.spacing(1.5),
						backgroundImage: "none",
					}),
				},
			},
		},
	});

export default getTheme;
