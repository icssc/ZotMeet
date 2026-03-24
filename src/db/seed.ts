import { randomUUID } from "crypto";
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as relations from "./relations";
import * as schema from "./schema";
import { GroupRole } from "./schema";

if (!process.env.DATABASE_URL) {
	throw new Error("Missing DATABASE_URL env var.");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema: { ...schema, ...relations } });

const BATCH_SIZE = 15;

const SEED_GROUP_ID = "00000000-0000-0000-0000-000000000099";
const SEED_ADMIN_MEMBER_ID = "00000000-0000-0000-0000-000000000000";
const SEED_ADMIN_USER_ID = "seed_admin";

const NAME_POOL = [
	{ handle: "ethanc", displayName: "Ethan Chen" },
	{ handle: "panteater", displayName: "Peter Anteater" },
	{ handle: "zotking", displayName: "Zot King" },
	{ handle: "aldrichpark", displayName: "Aldrich Park" },
	{ handle: "ringroad", displayName: "Ring Road" },
	{ handle: "merage", displayName: "Dean Merage" },
	{ handle: "bren", displayName: "Bren Events" },
	{ handle: "petr", displayName: "PETR Advisor" },
	{ handle: "crammerr", displayName: "Last-Minute Larry" },
	{ handle: "studybuddy", displayName: "Study Buddy" },
	{ handle: "zotbot", displayName: "ZotBot" },
	{ handle: "icssc", displayName: "ICSSC Council" },
	{ handle: "anteaterfan", displayName: "Anteater Fan" },
	{ handle: "steveair", displayName: "Steve Airpods" },
	{ handle: "mesacourtdj", displayName: "Mesa Court DJ" },
	{ handle: "parkingpass", displayName: "Parking Pass" },
	{ handle: "finalszn", displayName: "Final Szn" },
	{ handle: "middleearth", displayName: "Middle Earth RA" },
	{ handle: "cramlab", displayName: "Science Library" },
	{ handle: "zotgrad", displayName: "Zot Grad" },
];

async function seed(): Promise<void> {
	await db
		.insert(schema.members)
		.values({ id: SEED_ADMIN_MEMBER_ID, displayName: "Seed Admin" })
		.onConflictDoNothing();

	await db
		.insert(schema.users)
		.values({
			id: SEED_ADMIN_USER_ID,
			memberId: SEED_ADMIN_MEMBER_ID,
			email: "admin@zotmeet.dev",
		})
		.onConflictDoNothing();

	await db
		.insert(schema.groups)
		.values({
			id: SEED_GROUP_ID,
			name: "ZotMeet Dev Team",
			description:
				"Dummy group for testing large group sizes and UI overflow states.",
			createdBy: SEED_ADMIN_USER_ID,
			createdAt: new Date(),
			archived: false,
		})
		.onConflictDoNothing();

	const suffix = Math.random().toString(16).slice(2, 6);

	await db.transaction(async (tx) => {
		for (const { handle, displayName } of NAME_POOL.slice(0, BATCH_SIZE)) {
			const [newMember] = await tx
				.insert(schema.members)
				.values({ id: randomUUID(), displayName })
				.returning({ id: schema.members.id });

			if (!newMember) {
				throw new Error(`Failed to insert member for ${handle}`);
			}

			await tx.insert(schema.users).values({
				id: `seed_${handle}_${suffix}`,
				memberId: newMember.id,
				email: `${handle}_${suffix}@zotmeet.dev`,
			});

			await tx.insert(schema.usersInGroup).values({
				userId: `seed_${handle}_${suffix}`,
				groupId: SEED_GROUP_ID,
				role: GroupRole.MEMBER,
			});
		}
	});

	console.log(`${BATCH_SIZE} users added (batch: _${suffix})`);
}

seed()
	.catch((error: unknown) => {
		console.error("Seed failed:", error);
		process.exit(1);
	})
	.finally(() => pool.end());
