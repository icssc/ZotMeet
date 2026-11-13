import { z } from "zod";

/**
 * The response of Anteater API's `/v2/rest/libraryTraffic`, validated before
 * it is summarised so a changed payload fails with its real cause.
 */

/** One floor or section, as the API returns it. */
export const libraryTrafficLocationSchema = z.object({
	id: z.number(),
	libraryName: z.string(),
	locationName: z.string(),
	/** People currently detected. */
	trafficCount: z.number().nonnegative(),
	/** Fraction of stated capacity: 0 to 1, or above 1 when over-occupied. */
	trafficPercentage: z.number().nonnegative().nullable(),
	/** ISO 8601 time of the reading. */
	timestamp: z.string().nullable(),
});

export const libraryTrafficResponseSchema = z.object({
	ok: z.literal(true),
	data: z.array(libraryTrafficLocationSchema),
});

export type LibraryTrafficLocation = z.infer<
	typeof libraryTrafficLocationSchema
>;
export type LibraryTrafficResponse = z.infer<
	typeof libraryTrafficResponseSchema
>;
