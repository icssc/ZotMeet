"use client";

import { saveThemePreference } from "@actions/user/action";
import { CssBaseline, ThemeProvider } from "@mui/material";
import {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
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
	initialMode,
}: {
	children: React.ReactNode;
	initialMode: ThemeMode;
}) {
	const [mode, setMode] = useState<ThemeMode>(initialMode);
	// resolving what "system" means for the current OS
	const [resolvedMode, setResolvedMode] = useState<"light" | "dark">(() => {
		if (initialMode !== "system") return initialMode;

		// Check if we are on the client to safely access window
		if (typeof window !== "undefined") {
			return window.matchMedia("(prefers-color-scheme: dark)").matches
				? "dark"
				: "light";
		}

		return "light";
	});

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
	const isFirstMount = useRef(true);

	useEffect(() => {
		if (isFirstMount.current) {
			// skip saving on first mount since it's just initialMode
			isFirstMount.current = false;
			return;
		}

		async function persistMode() {
			try {
				await saveThemePreference(mode);
			} catch (err) {
				console.error("Failed to save theme preference", err);
			}
		}
		persistMode();
	}, [mode]);

	const theme = useMemo(() => getTheme(resolvedMode), [resolvedMode]);

	return (
		<ThemeModeContext.Provider value={{ mode, setMode }}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				{children}
			</ThemeProvider>
		</ThemeModeContext.Provider>
	);
}
