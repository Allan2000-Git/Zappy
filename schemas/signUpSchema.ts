import { z } from "zod";

export const usernameValidation = z
                                .string()
                                .min(3, "Username must be at least 3 characters")
                                .regex(/^[a-zA-Z0-9_]{3,20}$/, "Please enter a valid username")

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({ message: "Please enter a valid email address"}),
    password: z.string().min(4, { message: "Password must be at least 4 characters"})
})