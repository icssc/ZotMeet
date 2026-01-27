import { z } from "zod";

export const createGroupSchema = z.object({
	name: z
		.string()
		.min(1, {
			message: "Group name is required",
		})
		.max(100, {
			message: "Group name must be less than 100 characters",
		}),
	description: z
		.string()
		.max(500, {
			message: "Description must be less than 500 characters",
		})
		.optional(),
});

export type CreateGroupInput = z.infer<typeof createGroupSchema>;
