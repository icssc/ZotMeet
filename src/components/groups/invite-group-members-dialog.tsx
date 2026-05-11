"use client";

import { inviteGroupMembers } from "@actions/group/invite-members/action";
import { searchUsers } from "@actions/user/action";
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
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useSnackbar } from "@/components/ui/snackbar-provider";

interface SelectedMember {
	id: string;
	email: string;
	profilePicture: string | null;
}

interface InviteGroupMembersDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	groupId: string;
	groupName: string;
	currentUserId: string;
	existingMemberUserIds: string[];
}

const getInitials = (email: string) => {
	const name = email.split("@")[0] ?? "";
	return name.slice(0, 2).toUpperCase();
};

export function InviteGroupMembersDialog({
	open,
	onOpenChange,
	groupId,
	groupName,
	currentUserId,
	existingMemberUserIds,
}: InviteGroupMembersDialogProps) {
	const [members, setMembers] = useState<SelectedMember[]>([]);
	const [memberQuery, setMemberQuery] = useState("");
	const [searchResults, setSearchResults] = useState<
		{ id: string; email: string; profilePicture: string | null }[]
	>([]);
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState("");
	const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const { showSuccess, showError } = useSnackbar();

	useEffect(() => {
		return () => {
			if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
		};
	}, []);

	const resetForm = useCallback(() => {
		setMembers([]);
		setMemberQuery("");
		setSearchResults([]);
		setError("");
	}, []);

	const handleOpenChange = (nextOpen: boolean) => {
		if (!nextOpen) resetForm();
		onOpenChange(nextOpen);
	};

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
				const excluded = new Set([currentUserId, ...existingMemberUserIds]);
				const filtered = results.filter(
					(r) => !excluded.has(r.id) && !members.some((m) => m.id === r.id),
				);
				setSearchResults(filtered);
			}, 200);
		},
		[members, currentUserId, existingMemberUserIds],
	);

	const addMember = useCallback(
		(user: { id: string; email: string; profilePicture: string | null }) => {
			if (!members.some((m) => m.id === user.id)) {
				setMembers((prev) => [
					...prev,
					{
						id: user.id,
						email: user.email,
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

	const handleDone = useCallback(() => {
		if (members.length === 0) {
			resetForm();
			onOpenChange(false);
			return;
		}

		setError("");
		startTransition(async () => {
			const result = await inviteGroupMembers(
				groupId,
				members.map((m) => m.id),
			);

			if (result.success) {
				showSuccess(result.message);
				resetForm();
				onOpenChange(false);
			} else {
				setError(result.message);
				showError(result.message);
			}
		});
	}, [groupId, members, onOpenChange, showSuccess, resetForm, showError]);

	return (
		<Dialog
			open={open}
			onClose={() => handleOpenChange(false)}
			maxWidth="sm"
			fullWidth
		>
			<DialogTitle>Invite to {groupName}</DialogTitle>

			<DialogContent>
				<div className="flex flex-col gap-5 pt-1">
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
							<TextField {...params} label="Add people" size="small" />
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
									<span className="text-sm">{option.email}</span>
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

					<Typography variant="caption" color="textSecondary">
						They will get an in-app notification and email with a link to join
						the group.
					</Typography>

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
				<Button variant="contained" onClick={handleDone} disabled={isPending}>
					{isPending ? "Sending…" : "Send invites"}
				</Button>
			</DialogActions>
		</Dialog>
	);
}
