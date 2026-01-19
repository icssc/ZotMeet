"use client";

import {
	acceptInvite,
	declineInvite,
} from "@actions/group/invite/create/action";
import { Button } from "@/components/ui/button";

interface InviteDecisionProps {
	inviteToken: string;
}

async function handleAccept(inviteToken: string) {
	const result = await acceptInvite(inviteToken);
	console.log(result);
	alert(result.message);
}

async function handleDecline(inviteToken: string) {
	const result = await declineInvite(inviteToken);
	console.log(result);
	alert(result.message);
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
				<Button onClick={() => handleDecline(inviteToken)}>Decline</Button>
			</div>
		</div>
	);
};
