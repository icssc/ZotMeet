"use client";

import { acceptInvite } from "@actions/group/invite/create/action";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

async function handleAccept(inviteLink: string) {
	if (!inviteLink) {
		return;
	}

	const token = inviteLink.split("/").pop();
	if (!token) {
		return;
	}

	const result = await acceptInvite(token);
	alert(result.message);
}

interface InviteDecisionProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export const InviteDecision = ({ open, onOpenChange }: InviteDecisionProps) => {
	const [input, setInput] = useState("");

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle className="font-bold text-xl">
						Join Existing Group
					</DialogTitle>
					<DialogDescription></DialogDescription>
				</DialogHeader>

				<form
					onSubmit={(e) => {
						e.preventDefault();
						void handleAccept(input);
					}}
					className="flex items-end gap-3"
				>
					<div className="flex-1 space-y-1">
						<p className="text-sm">Join via Link</p>
						<Input
							placeholder="Insert Meeting Link"
							value={input}
							onChange={(e) => setInput(e.target.value)}
						/>
					</div>
					<Button type="submit">Join</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
};
