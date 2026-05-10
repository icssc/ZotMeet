"use client";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { IconButton } from "@mui/material";
import { useCallback } from "react";
import { copyTextToClipboard } from "@/lib/clipboard/utils";
import { useSnackbar } from "../ui/snackbar-provider";

export interface CopyToClipboardButtonProps {
	content: string;
	successMessage: string;
	errorMessage: string;
}

/**
 * Small icon button that copies `content` to the clipboard and surfaces result via snackbar.
 */
export function CopyToClipboardButton({
	content,
	successMessage,
	errorMessage,
}: CopyToClipboardButtonProps) {
	const { showSuccess, showError } = useSnackbar();

	const handleCopy = useCallback(async () => {
		try {
			const copied = await copyTextToClipboard(content);
			if (!copied) {
				throw new Error("Clipboard write failed");
			}
			showSuccess(successMessage);
		} catch (_clipboardError) {
			showError(errorMessage);
		}
	}, [content, showSuccess, showError, successMessage, errorMessage]);

	return (
		<IconButton
			type="button"
			size="small"
			onClick={() => {
				void handleCopy();
			}}
		>
			<ContentCopyIcon fontSize="small" />
		</IconButton>
	);
}
