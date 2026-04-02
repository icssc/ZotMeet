"use client";

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

	// Update resolvedMode whenever mode or system preference changes
	useEffect(() => {
		if (mode === "system") {
			const mq = window.matchMedia("(prefers-color-scheme: dark)");
			const update = () => setResolvedMode(mq.matches ? "dark" : "light");
			update();
			mq.addEventListener("change", update);
			return () => mq.removeEventListener("change", update);
		} else {
			setResolvedMode(mode);
		}
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
