"use client";

import { createGroup } from "@actions/group/create/action";
import React from "react";
import { Button } from "@/components/ui/button";

export const CreateGroup = () => {
	const handleClick = async () => {
		console.log("CLICKED");

		const result = await createGroup("TESTNAME", "TESTDESC");

		// Check if there's an error first
		if ("error" in result) {
			console.error("Error creating group:", result.error);
		} else {
			//  { id: string }
			console.log("THE ID", result.id);
		}
	};

	return (
		<div>
			<Button onClick={handleClick}>Create Groups</Button>
		</div>
	);
};
