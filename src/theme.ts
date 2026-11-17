"use client";

import { green, orange, red } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";
import { hsl } from "@zotmeet/tokens";
import { muiTypography } from "@zotmeet/tokens/typography";
import { figtree } from "@/fonts";

export const getTheme = (mode: "light" | "dark") =>
	createTheme({
		typography: {
			fontFamily: figtree.style.fontFamily,
			// The ramp is written once in `packages/tokens/typography.js`, which
			// the Expo app's Tailwind config reads too; `muiTypography` renders it
			// in the rem sizes and unitless line heights this theme always used.
			...muiTypography(),
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
			// Every colour this palette shares with the Expo app comes from
			// `packages/tokens` — the same file both Tailwind configs read — so a
			// palette entry and its `bg-*` class cannot drift apart. Entries still
			// written out below (`success`, `error`, the `light`/`dark` shades) have
			// no native counterpart yet; give one a token when native needs it.
			primary: {
				main: hsl("primary"),
				contrastText: hsl("primary-foreground"),
				light: "#fed3df",
			},
			secondary: {
				main: hsl("secondary-main"),
				contrastText: hsl("secondary-main-foreground"),
			},
			success: {
				main: green[800],
				dark: green[900],
				light: green[500],
				contrastText: "#ffffff",
			},
			warning: {
				main: hsl("warning"),
				dark: orange[900],
				light: orange[500],
				contrastText: hsl("warning-foreground"),
			},
			info: {
				main: hsl("info"),
				contrastText: hsl("info-foreground"),
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
					root: ({ theme, ownerState }) => ({
						borderRadius: 8,
						backgroundColor: theme.palette.background.paper,
						...(ownerState.variant === "outlined" && {
							boxShadow: "0px 4px 0px rgba(0,0,0,0.25)",
						}),
					}),
				},
			},
			MuiButton: {
				variants: [
					{
						props: { size: "square" },
						style: ({ theme }) => ({
							minWidth: 0,
							width: theme.spacing(5),
							height: theme.spacing(5),
							padding: 0,
						}),
					},
				],
				styleOverrides: {
					root: {
						textTransform: "none",
					},
					contained: ({ theme, ownerState }) => {
						const paletteColor =
							ownerState.color && ownerState.color !== "inherit"
								? theme.palette[ownerState.color]?.main
								: theme.palette.primary.main;
						return {
							boxShadow: `0 4px 0 0 rgba(0,0,0,0.15), 0 4px 0 0 ${paletteColor}`,
							"& .MuiSvgIcon-root": { color: "inherit" },
							"&:hover": {
								boxShadow: `0 2px 0 0 rgba(0,0,0,0.15), 0 2px 0 0 ${paletteColor}`,
								transform: "translateY(2px)",
							},
							"&:active": {
								boxShadow: "none",
								transform: "translateY(4px)",
							},
						};
					},
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
					outlined: ({ theme }) => ({
						color: theme.palette.text.primary,
						borderColor:
							theme.palette.mode === "dark"
								? "rgba(255,255,255,0.25)"
								: "rgba(0,0,0,0.25)",
						backgroundColor: theme.palette.background.paper,

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
					}),
					outlinedPrimary: ({ theme }) => ({
						"&:hover": {
							borderColor: theme.palette.primary.main,
						},
					}),
					outlinedSecondary: ({ theme }) => ({
						backgroundColor: theme.palette.secondary.main,
						color: theme.palette.secondary.contrastText,
						borderColor: theme.palette.secondary.main,
						"&:hover": {
							backgroundColor: theme.palette.secondary.main,
							color: theme.palette.secondary.contrastText,
							borderColor: theme.palette.secondary.main,
						},
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
