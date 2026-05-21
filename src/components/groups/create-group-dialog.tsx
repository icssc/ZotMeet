"use client";

import { AddAPhoto } from "@mui/icons-material";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useCallback, useRef, useState, useTransition } from "react";
import {
	MemberInviteFields,
	type SearchUser,
} from "@/components/groups/add-member-dialog";
import { createGroup } from "@/server/actions/group/create/action";

export const MAX_GROUP_ICON_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface CreateGroupDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export const compressImage = async (file: File) => {
	const bitmap = await createImageBitmap(file);
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");
	if (!ctx) {
		throw new Error("Canvas context unavailable");
	}
	const outputSize = 256;
	canvas.width = outputSize;
	canvas.height = outputSize;

	// Center-crop image to a square before resizing
	const srcW = bitmap.width;
	const srcH = bitmap.height;
	const cropSize = Math.min(srcW, srcH);
	const sx = Math.floor((srcW - cropSize) / 2);
	const sy = Math.floor((srcH - cropSize) / 2);
	// resizing
	ctx.imageSmoothingEnabled = true;
	ctx.imageSmoothingQuality = "high";
	ctx.drawImage(
		bitmap,
		sx,
		sy,
		cropSize,
		cropSize,
		0,
		0,
		outputSize,
		outputSize,
	);

	return new Promise<string>((resolve, reject) => {
		canvas.toBlob(
			(blob) => {
				if (!blob) {
					reject(new Error("Image compression failed"));
					return;
				}
				const reader = new FileReader();
				reader.onloadend = () => resolve(reader.result as string);
				reader.readAsDataURL(blob);
			},
			"image/jpeg",
			0.7,
		);
	});
};

export function CreateGroupDialog({
	open,
	onOpenChange,
}: CreateGroupDialogProps) {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [members, setMembers] = useState<SearchUser[]>([]);
	const [inviteLink, setInviteLink] = useState("");
	const [inviteFieldsKey, setInviteFieldsKey] = useState(0);
	const [isPending, startTransition] = useTransition();
	const [iconBase64, setIconBase64] = useState("");
	const [error, setError] = useState("");

	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const resetForm = useCallback(() => {
		setName("");
		setDescription("");
		setMembers([]);
		setInviteLink("");
		setInviteFieldsKey((k) => k + 1);
		setIconBase64("");
		setError("");
	}, []);

	const handleOpenChange = useCallback(
		(nextOpen: boolean) => {
			if (!nextOpen) resetForm();
			onOpenChange(nextOpen);
		},
		[onOpenChange, resetForm],
	);

	const handleImageUpload = useCallback(async (file: File) => {
		if (!file.type.startsWith("image/")) {
			setError("Only image files are allowed.");
			return;
		}

		if (file.size > MAX_GROUP_ICON_FILE_SIZE) {
			setError("Image must be under 5MB.");
			return;
		}

		try {
			const compressedBase64 = await compressImage(file);
			setIconBase64(compressedBase64);
			setError("");
		} catch {
			setError("Failed to process image.");
		}
	}, []);

	const handleSubmit = useCallback(() => {
		if (!name.trim()) {
			setError("Group name is required");
			return;
		}

		setError("");
		startTransition(async () => {
			const result = await createGroup({
				name: name.trim(),
				description: description.trim() || undefined,
				memberIds: members.map((m) => m.id),
				icon: iconBase64 || undefined,
			});

			if (result.success && result.groupId) {
				const link = `${window.location.origin}/groups/${result.groupId}/join`;
				setInviteLink(link);
				handleOpenChange(false);
			} else {
				setError(result.message);
			}
		});
	}, [name, description, members, handleOpenChange, iconBase64]);

	return (
		<Dialog
			open={open}
			onClose={() => handleOpenChange(false)}
			maxWidth="sm"
			fullWidth
		>
			<DialogTitle>Create New Group</DialogTitle>
			<DialogContent>
				<div className="flex flex-col gap-5 pt-1">
					<div className="flex flex-col items-center gap-3">
						<button
							type="button"
							onClick={() => fileInputRef.current?.click()}
							className="relative"
						>
							<Avatar
								src={iconBase64 || undefined}
								sx={{ width: 82, height: 82 }}
							>
								<AddAPhoto className="size-7" />
							</Avatar>
						</button>

						<input
							ref={fileInputRef}
							type="file"
							accept="image/*"
							hidden
							onChange={(e) => {
								const file = e.target.files?.[0];
								if (file) handleImageUpload(file);
							}}
						/>

						<p className="text-gray-500 text-xs">Upload group icon (max 5MB)</p>
					</div>

					<TextField
						label="Group Name*"
						variant="outlined"
						fullWidth
						value={name}
						onChange={(e) => setName(e.target.value.slice(0, 100))}
						helperText={`${name.length}/100`}
						slotProps={{ formHelperText: { sx: { textAlign: "right" } } }}
					/>

					<TextField
						label="Group Description"
						variant="outlined"
						fullWidth
						multiline
						rows={2}
						value={description}
						onChange={(e) => setDescription(e.target.value.slice(0, 500))}
						helperText={`${description.length}/500`}
						slotProps={{ formHelperText: { sx: { textAlign: "right" } } }}
					/>

					<MemberInviteFields
						key={inviteFieldsKey}
						selectedMembers={members}
						onSelectedMembersChange={setMembers}
						excludeUserIds={[]}
						searchFieldLabel="Add Members"
						shareLink={{
							url: inviteLink,
							placeholder: "Link available after group is created",
							caption: "Anyone with this link can join the group",
						}}
					/>

					{error && (
						<Typography variant="body2" color="error">
							{error}
						</Typography>
					)}
				</div>
			</DialogContent>

			<DialogActions>
				<Button variant="text" onClick={() => handleOpenChange(false)}>
					Cancel
				</Button>
				<Button
					variant="contained"
					onClick={handleSubmit}
					disabled={isPending || !name.trim()}
				>
					{isPending ? "Creating..." : "Create Group"}
				</Button>
			</DialogActions>
		</Dialog>
	);
}
