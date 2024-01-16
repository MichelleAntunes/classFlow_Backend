import z from "zod";
import {
  TAnnotation,
  ImageData,
  TNote,
  USER_ROLES,
} from "../../models/Student";

export interface EditStudentInputDTO {
  name: string;
  email: string;
  phone: number;
  age: number;
  photo: ImageData | string | null;
  teacher_id: string;
  class_id: string;
  token: string;
  idToEdit: string;
  notes: string[];
  annotations: string[];
  role: USER_ROLES;
}

export interface EditStudentOutputDTO {
  message: string;
  student: {
    token: string;
    name: string;
    created_at: string;
  };
}

export const EditStudentSchema = z
  .object({
    name: z.string().min(1),
    email: z.string().min(1),
    phone: z.number().min(1),
    age: z.number().min(1),
    photo: z.string().nullable(),
    teacher_id: z.string().min(1),
    class_id: z.string().min(1),
    token: z.string().min(1),
    idToEdit: z.string().min(1),
    notes: z.array(z.string().min(1)),
    annotations: z.array(z.string().min(1)),
    role: z.string().min(1),
  })
  .transform((data) => data as EditStudentInputDTO);
