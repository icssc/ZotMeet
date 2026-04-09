"use client";

import { searchUsers } from "@actions/user/action";
import Autocomplete from "@mui/material/Autocomplete";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import { Check, Copy } from "lucide-react";
import { useCallback, useRef, useState, useTransition } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { createGroup } from "@/server/actions/group/create/action";

interface SelectedMember {
	id: string;
	email: string;
}

interface CreateGroupDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function CreateGroupDialog({
	open,
	onOpenChange,
}: CreateGroupDialogProps) {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [members, setMembers] = useState<SelectedMember[]>([]);
	const [memberQuery, setMemberQuery] = useState("");
	const [searchResults, setSearchResults] = useState<
		{ id: string; email: string }[]
	>([]);
	const [inviteLink, setInviteLink] = useState("");
	const [copied, setCopied] = useState(false);
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState("");
	const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	const resetForm = useCallback(() => {
		setName("");
		setDescription("");
		setMembers([]);
		setMemberQuery("");
		setSearchResults([]);
		setInviteLink("");
		setCopied(false);
		setError("");
	}, []);

	const handleOpenChange = useCallback(
		(nextOpen: boolean) => {
			if (!nextOpen) resetForm();
			onOpenChange(nextOpen);
		},
		[onOpenChange, resetForm],
	);

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
		(user: { id: string; email: string }) => {
			if (!members.some((m) => m.id === user.id)) {
				setMembers((prev) => [...prev, { id: user.id, email: user.email }]);
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
			});

			if (result.success && result.groupId) {
				const link = `${window.location.origin}/groups/${result.groupId}/join`;
				setInviteLink(link);
				handleOpenChange(false);
			} else {
				setError(result.message);
			}
		});
	}, [name, description, members, handleOpenChange]);

	const getInitials = (email: string) => {
		const name = email.split("@")[0] ?? "";
		return name.slice(0, 2).toUpperCase();
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle className="font-bold text-xl">
						Create New Group
					</DialogTitle>
				</DialogHeader>

				<div className="flex flex-col gap-5">
					<div className="relative">
						<fieldset className="rounded border border-gray-300 px-3 pt-1 pb-2">
							<legend className="px-1 text-gray-500 text-xs">
								Group Name*
							</legend>
							<input
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value.slice(0, 100))}
								className="w-full bg-transparent text-base outline-none"
								placeholder=""
							/>
						</fieldset>
						<span className="absolute top-full right-0 mt-0.5 text-gray-400 text-xs">
							{name.length}/100
						</span>
					</div>

					<div className="relative">
						<fieldset className="rounded border border-gray-300 px-3 pt-1 pb-2">
							<legend className="px-1 text-gray-500 text-xs">
								Group Description
							</legend>
							<textarea
								value={description}
								onChange={(e) => setDescription(e.target.value.slice(0, 500))}
								className="min-h-[60px] w-full resize-none bg-transparent text-base outline-none"
								rows={2}
							/>
						</fieldset>
						<span className="absolute top-full right-0 mt-0.5 text-gray-400 text-xs">
							{description.length}/500
						</span>
					</div>

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
									<div className="flex size-8 items-center justify-center rounded-full bg-blue-100 font-medium text-blue-700 text-xs">
										{getInitials(option.email)}
									</div>
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
									avatar={<Avatar>{getInitials(member.email)}</Avatar>}
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
							<input
								type="text"
								value={inviteLink}
								readOnly
								placeholder="Link available after group is created"
								className="flex-1 rounded border border-gray-300 bg-gray-50 px-3 py-2 text-gray-500 text-sm outline-none"
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

					{error && <p className="text-red-500 text-sm">{error}</p>}

					<div className="flex items-center justify-end gap-4">
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
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
