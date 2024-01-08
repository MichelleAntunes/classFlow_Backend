import z from "zod";
import { TStudentsModel } from "../../models/Student";

export interface GetStudentInputDTO {
  q: string;
}

export type GetStudentOutputDTO = TStudentsModel[];

export const GetStudentSchema = z
  .object({
    q: z.string().min(1).optional(),
  })
  .transform((data) => data as GetStudentInputDTO);
