"use client";

import { createGroup } from "@actions/group/create/action";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import React from "react";
import { Button } from "@/components/ui/button";

export const CreateGroup = () => {
	const [meetingId, setMeetingId] = useQueryState("id");
	const router = useRouter();

	const handleClick = async () => {
		console.log("CLICKED");

		const result = await createGroup("TESTNAME", "TESTDESC");

		// Check if there's an error first
		if ("error" in result) {
			console.error("Error creating group:", result.error);
		} else {
			//  { id: string }
			console.log("THE ID", result.id);
			setMeetingId(result.id);
			router.push(`/groups/${result.id}`);
		}
	};

	return (
		<div>
			<Button onClick={handleClick}>Create Groups</Button>
		</div>
	);
};
