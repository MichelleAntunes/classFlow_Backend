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
    token: z.string().min(1),
    idToDelete: z.string().min(1),
  })
  .transform((data) => data as DeleteStudentInputDTO);
