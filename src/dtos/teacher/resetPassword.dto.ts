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
    newPassword: z.string().min(6),
    confirmPassword: z.string(),
  })
  .transform((data) => data as ResetPasswordInputDTO);
