import z from "zod";
import { USER_ROLES } from "../../models/Student";

export interface CreateStudentInputDTO {
  name: string;
  email: string;
  phone: number;
  age: number;
  role: USER_ROLES;
  token: string;
}

export interface CreateStudentOutputDTO {
  message: string;
  student: {
    token: string;
    name: string;
    created_at: string;
  };
}

export const CreateStudentSchema = z.object({
  token: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.number(),
  age: z.number().min(1),
  password: z.string().min(4),
});
