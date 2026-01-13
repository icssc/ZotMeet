"use client";

import { createGroup } from "@actions/group/create/action";
import { zodResolver } from "@hookform/resolvers/zod";
import { Copy } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
//import { toast } from "sonner";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createGroupSchema } from "@/server/actions/group/create/schema";

export const CreateGroup = () => {
	const router = useRouter();
	const [isCreating, setIsCreating] = useState(false);
	const [error, setError] = useState<string | null>(null);

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

		const result = await createGroup(data.name, data.description);

		if ("error" in result) {
			setError(result.error);
			setIsCreating(false);
		} else {
			console.log("Group created with ID:", result.id);
			//router.push(`/groups/${result.id}`);
			setCreatedGroup(true);
			setTempGroupId(result.id);
			setIsCreating(false);
		}
	};

	const handleCopy = async () => {
		await navigator.clipboard.writeText(
			`http:zotmeet.com/groups/${tempGroupId}`,
		);
	};

	const [createdGroup, setCreatedGroup] = useState(false);
	const [tempGroupId, setTempGroupId] = useState("");

	return (
		<div className="mx-auto mb-4 flex w-full max-w-md flex-col gap-2 rounded-xl border-2 border-gray-200 bg-[#F9FAFB] bg-opacity-50 p-4">
			<h2 className="font-dm-sans font-medium text-gray-800 text-lg">
				Create New Group
			</h2>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
							http://zotmeet.com/groups/{tempGroupId}
						</p>
						<Button
							onClick={handleCopy}
							variant="outline"
							className="flex items-center gap-2 rounded-lg border-gray-300 bg-gray-100 px-4 py-2 font-medium font-sans text-gray-800 shadow-sm hover:bg-gray-200"
						>
							<Copy className="h-4 w-4" />
							<span className="uppercase tracking-wide">COPY</span>
						</Button>
					</div>
					<p className="text-gray-400 text-xs">
						Anyone with this link can join the group
					</p>
				</div>
			)}
		</div>
	);
};
