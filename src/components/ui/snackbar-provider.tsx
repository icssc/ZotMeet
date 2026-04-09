"use client";

import { Alert, Snackbar } from "@mui/material";
import { createContext, useCallback, useContext, useState } from "react";

type SnackbarSeverity = "success" | "error" | "info" | "warning";

interface SnackbarState {
	open: boolean;
	message: string;
	severity: SnackbarSeverity;
}

interface SnackbarContextType {
	showSuccess: (message: string) => void;
	showError: (message: string) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(
	undefined,
);

export function useSnackbar() {
	const context = useContext(SnackbarContext);
	if (!context)
		throw new Error("useSnackbar must be used inside SnackbarProvider");
	return context;
}

export function SnackbarProvider({ children }: { children: React.ReactNode }) {
	const [state, setState] = useState<SnackbarState>({
		open: false,
		message: "",
		severity: "info",
	});

	const show = useCallback((message: string, severity: SnackbarSeverity) => {
		setState({ open: true, message, severity });
	}, []);

	const showSuccess = useCallback(
		(message: string) => show(message, "success"),
		[show],
	);

	const showError = useCallback(
		(message: string) => show(message, "error"),
		[show],
	);

	const handleClose = (_: unknown, reason?: string) => {
		if (reason === "clickaway") return;
		setState((s) => ({ ...s, open: false }));
	};

	return (
		<SnackbarContext.Provider value={{ showSuccess, showError }}>
			{children}
			<Snackbar
				open={state.open}
				autoHideDuration={4000}
				onClose={handleClose}
				anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
			>
				<Alert
					onClose={handleClose}
					severity={state.severity}
					variant="filled"
					sx={{ width: "100%" }}
				>
					{state.message}
				</Alert>
			</Snackbar>
		</SnackbarContext.Provider>
	);
}
