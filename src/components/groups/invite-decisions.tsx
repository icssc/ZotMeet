"use client";

import { acceptInvite } from "@actions/group/invite/create/action";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface InviteDecisionProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export const InviteDecision = ({ open, onOpenChange }: InviteDecisionProps) => {
	const [input, setInput] = useState("");
	const router = useRouter();

	const handleAccept = async () => {
		if (!input) return;

		const token = input.split("/").pop();
		if (!token) return;

		try {
			const result = await acceptInvite(token);
			alert(result.message);
			if (result.success) {
				onOpenChange(false);
				setInput("");
				router.refresh();
			}
		} catch {
			alert("Failed to accept invite. Please try again.");
		}
	};

	return (
		<Dialog
			open={open}
			onClose={() => onOpenChange(false)}
			maxWidth="sm"
			fullWidth
		>
			<DialogTitle>Join Existing Group</DialogTitle>

			<DialogContent>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						void handleAccept();
					}}
				>
					<TextField
						label="Join via Link"
						placeholder="Insert Meeting Link"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						fullWidth
						sx={{ mt: 1 }}
					/>
				</form>
			</DialogContent>

			<DialogActions>
				<Button onClick={() => onOpenChange(false)} variant="text">
					Cancel
				</Button>
				<Button
					onClick={() => void handleAccept()}
					variant="contained"
					disabled={!input}
				>
					Join
				</Button>
			</DialogActions>
		</Dialog>
	);
};
