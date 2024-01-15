import z from "zod";
import { StudentModel } from "../../models/Student";

export interface GetStudentInputDTO {
  q: string;
}

export type GetStudentOutputDTO = StudentModel[];

export const GetStudentSchema = z
  .object({
    q: z.string().min(1).optional(),
  })
  .transform((data) => data as GetStudentInputDTO);
