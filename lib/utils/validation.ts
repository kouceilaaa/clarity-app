import { z } from "zod";

// ========== AUTH SCHEMAS ==========

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const RegisterSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string(),
    newPassword: z
      .string()
      .min(8)
      .regex(/[A-Z]/)
      .regex(/[0-9]/)
      .regex(/[^A-Za-z0-9]/),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ========== SIMPLIFICATION SCHEMAS ==========

export const SimplifyTextSchema = z.object({
  text: z
    .string()
    .min(10, "Text must be at least 10 characters")
    .max(50000, "Text cannot exceed 50,000 characters"),
  mode: z.enum(["simple", "accessible", "summary"]),
  saveToHistory: z.boolean().optional(),
});

export const ExtractFromUrlSchema = z.object({
  url: z.string().url("Invalid URL"),
  mode: z.enum(["simple", "accessible", "summary"]),
  includeImages: z.boolean().optional(),
  preserveLinks: z.boolean().optional(),
});

// ========== USER SCHEMAS ==========

export const UpdateProfileSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
});

// ========== TYPE INFERENCE ==========

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
export type SimplifyTextInput = z.infer<typeof SimplifyTextSchema>;
export type ExtractFromUrlInput = z.infer<typeof ExtractFromUrlSchema>;
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;

// ========== SHARED SCHEMAS ==========

export const EmailSchema = z.string().email();
export const UrlSchema = z.string().url();
export const ModeSchema = z.enum(["simple", "accessible", "summary"]);
