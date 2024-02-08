import z from "zod";

export interface DeleteInactiveStudentInputDTO {
  token: string;
  idToDelete: string;
}

export interface DeleteInactiveStudentDTO {
  message: string;
}

export const DeleteInactiveStudentSchema = z
  .object({
    token: z.string(),
    idToDelete: z.string(),
  })
  .transform((data) => data as DeleteInactiveStudentInputDTO);
