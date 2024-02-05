import z from "zod";
export interface EditNoteInputDTO {
  token: string;
  idToEdit: string;
  note: string;
}

export interface EditNoteOutputDTO {
  message: string;
}

export const EditNoteSchema = z
  .object({
    token: z.string().min(1),
    idToEdit: z.string().min(1),
    note: z.string().min(1),
  })
  .transform((data) => data as EditNoteInputDTO);
