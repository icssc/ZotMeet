"use client";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { createContext, useContext, useMemo, useState } from "react";
import { getTheme } from "@/theme";

type ThemeContextType = {
	mode: "light" | "dark";
	setMode: (mode: "light" | "dark") => void;
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
	const [mode, setMode] = useState<"light" | "dark">("light");

	const theme = useMemo(() => getTheme(mode), [mode]);

	return (
		<ThemeModeContext.Provider value={{ mode, setMode }}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				{children}
			</ThemeProvider>
		</ThemeModeContext.Provider>
	);
}
