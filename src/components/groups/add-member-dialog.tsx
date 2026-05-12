"use client";

import { inviteGroupMember } from "@actions/group/add-member/action";
import { createGroupInvite } from "@actions/group/invite/create/action";
import { inviteMeetingMembers } from "@actions/meeting/invite/action";
import { searchUsers } from "@actions/user/action";
import {
	Autocomplete,
	Avatar,
	Button,
	Chip,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	Typography,
} from "@mui/material";
import { Check, Copy } from "lucide-react";
import {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
	useTransition,
} from "react";
import { useSnackbar } from "@/components/ui/snackbar-provider";

export type SearchUser = {
	id: string;
	email: string;
	profilePicture: string | null;
};

function getInitials(email: string) {
	const name = email.split("@")[0] ?? "";
	return name.slice(0, 2).toUpperCase();
}

export type MemberInviteShareLink = {
	url: string;
	placeholder: string;
	caption: string;
};

type MemberInviteFieldsProps = {
	selectedMembers: SearchUser[];
	onSelectedMembersChange: (members: SearchUser[]) => void;
	/** User IDs to hide from search (e.g. existing group members). */
	excludeUserIds: string[];
	searchDebounceMs?: number;
	searchFieldLabel?: string;
	shareLink?: MemberInviteShareLink | null;
};

