import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

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
		<Dialog open={isGuestDialogOpen} onOpenChange={setIsGuestDialogOpen}>
			TODO: Guest
			<DialogContent>
				<DialogTitle>Continue as Guest</DialogTitle>
				<Input
					id="name"
					placeholder="Enter your name..."
					value={guestName}
					onChange={(e) => setGuestName(e.target.value)}
					autoFocus
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							handleGuestSubmit();
						}
					}}
				/>
				<DialogFooter>
					<Button
						type="button"
						onClick={handleGuestSubmit}
						disabled={!guestName.trim()}
					>
						Submit
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
