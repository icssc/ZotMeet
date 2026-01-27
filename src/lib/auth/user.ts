import { db } from "@/db";
import { members, oauthAccounts, users } from "@/db/schema";

// Projection of user table for db queries to limit what is returned
export const userProfileProjection = {
	id: users.id,
	email: users.email,
	memberId: users.memberId,
	displayName: members.displayName,
};

export type UserProfile = {
	id: string;
	email: string;
	memberId: string;
	displayName: string;
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
	_picture: string | null,
): Promise<UserProfile> {
	const newGoogleUser = await db.transaction(async (tx) => {
		const [newMember] = await tx
			.insert(members)
			.values({ displayName: username })
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
		...newGoogleUser,
		id: googleUserId,
		email: email,
		memberId: newGoogleUser.memberId,
		displayName: username,
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
