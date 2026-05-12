"use client";

import {
	Autocomplete,
	Avatar,
	Button,
	Chip,
	Dialog,
	DialogContent,
	DialogTitle,
	TextField,
} from "@mui/material";
import { useState } from "react";

export type SearchUser = {
	id: string;
	email: string;
	profilePicture?: string | null;
};

type AddMemberDialogProps = {
	open: boolean;
	onClose: () => void;
	onSearch: (query: string) => void;
	onAddMember: (users: SearchUser[]) => Promise<void>;
	searchResults: SearchUser[];
};

function getInitials(email: string) {
	return email.charAt(0).toUpperCase();
}

export function AddMemberDialog({
	open,
	onClose,
	onSearch,
	onAddMember,
	searchResults,
}: AddMemberDialogProps) {
	const [memberQuery, setMemberQuery] = useState("");
	const [selectedMembers, setSelectedMembers] = useState<SearchUser[]>([]);

	function addMember(user: SearchUser) {
		if (selectedMembers.some((m) => m.id === user.id)) {
			return;
		}

		setSelectedMembers((prev) => [...prev, user]);
		setMemberQuery("");
	}

	function removeMember(userId: string) {
		setSelectedMembers((prev) => prev.filter((m) => m.id !== userId));
	}

	function handleClose() {
		setSelectedMembers([]);
		setMemberQuery("");
		onClose();
	}

	return (
		<Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
			<DialogTitle>Add Members</DialogTitle>

			<DialogContent>
				<div className="flex flex-col gap-5 pt-1">
					{/* Search */}
					<Autocomplete
						options={searchResults.filter(
							(user) => !selectedMembers.some((m) => m.id === user.id),
						)}
						getOptionLabel={(option) => option.email}
						filterOptions={(x) => x}
						inputValue={memberQuery}
						onInputChange={(_, value, reason) => {
							if (reason !== "reset") {
								setMemberQuery(value);
								onSearch(value);
							}
						}}
						onChange={(_, user) => {
							if (user) {
								addMember(user);
								setMemberQuery("");
								onSearch("");
							}
						}}
						value={null}
						isOptionEqualToValue={(option, value) => option.id === value.id}
						noOptionsText={
							memberQuery.length < 2 ? "Type to search…" : "No users found"
						}
						disablePortal
						renderInput={(params) => (
							<TextField {...params} label="Search users" size="small" />
						)}
						renderOption={({ key, ...optionProps }, option) => (
							<li key={key ?? option.id} {...optionProps}>
								<div className="flex items-center gap-3">
									<Avatar
										src={option.profilePicture ?? undefined}
										slotProps={{
											img: {
												referrerPolicy: "no-referrer",
											},
										}}
									>
										{getInitials(option.email)}
									</Avatar>

									<span className="text-sm">{option.email}</span>
								</div>
							</li>
						)}
					/>

					{/* Selected members */}
					<div className="flex-1 overflow-y-auto">
						{selectedMembers.length > 0 && (
							<div className="flex flex-wrap gap-2">
								{selectedMembers.map((member) => (
									<Chip
										key={member.id}
										avatar={
											<Avatar
												src={member.profilePicture ?? undefined}
												slotProps={{
													img: {
														referrerPolicy: "no-referrer",
													},
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
					</div>

					{/* Footer */}
					<Button
						fullWidth
						variant="contained"
						disabled={selectedMembers.length === 0}
						onClick={async () => {
							await onAddMember(selectedMembers);
							handleClose();
						}}
					>
						Add Members
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
