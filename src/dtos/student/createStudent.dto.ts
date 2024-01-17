import z from "zod";
import { TAnnotation, TNote, USER_ROLES } from "../../models/Student";

export interface CreateStudentInputDTO {
  name: string;
  email: string;
  phone: number;
  age: number;
  notes?: TNote[] | string | undefined;
  annotations?: TAnnotation[] | string | undefined;
  photo?: string | undefined;
  role: USER_ROLES;
  token: string;
}

export interface CreateStudentOutputDTO {
  message: string;
  studentName: string;
}

export const CreateStudentSchema = z
  .object({
    token: z.string().min(1),
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.number(),
    age: z.number().min(1),
    notes: z.string().optional(),
    annotations: z.string().optional(),
    photo: z
      .string()
      .refine((value) => {
        return (
          value.startsWith("http") ||
          value.endsWith(".png") ||
          value.endsWith(".jpeg")
        );
      })
      .optional(),
    role: z.string(),
  })
  .transform((data) => data as CreateStudentInputDTO);
