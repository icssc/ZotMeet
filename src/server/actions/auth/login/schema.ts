import { z } from "zod";

export const loginFormSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address",
    }),
    password: z.string().min(1, {
        message: "Password must not be empty",
    }),
});
