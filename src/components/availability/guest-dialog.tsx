import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
} from "@mui/material";

interface GuestDialogProps {
	isGuestDialogOpen: boolean;
	setIsGuestDialogOpen: (isOpen: boolean) => void;
	guestName: string;
	setGuestName: (name: string) => void;
	saveAvailabilityData: (name: string) => void;
}

export function GuestDialog({
	isGuestDialogOpen,
	setIsGuestDialogOpen,
	guestName,
	setGuestName,
	saveAvailabilityData,
}: GuestDialogProps) {
	const handleGuestSubmit = () => {
		if (guestName.trim()) {
			setIsGuestDialogOpen(false);
			saveAvailabilityData(guestName);
		}
	};

	return (
		<Dialog
			open={isGuestDialogOpen}
			onClose={() => setIsGuestDialogOpen(false)}
			maxWidth="xs"
			fullWidth
		>
			<DialogTitle>Continue as Guest</DialogTitle>

			<DialogContent>
				<TextField
					autoFocus
					label="Your name"
					placeholder="Enter your name..."
					value={guestName}
					onChange={(e) => setGuestName(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter") handleGuestSubmit();
					}}
					fullWidth
					sx={{ mt: 1 }}
				/>
			</DialogContent>

			<DialogActions>
				<Button
					variant="contained"
					onClick={handleGuestSubmit}
					disabled={!guestName.trim()}
				>
					Submit
				</Button>
			</DialogActions>
		</Dialog>
	);
}
