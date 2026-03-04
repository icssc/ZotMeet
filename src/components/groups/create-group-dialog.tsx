"use client";

import { Check, ChevronDown, Copy, X } from "lucide-react";
import { useCallback, useRef, useState, useTransition } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { createGroup } from "@/server/actions/group/create/action";
import { searchUsers } from "@/server/actions/user/search";

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
	const [showDropdown, setShowDropdown] = useState(false);
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
		setShowDropdown(false);
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
				setShowDropdown(false);
				return;
			}

			searchTimeoutRef.current = setTimeout(async () => {
				const results = await searchUsers(query);
				const filtered = results.filter(
					(r) => !members.some((m) => m.id === r.id),
				);
				setSearchResults(filtered);
				setShowDropdown(filtered.length > 0);
			}, 300);
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
			setShowDropdown(false);
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

					<div className="relative">
						<fieldset className="rounded border border-gray-300 px-3 pt-1 pb-2">
							<legend className="px-1 text-gray-500 text-xs">
								Add Members
							</legend>
							<div className="flex items-center gap-2">
								<input
									type="text"
									value={memberQuery}
									onChange={(e) => handleMemberSearch(e.target.value)}
									onFocus={() => {
										if (searchResults.length > 0) setShowDropdown(true);
									}}
									className="flex-1 bg-transparent text-base outline-none"
									placeholder=""
								/>
								<div className="flex items-center gap-1">
									{memberQuery && (
										<button
											type="button"
											onClick={() => {
												setMemberQuery("");
												setSearchResults([]);
												setShowDropdown(false);
											}}
											className="text-gray-400 hover:text-gray-600"
										>
											<X className="size-4" />
										</button>
									)}
									<ChevronDown className="size-4 text-gray-400" />
								</div>
							</div>
						</fieldset>

						{showDropdown && (
							<div className="absolute right-0 left-0 z-10 mt-1 rounded border border-gray-200 bg-white shadow-lg">
								{searchResults.map((user) => (
									<button
										key={user.id}
										type="button"
										onClick={() => addMember(user)}
										className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50"
									>
										<div className="flex size-8 items-center justify-center rounded-full bg-blue-100 font-medium text-blue-700 text-xs">
											{getInitials(user.email)}
										</div>
										<span className="text-sm">{user.email}</span>
									</button>
								))}
							</div>
						)}
					</div>

					{members.length > 0 && (
						<div className="flex flex-wrap gap-2">
							{members.map((member) => (
								<div
									key={member.id}
									className="flex items-center gap-1.5 rounded-full bg-gray-100 py-1 pr-1 pl-2"
								>
									<div className="flex size-6 items-center justify-center rounded-full bg-blue-100 font-medium text-[10px] text-blue-700">
										{getInitials(member.email)}
									</div>
									<span className="text-sm">{member.email.split("@")[0]}</span>
									<button
										type="button"
										onClick={() => removeMember(member.id)}
										className="rounded-full p-0.5 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
									>
										<X className="size-3.5" />
									</button>
								</div>
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
							<button
								type="button"
								onClick={handleCopyLink}
								disabled={!inviteLink}
								className={cn(
									"flex items-center gap-1.5 rounded px-4 py-2 font-medium text-sm transition-colors",
									copied
										? "bg-green-600 text-white"
										: inviteLink
											? "bg-blue-600 text-white hover:bg-blue-700"
											: "cursor-not-allowed bg-gray-200 text-gray-400",
								)}
							>
								{copied ? (
									<>
										<Check className="size-4" />
										COPIED
									</>
								) : (
									<>
										<Copy className="size-4" />
										COPY
									</>
								)}
							</button>
						</div>
						<p className="mt-1 text-gray-400 text-xs">
							Anyone with this link can join the group
						</p>
					</div>

					{error && <p className="text-red-500 text-sm">{error}</p>}

					<div className="flex items-center justify-end gap-4">
						<button
							type="button"
							onClick={() => handleOpenChange(false)}
							className="font-medium text-blue-600 text-sm uppercase tracking-wider hover:text-blue-700"
						>
							Cancel
						</button>
						<button
							type="button"
							onClick={handleSubmit}
							disabled={isPending || !name.trim()}
							className={cn(
								"rounded bg-blue-600 px-6 py-2.5 font-medium text-sm text-white uppercase tracking-wider",
								"hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50",
							)}
						>
							{isPending ? "Creating..." : "Create Group"}
						</button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
