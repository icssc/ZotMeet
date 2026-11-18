"use client";

import { Close, LinkRounded, MailOutline } from "@mui/icons-material";
import {
	Alert,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	Link,
	TextField,
	Typography,
} from "@mui/material";
import {
	firstVideoLink,
	SCHEDULE_MESSAGE_MAX,
	splitMessageLinks,
} from "@zotmeet/shared";
import { format } from "date-fns";
import { useState } from "react";

interface ScheduleConfirmDialogProps {
	open: boolean;
	onClose: () => void;
	/** Saves the schedule with the message; resolves `true` on success. */
	onConfirm: (message: string) => Promise<boolean>;
	meetingTitle: string;
	start: Date;
	end: Date;
	recipientCount: number;
}

/**
 * Shown when the host's Save will schedule the meeting for the first time
 * (and so email everyone). Lets the host attach an optional message; links in
 * it become clickable in the email.
 */
export function ScheduleConfirmDialog({
	open,
	onClose,
	onConfirm,
	meetingTitle,
	start,
	end,
	recipientCount,
}: ScheduleConfirmDialogProps) {
	const [message, setMessage] = useState("");
	const [isSaving, setIsSaving] = useState(false);

	const links = splitMessageLinks(message).filter((s) => s.kind === "link");
	const videoLink = firstVideoLink(links);
	const memberWord = recipientCount === 1 ? "member" : "members";

	const handleConfirm = async () => {
		setIsSaving(true);
		try {
			if (await onConfirm(message)) onClose();
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<Dialog
			open={open}
			onClose={isSaving ? undefined : onClose}
			maxWidth="sm"
			fullWidth
			slotProps={{ transition: { onExited: () => setMessage("") } }}
		>
			<DialogTitle className="flex items-center justify-between">
				Schedule this meeting?
				<IconButton aria-label="Close" onClick={onClose} disabled={isSaving}>
					<Close />
				</IconButton>
			</DialogTitle>

			<DialogContent>
				<div className="flex flex-col gap-5 pt-1">
					<Typography color="text.secondary">
						{meetingTitle} · {format(start, "EEE, MMM d · h:mm")} –{" "}
						{format(end, "h:mm a")}
					</Typography>

					<Alert severity="info" icon={<MailOutline />}>
						<Typography variant="body2" fontWeight={600}>
							{recipientCount} {memberWord} will get an email
						</Typography>
						<Typography variant="body2">
							It includes the time, your message and Add to Google Calendar.
						</Typography>
						<Typography variant="caption" color="text.secondary">
							Members who turned off scheduled-meeting notifications won't be
							notified.
						</Typography>
					</Alert>

					<TextField
						label="Message (optional)"
						multiline
						minRows={4}
						fullWidth
						value={message}
						onChange={(e) =>
							setMessage(e.target.value.slice(0, SCHEDULE_MESSAGE_MAX))
						}
						placeholder="Add a note for everyone. Paste a Zoom or Meet link and it becomes clickable."
						helperText={`Links become clickable in the email · ${message.length}/${SCHEDULE_MESSAGE_MAX}`}
					/>

					{links.length > 0 && (
						<div className="flex flex-col gap-2">
							<Typography variant="overline" color="text.secondary">
								Links in your message
							</Typography>
							{links.map((segment, i) => (
								<div
									key={`${segment.value}-${i}`}
									className="flex min-w-0 items-center gap-2"
								>
									<LinkRounded fontSize="small" color="primary" />
									<Link
										href={segment.value}
										target="_blank"
										rel="noopener noreferrer"
										className="min-w-0 flex-1 truncate"
									>
										{segment.value.replace(/^https?:\/\//, "")}
									</Link>
									{segment.value === videoLink && (
										<Typography variant="caption" color="text.secondary">
											Video call
										</Typography>
									)}
								</div>
							))}
						</div>
					)}
				</div>
			</DialogContent>

			<DialogActions className="px-6 pb-5">
				<Button variant="outlined" onClick={onClose} disabled={isSaving}>
					Back
				</Button>
				<Button
					variant="contained"
					onClick={() => {
						handleConfirm().catch(console.error);
					}}
					disabled={isSaving}
				>
					Schedule & notify
				</Button>
			</DialogActions>
		</Dialog>
	);
}
