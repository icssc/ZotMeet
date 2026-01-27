import { z } from "zod";

export const updateGroupSchema = z.object({
	groupId: z.string().uuid({
		message: "Invalid group ID",
	}),
	name: z
		.string()
		.min(1, {
			message: "Group name is required",
		})
		.max(100, {
			message: "Group name must be less than 100 characters",
		})
		.optional(),
	description: z
		.string()
		.max(500, {
			message: "Description must be less than 500 characters",
		})
		.optional(),
});

export type UpdateGroupInput = z.infer<typeof updateGroupSchema>;
