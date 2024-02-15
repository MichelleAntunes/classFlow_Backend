import z from "zod";

export interface LoginInputDTO {
  email: string;
  password: string;
}

export interface LoginOutputDTO {
  token: string;
}

export const LoginSchema = z
  .object({
    email: z.string().email(),
    password: z
      .string()
      .min(8)
      .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()-_+=]).{8,}$/, {
        message:
          "The password must contain at least one lowercase letter, one uppercase letter, one number and one special character.",
      }),
  })
  .transform((data) => data as LoginInputDTO);
