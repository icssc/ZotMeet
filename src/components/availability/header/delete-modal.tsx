import { archiveMeeting } from "@actions/meeting/archive/action";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useSnackbar } from "@/components/ui/snackbar-provider";
import type { SelectMeeting } from "@/db/schema";

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
	const { showSuccess, showError } = useSnackbar();

	const handleDeleteClick = async () => {
		const { success, error } = await archiveMeeting(meetingData);

		if (success) {
			showSuccess("Meeting deleted successfully!");
			router.push("/summary");
		} else {
			showError(error ?? "Something went wrong.");
		}

		handleOpenChange(false);
	};

	return (
		<Dialog open={isOpen} onClose={() => handleOpenChange(false)}>
			<DialogTitle>Delete Meeting</DialogTitle>

			<DialogContent>
				<DialogContentText>
					Are you sure you want to delete this meeting? This action cannot be
					undone.
				</DialogContentText>
			</DialogContent>

			<DialogActions>
				<Button onClick={() => handleOpenChange(false)}>Cancel</Button>
				<Button onClick={handleDeleteClick} color="error">
					Delete
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export { DeleteModal };
