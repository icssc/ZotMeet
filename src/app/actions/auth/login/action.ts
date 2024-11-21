"use server";

import { loginFormSchema } from "@/app/actions/auth/login/schema";
import { z } from "zod";

export type LoginFormState = {
    message: string;
    error: boolean;
};

export default async function loginAction(
    payload: z.infer<typeof loginFormSchema>
): Promise<LoginFormState> {
    const parsed = loginFormSchema.safeParse(payload);
    if (!parsed.success) {
        return {
            error: true,
            message: parsed.error.message,
        };
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("login");

    return {
        error: false,
        message: "hi",
    };
}
