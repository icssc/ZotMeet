import { db } from "@/db";
import { members, SelectUser, users } from "@/db/schema";
import { generateIdFromEntropySize } from "@/lib/auth/crypto";
import { hashPassword } from "@/lib/auth/password";
import { eq } from "drizzle-orm";

export const userProjection = {
    id: users.id,
    displayName: members.displayName,
    email: users.email,
};

// Projection of user table to limit what is returned
export type UserProfile = Pick<SelectUser, "id" | "email">;

export async function createUser(
    email: string,
    displayName: string,
    password: string
): Promise<UserProfile> {
    const passwordHash = await hashPassword(password);
    const userId = generateIdFromEntropySize(10);

    const newUser = await db.transaction(async (tx) => {
        await tx.insert(members).values({ id: userId , displayName});

        const [newUser] = await tx
            .insert(users)
            .values({
                id: userId,
                email,
                passwordHash,
                createdAt: new Date(),
            })
            .returning(userProjection);

        return newUser;
    });

    if (newUser === null) {
        throw new Error("Unexpected error");
    }

    return newUser;
}

export async function getUserPasswordHash(userId: string): Promise<string> {
    const [row] = await db
        .select({
            passwordHash: users.passwordHash,
        })
        .from(users)
        .where(eq(users.id, userId));

    if (row.passwordHash === null) {
        throw new Error("Invalid user ID");
    }

    return row.passwordHash;
}
