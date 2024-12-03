"use server";

import { signupFormSchema } from "@/app/actions/auth/signup/schema";
import { z } from "zod";

export type SignupFormState = {
    message: string;
    error: boolean;
};

export default async function signupAction(
    payload: z.infer<typeof signupFormSchema>
): Promise<SignupFormState> {
    const parsed = signupFormSchema.safeParse(payload);
    if (!parsed.success) {
        return {
            error: true,
            message: parsed.error.message,
        };
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("signup");

    return {
        error: false,
        message: "hi",
    };
}
