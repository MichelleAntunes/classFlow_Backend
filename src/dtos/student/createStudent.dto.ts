import z from "zod";
import {
  TAnnotation,
  TImageData,
  TNote,
  USER_ROLES,
} from "../../models/Student";

export interface CreateStudentInputDTO {
  id: string;
  name: string;
  email: string;
  phone: number;
  age: number;
  notes: TNote[];
  annotations: TAnnotation[];
  photo: TImageData | string | null;
  teacher_id: string;
  class_id: string;
  password: string;
  email_verified: string;
  created_at: string;
  role: USER_ROLES;
}

export interface CreateStudentOutputDTO {
  message: string;
  student: {
    id: string;
    name: string;
    created_at: string;
  };
}

export const CreateStudentSchema = z
  .object({
    id: z
      .string({
        required_error: "'id' é obrigatória",
        invalid_type_error: "'id' deve ser do tipo string",
      })
      .min(1, "'id' deve possuir no mínimo 1 caractere"),
    name: z
      .string({
        required_error: "'name' é obrigatório",
        invalid_type_error: "'name' deve ser do tipo string",
      })
      .min(2, "'name' deve possuir no mínimo 2 caracteres"),
    email: z
      .string({
        required_error: "'email' é obrigatório",
        invalid_type_error: "'email' deve ser do tipo string",
      })
      .email("'email' inválido"),
    phone: z.number(),
    age: z.number().min(1),
    password: z.string().min(4),
  })
  .transform((data) => data as CreateStudentInputDTO);
