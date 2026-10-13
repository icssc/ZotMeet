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
	memberIds: z.array(z.string()).optional(),
	/** UCI directory picks without a ZotMeet account; emailed an invite link. */
	inviteEmails: z.array(z.string().email()).max(50).optional(),
	icon: z.string().optional(),
});

export type CreateGroupInput = z.infer<typeof createGroupSchema>;
