"use client";

import { createGroup } from "@actions/group/create/action";
import { createGroupInvite } from "@actions/group/invite/create/action";
import { zodResolver } from "@hookform/resolvers/zod";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { IconButton } from "@mui/material";
import { User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Button } from "@/components/ui/button";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createGroupSchema } from "@/server/actions/group/create/schema";

interface CreateGroupProps {
	email: string;
}

export const CreateGroup = ({ email }: CreateGroupProps) => {
	const [isCreating, setIsCreating] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [createdGroup, setCreatedGroup] = useState(false);
	const [tempGroupId, setTempGroupId] = useState("");
	const [inviteLink, setInviteLink] = useState("");
	const [showPopup, setShowPopup] = useState(false);

	const form = useForm<z.infer<typeof createGroupSchema>>({
		resolver: zodResolver(createGroupSchema),
		defaultValues: {
			name: "",
			description: "",
		},
	});

	const onSubmit = async (data: z.infer<typeof createGroupSchema>) => {
		setIsCreating(true);
		setError(null);

		const result = await createGroup(data);

		if (!result.success) {
			setError(result.message);
			setIsCreating(false);
		} else {
			console.log("Group created with ID:", result.groupId);
			//router.push(`/groups/${result.groupId}`);
			setCreatedGroup(true);
			setTempGroupId(result.groupId || "");
			setIsCreating(false);

			//create invite link data
			if (result.groupId) {
				const groupInvite = await createGroupInvite(result.groupId, 7);
				console.log(
					groupInvite.success,
					groupInvite.message,
					groupInvite.inviteToken,
					groupInvite.inviteUrl,
				);
				if (groupInvite.inviteUrl) {
					setInviteLink(groupInvite.inviteUrl);
				}
			}
		}
	};

	const handleCopy = async () => {
		await navigator.clipboard.writeText(inviteLink);
	};

	const togglePopup = () => {
		setShowPopup(!showPopup);
	};

	return (
		<>
			<Button onClick={togglePopup}>+ Create Group</Button>

			{showPopup && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
					<div className="mx-4 w-full max-w-md">
						<div className="relative mx-auto mb-4 flex w-full max-w-md flex-shrink-0 flex-col gap-2 rounded-xl border-2 border-gray-200 bg-[#F9FAFB] p-4">
							<IconButton
								onClick={togglePopup}
								aria-label="close"
								sx={{
									position: "absolute",
									right: 8,
									top: 8,
									zIndex: 10,
								}}
							>
								<CloseIcon />
							</IconButton>

							<h2 className="pr-10 font-dm-sans font-medium text-gray-800 text-lg">
								Create New Group
							</h2>

							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className="space-y-4"
								>
									<FormField
										control={form.control}
										name="name"
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<Input
														placeholder="Group Name *"
														{...field}
														disabled={isCreating}
														className="border-2 border-gray-300 focus-visible:border-gray-500"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="description"
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<Input
														placeholder="Description (optional)"
														{...field}
														disabled={isCreating}
														className="border-2 border-gray-300 focus-visible:border-gray-500"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									{error && (
										<p className="font-dm-sans text-red-500 text-sm">{error}</p>
									)}

									<Button type="submit" disabled={isCreating} className="w-fit">
										{isCreating ? "Creating..." : "Create Group"}
									</Button>
								</form>
							</Form>

							{createdGroup && (
								<div className="mt-4 space-y-3 border-gray-200 border-t pt-4">
									<p className="font-dm-sans text-gray-600 text-sm">
										Group created! Share this link:
									</p>
									<div className="flex items-center gap-2">
										<p className="flex-1 truncate font-mono text-gray-500 text-sm">
											{inviteLink}
										</p>
										<Button
											onClick={handleCopy}
											variant="outline"
											className="flex items-center gap-2 rounded-lg border-gray-300 bg-gray-100 px-4 py-2 font-medium font-sans text-gray-800 shadow-sm hover:bg-gray-200"
										>
											<ContentCopyIcon className="h-4 w-4" />
											<span className="uppercase tracking-wide">COPY</span>
										</Button>
									</div>
									<p className="text-gray-400 text-xs">
										Anyone with this link can join the group
									</p>
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</>
	);
};
