import z from "zod";

export interface SignupInputDTO {
  name: string;
  email: string;
  password: string;
}

export interface SignupOutputDTO {
  token: string;
}

export const SignupSchema = z
  .object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z
      .string()
      .min(8)
      .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()-_+=]).{8,}$/, {
        message:
          "The password must contain at least one lowercase letter, one uppercase letter, one number and one special character.",
      }),
  })
  .transform((data) => data as SignupInputDTO);
