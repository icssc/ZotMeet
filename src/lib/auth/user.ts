import { eq } from "drizzle-orm";
import { db } from "@/db";
import { members, oauthAccounts, users } from "@/db/schema";

// Projection of user table for db queries to limit what is returned
export async function generateUsername(displayName: string): Promise<string> {
	let base = displayName
		.toLowerCase()
		.replace(/\s+/g, ".")
		.replace(/[^a-z0-9._]/g, "")
		.replace(/[._]{2,}/g, ".")
		.replace(/^[._]+|[._]+$/g, "");

	if (!base) base = "user";

	const isTaken = (candidate: string) =>
		db.query.members.findFirst({
			where: eq(members.username, candidate),
			columns: { id: true },
		});

	if (!(await isTaken(base))) return base;

	let i = 2;
	while (true) {
		const candidate = `${base}${i}`;
		if (!(await isTaken(candidate))) return candidate;
		i++;
	}
}

export const userProfileProjection = {
	id: users.id,
	email: users.email,
	memberId: users.memberId,
	displayName: members.displayName,
	googleName: members.googleName,
	username: members.username,
	year: members.year,
	school: members.school,
	profilePicture: members.profilePicture,
};

export type UserProfile = {
	id: string;
	email: string;
	memberId: string;
	displayName: string;
	googleName: string | null;
	username: string | null;
	year: string | null;
	school: string | null;
	profilePicture: string | null;
};
export type NotificationItem = {
	id: string;
	createdAt: Date | null;
	memberId: string;
	createdBy: string | null;
	createdByAvatar: string | null;
	title: string;
	type: string;
	readAt: Date | null;
	message: string | null;
	redirect: string | null;
	groupIcon: string | null;
};
//TODO: Guest
// export type GuestMember = {
//     memberId: string;
//     displayName: string;
// };

export async function createGoogleUser(
	googleUserId: string,
	email: string,
	username: string,
	picture: string | null,
): Promise<UserProfile> {
	const generatedUsername = await generateUsername(username);

	const newGoogleUser = await db.transaction(async (tx) => {
		const [newMember] = await tx
			.insert(members)
			.values({
				displayName: username,
				googleName: username,
				username: generatedUsername,
				profilePicture: picture,
			})
			.returning({
				id: members.id,
			});
		await tx.insert(users).values({
			id: googleUserId,
			memberId: newMember.id,
			email: email,
			createdAt: new Date(),
		});
		const [newGoogleMember] = await tx
			.insert(oauthAccounts)
			.values({
				userId: googleUserId,
				providerId: "oidc",
				providerUserId: googleUserId,
			})
			.returning({
				memberId: oauthAccounts.providerUserId,
			});

		return newGoogleMember;
	});

	if (newGoogleUser === null) {
		throw new Error("Unexpected error");
	}

	return {
		id: googleUserId,
		email: email,
		memberId: newGoogleUser.memberId,
		displayName: username,
		googleName: username,
		username: generatedUsername,
		year: null,
		school: null,
		profilePicture: picture,
	};
}

//TODO: Guest
// export async function createGuest({
//     displayName,
//     meetingId,
// }: {
//     displayName: string;
//     meetingId: string;
// }): Promise<GuestMember> {
//     // Temporary implementation for guest users.
//     const existingMember = await db
//         .select()
//         .from(availabilities)
//         .innerJoin(members, eq(availabilities.memberId, members.id))
//         .where(
//             and(
//                 eq(availabilities.meetingId, meetingId),
//                 eq(members.displayName, displayName)
//             )
//         )
//         .limit(1);

//     if (existingMember && existingMember.length > 0) {
//         throw new Error(`$Display name "${displayName}" already exists.`);
//     }

//     const [newMember] = await db
//         .insert(members)
//         .values({ displayName })
//         .returning({
//             memberId: members.id,
//         });

//     if (newMember === null) {
//         throw new Error("Unexpected error");
//     }

//     return {
//         ...newMember,
//         displayName,
//     };
// }
