import z from "zod";

export interface DeleteStudentInputDTO {
  token: string;
  idToDelete: string;
}

export interface DeleteStudentOutputDTO {
  message: string;
}

export const DeleteStudentSchema = z
  .object({
    token: z.string(),
    idToDelete: z.string(),
  })
  .transform((data) => data as DeleteStudentInputDTO);
