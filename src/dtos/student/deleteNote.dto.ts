import z from "zod";

export interface DeleteNoteInputDTO {
  token: string;
  idToDelete: string;
}

export interface DeleteNoteOutputDTO {
  message: string;
}

export const DeleteNoteSchema = z
  .object({
    token: z.string(),
    idToDelete: z.string(),
  })
  .transform((data) => data as DeleteNoteInputDTO);
