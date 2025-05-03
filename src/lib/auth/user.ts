import { db } from "@/db";
import { members, oauthAccounts, users } from "@/db/schema";
import { generateIdFromEntropySize } from "@/lib/auth/crypto";
import { hashPassword } from "@/lib/auth/password";
import { eq } from "drizzle-orm";

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

export type UserProfileWithGoogleId = {
    id: string
    googleUserId: string;
    username: string;
    picture: string | null;
}


//TODO: Guest
// export type GuestMember = {
//     memberId: string;
//     displayName: string;
// };

export async function createUser(
    email: string,
    displayName: string,
    password: string
): Promise<UserProfile> {
    const passwordHash = await hashPassword(password);
    const userId = generateIdFromEntropySize(10);

    const newUser = await db.transaction(async (tx) => {
        const [newMember] = await tx
            .insert(members)
            .values({ displayName })
            .returning({
                id: members.id,
            });

        const [newUser] = await tx
            .insert(users)
            .values({
                id: userId,
                email,
                passwordHash,
                createdAt: new Date(),
                memberId: newMember.id,
            })
            .returning({
                id: users.id,
                email: users.email,
                memberId: users.memberId,
            });

        return newUser;
    });

    if (newUser === null) {
        throw new Error("Unexpected error");
    }

    return {
        ...newUser,
        displayName,
    };
}

export async function createGoogleUser(
    googleUserId: string,
    username: string,
    picture: string | null,
) : Promise<UserProfileWithGoogleId> {
    const userId = generateIdFromEntropySize(10);

    const newGoogleUser = await db.transaction(async (tx) => {
        const [newMember] = await tx
            .insert(members)
            .values({ displayName: username })
            .returning({
                id: members.id,
            });
            const [newUser] = await tx
            .insert(users)
            .values({
                id: googleUserId,
                memberId: newMember.id,
                email: "google user", //TODO: Change to correct values
                passwordHash: "google user", //TODO: Change to correct values
                createdAt: new Date(),
            })
            .returning({
                id: users.id,
                email: users.email,
                memberId: users.memberId,
            });
        const [newGoogleMember] = await tx
            .insert(oauthAccounts)
            .values({ 
                userId: newUser.id,
                providerId: "google",
                providerUserId: googleUserId,
            }) //TODO: Change to correct values
            .returning({
                id: oauthAccounts.userId,
            });
        
        

        return newGoogleMember;
    });

    if (newGoogleUser === null) {
        throw new Error("Unexpected error");
    }

    return {
        ...newGoogleUser,
        googleUserId,
        username,
        picture,
    };
}

export async function getUserPasswordHash(userId: string): Promise<string> {
    const user = await db.query.users.findFirst({
        columns: {
            passwordHash: true,
        },
        where: eq(users.id, userId),
    });

    if (user === undefined) {
        throw new Error("Invalid user ID");
    }

    if (user.passwordHash === null) {
        throw new Error("User does not have a password");
    }

    return user.passwordHash;
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
