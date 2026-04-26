"use client";

import { searchUsers } from "@actions/user/action";
import { AddAPhoto } from "@mui/icons-material";
import Autocomplete from "@mui/material/Autocomplete";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Check, Copy } from "lucide-react";
import { useCallback, useRef, useState, useTransition } from "react";
import { createGroup } from "@/server/actions/group/create/action";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface SelectedMember {
	id: string;
	email: string;
	username: string | null;
	profilePicture: string | null;
}

interface CreateGroupDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

const compressImage = async (file: File) => {
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
	const [members, setMembers] = useState<SelectedMember[]>([]);
	const [memberQuery, setMemberQuery] = useState("");
	const [searchResults, setSearchResults] = useState<
		{
			id: string;
			email: string;
			username: string | null;
			profilePicture: string | null;
		}[]
	>([]);
	const [inviteLink, setInviteLink] = useState("");
	const [copied, setCopied] = useState(false);
	const [isPending, startTransition] = useTransition();
	const [iconBase64, setIconBase64] = useState("");
	const [error, setError] = useState("");

	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	const resetForm = useCallback(() => {
		setName("");
		setDescription("");
		setMembers([]);
		setMemberQuery("");
		setSearchResults([]);
		setInviteLink("");
		setCopied(false);
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

		if (file.size > MAX_FILE_SIZE) {
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

	const handleMemberSearch = useCallback(
		(query: string) => {
			setMemberQuery(query);

			if (searchTimeoutRef.current) {
				clearTimeout(searchTimeoutRef.current);
			}

			if (query.length < 2) {
				setSearchResults([]);
				return;
			}

			searchTimeoutRef.current = setTimeout(async () => {
				const results = await searchUsers(query);
				const filtered = results.filter(
					(r) => !members.some((m) => m.id === r.id),
				);
				setSearchResults(filtered);
			}, 50);
		},
		[members],
	);

	const addMember = useCallback(
		(user: {
			id: string;
			email: string;
			username: string | null;
			profilePicture: string | null;
		}) => {
			if (!members.some((m) => m.id === user.id)) {
				setMembers((prev) => [
					...prev,
					{
						id: user.id,
						email: user.email,
						username: user.username,
						profilePicture: user.profilePicture,
					},
				]);
			}
			setMemberQuery("");
			setSearchResults([]);
		},
		[members],
	);

	const removeMember = useCallback((userId: string) => {
		setMembers((prev) => prev.filter((m) => m.id !== userId));
	}, []);

	const handleCopyLink = useCallback(async () => {
		if (!inviteLink) return;
		await navigator.clipboard.writeText(inviteLink);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	}, [inviteLink]);

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

	const getInitials = (email: string) => {
		const name = email.split("@")[0] ?? "";
		return name.slice(0, 2).toUpperCase();
	};

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

					<Autocomplete
						options={searchResults}
						getOptionLabel={(option) => option.email}
						filterOptions={(x) => x}
						inputValue={memberQuery}
						onInputChange={(_, value, reason) => {
							if (reason !== "reset") handleMemberSearch(value);
						}}
						onChange={(_, user) => {
							if (user) addMember(user);
						}}
						value={null}
						isOptionEqualToValue={(option, value) => option.id === value.id}
						noOptionsText={
							memberQuery.length < 2 ? "Type to search…" : "No users found"
						}
						disablePortal
						renderInput={(params) => (
							<TextField {...params} label="Add Members" size="small" />
						)}
						renderOption={({ key, ...optionProps }, option) => (
							<li key={key ?? option.id} {...optionProps}>
								<div className="flex items-center gap-3">
									<Avatar
										src={option.profilePicture ?? undefined}
										slotProps={{ img: { referrerPolicy: "no-referrer" } }}
									>
										{getInitials(option.email)}
									</Avatar>
									<div className="flex flex-col">
										<span className="text-sm">{option.email}</span>
										{option.username ? (
											<span className="text-muted-foreground text-xs">
												@{option.username}
											</span>
										) : null}
									</div>
								</div>
							</li>
						)}
					/>

					{members.length > 0 && (
						<div className="flex flex-wrap gap-2">
							{members.map((member) => (
								<Chip
									key={member.id}
									avatar={
										<Avatar
											src={member.profilePicture ?? undefined}
											slotProps={{ img: { referrerPolicy: "no-referrer" } }}
										>
											{getInitials(member.email)}
										</Avatar>
									}
									label={member.email.split("@")[0]}
									onDelete={() => removeMember(member.id)}
									variant="filled"
								/>
							))}
						</div>
					)}

					<div>
						<p className="mb-1.5 text-gray-500 text-sm">Or Share Invite Link</p>
						<div className="flex items-center gap-2">
							<TextField
								value={inviteLink}
								placeholder="Link available after group is created"
								size="small"
								fullWidth
								slotProps={{ input: { readOnly: true } }}
							/>
							<Button
								variant="contained"
								disableElevation
								onClick={handleCopyLink}
								disabled={!inviteLink}
								color={copied ? "success" : "primary"}
								startIcon={copied ? <Check /> : <Copy />}
							>
								{copied ? "Copied" : "Copy"}
							</Button>
						</div>
						<p className="mt-1 text-gray-400 text-xs">
							Anyone with this link can join the group
						</p>
					</div>

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
