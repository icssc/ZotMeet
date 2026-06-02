"use client";

import { inviteGroupMember } from "@actions/group/add-member/action";
import { createGroupInvite } from "@actions/group/invite/create/action";
import {
	inviteMeetingMembers,
	updateMeetingInvitePermissions,
} from "@actions/meeting/invite/action";
import { searchUsers } from "@actions/user/search";
import {
	Autocomplete,
	Avatar,
	Button,
	Chip,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControlLabel,
	Switch,
	TextField,
	Typography,
} from "@mui/material";
import { Check, Copy } from "lucide-react";
import {
	type HTMLAttributes,
	memo,
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
	username: string | null;
	displayName: string | null;
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

type MemberSearchAutocompleteProps = {
	selectedMemberIds: Set<string>;
	excludeUserIds: string[];
	searchDebounceMs: number;
	searchFieldLabel: string;
	onSelectMember: (user: SearchUser) => void;
};

const MemberSearchOption = memo(function MemberSearchOption({
	option,
	...optionProps
}: HTMLAttributes<HTMLLIElement> & { option: SearchUser }) {
	const secondaryText = option.username
		? `@${option.username} • ${option.email}`
		: option.email;

	return (
		<li {...optionProps}>
			<div className="flex w-full min-w-0 items-center gap-3">
				<Avatar
					className="shrink-0"
					src={option.profilePicture ?? undefined}
					slotProps={{
						img: { referrerPolicy: "no-referrer" },
					}}
				>
					{getInitials(option.email)}
				</Avatar>
				<div className="min-w-0 flex-1 overflow-hidden">
					<Typography color="textPrimary" variant="body2" noWrap>
						{option.displayName}
					</Typography>
					<Typography color="textSecondary" variant="caption" noWrap>
						{secondaryText}
					</Typography>
				</div>
			</div>
		</li>
	);
});

function MemberSearchAutocomplete({
	selectedMemberIds,
	excludeUserIds,
	searchDebounceMs,
	searchFieldLabel,
	onSelectMember,
}: MemberSearchAutocompleteProps) {
	const [memberQuery, setMemberQuery] = useState("");
	const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
	const [isSearching, startSearchTransition] = useTransition();
	const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const latestQueryRef = useRef("");

	const excludeSet = useMemo(() => new Set(excludeUserIds), [excludeUserIds]);

	useEffect(() => {
		return () => {
			if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
		};
	}, []);

	const handleMemberSearch = useCallback(
		(query: string) => {
			setMemberQuery(query);
			latestQueryRef.current = query;

			if (searchTimeoutRef.current) {
				clearTimeout(searchTimeoutRef.current);
			}

			if (query.length < 2) {
				startSearchTransition(() => setSearchResults([]));
				return;
			}

			searchTimeoutRef.current = setTimeout(() => {
				void (async () => {
					const results = await searchUsers(query);
					if (latestQueryRef.current !== query) return;

					startSearchTransition(() => {
						setSearchResults(
							results.filter(
								(r) => !excludeSet.has(r.id) && !selectedMemberIds.has(r.id),
							),
						);
					});
				})();
			}, searchDebounceMs);
		},
		[excludeSet, searchDebounceMs, selectedMemberIds],
	);

	const options = useMemo(
		() => searchResults.filter((user) => !selectedMemberIds.has(user.id)),
		[searchResults, selectedMemberIds],
	);

	return (
		<Autocomplete
			options={options}
			loading={isSearching}
			getOptionLabel={(option) => option.email}
			filterOptions={(x) => x}
			inputValue={memberQuery}
			onInputChange={(_, value, reason) => {
				if (reason !== "reset") handleMemberSearch(value);
			}}
			onChange={(_, user) => {
				if (user) {
					onSelectMember(user);
					setMemberQuery("");
					setSearchResults([]);
				}
			}}
			value={null}
			isOptionEqualToValue={(option, value) => option.id === value.id}
			noOptionsText={
				memberQuery.length < 2
					? "Search via Email, Display Name, Username..."
					: "No users found"
			}
			slotProps={{
				popper: {
					placement: "bottom-start",
					modifiers: [{ name: "flip", enabled: false }],
					sx: (theme) => ({ zIndex: theme.zIndex.modal + 1 }),
				},
			}}
			renderInput={(params) => (
				<TextField {...params} label={searchFieldLabel} size="small" />
			)}
			ListboxProps={{
				style: { maxHeight: 140, overflowY: "auto" },
			}}
			renderOption={({ key, ...optionProps }, option) => (
				<MemberSearchOption
					key={key ?? option.id}
					option={option}
					{...optionProps}
				/>
			)}
		/>
	);
}

export function MemberInviteFields({
	selectedMembers,
	onSelectedMembersChange,
	excludeUserIds,
	searchDebounceMs = 100,
	searchFieldLabel = "Search users",
	shareLink,
}: MemberInviteFieldsProps) {
	const { showError } = useSnackbar();
	const [copied, setCopied] = useState(false);
	const copiedTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		return () => {
			if (copiedTimeoutRef.current) clearTimeout(copiedTimeoutRef.current);
		};
	}, []);

	const selectedMemberIds = useMemo(
		() => new Set(selectedMembers.map((m) => m.id)),
		[selectedMembers],
	);

	const addMember = useCallback(
		(user: SearchUser) => {
			if (selectedMembers.some((m) => m.id === user.id)) return;
			onSelectedMembersChange([
				...selectedMembers,
				{
					id: user.id,
					email: user.email,
					username: user.username,
					displayName: user.displayName,
					profilePicture: user.profilePicture ?? null,
				},
			]);
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

	return (
		<div className="flex flex-col gap-5 pt-1">
			<MemberSearchAutocomplete
				selectedMemberIds={selectedMemberIds}
				excludeUserIds={excludeUserIds}
				searchDebounceMs={searchDebounceMs}
				searchFieldLabel={searchFieldLabel}
				onSelectMember={addMember}
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
			isOwner: boolean;
			membersCanInvite: boolean;
			onMembersCanInviteChange: (value: boolean) => void;
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
	const isOwner = purpose === "meeting" ? props.isOwner : false;
	const membersCanInvite =
		purpose === "meeting" ? props.membersCanInvite : false;
	const onMembersCanInviteChange =
		purpose === "meeting" ? props.onMembersCanInviteChange : undefined;
	const groupId = purpose === "group" ? props.groupId : undefined;
	const excludeUserIds = purpose === "group" ? props.excludeUserIds : [];
	const canLoadInviteLink =
		purpose === "group" ? props.canLoadInviteLink : false;

	const [members, setMembers] = useState<SearchUser[]>([]);
	const [isUpdatingPermissions, setIsUpdatingPermissions] = useState(false);
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

	const handleMembersCanInviteChange = useCallback(
		async (checked: boolean) => {
			if (!meetingId || !onMembersCanInviteChange) return;

			setIsUpdatingPermissions(true);
			onMembersCanInviteChange(checked);

			try {
				const result = await updateMeetingInvitePermissions({
					meetingId,
					membersCanInvite: checked,
				});

				if (!result.success) {
					onMembersCanInviteChange(!checked);
					showError(result.message);
				} else {
					showSuccess(result.message);
				}
			} catch (error) {
				console.error(error);
				onMembersCanInviteChange(!checked);
				showError("Failed to update invite permissions.");
			} finally {
				setIsUpdatingPermissions(false);
			}
		},
		[meetingId, onMembersCanInviteChange, showError, showSuccess],
	);

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

			<DialogActions sx={{ justifyContent: "flex-end", px: 3, pb: 2, pt: 1 }}>
				{purpose === "meeting" && isOwner && (
					<FormControlLabel
						sx={{ m: 0, mr: "auto" }}
						control={
							<Switch
								checked={membersCanInvite}
								disabled={isUpdatingPermissions}
								onChange={(e) => {
									void handleMembersCanInviteChange(e.target.checked);
								}}
							/>
						}
						label={
							<Typography color="textPrimary">Allow Guest Invites</Typography>
						}
					/>
				)}
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
	isOwner: boolean;
	membersCanInvite: boolean;
	onMembersCanInviteChange: (value: boolean) => void;
};

export function InviteMembersDialog({
	open,
	onOpenChange,
	meetingId,
	isOwner,
	membersCanInvite,
	onMembersCanInviteChange,
}: InviteMembersDialogProps) {
	return (
		<MemberInviteDialog
			purpose="meeting"
			open={open}
			onOpenChange={onOpenChange}
			meetingId={meetingId}
			isOwner={isOwner}
			membersCanInvite={membersCanInvite}
			onMembersCanInviteChange={onMembersCanInviteChange}
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
