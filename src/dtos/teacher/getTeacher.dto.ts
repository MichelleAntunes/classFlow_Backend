import z from "zod";
import { TeacherModel } from "../../models/Teacher";

export interface GetTeacherInputDTO {
  token: string;
}

export type GetTeacherOutputDTO = TeacherModel[];

export const GetTeacherSchema = z
  .object({
    token: z.string().min(1).optional(),
  })
  .transform((data) => data as GetTeacherInputDTO);
