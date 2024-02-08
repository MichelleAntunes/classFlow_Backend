import z from "zod";
import { InactiveStudentModel } from "../../models/InactiveStudent";

export interface GetInactiveStudentInputDTO {
  token: string;
}

export type GetInactiveStudentOutputDTO = InactiveStudentModel[];

export const GetInactiveStudentSchema = z
  .object({
    token: z.string().min(1).optional(),
  })
  .transform((data) => data as GetInactiveStudentInputDTO);
