import z from "zod";
export interface AddNewNoteInputDTO {
  token: string;
  idToEdit: string;
  notes: string[];
}

export interface AddNewNoteOutputDTO {
  message: string;
}

export const AddNewNoteSchema = z
  .object({
    token: z.string().min(1),
    idToEdit: z.string().min(1),
    notes: z.array(z.string()),
  })
  .transform((data) => data as AddNewNoteInputDTO);
