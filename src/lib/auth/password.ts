"server-only";

import { hash, verify } from "@node-rs/argon2";

export async function hashPassword(password: string): Promise<string> {
    return await hash(password, {
        memoryCost: 19456,
        timeCost: 2,
        parallelism: 1,
        outputLen: 32,
    });
}

export async function verifyPasswordHash(
    hash: string,
    password: string
): Promise<boolean> {
    return await verify(hash, password);
}
