import type { MeetingListItem } from "@zotmeet/shared";
import { useState } from "react";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Typography } from "@/components/ui/typography";
import { archiveMeeting, leaveMeeting } from "@/lib/api/meetings";
import { Icon } from "@/lib/icons";
import { getDeleteLeaveAction } from "@/lib/meetings/delete-leave-action";

interface DeleteModalProps {
	meetingData: MeetingListItem;
	isOpen: boolean;
	handleOpenChange: (open: boolean) => void;
	isOwner: boolean;
	isDeletionPending: boolean;
	onDeletionPendingChange: (pending: boolean) => void;
	/** Called after a successful delete / leave — the web's `router.refresh()`. */
	onDone: () => void;
}

/**
 * Native counterpart to the web app's `DeleteModal`
 * (`src/components/meetings/delete-modal.tsx`): the confirmation behind a
 * card's "Delete Meeting" / "Leave Meeting". The web calls the
 * `archiveMeeting` / `leaveMeeting` server actions; this calls the routes
 * that wrap them. Always the dialog form — the web's bottom drawer is its
 * `sm`-down layout, and this dialog already sits in the small-screen slot.
 * There is no snackbar here, so a refused action shows inside the dialog.
 */
export function DeleteModal({
	meetingData,
	isOpen,
	handleOpenChange,
	isOwner,
	isDeletionPending,
	onDeletionPendingChange,
	onDone,
}: DeleteModalProps) {
	const [error, setError] = useState<string | null>(null);
	const {
		label: actionLabel,
		icon,
		confirmColor,
	} = getDeleteLeaveAction(isOwner);

	const bodyText = isOwner
		? "This action is irreversible. All members will be removed from this meeting."
		: "You will be removed from this meeting and your availability will be cleared.";

	const handleConfirm = async () => {
		onDeletionPendingChange(true);
		setError(null);
		try {
			const result = isOwner
				? await archiveMeeting(meetingData.id)
				: await leaveMeeting(meetingData.id);

			if (result.success) {
				handleOpenChange(false);
				onDone();
			} else {
				setError(result.error ?? "Something went wrong.");
			}
		} catch (caught) {
			setError(
				caught instanceof Error ? caught.message : "Something went wrong.",
			);
		} finally {
			onDeletionPendingChange(false);
		}
	};

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(open) => {
				if (!isDeletionPending) handleOpenChange(open);
			}}
		>
			<DialogContent>
				<DialogHeader>
					<View className="flex-row items-center gap-1">
						<Icon name={icon} size={22} />
						<DialogTitle>{actionLabel}</DialogTitle>
					</View>
					<DialogDescription>{bodyText}</DialogDescription>
				</DialogHeader>

				{error ? (
					<Typography variant="body2" color="error">
						{error}
					</Typography>
				) : null}

				<DialogFooter>
					<Button
						variant="outlined"
						label="Cancel"
						disabled={isDeletionPending}
						onPress={() => handleOpenChange(false)}
					/>
					<Button
						variant="contained"
						color={confirmColor}
						disabled={isDeletionPending}
						onPress={handleConfirm}
					>
						<Icon
							name={icon}
							size={18}
							className={
								confirmColor === "error"
									? "text-destructive-foreground"
									: "text-warning-foreground"
							}
						/>
						<Typography
							variant="button"
							className={
								confirmColor === "error"
									? "text-destructive-foreground"
									: "text-warning-foreground"
							}
						>
							{actionLabel}
						</Typography>
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
