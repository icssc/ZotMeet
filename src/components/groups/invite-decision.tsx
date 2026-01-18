"use client";

import { acceptInvite } from "@actions/group/invite/create/action";
import { Button } from "@/components/ui/button";

interface InviteDecisionProps {
	inviteToken: string;
}

async function handleAccept(inviteToken: string) {
	const result = await acceptInvite(inviteToken);
	if (!result) {
		console.log("SOMETHING WENT WRONG");
	}

	console.log("IT WORKED ", result);
}

export const InviteDecision = ({ inviteToken }: InviteDecisionProps) => {
	return (
		<div>
			<div className="p-8">
				<h1 className="mb-4 font-medium font-montserrat text-3xl">
					Invite to Group
				</h1>
				<p className="mb-4 text-gray-600">Invite token: {inviteToken}</p>
				<Button onClick={() => handleAccept(inviteToken)}>Accept</Button>
				<Button>Decline</Button>
			</div>
		</div>
	);
};
