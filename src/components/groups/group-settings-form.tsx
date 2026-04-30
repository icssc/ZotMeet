"use client";

import { AddAPhoto, Delete } from "@mui/icons-material";
import { Avatar, Button, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import {
	compressImage,
	MAX_GROUP_ICON_FILE_SIZE,
} from "@/components/groups/create-group-dialog";
import { useSnackbar } from "@/components/ui/snackbar-provider";
import type { SelectGroup } from "@/db/schema";
import { deleteGroup } from "@/server/actions/group/delete/action";
import { updateGroup } from "@/server/actions/group/update/action";

interface GroupSettingsFormProps {
	group: SelectGroup;
	onCancel?: () => void;
}

export function GroupSettingsForm({ group, onCancel }: GroupSettingsFormProps) {
	const router = useRouter();
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const { showSuccess } = useSnackbar();
	const [editedName, setEditedName] = useState(group.name);
	const [editedDescription, setEditedDescription] = useState(
		group.description ?? "",
	);
	const [editedIcon, setEditedIcon] = useState(group.icon ?? "");
	const [isSavingSettings, startSavingSettings] = useTransition();
	const [isDeletingGroup, startDeletingGroup] = useTransition();
	const [settingsError, setSettingsError] = useState("");
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const [deleteConfirmName, setDeleteConfirmName] = useState("");

	const handleIconUpload = async (file: File) => {
		if (!file.type.startsWith("image/")) {
			setSettingsError("Only image files are allowed.");
			return;
		}

		if (file.size > MAX_GROUP_ICON_FILE_SIZE) {
			setSettingsError("Image must be under 5MB.");
			return;
		}

		try {
			const compressedBase64 = await compressImage(file);
			setEditedIcon(compressedBase64);
			setSettingsError("");
		} catch {
			setSettingsError("Failed to process image.");
		}
	};

	const handleSaveSettings = () => {
		if (!editedName.trim()) {
			setSettingsError("Group name is required");
			return;
		}

		setSettingsError("");
		startSavingSettings(async () => {
			const result = await updateGroup({
				groupId: group.id,
				name: editedName.trim(),
				description: editedDescription.trim(),
				icon: editedIcon || "",
			});

			if (!result.success) {
				setSettingsError(result.message);
				return;
			}

			showSuccess("Group updated successfully.");
			router.refresh();
			onCancel?.();
		});
	};

	const handleDeleteGroup = () => {
		if (deleteConfirmName.trim() !== group.name) {
			setSettingsError("Group name does not match.");
			return;
		}

		setSettingsError("");
		startDeletingGroup(async () => {
			const result = await deleteGroup(group.id);
			if (!result.success) {
				setSettingsError(result.message);
				return;
			}

			showSuccess("Group deleted successfully.");
			router.push("/groups");
			router.refresh();
		});
	};

	return (
		<div className="flex flex-col gap-5 pt-1">
			<div className="flex flex-col items-center gap-3">
				<button
					type="button"
					onClick={() => fileInputRef.current?.click()}
					className="relative"
				>
					<Avatar src={editedIcon || undefined} sx={{ width: 82, height: 82 }}>
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
						if (file) {
							void handleIconUpload(file);
						}
					}}
				/>

				<p className="text-gray-500 text-xs">Edit group icon (max 5MB)</p>
			</div>

			<TextField
				label="Group Name*"
				variant="outlined"
				fullWidth
				value={editedName}
				onChange={(e) => setEditedName(e.target.value.slice(0, 100))}
				helperText={`${editedName.length}/100`}
				slotProps={{ formHelperText: { sx: { textAlign: "right" } } }}
			/>

			<TextField
				label="Group Description"
				variant="outlined"
				fullWidth
				multiline
				rows={2}
				value={editedDescription}
				onChange={(e) => setEditedDescription(e.target.value.slice(0, 500))}
				helperText={`${editedDescription.length}/500`}
				slotProps={{ formHelperText: { sx: { textAlign: "right" } } }}
			/>

			<div className="flex flex-col gap-1">
				<Button
					color="error"
					onClick={() => setShowDeleteConfirm(true)}
					startIcon={<Delete sx={{ color: "error.main" }} />}
					sx={{ alignSelf: "flex-start", p: 0 }}
				>
					Delete Group
				</Button>
				<span className="text-gray-500 text-xs">
					This action cannot be undone.
				</span>

				{showDeleteConfirm && (
					<div className="mt-3 w-full">
						<TextField
							label="Enter group name to confirm deletion*"
							fullWidth
							size="small"
							value={deleteConfirmName}
							onChange={(e) => setDeleteConfirmName(e.target.value)}
						/>
					</div>
				)}
			</div>

			{settingsError && (
				<Typography variant="body2" color="error">
					{settingsError}
				</Typography>
			)}

			<div className="flex items-center justify-end gap-2">
				<Button
					variant="text"
					onClick={() => {
						if (onCancel) {
							onCancel();
							return;
						}
						router.back();
					}}
				>
					Cancel
				</Button>
				<Button
					variant="contained"
					onClick={handleSaveSettings}
					disabled={isSavingSettings || !editedName.trim()}
				>
					{isSavingSettings ? "Saving..." : "Save Changes"}
				</Button>
				{showDeleteConfirm && (
					<Button
						variant="text"
						color="error"
						onClick={handleDeleteGroup}
						disabled={isDeletingGroup}
					>
						{isDeletingGroup ? "Deleting..." : "Confirm Delete"}
					</Button>
				)}
			</div>
		</div>
	);
}