export function MemberInviteFields({
	selectedMembers,
	onSelectedMembersChange,
	excludeUserIds,
	searchDebounceMs = 200,
	searchFieldLabel = "Search users",
	shareLink,
}: MemberInviteFieldsProps) {
	const { showError } = useSnackbar();
	const [memberQuery, setMemberQuery] = useState("");
	const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
	const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const latestQueryRef = useRef("");
	const [copied, setCopied] = useState(false);
	const copiedTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		return () => {
			if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
			if (copiedTimeoutRef.current) clearTimeout(copiedTimeoutRef.current);
		};
	}, []);

	const excludeSet = useMemo(() => new Set(excludeUserIds), [excludeUserIds]);

	const handleMemberSearch = useCallback(
		(query: string) => {
			setMemberQuery(query);
			latestQueryRef.current = query;

			if (searchTimeoutRef.current) {
				clearTimeout(searchTimeoutRef.current);
			}

			if (query.length < 2) {
				setSearchResults([]);
				return;
			}

			searchTimeoutRef.current = setTimeout(async () => {
				const results = await searchUsers(query);
				if (latestQueryRef.current !== query) return;

				setSearchResults(results.filter((r) => !excludeSet.has(r.id)));
			}, searchDebounceMs);
		},
		[excludeSet, searchDebounceMs],
	);

	const addMember = useCallback(
		(user: SearchUser) => {
			if (selectedMembers.some((m) => m.id === user.id)) return;
			onSelectedMembersChange([
				...selectedMembers,
				{
					id: user.id,
					email: user.email,
					profilePicture: user.profilePicture ?? null,
				},
			]);
			setMemberQuery("");
			setSearchResults([]);
		},
		[selectedMembers, onSelectedMembersChange],
	);

	const removeMember = useCallback(
		(userId: string) => {
			onSelectedMembersChange(selectedMembers.filter((m) => m.id !== userId));
		},
		[selectedMembers, onSelectedMembersChange],
	);

	const handleCopyLink = useCallback(async () => {
		if (!shareLink?.url) return;
		try {
			await navigator.clipboard.writeText(shareLink.url);
			setCopied(true);
			if (copiedTimeoutRef.current) clearTimeout(copiedTimeoutRef.current);
			copiedTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
		} catch {
			showError("Failed to copy link to clipboard.");
		}
	}, [shareLink?.url, showError]);

	// Filter again at render time so members selected while a debounced search
	// is in-flight are immediately hidden from the dropdown.
	const options = searchResults.filter(
		(user) => !selectedMembers.some((m) => m.id === user.id),
	);

	return (
		<div className="flex flex-col gap-5 pt-1">
			<Autocomplete
				options={options}
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
					<TextField {...params} label={searchFieldLabel} size="small" />
				)}
				renderOption={({ key, ...optionProps }, option) => (
					<li key={key ?? option.id} {...optionProps}>
						<div className="flex items-center gap-3">
							<Avatar
								src={option.profilePicture ?? undefined}
								slotProps={{
									img: { referrerPolicy: "no-referrer" },
								}}
							>
								{getInitials(option.email)}
							</Avatar>
							<span className="text-sm">{option.email}</span>
						</div>
					</li>
				)}
			/>

			{selectedMembers.length > 0 && (
				<div className="flex flex-wrap gap-2">
					{selectedMembers.map((member) => (
						<Chip
							key={member.id}
							avatar={
								<Avatar
									src={member.profilePicture ?? undefined}
									slotProps={{
										img: { referrerPolicy: "no-referrer" },
									}}
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

			{shareLink && (
				<div>
					<Typography variant="caption" color="textSecondary">
						Or Share Invite Link
					</Typography>
					<div className="mt-1 flex items-center gap-2">
						<TextField
							value={shareLink.url}
							placeholder={shareLink.placeholder}
							size="small"
							fullWidth
							slotProps={{ input: { readOnly: true } }}
						/>
						<Button
							variant="contained"
							disableElevation
							onClick={handleCopyLink}
							disabled={!shareLink.url}
							color={copied ? "success" : "primary"}
							startIcon={copied ? <Check /> : <Copy />}
						>
							{copied ? "Copied" : "Copy"}
						</Button>
					</div>
					<Typography variant="caption" color="textSecondary">
						{shareLink.caption}
					</Typography>
				</div>
			)}
		</div>
	);
}

export type MemberInviteDialogProps =
	| {
			purpose: "meeting";
			open: boolean;
			onOpenChange: (open: boolean) => void;
			meetingId: string;
	  }
	| {
			purpose: "group";
			open: boolean;
			onOpenChange: (open: boolean) => void;
			groupId: string;
			excludeUserIds: string[];
			/** When true, loads a group invite URL when the dialog opens (group creator). */
			canLoadInviteLink: boolean;
	  };

export function MemberInviteDialog(props: MemberInviteDialogProps) {
	const { open, onOpenChange, purpose } = props;
	const meetingId = purpose === "meeting" ? props.meetingId : undefined;
	const groupId = purpose === "group" ? props.groupId : undefined;
	const excludeUserIds = purpose === "group" ? props.excludeUserIds : [];
	const canLoadInviteLink =
		purpose === "group" ? props.canLoadInviteLink : false;

	const [members, setMembers] = useState<SearchUser[]>([]);
	const [meetingLink, setMeetingLink] = useState("");
	const [groupInviteLink, setGroupInviteLink] = useState("");
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState("");
	const [fieldsKey, setFieldsKey] = useState(0);
	const { showSuccess, showError } = useSnackbar();

	useEffect(() => {
		if (!open || purpose !== "meeting" || !meetingId) return;
		setMeetingLink(`${window.location.origin}/availability/${meetingId}`);
	}, [open, purpose, meetingId]);

	useEffect(() => {
		if (!open || purpose !== "group" || !groupId || !canLoadInviteLink) {
			if (!open) setGroupInviteLink("");
			return;
		}

		let cancelled = false;
		(async () => {
			const res = await createGroupInvite(groupId);
			if (cancelled) return;
			if (res.success && res.inviteUrl) {
				setGroupInviteLink(res.inviteUrl);
			} else {
				setGroupInviteLink("");
				showError(res.message || "Failed to generate invite link.");
			}
		})();

		return () => {
			cancelled = true;
		};
	}, [open, purpose, groupId, canLoadInviteLink, showError]);

	const resetForm = useCallback(() => {
		setMembers([]);
		setError("");
		setFieldsKey((k) => k + 1);
	}, []);

	const handleOpenChange = (nextOpen: boolean) => {
		if (!nextOpen) resetForm();
		onOpenChange(nextOpen);
	};

	const shareLink: MemberInviteShareLink | null =
		purpose === "meeting"
			? {
					url: meetingLink,
					placeholder: "Loading link…",
					caption: "Anyone with this link can view the meeting",
				}
			: canLoadInviteLink
				? {
						url: groupInviteLink,
						placeholder: "Loading link…",
						caption: "Anyone with this link can join the group",
					}
				: null;

	const handleDone = useCallback(() => {
		if (members.length === 0) {
			resetForm();
			onOpenChange(false);
			return;
		}

		setError("");

		if (purpose === "meeting" && meetingId) {
			startTransition(async () => {
				const result = await inviteMeetingMembers(
					meetingId,
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
			return;
		}

		if (purpose === "group" && groupId) {
			startTransition(async () => {
				let hadError = false;
				let firstMessage = "";

				for (const user of members) {
					const res = await inviteGroupMember(groupId, user.id);
					if (!res.success) {
						hadError = true;
						const msg = `Failed to invite ${user.email}: ${res.message}`;
						if (!firstMessage) firstMessage = msg;
						showError(msg);
					} else {
						showSuccess(`Invite sent to ${user.email}`);
					}
				}

				if (!hadError) {
					resetForm();
					onOpenChange(false);
				} else {
					setError(firstMessage);
				}
			});
		}
	}, [
		purpose,
		meetingId,
		groupId,
		members,
		onOpenChange,
		resetForm,
		showError,
		showSuccess,
	]);

	return (
		<Dialog
			open={open}
			onClose={() => handleOpenChange(false)}
			maxWidth="sm"
			fullWidth
		>
			<DialogTitle>Invite Members</DialogTitle>

			<DialogContent>
				<MemberInviteFields
					key={fieldsKey}
					selectedMembers={members}
					onSelectedMembersChange={setMembers}
					excludeUserIds={excludeUserIds}
					searchFieldLabel="Add Members"
					shareLink={shareLink}
				/>

				{error && (
					<Typography variant="body2" color="error" sx={{ mt: 2 }}>
						{error}
					</Typography>
				)}
			</DialogContent>

			<DialogActions>
				<Button variant="text" onClick={() => handleOpenChange(false)}>
					Cancel
				</Button>
				<Button variant="contained" onClick={handleDone} disabled={isPending}>
					{isPending ? "Sending…" : "Done"}
				</Button>
			</DialogActions>
		</Dialog>
	);
}

type InviteMembersDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	meetingId: string;
};

export function InviteMembersDialog({
	open,
	onOpenChange,
	meetingId,
}: InviteMembersDialogProps) {
	return (
		<MemberInviteDialog
			purpose="meeting"
			open={open}
			onOpenChange={onOpenChange}
			meetingId={meetingId}
		/>
	);
}

type AddMemberDialogProps = {
	open: boolean;
	onClose: () => void;
	groupId: string;
	excludeUserIds: string[];
	canLoadInviteLink: boolean;
};

export function AddMemberDialog({
	open,
	onClose,
	groupId,
	excludeUserIds,
	canLoadInviteLink,
}: AddMemberDialogProps) {
	return (
		<MemberInviteDialog
			purpose="group"
			open={open}
			onOpenChange={(next) => {
				if (!next) onClose();
			}}
			groupId={groupId}
			excludeUserIds={excludeUserIds}
			canLoadInviteLink={canLoadInviteLink}
		/>
	);
}
