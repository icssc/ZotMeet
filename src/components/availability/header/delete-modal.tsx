import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { SelectMeeting } from "@/db/schema";
import { archiveMeeting } from "@actions/meeting/archive/action";
import { toast } from "sonner";

interface DeleteModalProps {
	meetingData: SelectMeeting;
	isOpen: boolean;
	handleOpenChange: (open: boolean) => void;
}
const DeleteModal = ({
	meetingData,
	isOpen,
	handleOpenChange,
}: DeleteModalProps) => {
	const router = useRouter();

	if (!isOpen) {
		return null;
	}

	const handleDeleteClick = async () => {
		const { success, error } = await archiveMeeting(meetingData);

		if (success) {
			toast.success("Meeting deleted successfully!");
			router.push("/summary");
		} else {
			toast.error(error);
		}

		handleOpenChange(false);
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Delete Meeting</DialogTitle>
				</DialogHeader>

				<DialogDescription>
					Are you sure you want to delete this meeting? This action cannot be
					undone.
				</DialogDescription>

				<DialogFooter>
					<Button onClick={() => handleOpenChange(false)} variant="outline">
						Close
					</Button>
					<Button onClick={handleDeleteClick} variant="destructive">
						Delete
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export { DeleteModal };
