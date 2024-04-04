import z from "zod";

export interface DeleteTeacherInputDTO {
  token: string;
  idTeacherToDelete: string;
}

export interface DeleteTeacherOutputDTO {
  message: string;
}

export const DeleteTeacherSchema = z
  .object({
    token: z.string(),
    idTeacherToDelete: z.string(),
  })
  .transform((data) => data as DeleteTeacherInputDTO);
