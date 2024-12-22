import { z } from "zod";

import { type ChangePassword } from "@/types/ChangePassword";
import { EditProfile } from "@/types/EditProfile";
import { UserSignUp } from "@/types/UserSignUp";
import { normalizeString } from "@/utils/normalizeString";

class UserValidator {
    public static validateSignUp(data: UserSignUp) {
        const signUpSchema = z
            .object({
                fullname: z
                    .string({ required_error: "Fullname is required" })
                    .min(3, "Full name must be at least 3 characters long")
                    .max(255, "Full name must not exceed 255 characters")
                    .transform(normalizeString),
                email: z
                    .string({ required_error: "Email is required" })
                    .email("Invalid email format")
                    .min(5, "Email must be at least 5 characters long")
                    .max(255, "Email must not exceed 255 characters"),
                password: z
                    .string()
                    .min(1, "Password is required")
                    .min(6, "Password must be at least 6 characters long")
                    .max(255, "Password must not exceed 255 characters")
                    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
                    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
                    .regex(/\d/, "Password must contain at least one number")
                    .regex(/[\W_]/, "Password must contain at least one special character"),
                confirmedPassword: z.string({
                    required_error: "Confirm password is required"
                })
            })
            .refine((data) => data.password === data.confirmedPassword, {
                message: "Passwords don't match",
                path: ["confirmedPassword"]
            });

        return signUpSchema.safeParse(data);
    }

    public static validateSignIn(data: unknown) {
        const signInSchema = z.object({
            email: z
                .string()
                .min(1, "Email is required")
                .email("Invalid email format")
                .min(5, "Email must be at least 5 characters long")
                .max(255, "Email must not exceed 255 characters"),

            password: z.string().min(1, "Password is required")
        });

        return signInSchema.safeParse(data);
    }

    public static validateChangePassword(data: ChangePassword) {
        const changePasswordSchema = z.object({
            currentPassword: z.string().min(1, "Current Password is required"),
            newPassword: z
                .string()
                .min(1, "Password is required")
                .min(6, "Password must be at least 6 characters long")
                .max(255, "Password must not exceed 255 characters")
                .regex(/[a-z]/, "Password must contain at least one lowercase letter")
                .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
                .regex(/\d/, "Password must contain at least one number")
                .regex(/[\W_]/, "Password must contain at least one special character")
        });

        return changePasswordSchema.safeParse(data);
    }

    public static validateEditProfile(data: EditProfile) {
        const editProfileFormSchema = z.object({
            profile_img: z.string().min(1, "Avatar image is required"),
            fullname: z
                .string()
                .min(1, "Full name is required")
                .min(3, "Full name must be at least 3 characters long")
                .max(255, "Full name must not exceed 255 characters"),
            email: z.string().email("Invalid email address"),
            username: z
                .string()
                .min(3, "Username must be at least 3 characters")
                .max(255, "Username must not exceed 255 characters"),
            bio: z.string().max(500, "Bio must not exceed 500 characters"),
            youtube: z.string().url("Invalid URL").optional().or(z.literal("")),
            instagram: z.string().url("Invalid URL").optional().or(z.literal("")),
            facebook: z.string().url("Invalid URL").optional().or(z.literal("")),
            twitter: z.string().url("Invalid URL").optional().or(z.literal("")),
            github: z.string().url("Invalid URL").optional().or(z.literal("")),
            website: z.string().url("Invalid URL").optional().or(z.literal(""))
        });

        return editProfileFormSchema.safeParse(data);
    }
}

export default UserValidator;
