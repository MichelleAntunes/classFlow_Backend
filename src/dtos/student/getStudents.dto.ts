import z from "zod";
import { StudentModel } from "../../models/Student";

export interface GetStudentInputDTO {
  token: string;
}

export type GetStudentOutputDTO = StudentModel[];

export const GetStudentSchema = z
  .object({
    token: z.string().min(1).optional(),
  })
  .transform((data) => data as GetStudentInputDTO);
