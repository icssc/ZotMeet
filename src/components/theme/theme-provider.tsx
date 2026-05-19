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

	// TODO: Standardize CSS classes for light and dark mode
	const [systemPrefersDark, setSystemPrefersDark] = useState(false);

	useEffect(() => {
		const mq = window.matchMedia("(prefers-color-scheme: dark)");
		const update = () => setSystemPrefersDark(mq.matches);
		update();
		mq.addEventListener("change", update);
		return () => mq.removeEventListener("change", update);
	}, []);

	const resolvedMode: "light" | "dark" =
		mode === "system" ? (systemPrefersDark ? "dark" : "light") : mode;

	// TODO: Remove above

	const theme = useMemo(() => getTheme(resolvedMode), [resolvedMode]);

	useEffect(() => {
		const root = document.documentElement;
		root.classList.toggle("dark", resolvedMode === "dark");
	}, [resolvedMode]);

	return (
		<ThemeModeContext.Provider value={{ mode, setMode }}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				{children}
			</ThemeProvider>
		</ThemeModeContext.Provider>
	);
}
