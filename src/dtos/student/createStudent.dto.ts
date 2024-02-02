import z from "zod";
import { USER_ROLES } from "../../models/Student";

export interface CreateStudentInputDTO {
  name: string;
  email: string;
  phone: string;
  age: number;
  role: USER_ROLES;
  photo: string;
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
    phone: z
      .string()
      .refine((value) => /^(?:\+|\d{0,4}\s?)?\d{6,14}$/.test(value), {
        message: "'phone' deve ser um número de telefone válido",
      }),
    age: z.number().min(1),
    role: z.string(),
    photo: z
      .string()
      .refine(
        (value) => {
          const isURL = /^(ftp|http|https):\/\/[^ "]+$/.test(value);
          const isImageData = /^data:image\/.+/.test(value);

          return isURL || isImageData;
        },
        {
          message: "'photo' deve ser uma URL válida ou em formatos JPEG pu PNG",
        }
      )
      .optional(),
  })
  .transform((data) => data as CreateStudentInputDTO);
