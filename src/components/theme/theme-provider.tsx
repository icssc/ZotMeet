"use client";

import { getUserThemeMode, saveThemePreference } from "@actions/user/action";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getTheme } from "@/theme";

type ThemeMode = "light" | "dark" | "system";

type ThemeContextType = {
	mode: ThemeMode;
	setMode: (mode: ThemeMode) => void;
};

const ThemeModeContext = createContext<ThemeContextType | undefined>(undefined);

export function useThemeMode() {
	const context = useContext(ThemeModeContext);
	if (!context)
		throw new Error("useThemeMode must be used inside AppThemeProvider");
	return context;
}

export default function AppThemeProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [mode, setMode] = useState<ThemeMode>("light");
	// resolving what "system" means for the current OS
	const [resolvedMode, setResolvedMode] = useState<"light" | "dark">("light");
	const [initialThemeLoaded, setInitialThemeLoaded] = useState(false);

	// on mount, fetch user's theme preference from DB
	useEffect(() => {
		async function fetchThemePreference() {
			try {
				const themeMode = await getUserThemeMode();
				setMode(themeMode);
				setInitialThemeLoaded(true);
			} catch (err) {
				console.error("Failed to fetch theme preference", err);
			}
		}

		fetchThemePreference();
	}, []);

	// Update resolvedMode whenever mode or system preference changes
	useEffect(() => {
		if (mode === "system") {
			const preferDark = window.matchMedia("(prefers-color-scheme: dark)");
			const update = () =>
				setResolvedMode(preferDark.matches ? "dark" : "light");
			update();
			preferDark.addEventListener("change", update); // run update() when system pref changes
			return () => preferDark.removeEventListener("change", update); // cleanup
		} else {
			setResolvedMode(mode);
		}
	}, [mode]);

	// saving user preference to DB if it changed
	useEffect(() => {
		async function persistMode() {
			try {
				await saveThemePreference(mode);
			} catch (err) {
				console.error("Failed to save theme preference", err);
			}
		}
		if (initialThemeLoaded) {
			persistMode();
		}
	}, [mode, initialThemeLoaded]);

	const theme = useMemo(() => getTheme(resolvedMode), [resolvedMode]);

	if (!initialThemeLoaded) {
		// Don't render children until we know the user's theme preference
		return null;
	}

	return (
		<ThemeModeContext.Provider value={{ mode, setMode }}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				{children}
			</ThemeProvider>
		</ThemeModeContext.Provider>
	);
}
