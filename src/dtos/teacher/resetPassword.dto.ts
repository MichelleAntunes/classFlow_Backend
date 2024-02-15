import z from "zod";

export interface ResetPasswordInputDTO {
  email: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordOutputDTO {
  token: string;
}

export const ResetPasswordSchema = z
  .object({
    email: z.string().email(),
    newPassword: z
      .string()
      .min(8)
      .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()-_+=]).{8,}$/, {
        message:
          "The password must contain at least one lowercase letter, one uppercase letter, one number and one special character.",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
  })
  .transform((data) => data as ResetPasswordInputDTO);
